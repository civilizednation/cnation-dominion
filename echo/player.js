(() => {
  "use strict";

  const BGM_BASE = "../assets/audio/bgm/";

  const PLAYLIST = [];
  ECHO_TRACKS.forEach((theme, ti) => {
    theme.tracks.forEach((t) => {
      PLAYLIST.push({
        file: BGM_BASE + t.file,
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
    eq: Array.from(document.querySelectorAll("#eq span")),
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
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function selectTrack(index, autoplay = true) {
    currentIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    const t = PLAYLIST[currentIndex];

    els.art.style.setProperty("--accent", t.accent);
    els.art.style.backgroundImage =
      `url("assets/themes/${t.themeId}.png"), radial-gradient(circle at 50% 38%, color-mix(in srgb, ${t.accent} 42%, transparent), transparent 68%)`;
    els.screen.style.setProperty("--accent", t.accent);
    els.npIndex.textContent = `${String(t.themeIndex).padStart(2, "0")} · ${t.themeKo.toUpperCase()}`;
    els.npBadge.textContent = t.roman;
    els.npTitle.textContent = t.title;

    els.audio.src = t.file;
    setScreenState("playing");
    if (autoplay) play();
  }

  function play() {
    if (currentIndex === null) {
      selectTrack(0);
      return;
    }
    ensureAudioGraph();
    if (audioCtx.state === "suspended") audioCtx.resume();
    els.audio.play().catch(() => {});
  }

  function pause() {
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
      els.eq.forEach((bar) => { bar.style.transform = "scaleY(0.12)"; });
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const step = Math.max(1, Math.floor(data.length / els.eq.length));
    els.eq.forEach((bar, i) => {
      const v = data[i * step] / 255;
      bar.style.transform = `scaleY(${Math.max(0.12, v)})`;
    });
  }

  els.audio.addEventListener("timeupdate", () => {
    const { currentTime, duration } = els.audio;
    els.progressFill.style.width = duration ? `${(currentTime / duration) * 100}%` : "0%";
    els.timeCur.textContent = formatTime(currentTime);
    els.timeDur.textContent = formatTime(duration);
  });
  els.audio.addEventListener("ended", next);
  els.audio.addEventListener("play", updatePlayIcon);
  els.audio.addEventListener("pause", updatePlayIcon);

  els.btnPrev.addEventListener("click", prev);
  els.btnNext.addEventListener("click", next);
  els.btnPlay.addEventListener("click", togglePlay);
  els.btnMenu.addEventListener("click", toggleMenu);

  setScreenState("standby");
  tickEqualizer();
})();
