(() => {
  "use strict";

  const BGM_BASE = "./assets/audio/bgm/";
  const SFX_FILES = {
    click: "./assets/audio/sfx/click.wav",
    card: "./assets/audio/sfx/card.wav",
    buy: "./assets/audio/sfx/buy.wav",
    block: "./assets/audio/sfx/block.wav",
    warning: "./assets/audio/sfx/warning.wav",
    confirm: "./assets/audio/sfx/confirm.wav"
  };
  const KINGDOM_BGM = [
    ["01_village_01.mp3", "01_village_02.mp3"],
    ["02_estate_01.mp3", "02_estate_02.mp3"],
    ["03_battle_01.mp3", "03_battle_02.mp3"],
    ["04_garden_01.mp3", "04_garden_02.mp3"],
    ["05_engine_01.mp3", "05_engine_02.mp3"],
    ["06_wealth_01.mp3", "06_wealth_02.mp3"],
    ["07_treasure_01.mp3", "07_treasure_02.mp3"],
    ["08_trade_01.mp3", "08_trade_02.mp3"],
    ["09_chaos_01.mp3", "09_chaos_02.mp3"],
    ["10_feast_01.mp3", "10_feast_02.mp3"]
  ];

  const DEFAULT_BGM_VOLUME = 0.25;
  const DEFAULT_SFX_VOLUME = 1;
  const BGM_FADE_SECONDS = 2.5;
  const BGM_SWITCH_SECONDS = 1.4;
  const MAX_SAME_SFX_VOICES = 5;
  const MIN_SFX_INTERVAL_MS = 20;

  const storage = {
    bgmVolume: "cnation_bgm_volume",
    sfxVolume: "cnation_sfx_volume",
    bgmMuted: "cnation_bgm_muted",
    sfxMuted: "cnation_sfx_muted",
    bgmLevel: "cnation_bgm_level",
    sfxLevel: "cnation_sfx_level"
  };
  const BGM_LEVELS = {off: 0, small: DEFAULT_BGM_VOLUME * 0.5, normal: DEFAULT_BGM_VOLUME, large: DEFAULT_BGM_VOLUME * 1.5};
  const SFX_LEVELS = {off: 0, small: DEFAULT_SFX_VOLUME * 0.5, normal: DEFAULT_SFX_VOLUME, large: DEFAULT_SFX_VOLUME * 1.5};

  const readNumber = (key, fallback) => {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  };
  const readBool = key => localStorage.getItem(key) === "true";
  const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
  const clampSfx = value => Math.max(0, Math.min(1.5, Number(value) || 0));
  const readLevel = key => {
    const value = localStorage.getItem(key);
    return ["off", "small", "normal", "large"].includes(value) ? value : "normal";
  };

  let audioCtx = null;
  let initialized = false;
  let unlocked = false;
  let visible = !document.hidden;
  const hasSavedBgmLevel = localStorage.getItem(storage.bgmLevel) !== null;
  const hasSavedSfxLevel = localStorage.getItem(storage.sfxLevel) !== null;
  let bgmLevel = hasSavedBgmLevel ? readLevel(storage.bgmLevel) : "normal";
  let sfxLevel = hasSavedSfxLevel ? readLevel(storage.sfxLevel) : "normal";
  let bgmVolume = clamp(BGM_LEVELS[bgmLevel] ?? readNumber(storage.bgmVolume, DEFAULT_BGM_VOLUME));
  let sfxVolume = clampSfx(SFX_LEVELS[sfxLevel] ?? readNumber(storage.sfxVolume, DEFAULT_SFX_VOLUME));
  let bgmMuted = bgmLevel === "off";
  let sfxMuted = sfxLevel === "off";
  let currentMode = "";
  let currentPlaylist = [];
  let currentIndex = 0;
  let activePlayer = 0;
  let switchTimer = 0;
  let fadeRaf = 0;
  let sfxReady = false;
  let sfxLoading = null;
  const buffers = {};
  const voices = {};
  const lastSfxAt = {};
  const bgmPreloads = new Map();

  const players = [new Audio(), new Audio()];
  players.forEach((player, index) => {
    player.preload = "auto";
    player.crossOrigin = "anonymous";
    player.loop = false;
    player.addEventListener("ended", () => {
      if (currentMode !== "result" && index === activePlayer) playNextTrack(false);
    });
    player.addEventListener("error", () => {
      if (player.src) console.warn("BGM 로딩 실패:", player.src);
      if (currentMode !== "result" && index === activePlayer) playNextTrack(false);
    });
  });

  function bgmUrl(file) {
    return new URL(BGM_BASE + file, location.href).href;
  }

  function preloadBgmFiles(files = []) {
    files.filter(Boolean).forEach(file => {
      const url = bgmUrl(file);
      if (bgmPreloads.has(url)) return;
      const audio = new Audio();
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.loop = false;
      audio.src = url;
      bgmPreloads.set(url, audio);
      try { audio.load(); } catch {}
    });
  }

  function prepareNextTrack() {
    if (!currentPlaylist.length || currentMode === "result") return;
    const nextIndex = nextPlaylistIndex();
    const nextPlayer = players[1 - activePlayer];
    const url = bgmUrl(currentPlaylist[nextIndex]);
    if (nextPlayer.src !== url) {
      nextPlayer.pause();
      nextPlayer.src = url;
      nextPlayer.loop = false;
      nextPlayer.currentTime = nextTrackStartTime(nextIndex);
      nextPlayer.volume = 0;
      try { nextPlayer.load(); } catch {}
    }
    preloadBgmFiles([currentPlaylist[nextIndex], "result.mp3"]);
  }

  function nextPlaylistIndex() {
    if (!currentPlaylist.length) return 0;
    if (currentMode === "title" && currentPlaylist.length > 1 && currentIndex >= 1) return 1;
    return (currentIndex + 1) % currentPlaylist.length;
  }

  function nextTrackStartTime(index) {
    return 0;
  }

  function getAudioContext() {
    if (audioCtx) return audioCtx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
  }

  function targetBgmVolume() {
    return bgmMuted || !visible ? 0 : bgmVolume;
  }

  function cancelTimers() {
    clearTimeout(switchTimer);
    switchTimer = 0;
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    fadeRaf = 0;
  }

  function fade(player, from, to, seconds, done) {
    const start = performance.now();
    const duration = Math.max(0.01, seconds) * 1000;
    player.volume = clamp(from);
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      player.volume = clamp(from + (to - from) * t);
      if (t < 1) {
        fadeRaf = requestAnimationFrame(tick);
      } else if (done) {
        done();
      }
    };
    fadeRaf = requestAnimationFrame(tick);
  }

  async function safePlay(player) {
    if (!unlocked || bgmMuted || !visible) return false;
    try {
      await player.play();
      return true;
    } catch (error) {
      console.warn("BGM 재생 차단 또는 실패:", error);
      return false;
    }
  }

  async function tryAutoplayTitle() {
    if (!document.getElementById("titleScreen")?.classList.contains("active")) return;
    if (!currentPlaylist.length) playTitle();
    if (bgmMuted || !visible) return;
    unlocked = true;
    await startTrack(currentIndex, true);
    if (players[activePlayer].paused) unlocked = false;
  }

  function scheduleCrossfade() {
    clearTimeout(switchTimer);
    const player = players[activePlayer];
    if (!currentPlaylist.length || currentMode === "result") return;
    const duration = Number(player.duration);
    if (!Number.isFinite(duration) || duration <= BGM_FADE_SECONDS + 0.5) {
      switchTimer = setTimeout(scheduleCrossfade, 1000);
      return;
    }
    const remain = Math.max(0.4, duration - player.currentTime - BGM_FADE_SECONDS);
    prepareNextTrack();
    switchTimer = setTimeout(() => playNextTrack(true), remain * 1000);
  }

  async function startTrack(index, fadeIn = true) {
    if (!currentPlaylist.length) return;
    cancelTimers();
    currentIndex = index % currentPlaylist.length;
    const player = players[activePlayer];
    player.loop = false;
    player.src = bgmUrl(currentPlaylist[currentIndex]);
    player.currentTime = nextTrackStartTime(currentIndex);
    player.volume = fadeIn ? 0 : targetBgmVolume();
    const played = await safePlay(player);
    if (played) {
      if (fadeIn) fade(player, 0, targetBgmVolume(), BGM_SWITCH_SECONDS);
      prepareNextTrack();
      scheduleCrossfade();
    }
    return played;
  }

  async function playNextTrack(crossfade = true) {
    if (!currentPlaylist.length || currentMode === "result") return;
    const oldPlayer = players[activePlayer];
    const nextPlayerIndex = 1 - activePlayer;
    const nextPlayer = players[nextPlayerIndex];
    const nextIndex = nextPlaylistIndex();
    clearTimeout(switchTimer);
    const url = bgmUrl(currentPlaylist[nextIndex]);
    if (nextPlayer.src !== url) nextPlayer.src = url;
    nextPlayer.loop = false;
    nextPlayer.currentTime = nextTrackStartTime(nextIndex);
    nextPlayer.volume = crossfade ? 0 : targetBgmVolume();
    const played = await safePlay(nextPlayer);
    if (!played) return;
    fade(oldPlayer, oldPlayer.volume, 0, crossfade ? BGM_FADE_SECONDS : 0.08, () => {
      oldPlayer.pause();
      oldPlayer.currentTime = 0;
    });
    if (crossfade) fade(nextPlayer, 0, targetBgmVolume(), BGM_FADE_SECONDS);
    activePlayer = nextPlayerIndex;
    currentIndex = nextIndex;
    prepareNextTrack();
    scheduleCrossfade();
  }

  async function setPlaylist(mode, files, restartFromFirst = false) {
    const list = files.filter(Boolean);
    if (!list.length) return;
    preloadBgmFiles([...list, "result.mp3"]);
    const same = currentMode === mode && currentPlaylist.join("|") === list.join("|");
    currentMode = mode;
    currentPlaylist = list;
    if (!unlocked) return;
    if (same && !restartFromFirst) {
      players[activePlayer].volume = targetBgmVolume();
      return;
    }
    const oldPlayer = players[activePlayer];
    const nextPlayerIndex = 1 - activePlayer;
    activePlayer = nextPlayerIndex;
    currentIndex = 0;
    const nextPlayer = players[activePlayer];
    cancelTimers();
    nextPlayer.src = bgmUrl(currentPlaylist[0]);
    nextPlayer.loop = false;
    nextPlayer.currentTime = nextTrackStartTime(0);
    nextPlayer.volume = 0;
    const played = await safePlay(nextPlayer);
    if (!played) return;
    fade(oldPlayer, oldPlayer.volume, 0, BGM_SWITCH_SECONDS, () => {
      oldPlayer.pause();
      oldPlayer.currentTime = 0;
    });
    fade(nextPlayer, 0, targetBgmVolume(), BGM_SWITCH_SECONDS);
    prepareNextTrack();
    scheduleCrossfade();
  }

  async function loadSfx() {
    if (sfxLoading) return sfxLoading;
    const ctx = getAudioContext();
    if (!ctx) return Promise.resolve(false);
    sfxLoading = Promise.allSettled(Object.entries(SFX_FILES).map(async ([name, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.arrayBuffer();
        buffers[name] = await ctx.decodeAudioData(data);
      } catch (error) {
        console.warn(`효과음 로딩 실패: ${name}`, error);
      }
    })).then(() => {
      sfxReady = Object.keys(buffers).length > 0;
      return sfxReady;
    });
    return sfxLoading;
  }

  async function unlock() {
    initialized || init();
    const ctx = getAudioContext();
    try {
      if (ctx && ctx.state !== "running") await ctx.resume();
    } catch (error) {
      console.warn("AudioContext 활성화 실패:", error);
    }
    unlocked = true;
    loadSfx();
    if (!currentPlaylist.length && document.getElementById("titleScreen")?.classList.contains("active")) {
      playTitle();
    } else if (currentPlaylist.length) {
      players[activePlayer].paused && startTrack(currentIndex, true);
    }
  }

  function playSfx(name = "click") {
    const ctx = getAudioContext();
    if (!ctx || sfxMuted) return false;
    const buffer = buffers[name];
    if (!unlocked || !sfxReady || !buffer) {
      loadSfx();
      return false;
    }
    const nowMs = performance.now();
    if (nowMs - (lastSfxAt[name] || 0) < MIN_SFX_INTERVAL_MS) return true;
    lastSfxAt[name] = nowMs;
    voices[name] ||= [];
    while (voices[name].length >= MAX_SAME_SFX_VOICES) {
      const old = voices[name].shift();
      try { old.stop(); } catch {}
    }
    try {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.value = sfxVolume * (SFX_VOLUME[name] ?? 0.35);
      source.connect(gain).connect(ctx.destination);
      voices[name].push(source);
      source.onended = () => {
        voices[name] = (voices[name] || []).filter(item => item !== source);
      };
      source.start();
      return true;
    } catch (error) {
      console.warn("효과음 재생 실패:", name, error);
      return false;
    }
  }

  const SFX_VOLUME = {
    click: 0.32,
    card: 0.38,
    buy: 0.48,
    block: 0.45,
    warning: 0.48,
    confirm: 0.45
  };

  function playTitle() {
    preloadBgmFiles(["title.mp3", "result.mp3"]);
    return setPlaylist("title", ["title.mp3"], false);
  }

  function playKingdom(presetIndex = 0, restartFromFirst = false) {
    preloadBgmFiles([...(KINGDOM_BGM[presetIndex] || KINGDOM_BGM[0]), "result.mp3"]);
    return setPlaylist(`kingdom-${presetIndex}`, KINGDOM_BGM[presetIndex] || KINGDOM_BGM[0], restartFromFirst);
  }

  // resolves once the kingdom's first track has buffered enough to play smoothly (or after
  // timeoutMs on a slow/broken connection, so a loading screen waiting on this never hangs
  // forever). Only the first track matters here — the second is preloaded later, well before
  // it's needed, via prepareNextTrack() during actual playback.
  function preloadKingdomReady(presetIndex = 0, timeoutMs = 12000) {
    const file = (KINGDOM_BGM[presetIndex] || KINGDOM_BGM[0])[0];
    const url = bgmUrl(file);
    let audio = bgmPreloads.get(url);
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.src = url;
      bgmPreloads.set(url, audio);
      try { audio.load(); } catch {}
    }
    const ready = new Promise(resolve => {
      if (audio.readyState >= 3) return resolve();
      const done = () => {
        audio.removeEventListener("canplaythrough", done);
        audio.removeEventListener("loadeddata", done);
        audio.removeEventListener("error", done);
        resolve();
      };
      audio.addEventListener("canplaythrough", done, {once: true});
      audio.addEventListener("loadeddata", done, {once: true});
      audio.addEventListener("error", done, {once: true});
    });
    const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs));
    return Promise.race([ready, timeout]);
  }

  function playGuide() {
    preloadBgmFiles(["guide.mp3", "result.mp3"]);
    return setPlaylist("guide", ["guide.mp3"], false);
  }

  async function playResult() {
    currentMode = "result";
    currentPlaylist = ["result.mp3"];
    cancelTimers();
    players.forEach(player => {
      player.loop = false;
      player.pause();
      player.currentTime = 0;
      player.volume = 0;
    });
    if (!unlocked || bgmMuted || !visible) return;
    const player = players[activePlayer];
    player.src = bgmUrl("result.mp3");
    player.loop = false;
    player.currentTime = 0;
    player.volume = targetBgmVolume();
    try {
      await player.play();
    } catch (error) {
      console.warn("결과 음악 재생 실패:", error);
    }
  }

  function stopBgm() {
    cancelTimers();
    players.forEach(player => {
      player.pause();
      player.currentTime = 0;
      player.volume = 0;
    });
    currentPlaylist = [];
    currentMode = "";
  }

  function setBgmVolume(value) {
    bgmVolume = clamp(value);
    localStorage.setItem(storage.bgmVolume, String(bgmVolume));
    players[activePlayer].volume = targetBgmVolume();
  }

  function setSfxVolume(value) {
    sfxVolume = clampSfx(value);
    localStorage.setItem(storage.sfxVolume, String(sfxVolume));
  }

  function setBgmLevel(level = "normal") {
    bgmLevel = BGM_LEVELS[level] === undefined ? "normal" : level;
    bgmMuted = bgmLevel === "off";
    bgmVolume = clamp(BGM_LEVELS[bgmLevel]);
    localStorage.setItem(storage.bgmLevel, bgmLevel);
    localStorage.setItem(storage.bgmMuted, String(bgmMuted));
    localStorage.setItem(storage.bgmVolume, String(bgmVolume));
    players.forEach(player => {
      player.volume = player === players[activePlayer] ? targetBgmVolume() : 0;
      if (bgmMuted) player.pause();
    });
    if (!bgmMuted && unlocked && currentPlaylist.length) safePlay(players[activePlayer]);
    return bgmLevel;
  }

  function setSfxLevel(level = "normal") {
    sfxLevel = SFX_LEVELS[level] === undefined ? "normal" : level;
    sfxMuted = sfxLevel === "off";
    sfxVolume = clampSfx(SFX_LEVELS[sfxLevel]);
    localStorage.setItem(storage.sfxLevel, sfxLevel);
    localStorage.setItem(storage.sfxMuted, String(sfxMuted));
    localStorage.setItem(storage.sfxVolume, String(sfxVolume));
    return sfxLevel;
  }

  function getSettings() {
    return {bgmLevel, sfxLevel, bgmVolume, sfxVolume, bgmMuted, sfxMuted};
  }

  function toggleBgmMute() {
    bgmMuted = !bgmMuted;
    bgmLevel = bgmMuted ? "off" : "normal";
    bgmVolume = clamp(BGM_LEVELS[bgmLevel]);
    localStorage.setItem(storage.bgmMuted, String(bgmMuted));
    localStorage.setItem(storage.bgmLevel, bgmLevel);
    localStorage.setItem(storage.bgmVolume, String(bgmVolume));
    players.forEach(player => {
      player.volume = bgmMuted ? 0 : targetBgmVolume();
      if (!bgmMuted && unlocked && currentPlaylist.length && player === players[activePlayer]) safePlay(player);
    });
    return bgmMuted;
  }

  function toggleSfxMute() {
    sfxMuted = !sfxMuted;
    sfxLevel = sfxMuted ? "off" : "normal";
    sfxVolume = clampSfx(SFX_LEVELS[sfxLevel]);
    localStorage.setItem(storage.sfxMuted, String(sfxMuted));
    localStorage.setItem(storage.sfxLevel, sfxLevel);
    localStorage.setItem(storage.sfxVolume, String(sfxVolume));
    return sfxMuted;
  }

  function bindUnlockEvents() {
    const once = () => unlock();
    document.addEventListener("pointerdown", once, {once: true, passive: true});
    document.addEventListener("touchstart", once, {once: true, passive: true});
    document.addEventListener("click", once, {once: true});
    document.addEventListener("keydown", once, {once: true});
  }

  function init() {
    if (initialized) return;
    initialized = true;
    getAudioContext();
    loadSfx();
    preloadBgmFiles(["title.mp3", "result.mp3"]);
    bindUnlockEvents();
    if (document.getElementById("titleScreen")?.classList.contains("active")) {
      playTitle();
      setTimeout(tryAutoplayTitle, 0);
      window.addEventListener("load", tryAutoplayTitle, {once: true});
    }
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      const player = players[activePlayer];
      if (!visible) {
        players.forEach(item => item.pause());
      } else if (unlocked && currentPlaylist.length && currentMode !== "result" && !bgmMuted) {
        safePlay(player);
        fade(player, player.volume, targetBgmVolume(), 0.6);
      }
    });
  }

  window.CNationAudio = {
    init,
    unlock,
    playTitle,
    playKingdom,
    preloadKingdomReady,
    playGuide,
    playResult,
    playSfx,
    stopBgm,
    setBgmVolume,
    setSfxVolume,
    setBgmLevel,
    setSfxLevel,
    getSettings,
    toggleBgmMute,
    toggleSfxMute
  };

  init();
})();
