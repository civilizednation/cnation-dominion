(() => {
  "use strict";

  // origin/ 안에 원본 고음질(192k) 파일이 있으면 그걸 재생하고,
  // 아직 없거나 로드에 실패하면 게임용 저음질(64k) 파일로 자동 대체한다.
  const BGM_BASE_HQ = "../assets/audio/bgm/origin/";
  const BGM_BASE_LQ = "../assets/audio/bgm/";

  // 비교 테스트용: click.wav 파일을 불러오는 대신 Web Audio API로 그 자리에서
  // 클릭음을 합성한다 — 네트워크 요청/디코딩이 없어서 지연이 있다면 wav 방식과
  // 체감 차이가 드러난다.
  let sfxCtx = null;
  function ensureSfxCtx() {
    if (!sfxCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      sfxCtx = new Ctx();
    }
    if (sfxCtx.state === "suspended") sfxCtx.resume();
    return sfxCtx;
  }
  function playClick() {
    const ctx = ensureSfxCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  const PLAYLIST = [];
  ECHO_TRACKS.forEach((theme, ti) => {
    theme.tracks.forEach((t) => {
      PLAYLIST.push({
        fileHQ: BGM_BASE_HQ + t.file,
        fileLQ: BGM_BASE_LQ + t.file,
        title: t.title,
        titleEn: t.titleEn,
        roman: t.roman,
        themeIndex: ti + 1,
        themeId: theme.id,
        themeKo: theme.themeKo,
        accent: theme.accent
      });
    });
  });

  // 막대그래프가 아니라 진짜 이퀄라이저처럼 보이도록 가늘고 촘촘한 바를 여러 개 생성한다.
  const EQ_BARS = 24;
  const eqEl = document.getElementById("eq");
  for (let i = 0; i < EQ_BARS; i++) eqEl.appendChild(document.createElement("span"));

  const els = {
    screen: document.getElementById("screen"),
    standby: document.getElementById("viewStandby"),
    playing: document.getElementById("viewPlaying"),
    library: document.getElementById("viewLibrary"),
    libList: document.getElementById("libList"),
    art: document.getElementById("art"),
    npIndex: document.getElementById("npIndex"),
    npBadge: document.getElementById("npBadge"),
    npTitle: document.getElementById("npTitle"),
    loadingHint: document.getElementById("loadingHint"),
    eq: Array.from(eqEl.children),
    progressFill: document.getElementById("progressFill"),
    timeCur: document.getElementById("timeCur"),
    timeDur: document.getElementById("timeDur"),
    audio: document.getElementById("audio"),
    btnPrev: document.getElementById("btnPrev"),
    btnPlay: document.getElementById("btnPlay"),
    btnNext: document.getElementById("btnNext"),
    btnMenu: document.getElementById("btnMenu")
  };

  let currentIndex = null;
  let libraryOpen = false;
  let audioCtx = null;
  let analyser = null;
  let wantsPlaying = false;

  function formatTime(sec) {
    if (!Number.isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function setScreenState(state) {
    els.screen.dataset.state = state;
    els.standby.hidden = state !== "standby";
    els.playing.hidden = state !== "playing";
    els.library.hidden = state !== "library";
  }

  function renderLibrary() {
    els.libList.innerHTML = "";
    ECHO_TRACKS.forEach((theme, ti) => {
      const group = document.createElement("div");
      group.className = "lib-group";
      group.style.setProperty("--accent", theme.accent);

      const head = document.createElement("div");
      head.className = "lib-theme";
      head.textContent = `${String(ti + 1).padStart(2, "0")} · ${theme.themeKo.toUpperCase()}`;
      group.appendChild(head);

      const row = document.createElement("div");
      row.className = "lib-tracks";
      theme.tracks.forEach((t, si) => {
        const idx = ti * 2 + si;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lib-track" + (idx === currentIndex ? " active" : "");
        btn.innerHTML = `<span class="lib-roman">${t.roman}</span><span class="lib-title">${t.title}</span>`;
        btn.addEventListener("click", () => {
          playClick();
          selectTrack(idx);
          closeLibrary();
        });
        row.appendChild(btn);
      });
      group.appendChild(row);
      els.libList.appendChild(group);
    });
  }

  function ensureAudioGraph() {
    if (audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    const source = audioCtx.createMediaElementSource(els.audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function selectTrack(index, autoplay = true) {
    currentIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    const t = PLAYLIST[currentIndex];

    els.art.style.setProperty("--accent", t.accent);
    // 화면이 바뀔 때 이미지가 뚝 끊겨 보이지 않도록, 일단 투명하게 내렸다가
    // 새 배경을 얹은 뒤 다음 프레임에 서서히 밝아지게 한다.
    els.art.style.opacity = "0";
    const artUrl = `url("assets/themes/${t.themeId}.webp"), radial-gradient(circle at 50% 38%, color-mix(in srgb, ${t.accent} 42%, transparent), transparent 68%)`;
    requestAnimationFrame(() => {
      els.art.style.backgroundImage = artUrl;
      requestAnimationFrame(() => { els.art.style.opacity = "1"; });
    });
    els.screen.style.setProperty("--accent", t.accent);
    els.npIndex.textContent = `${String(t.themeIndex).padStart(2, "0")} · ${t.themeKo.toUpperCase()}`;
    els.npBadge.textContent = t.roman;
    els.npTitle.textContent = t.title;

    els.audio.dataset.triedFallback = "";
    els.audio.src = t.fileHQ;
    wantsPlaying = autoplay;
    setScreenState("playing");
    if (autoplay) play();
  }

  // HQ 원본이 아직 없거나(404) 로드에 실패하면, 같은 트랙의 저음질 버전으로 한 번만 대체한다.
  // 실패 시점엔 재생이 아직 시작되지 못해 audio.paused가 true일 수 있으므로,
  // 실제 재생 상태 대신 "재생 의도"(wantsPlaying)를 기준으로 이어서 재생한다.
  els.audio.addEventListener("error", () => {
    if (currentIndex === null || els.audio.dataset.triedFallback === "1") return;
    const t = PLAYLIST[currentIndex];
    els.audio.dataset.triedFallback = "1";
    els.audio.src = t.fileLQ;
    if (wantsPlaying) els.audio.play().catch(() => {});
  });

  function play() {
    if (currentIndex === null) {
      selectTrack(0);
      return;
    }
    wantsPlaying = true;
    ensureAudioGraph();
    if (audioCtx.state === "suspended") audioCtx.resume();
    els.audio.play().catch(() => {});
  }

  function pause() {
    wantsPlaying = false;
    els.audio.pause();
  }

  function togglePlay() {
    if (currentIndex === null) {
      selectTrack(0);
      return;
    }
    if (els.audio.paused) play();
    else pause();
  }

  function prev() {
    if (currentIndex === null) { selectTrack(0); return; }
    selectTrack(currentIndex - 1);
  }

  function next() {
    if (currentIndex === null) { selectTrack(0); return; }
    selectTrack(currentIndex + 1);
  }

  function openLibrary() {
    libraryOpen = true;
    renderLibrary();
    setScreenState("library");
  }

  function closeLibrary() {
    libraryOpen = false;
    setScreenState(currentIndex === null ? "standby" : "playing");
  }

  function toggleMenu() {
    if (libraryOpen) closeLibrary();
    else openLibrary();
  }

  function updatePlayIcon() {
    els.btnPlay.classList.toggle("is-playing", !els.audio.paused);
  }

  function tickEqualizer() {
    requestAnimationFrame(tickEqualizer);
    if (!analyser || els.audio.paused) {
      els.eq.forEach((bar) => { bar.style.transform = "scaleY(0.06)"; });
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    // 음악 에너지가 몰려 있는 하위 60% 대역만 훑어서 바마다 눈에 띄게 움직이게 한다.
    const usableBins = Math.floor(data.length * 0.6);
    const step = usableBins / els.eq.length;
    els.eq.forEach((bar, i) => {
      const v = data[Math.floor(i * step)] / 255;
      bar.style.transform = `scaleY(${Math.max(0.06, v)})`;
    });
  }

  els.audio.addEventListener("timeupdate", () => {
    const { currentTime, duration } = els.audio;
    els.progressFill.style.width = duration ? `${(currentTime / duration) * 100}%` : "0%";
    els.timeCur.textContent = formatTime(currentTime);
    els.timeDur.textContent = formatTime(duration);
  });

  // 특히 origin/ 고음질 파일은 느린 네트워크에서 로딩이 오래 걸릴 수 있다.
  // 버튼을 눌러도 한참 소리가 안 나오면 사용자가 안 눌린 줄 알 수 있으니,
  // 로딩이 150ms 넘게 걸리면 안내 문구를 띄운다 (짧으면 깜빡임만 하고 안 보임).
  let loadingHintTimer = null;
  function showLoadingHint() {
    clearTimeout(loadingHintTimer);
    loadingHintTimer = setTimeout(() => els.loadingHint.classList.add("visible"), 150);
  }
  function hideLoadingHint() {
    clearTimeout(loadingHintTimer);
    els.loadingHint.classList.remove("visible");
  }
  els.audio.addEventListener("loadstart", showLoadingHint);
  els.audio.addEventListener("canplay", hideLoadingHint);
  els.audio.addEventListener("playing", hideLoadingHint);
  els.audio.addEventListener("error", hideLoadingHint);

  els.audio.addEventListener("ended", next);
  els.audio.addEventListener("play", updatePlayIcon);
  els.audio.addEventListener("pause", updatePlayIcon);

  els.btnPrev.addEventListener("click", () => { playClick(); prev(); });
  els.btnNext.addEventListener("click", () => { playClick(); next(); });
  els.btnPlay.addEventListener("click", () => { playClick(); togglePlay(); });
  els.btnMenu.addEventListener("click", () => { playClick(); toggleMenu(); });

  // 메뉴 버튼처럼 클릭 중에 DOM을 크게 바꾸는 경우 브라우저 기본 :active가 눌린 채로
  // 고착되는 문제가 있어서, 눌림 표시는 여기서 직접 켜고 끈다.
  const pressButtons = [els.btnPrev, els.btnPlay, els.btnNext, els.btnMenu];
  pressButtons.forEach((btn) => {
    btn.addEventListener("pointerdown", () => btn.classList.add("is-pressed"));
  });
  function releaseAllPressed() {
    pressButtons.forEach((btn) => btn.classList.remove("is-pressed"));
  }
  window.addEventListener("pointerup", releaseAllPressed);
  window.addEventListener("pointercancel", releaseAllPressed);

  setScreenState("standby");
  tickEqualizer();
})();
