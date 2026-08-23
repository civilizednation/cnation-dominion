const IMG = "./assets/cards/";
const cards = {
  copper:{name:"동",type:"treasure",cost:0,coins:1,img:"001-copper-동.webp"},
  silver:{name:"은",type:"treasure",cost:3,coins:2,img:"002-silver-은.webp"},
  gold:{name:"금",type:"treasure",cost:6,coins:3,img:"003-gold-금.webp"},
  estate:{name:"사유지",type:"victory",cost:2,vp:1,img:"004-estate-사유지.webp"},
  duchy:{name:"공작령",type:"victory",cost:5,vp:3,img:"005-duchy-공작령.webp"},
  province:{name:"속령",type:"victory",cost:8,vp:6,img:"006-province-속령.webp"},
  curse:{name:"저주",type:"curse",cost:0,vp:-1,img:"007-curse-저주.webp"},
  cellar:{name:"지하옥",type:"action",cost:2,img:"008-cellar-지하옥.webp"},
  moat:{name:"해자",type:"action-reaction",cost:2,img:"009-moat-해자.webp"},
  village:{name:"마을",type:"action",cost:3,img:"010-village-마을.webp"},
  woodcutter:{name:"나무꾼",type:"action",cost:3,img:"011-woodcutter-나무꾼.webp"},
  workshop:{name:"작업장",type:"action",cost:3,img:"012-workshop-작업장.webp"},
  moneylender:{name:"대부업자",type:"action",cost:4,img:"013-moneylender-대부업자.webp"},
  remodel:{name:"개조",type:"action",cost:4,img:"014-remodel-개조.webp"},
  smithy:{name:"대장장이",type:"action",cost:4,img:"015-smithy-대장장이.webp"},
  spy:{name:"첩자",type:"action-attack",cost:4,img:"016-spy-첩자.webp"},
  thief:{name:"도둑",type:"action-attack",cost:4,img:"017-thief-도둑.webp"},
  throne:{name:"알현실",type:"action",cost:4,img:"018-throne-room-알현실.webp"},
  militia:{name:"민병대",type:"action-attack",cost:4,img:"019-militia-민병대.webp"},
  council:{name:"집회소",type:"action",cost:5,img:"020-council-room-집회소.webp"},
  festival:{name:"축제",type:"action",cost:5,img:"021-festival-축제.webp"},
  laboratory:{name:"실험실",type:"action",cost:5,img:"022-laboratory-실험실.webp"},
  library:{name:"도서관",type:"action",cost:5,img:"023-library-도서관.webp"},
  market:{name:"시장",type:"action",cost:5,img:"024-market-시장.webp"},
  secret:{name:"밀실",type:"action-reaction",cost:2,img:"025-secret-chamber-밀실.webp"},
  witch:{name:"마녀",type:"action-attack",cost:5,img:"026-witch-마녀.webp"},
  adventurer:{name:"모험가",type:"action",cost:6,img:"027-adventurer-모험가.webp"},
  chancellor:{name:"민사고",type:"action",cost:3,img:"028-chancellor-민사고.webp"},
  feast:{name:"연회",type:"action",cost:4,img:"029-feast-연회.webp"},
  mine:{name:"광산",type:"action",cost:5,img:"030-mine-광산.webp"},
  chapel:{name:"예배당",type:"action",cost:2,img:"031-chapel-예배당.webp"},
  gardens:{name:"정원",type:"victory",cost:4,img:"032-gardens-정원.webp"}
};
const nameToId = Object.fromEntries(Object.entries(cards).map(([id,c])=>[c.name,id]));
Object.assign(nameToId, {관료:"chancellor", 의회의사당:"council", 집회소:"council"});
const presets = [
  ["첫걸음 마을","도미니언의 기본 메커니즘을 두루 배우기 좋은 입문자용 덱","지하옥, 해자, 마을, 나무꾼, 작업장, 개조, 대장장이, 민병대, 광산, 시장"],
  ["대지주의 영지","필요 없는 카드를 빠르게 폐기하고 고급 재화를 모으는 덱","예배당, 관료, 대부업자, 연회, 알현실, 시장, 실험실, 광산, 모험가, 의회의사당"],
  ["전장의 화염","상대를 끊임없이 공격하고 방어하는 치열한 견제 위주의 덱","관료, 첩자, 민병대, 도둑, 의회의사당, 마을, 축제, 도서관, 해자, 마녀"],
  ["풍요의 정원","덱의 전체 카드 수량을 폭발적으로 늘려 승점을 얻는 특수 덱","지하옥, 작업장, 연회, 정원, 나무꾼, 마을, 도둑, 실험실, 마녀, 예배당"],
  ["무한의 엔진","액션과 드로우를 연쇄하여 한 턴에 수많은 카드를 사용하는 덱","지하옥, 마을, 관료, 나무꾼, 작업장, 개조, 대장장이, 축제, 도서관, 시장"],
  ["빈민과 부유층","상대의 재화를 훔치고 덱 구성을 압축해 격차를 벌리는 덱","대부업자, 민병대, 도둑, 마녀, 예배당, 해자, 알현실, 시장, 대장장이, 광산"],
  ["보물 사냥꾼","덱 순환을 극대화하여 금과 은을 빠르게 끌어모으는 덱","지하옥, 작업장, 관료, 모험가, 실험실, 대장장이, 연회, 광산, 시장, 알현실"],
  ["비밀 거래","카드 획득과 변환을 통해 순식간에 고성능 덱을 완성하는 덱","작업장, 개조, 연회, 대부업자, 해자, 마을, 대장장이, 광산, 의회의사당, 시장"],
  ["혼돈의 마법","손패 압박과 감점 부여로 상대의 전략을 방해하는 덱","마녀, 첩자, 민병대, 지하옥, 해자, 마을, 도서관, 축제, 대장장이, 예배당"],
  ["귀족의 연회","고비용 카드를 대량 수급하며 깔끔하게 덱을 경영하는 덱","연회, 광산, 의회의사당, 실험실, 도서관, 시장, 알현실, 축제, 마을, 개조"]
].map(([title,desc,list])=>({title,desc,ids:list.split(",").map(s=>nameToId[s.trim()]).filter(Boolean)}));
// end conditions are based on the 3 victory-point piles (province/duchy/estate) only:
// - trigger: any one of these empty ends the game immediately
// - anyOf/anyOfCount: the game ends once this many of these piles are empty
// - allOf: the game ends only once every one of these piles is empty
const modes = {
  original:{label:"오리지널",desc:"속령 고갈 또는 승점 카드 2종류 고갈",trigger:["province"],anyOf:["province","duchy","estate"],anyOfCount:2,province:8},
  speed:{label:"스피드",desc:"속령 또는 공작령 고갈",trigger:["province","duchy"],province:6},
  long:{label:"롱게임",desc:"승점 카드 3종류 모두 고갈",allOf:["province","duchy","estate"],province:8}
};
const diffs = {
  easy:{label:"하",desc:"기본 구매 위주"},
  normal:{label:"중",desc:"점수와 재화 균형"},
  hard:{label:"상",desc:"엔진과 공격 우선"},
  extreme:{label:"최상",desc:"최적화된 엔진과 저주 러시"}
};
let selectedPreset = 0, selectedDiff = "normal", selectedMode = "original";
let uid = 1, state = null, awaiting = false, selectedTreasures = new Set();
let audioCtx = null;

const $ = id => document.getElementById(id);
const make = id => ({id, uid: uid++});
const card = x => cards[x.id || x];
const shuffle = arr => { for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; };
const allCards = p => [...p.deck,...p.hand,...p.discard,...p.play];
const log = text => { state.log.unshift(text); state.log = state.log.slice(0, 30); };
const hasMoat = p => p.hand.some(c=>c.id==="moat");
function sound(kind="click") {
  if (window.CNationAudio?.playSfx?.(kind)) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const settings = {
      click: [620, 0.045, 0.035],
      card: [520, 0.07, 0.045],
      buy: [760, 0.09, 0.055],
      block: [180, 0.08, 0.04],
      warning: [150, 0.16, 0.075],
      confirm: [880, 0.06, 0.05]
    }[kind] || [620, 0.045, 0.035];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(settings[0], now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(settings[2] * 2.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings[1]);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + settings[1] + 0.01);
    if (kind === "warning") {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      const next = now + 0.09;
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(settings[0] * 0.82, next);
      gain2.gain.setValueAtTime(0.0001, next);
      gain2.gain.exponentialRampToValueAtTime(settings[2] * 2.25, next + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.0001, next + settings[1]);
      osc2.connect(gain2).connect(audioCtx.destination);
      osc2.start(next);
      osc2.stop(next + settings[1] + 0.01);
    }
  } catch {}
}
const BASE_CARD_IDS = ["copper","silver","gold","estate","duchy","province","curse"];
function cardImageUrls(ids) {
  return [...new Set(ids.map(id => IMG + cards[id].img))];
}
// downloads every url in parallel while reporting combined real progress via onProgress(0..1),
// priming the browser's HTTP cache so later <img>/<audio> requests for the same URLs load
// instantly. Races a hard timeout so a genuinely stalled connection can't leave a loading screen
// stuck.
//
// Each file gets an equal fixed weight of 1/N — known instantly, with no network round trip —
// and contributes its own live byte fraction (0..1) within that slice once its own response
// headers arrive. Two alternatives were tried and rejected: summing live content-length headers
// into one shared denominator makes the total grow unpredictably as more files' headers trickle
// in, so the fraction can visibly jump backward; waiting for every header before computing
// anything fixes that but, behind a browser's ~6-connections-per-origin cap, means nothing moves
// for several seconds while the first wave of files fully downloads. Fixed per-file weights avoid
// both: the denominator never changes, and whichever files are already in flight start
// contributing immediately.
function preloadWithProgress(urls, onProgress, timeoutMs = 30000) {
  const list = [...new Set(urls)].filter(Boolean);
  const n = list.length;
  if (!n) { onProgress(1); return Promise.resolve(); }
  const shareDone = list.map(() => 0);
  const report = () => onProgress(Math.min(1, shareDone.reduce((a, b) => a + b, 0) / n));
  const work = Promise.all(list.map(async (url, i) => {
    try {
      const res = await fetch(url);
      if (!res.ok || !res.body) { shareDone[i] = 1; return report(); }
      const total = Number(res.headers.get("content-length")) || 0;
      const reader = res.body.getReader();
      let loaded = 0;
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        shareDone[i] = total > 0 ? Math.min(1, loaded / total) : 0.5;
        report();
      }
      shareDone[i] = 1;
      report();
    } catch {
      shareDone[i] = 1;
      report();
    }
  })).then(() => onProgress(1));
  const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs));
  return Promise.race([work, timeout]);
}
function setLoadingProgress(fraction) {
  const pct = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  const fill = $("loadingBarFill");
  if (fill) fill.style.width = `${pct}%`;
  const label = $("loadingPercent");
  if (label) label.textContent = `${pct}%`;
}

function initChoices() {
  $("deckChoices").innerHTML = presets.map((p,i)=>`<button class="choice ${i===selectedPreset?"selected":""}" data-deck="${i}"><strong>${i+1}. ${p.title}</strong><span>${p.desc} · ${p.ids.map(id=>cards[id].name).join(", ")}</span></button>`).join("");
  $("difficultyChoices").innerHTML = Object.entries(diffs).map(([id,d])=>`<button class="choice ${id===selectedDiff?"selected":""}" data-diff="${id}"><strong>${d.label}</strong><span>${d.desc}</span></button>`).join("");
  $("modeChoices").innerHTML = Object.entries(modes).map(([id,m])=>`<button class="choice ${id===selectedMode?"selected":""}" data-mode="${id}"><strong>${m.label}</strong><span>${m.desc}</span></button>`).join("");
  renderSoundChoices();
  document.querySelectorAll("[data-deck]").forEach(b=>b.onclick=()=>{sound("click");selectedPreset=+b.dataset.deck;initChoices();});
  document.querySelectorAll("[data-diff]").forEach(b=>b.onclick=()=>{sound("click");selectedDiff=b.dataset.diff;initChoices();});
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{sound("click");selectedMode=b.dataset.mode;initChoices();});
}

function renderSoundChoices() {
  const root = $("soundChoices");
  if (!root) return;
  const labels = {off:"끄기", small:"작게", normal:"보통", large:"크게"};
  const settings = window.CNationAudio?.getSettings?.() || {bgmLevel:"normal", sfxLevel:"normal"};
  const row = (kind, label, selected) => `<b>${label}</b><div class="sound-row">${Object.entries(labels).map(([id,text])=>`<button class="sound-choice ${selected===id?"selected":""}" data-sound-kind="${kind}" data-sound-level="${id}">${text}</button>`).join("")}</div>`;
  root.innerHTML = row("bgm", "음악", settings.bgmLevel) + row("sfx", "효과음", settings.sfxLevel);
  root.querySelectorAll("[data-sound-kind]").forEach(button => {
    button.onclick = async () => {
      sound("click");
      await window.CNationAudio?.unlock?.();
      const level = button.dataset.soundLevel;
      if (button.dataset.soundKind === "bgm") window.CNationAudio?.setBgmLevel?.(level);
      else window.CNationAudio?.setSfxLevel?.(level);
      renderSoundChoices();
    };
  });
}

function newPlayer(name, ai=false) {
  const deck = shuffle([...Array(7)].map(()=>make("copper")).concat([...Array(3)].map(()=>make("estate"))));
  const p = {name, ai, deck, hand:[], discard:[], play:[], actions:1, buys:1, coins:0, turns:0};
  draw(p, 5);
  return p;
}

async function startGame() {
  const presetIds = presets[selectedPreset].ids;
  $("titleScreen").classList.remove("active");
  $("loadingScreen").classList.add("active");
  setLoadingProgress(0);
  // wait for this game's card art + its kingdom's first BGM track before showing the board, so
  // slow connections don't see cards pop in one by one mid-game
  const imageUrls = cardImageUrls([...BASE_CARD_IDS, ...presetIds]);
  const bgmTrackUrl = window.CNationAudio?.kingdomFirstTrackUrl?.(selectedPreset);
  await preloadWithProgress([...imageUrls, ...(bgmTrackUrl ? [bgmTrackUrl] : [])], setLoadingProgress);

  uid = 1;
  selectedTreasures.clear();
  const mode = modes[selectedMode];
  const supply = {copper:46, silver:40, gold:30, estate:8, duchy:8, province:mode.province, curse:10};
  for (const id of presetIds) supply[id] = cards[id].type === "victory" ? 8 : 10;
  state = {mode:selectedMode, diff:selectedDiff, preset:selectedPreset, phase:"action", current:0, players:[newPlayer("나"), newPlayer("컴퓨터", true)], supply, log:[]};
  log(`${presets[selectedPreset].title} 조합으로 시작합니다.`);
  window.CNationAudio?.playKingdom?.(selectedPreset, true);
  $("loadingScreen").classList.remove("active");
  $("gameScreen").classList.add("active");
  render();
}

function draw(p, n=1) {
  for (let i=0;i<n;i++) {
    if (!p.deck.length) { p.deck = shuffle(p.discard.splice(0)); }
    if (!p.deck.length) return;
    p.hand.push(p.deck.pop());
  }
}
function gain(p, id, to="discard") {
  if (!state.supply[id]) return false;
  state.supply[id]--;
  p[to].push(make(id));
  log(`${p.name}: ${cards[id].name} 획득`);
  return true;
}
function discardCard(p, c) { p.discard.push(c); }
function trashFromHand(p, uidValue) {
  const i = p.hand.findIndex(c=>c.uid===uidValue);
  return i >= 0 ? p.hand.splice(i,1)[0] : null;
}

function render() {
  if (!state) return;
  const p = state.players[0], cpu = state.players[1], active = state.players[state.current];
  $("message").innerHTML = messageHtml(active);
  $("playerStats").innerHTML = statsHtml(p);
  $("cpuStats").innerHTML = statsHtml(cpu);
  selectedTreasures = new Set([...selectedTreasures].filter(u=>p.hand.some(c=>c.uid===u)));
  $("playerHand").innerHTML = p.hand.map((c,i)=>handHtml(c,i,state.current===0)).join("");
  $("cpuHand").innerHTML = cpu.hand.map(()=>`<div class="mini-card back">?</div>`).join("");
  $("supplyGrid").innerHTML = Object.keys(state.supply).map(id=>supplyHtml(id)).join("");
  requestAnimationFrame(fitSupplyCards);
  $("selectAllBtn").disabled = state.current !== 0 || state.phase !== "buy" || awaiting || !p.hand.some(c=>cards[c.id].type==="treasure" && !selectedTreasures.has(c.uid));
  $("buyPhaseBtn").disabled = state.current !== 0 || state.phase !== "action" || awaiting;
  $("endTurnBtn").disabled = state.current !== 0 || awaiting;
  document.querySelectorAll("[data-hand]").forEach(el=>el.onclick=()=>onHand(+el.dataset.hand));
  document.querySelectorAll("[data-buy]").forEach(el=>el.onclick=()=>onSupply(el.dataset.buy));
}
function fitSupplyCards() {
  const center = document.querySelector(".center");
  const supply = document.querySelector(".supply");
  const grid = $("supplyGrid");
  const playerHand = $("playerHand");
  if (!center || !supply || !grid) return;
  const styles = getComputedStyle(grid);
  const gridGap = parseFloat(styles.columnGap) || 0;
  const centerGap = parseFloat(getComputedStyle(center).columnGap) || 0;
  const supplyTitle = supply.querySelector(".supply-title");
  const supplyStyles = getComputedStyle(supply);
  const supplyGap = parseFloat(supplyStyles.rowGap) || 0;
  const cols = 9;
  const rows = 2;
  const ratio = 31 / 48;
  const statusMinWidth = 320;
  const maxGridWidth = center.clientWidth - statusMinWidth - centerGap;
  const maxGridHeight = center.clientHeight - (supplyTitle?.offsetHeight || 0) - supplyGap;
  const maxW = (maxGridWidth - gridGap * (cols - 1)) / cols;
  const maxH = (maxGridHeight - gridGap * (rows - 1)) / rows;
  const width = Math.max(132, Math.floor(Math.min(maxW, maxH * ratio, 160)));
  const height = Math.floor(width / ratio);
  document.documentElement.style.setProperty("--pc-card-w", `${width}px`);
  document.documentElement.style.setProperty("--pc-card-h", `${height}px`);
  if (playerHand) playerHand.style.height = `${height + 8}px`;
}
function helpText() {
  return state.phase === "action"
    ? "액션 카드를 터치해 사용하세요. 더 사용할 액션이 없으면 구매 단계로 넘어가세요."
    : "재화 카드를 터치해 사용한 뒤 공급처 카드를 터치해 구매하세요.";
}
function messageHtml(active) {
  const phase = `${active.name} 턴 · ${state.phase === "action" ? "액션" : "구매"} 단계`;
  const guide = active.ai ? "컴퓨터가 생각 중입니다." : helpText();
  const feed = state.log.slice(0, 3).map((x,i)=>`<div class="${i===0?"recent":""}">${x}</div>`).join("");
  return `<div class="guide">${phase} · ${guide}</div><div class="feed">${feed}</div>`;
}
function statsHtml(p) {
  const total = p.deck.length + p.discard.length + p.hand.length + p.play.length;
  return `<span class="pill">점수 ${score(p)}</span><span class="pill">액션 ${p.actions}</span><span class="pill">구입 ${p.buys}</span><span class="pill">재화 ${p.coins}</span><span class="pill">덱 ${p.deck.length}</span><span class="pill">버림 ${p.discard.length}</span><span class="pill">총 ${total}</span>`;
}
function handHtml(c, i, human) {
  const cd = card(c);
  const playable = human && ((state.phase==="action" && cd.type.includes("action") && state.players[0].actions>0) || (state.phase==="buy" && cd.type==="treasure"));
  const selected = selectedTreasures.has(c.uid);
  return `<div class="mini-card ${playable?"":"disabled"} ${selected?"selected":""}" data-hand="${i}"><img src="${IMG+cd.img}" alt="${cd.name}"></div>`;
}
function supplyCountClass(count) {
  if (count <= 1) return "danger";
  if (count <= 3) return "warn";
  return "";
}
function supplyHtml(id) {
  const cd = cards[id], count = state.supply[id] || 0;
  return `<button class="supply-card ${count<=0?"empty":""}" data-buy="${id}"><img src="${IMG+cd.img}" alt="${cd.name}"><span class="count ${supplyCountClass(count)}">${count}</span></button>`;
}

async function onHand(i) {
  if (awaiting || state.current !== 0) return;
  const p = state.players[0], c = p.hand[i], cd = card(c);
  if (state.phase === "action" && cd.type.includes("action") && p.actions > 0) { sound("card"); await playAction(p, i); }
  else if (state.phase === "buy" && cd.type === "treasure") { sound("card"); toggleTreasure(p, c); }
  else { sound("block"); log("지금은 선택할 수 없습니다."); }
  render();
}
async function onSupply(id) {
  if (awaiting || state.current !== 0 || state.phase !== "buy") return;
  const p = state.players[0], cd = cards[id];
  if (state.supply[id] <= 0) return sound("block"), log("그 카드 더미가 비었습니다."), render();
  if (p.buys <= 0) return sound("block"), log("남은 구입이 없습니다."), render();
  if (p.coins < cd.cost) return sound("warning"), log("재화가 부족합니다."), render();
  sound("buy");
  p.coins -= cd.cost; p.buys--; discardSelectedTreasures(p); gain(p, id); render();
  // per the official rule the game ends at the END of the current turn (checked in endTurn's
  // cleanup, not here) — ending it the instant a pile empties would cut the buying player's own
  // turn short and deny them any remaining buys/actions they still had.
}
function playTreasure(p, i) {
  const [c] = p.hand.splice(i,1);
  p.play.push(c);
  p.coins += card(c).coins || 0;
  log(`${p.name}: ${card(c).name} 사용 (+${card(c).coins} 재화)`);
}
function toggleTreasure(p, c) {
  const coins = card(c).coins || 0;
  if (selectedTreasures.has(c.uid)) {
    if (p.coins < coins) return sound("block"), log("이미 사용한 재화는 구매 후 취소할 수 없습니다.");
    selectedTreasures.delete(c.uid);
    p.coins -= coins;
    log(`${p.name}: ${card(c).name} 선택 취소 (-${coins} 재화)`);
  } else {
    selectedTreasures.add(c.uid);
    p.coins += coins;
    log(`${p.name}: ${card(c).name} 선택 (+${coins} 재화)`);
  }
}
function selectAllTreasures() {
  if (awaiting || !state || state.current !== 0) return;
  const p = state.players[0];
  if (state.phase !== "buy") return sound("block"), log("구매 단계에서 재화 카드를 전체선택할 수 있습니다."), render();
  const targets = p.hand.filter(c=>cards[c.id].type === "treasure" && !selectedTreasures.has(c.uid));
  if (!targets.length) return sound("block"), log("선택할 재화 카드가 없습니다."), render();
  const coins = targets.reduce((sum,c)=>sum+(card(c).coins||0),0);
  targets.forEach(c => selectedTreasures.add(c.uid));
  p.coins += coins;
  sound("card");
  log(`${p.name}: 재화 카드 ${targets.length}장 전체선택 (+${coins} 재화)`);
  render();
}
function discardSelectedTreasures(p) {
  if (!selectedTreasures.size) return;
  const used = [];
  for (let i=p.hand.length-1;i>=0;i--) {
    const c = p.hand[i];
    if (selectedTreasures.has(c.uid) && cards[c.id].type === "treasure") {
      used.push(...p.hand.splice(i, 1));
    }
  }
  selectedTreasures.clear();
  p.discard.push(...used.reverse());
}
async function playAction(p, i, free=false) {
  let c;
  if (free) c = p.hand[i]; else { if (p.actions <= 0) return; p.actions--; [c] = p.hand.splice(i,1); p.play.push(c); }
  log(`${p.name}: ${card(c).name} 사용`);
  await resolveAction(p, c.id);
  render();
}

async function resolveAction(p, id) {
  const opp = state.players[p.ai ? 0 : 1];
  const human = !p.ai;
  if (id==="cellar") { p.actions++; const chosen = human ? await chooseHand("버릴 카드를 선택하세요", p, 0, 99) : aiChooseDiscards(p, p.hand.filter(c=>!cards[c.id].type.includes("action")).length); chosen.forEach(u=>discardCard(p, trashFromHand(p,u))); draw(p, chosen.length); }
  if (id==="moat") draw(p,2);
  if (id==="village") { draw(p,1); p.actions += 2; }
  if (id==="woodcutter") { p.buys++; p.coins += 2; }
  if (id==="workshop") await gainChoice(p, 4, "얻을 카드 선택");
  if (id==="moneylender") { const copper = p.hand.find(c=>c.id==="copper"); if (copper && (!human || await confirmPick("동 1장을 폐기하고 +3 재화를 얻을까요?"))) { trashFromHand(p, copper.uid); p.coins += 3; } }
  if (id==="remodel") { const pick = human ? (await chooseHand("폐기할 카드 1장 선택", p, 1, 1))[0] : aiRemodelTrash(p); const old = pick && trashFromHand(p, pick); if (old) await gainChoice(p, cards[old.id].cost + 2, "얻을 카드 선택"); }
  if (id==="smithy") draw(p,3);
  if (id==="spy") { draw(p,1); p.actions++; await spyEffect(p); }
  if (id==="thief") await thiefEffect(p, opp);
  if (id==="throne") { const acts = p.hand.map((c,i)=>cards[c.id].type.includes("action") ? i : -1).filter(i=>i>=0); if (acts.length) { const idx = human ? await chooseHandIndex("두 번 사용할 액션 카드 선택", p, acts) : acts[0]; const [target] = p.hand.splice(idx,1); p.play.push(target); await resolveAction(p, target.id); await resolveAction(p, target.id); } }
  if (id==="militia") { p.coins += 2; if (!hasMoat(opp)) await discardDownTo(opp, 3); else log(`${opp.name}: 해자로 방어`); }
  if (id==="council") { draw(p,4); p.buys++; draw(opp,1); }
  if (id==="festival") { p.actions += 2; p.buys++; p.coins += 2; }
  if (id==="laboratory") { draw(p,2); p.actions++; }
  if (id==="library") { while (p.hand.length < 7) draw(p,1); }
  if (id==="market") { draw(p,1); p.actions++; p.buys++; p.coins++; }
  if (id==="secret") { const chosen = human ? await chooseHand("버릴 카드 선택: 카드마다 +1 재화", p, 0, 99) : aiChooseDiscards(p, 2); chosen.forEach(u=>discardCard(p, trashFromHand(p,u))); p.coins += chosen.length; }
  if (id==="witch") { draw(p,2); if (!hasMoat(opp)) gain(opp,"curse"); else log(`${opp.name}: 해자로 방어`); }
  if (id==="adventurer") { let found=0, revealed=[]; while(found<2) { if(!p.deck.length) p.deck = shuffle(p.discard.splice(0)); if(!p.deck.length) break; const c=p.deck.pop(); if(cards[c.id].type==="treasure"){p.hand.push(c);found++;} else revealed.push(c); } p.discard.push(...revealed); }
  if (id==="chancellor") { p.coins += 2; if (!human || await confirmPick("덱을 버린 카드 더미로 보낼까요?")) p.discard.push(...p.deck.splice(0)); }
  if (id==="feast") { const idx = p.play.findIndex(c=>c.id==="feast"); if (idx>=0) p.play.splice(idx,1); await gainChoice(p, 5, "얻을 카드 선택"); }
  if (id==="mine") await mineEffect(p, human);
  if (id==="chapel") { const chosen = human ? await chooseHand("폐기할 카드 최대 4장 선택", p, 0, 4) : aiChapelTrash(p); chosen.forEach(u=>trashFromHand(p,u)); }
}

async function gainChoice(p, maxCost, title) {
  const ids = Object.keys(state.supply).filter(id=>state.supply[id] > 0 && cards[id].cost <= maxCost);
  if (!ids.length) return;
  const id = p.ai ? aiBuyPick(p, maxCost, ids) : await chooseSupply(title, ids);
  if (id) gain(p, id);
}
async function mineEffect(p, human) {
  const treasures = p.hand.map((c,i)=>cards[c.id].type==="treasure"?i:-1).filter(i=>i>=0);
  if (!treasures.length) return;
  const idx = human ? await chooseHandIndex("폐기할 재화 카드 선택", p, treasures) : treasures[0];
  const [old] = p.hand.splice(idx,1);
  // official rule only caps the gain at +3 cost; it has no lower bound, so trashing a Gold must
  // still be able to regain a Gold instead of leaving the player with nothing
  const ids = ["copper","silver","gold"].filter(id=>state.supply[id]>0 && cards[id].cost <= cards[old.id].cost + 3);
  const gainId = human ? await chooseSupply("손으로 가져올 재화 선택", ids) : ids.at(-1);
  if (gainId && state.supply[gainId]>0) { state.supply[gainId]--; p.hand.push(make(gainId)); log(`${p.name}: ${cards[gainId].name} 손으로 획득`); }
}
async function spyEffect(p) {
  for (const target of state.players) {
    if (target !== p && hasMoat(target)) { log(`${target.name}: 해자로 방어`); continue; }
    if (!target.deck.length) target.deck = shuffle(target.discard.splice(0));
    const top = target.deck.pop(); if (!top) continue;
    const discard = p.ai ? aiSpyDiscard(top) : await confirmPick(`${target.name}의 ${cards[top.id].name}: 버릴까요?`);
    (discard ? target.discard : target.deck).push(top);
  }
}
async function thiefEffect(p, opp) {
  if (hasMoat(opp)) return log(`${opp.name}: 해자로 방어`);
  const revealed=[]; for(let i=0;i<2;i++){ if(!opp.deck.length) opp.deck=shuffle(opp.discard.splice(0)); if(opp.deck.length) revealed.push(opp.deck.pop()); }
  const treasures = revealed.filter(c=>cards[c.id].type==="treasure");
  let trashed = null;
  if (treasures.length) trashed = treasures.sort((a,b)=>cards[b.id].cost-cards[a.id].cost)[0];
  for (const c of revealed) { if (trashed && c.uid===trashed.uid) continue; opp.discard.push(c); }
  if (trashed && (!p.ai || await confirmPick(`${cards[trashed.id].name}을 얻을까요?`))) p.discard.push(trashed);
}
async function discardDownTo(p, n) {
  const count = Math.max(0, p.hand.length - n);
  if (!count) return;
  const chosen = p.ai ? aiChooseDiscards(p, count) : await chooseHand(`${count}장 버리기`, p, count, count);
  chosen.forEach(u=>discardCard(p, trashFromHand(p,u)));
}

function beginBuyPhase() {
  if (state.current !== 0) return;
  selectedTreasures.clear();
  state.phase = "buy";
  log("구매 단계로 넘어갑니다.");
  render();
}
async function endTurn() {
  if (awaiting) return;
  cleanup(state.players[state.current]);
  if (checkEnd()) return endGame();
  state.current = 1 - state.current;
  startTurn(state.players[state.current]);
  render();
  if (state.players[state.current].ai) await aiTurn();
}
function cleanup(p) {
  if (!p.ai) selectedTreasures.clear();
  p.discard.push(...p.hand.splice(0), ...p.play.splice(0));
  draw(p,5); p.turns++;
}
function startTurn(p) { if (!p.ai) selectedTreasures.clear(); p.actions=1; p.buys=1; p.coins=0; state.phase="action"; log(`${p.name} 턴 시작`); }
async function aiTurn() {
  awaiting = true; render();
  const p = state.players[1];
  let guard = 20;
  while (guard-- && p.actions > 0) {
    const idx = aiActionIndex(p);
    if (idx < 0) break;
    await playAction(p, idx);
  }
  state.phase = "buy";
  for (let i=p.hand.length-1;i>=0;i--) if (cards[p.hand[i].id].type==="treasure") playTreasure(p,i);
  while (p.buys > 0) {
    const id = aiBuyPick(p, p.coins);
    if (!id) break;
    p.coins -= cards[id].cost; p.buys--; gain(p,id);
  }
  awaiting = false;
  await endTurn();
}

const ACTION_ORDER = {
  easy: ["smithy","market","village","woodcutter","laboratory","council","moat"],
  normal: ["village","laboratory","market","festival","smithy","witch","militia","moneylender","mine","workshop","council","library","woodcutter","chapel","cellar","chancellor","moat"],
  hard: ["witch","village","festival","laboratory","market","militia","moneylender","chapel","smithy","council","mine","adventurer","workshop","remodel","library","cellar","chancellor","thief","spy","throne","moat","woodcutter","feast"],
  extreme: ["witch","chapel","village","festival","laboratory","market","militia","moneylender","smithy","council","mine","workshop","remodel","adventurer","library","cellar","chancellor","throne","thief","spy","moat","woodcutter","feast"]
};
// net change in remaining actions from playing the card (draw/coin effects ignored); anything not
// listed is a terminal (-1). "상"/"최상" use this to always chain village/lab-type cards before
// spending their last action on a terminal, instead of scanning a single fixed priority order.
const ACTION_NET_GAIN = {village:1, festival:1, laboratory:0, market:0, cellar:0, spy:0};
function aiActionIndex(p) {
  const order = ACTION_ORDER[state.diff] || ACTION_ORDER.normal;
  const playable = order.map(id => p.hand.findIndex(c=>c.id===id)).filter(i=>i>=0);
  if (!playable.length) return -1;
  if (state.diff !== "hard" && state.diff !== "extreme") return playable[0];
  return playable.slice().sort((a,b) => {
    const netA = ACTION_NET_GAIN[p.hand[a].id] ?? -1, netB = ACTION_NET_GAIN[p.hand[b].id] ?? -1;
    return netB - netA || order.indexOf(p.hand[a].id) - order.indexOf(p.hand[b].id);
  })[0];
}
// how many cards a deck must reach before the AI starts buying duchy (outside the guaranteed
// province grab below); "중" is the earliest tier this applies to — "최상" holds off until the
// province pile itself is running low, keeping its engine bigger for longer. "하" doesn't use this
// at all; see aiBuyPick's early branch instead.
const GREEN_AT = {normal:24, hard:23, extreme:Infinity};
function aiBuyPriorities(diffId) {
  const preset = presets[state.preset].ids;
  if (diffId === "normal") return ["gold","witch","laboratory","market","festival","council","mine","silver","village","smithy","duchy","gardens","estate",...preset];
  if (diffId === "hard") return ["gold","witch","laboratory","market","festival","council","mine","silver","village","smithy","chapel","moneylender","militia","duchy","gardens","estate",...preset];
  return ["chapel","gold","witch","laboratory","market","festival","council","mine","silver","village","smithy","moneylender","militia","duchy","gardens","estate",...preset];
}
// caps how many of a one-shot/utility action the AI will pick up before it falls through to the
// next priority; without this a cheap card ranked ahead of silver (e.g. chapel at cost 2) gets
// bought on repeat instead of ever building an economy. Treasures/victory cards stay uncapped.
const BUY_CAP = {chapel:1, moneylender:2, witch:2, workshop:1, mine:1, remodel:1, feast:1, throne:1, adventurer:1, secret:1, chancellor:1, thief:1, spy:1, militia:2, village:4, festival:3, laboratory:3, market:4, smithy:3, council:2, library:2, cellar:1, woodcutter:2, moat:2};
// "상"/"최상" push past "중"'s cap on curses, chasing a bigger curse-attack lead.
function buyCap(diffId, id) {
  if (id === "witch" && (diffId === "extreme" || diffId === "hard")) return 4;
  return BUY_CAP[id];
}
function aiBuyPick(p, maxCost, pool=Object.keys(state.supply)) {
  if (maxCost >= 8 && state.supply.province) return "province";
  const diffId = state.diff;
  if (diffId === "easy") {
    // mimics a first-time player with no real strategy: grabs whichever affordable card has the
    // highest cost. This still buys treasure reasonably often (by accident) but also wastes buys
    // on victory cards the moment they outrank silver/gold in raw cost — a genuine beginner mistake
    // rather than the deliberately-crippled "always green first" priority list this replaced.
    const candidates = pool.filter(id => state.supply[id] > 0 && cards[id].cost > 0 && cards[id].cost <= maxCost);
    return candidates.length ? candidates.sort((a,b)=>cards[b].cost-cards[a].cost)[0] : null;
  }
  const total = allCards(p).length;
  const provinceLow = diffId === "extreme" && state.supply.province <= 4;
  if ((total > (GREEN_AT[diffId] ?? 24) || provinceLow) && maxCost >= 5 && state.supply.duchy) return "duchy";
  const priorities = aiBuyPriorities(diffId);
  for (const id of priorities) {
    if (!pool.includes(id) || !(state.supply[id] > 0) || cards[id].cost > maxCost) continue;
    const cap = buyCap(diffId, id);
    if (cap != null && allCards(p).filter(c=>c.id===id).length >= cap) continue;
    return id;
  }
  return null;
}
function aiChooseDiscards(p, count) {
  const value = c => ({curse:0, estate:1, duchy:1, province:1, copper:2, cellar:2, moat:2, silver:3, gold:5}[c.id] ?? 3);
  return [...p.hand].sort((a,b)=>value(a)-value(b)).slice(0,count).map(c=>c.uid);
}
function aiChapelTrash(p) {
  const junk = p.hand.filter(c=>["curse","estate","copper"].includes(c.id));
  if (state.diff !== "hard" && state.diff !== "extreme") return junk.slice(0,4).map(c=>c.uid);
  // keep a small copper buffer so trashing doesn't stall early-game coins, but trim harder than easy/normal
  const minCoppers = state.diff === "extreme" ? 2 : 3;
  const coppersOwned = allCards(p).filter(c=>c.id==="copper").length;
  return junk.filter(c=>c.id!=="copper" || coppersOwned > minCoppers).slice(0,4).map(c=>c.uid);
}
function aiRemodelTrash(p) { const c = p.hand.find(c=>["curse","estate","copper"].includes(c.id)) || p.hand[0]; return c?.uid; }
function aiSpyDiscard(c) { return ["curse","estate","copper"].includes(c.id); }

function score(p) {
  const total = allCards(p).length;
  return allCards(p).reduce((sum,c)=>{
    if (c.id==="gardens") return sum + Math.floor(total / 10);
    return sum + (cards[c.id].vp || 0);
  },0);
}
function countCardsForResult(p) {
  const counts = {};
  for (const c of allCards(p)) counts[c.id] = (counts[c.id] || 0) + 1;
  return counts;
}
function cardScoreForResult(id, count, totalCards) {
  if (id === "gardens") return count * Math.floor(totalCards / 10);
  return count * (cards[id].vp || 0);
}
function resultScoreRows(p) {
  const counts = countCardsForResult(p);
  const totalCards = allCards(p).length;
  return Object.keys(counts)
    .map(id => ({id, count: counts[id], points: cardScoreForResult(id, counts[id], totalCards)}))
    .filter(row => row.points !== 0 || cards[row.id].type === "victory" || cards[row.id].type === "curse")
    .sort((a,b) => (cards[b.id].vp || 0) - (cards[a.id].vp || 0) || cards[a.id].cost - cards[b.id].cost);
}
function resultCardHtml(id, count) {
  const cd = cards[id];
  return `<figure class="result-card"><img src="${IMG+cd.img}" alt="${cd.name}"><figcaption><strong>${cd.name}</strong><span>${count}장</span></figcaption></figure>`;
}
function resultPlayerHtml(p) {
  const counts = countCardsForResult(p);
  const totalCards = allCards(p).length;
  const rows = resultScoreRows(p);
  const holdings = Object.keys(counts)
    .sort((a,b) => cards[a].cost - cards[b].cost || cards[a].name.localeCompare(cards[b].name, "ko"))
    .map(id => resultCardHtml(id, counts[id]))
    .join("");
  const scoreRows = rows.map(row => `<div><span>${cards[row.id].name} ${row.count}장</span><b>${row.points}점</b></div>`).join("");
  return `<section class="result-player"><div class="result-player-head"><h3>${p.name}</h3><strong>${score(p)}점</strong><span>총 ${totalCards}장 · ${p.turns}턴</span></div><div class="result-holdings">${holdings}</div><div class="result-score">${scoreRows || "<div><span>승점 카드 없음</span><b>0점</b></div>"}<div class="total"><span>총점</span><b>${score(p)}점</b></div></div></section>`;
}
function resultSummaryHtml(ps, s0, s1) {
  const mode = modes[state.mode];
  const reason = checkEnd() ? mode.desc : "승리 조건 달성";
  const winner = s0 === s1
    ? (ps[0].turns <= ps[1].turns ? "동점이지만 턴 수 기준으로 내가 승리했습니다." : "동점이지만 턴 수 기준으로 컴퓨터가 승리했습니다.")
    : (s0 > s1 ? "내가 컴퓨터보다 높은 점수로 승리했습니다." : "컴퓨터가 더 높은 점수로 승리했습니다.");
  // the title ("승리!" etc.) is already shown in #endTitle above this, so it isn't repeated here
  return `<div class="result-summary"><span>내 점수 ${s0}점 · 컴퓨터 ${s1}점</span><p>${winner}</p><small>종료 조건: ${reason}</small></div><div class="result-board">${resultPlayerHtml(ps[0])}${resultPlayerHtml(ps[1])}</div>`;
}
function checkEnd() {
  const mode = modes[state.mode];
  if ((mode.trigger || []).some(id => state.supply[id] <= 0)) return true;
  if (mode.allOf && mode.allOf.every(id => state.supply[id] <= 0)) return true;
  if (mode.anyOf && mode.anyOf.filter(id => state.supply[id] <= 0).length >= mode.anyOfCount) return true;
  return false;
}
function endGame() {
  const ps = state.players, s0 = score(ps[0]), s1 = score(ps[1]);
  let title = s0 > s1 ? "승리!" : s0 < s1 ? "패배" : ps[0].turns <= ps[1].turns ? "동점 승리" : "동점 패배";
  window.CNationAudio?.playResult?.();
  $("endTitle").textContent = title;
  $("endText").innerHTML = resultSummaryHtml(ps, s0, s1);
  $("restartBtn").textContent = "확인";
  $("endScreen").classList.add("active");
  render();
}

function chooseHand(title, p, min, max) {
  return new Promise(resolve => openModal(title, p.hand, min, max, resolve));
}
function chooseHandIndex(title, p, indexes) {
  return new Promise(resolve => openModal(title, indexes.map(i=>p.hand[i]), 1, 1, uids => resolve(p.hand.findIndex(c=>c.uid===uids[0]))));
}
function chooseSupply(title, ids) {
  if (!ids.length) return Promise.resolve(null);
  return new Promise(resolve => openModal(title, ids.map(id=>({id, uid:id})), 1, 1, vals => resolve(vals[0])));
}
function confirmPick(title) {
  return new Promise(resolve => {
    openModal(title, [], 0, 0, () => resolve(true), () => resolve(false), "예", "아니오");
  });
}
function openModal(title, items, min, max, resolve, cancelResolve=null, okText="확인", cancelText="취소") {
  awaiting = true;
  const selected = new Set();
  $("modalTitle").textContent = title;
  $("modalCards").innerHTML = items.map(x=>`<button class="supply-card" data-pick="${x.uid}"><img src="${IMG+cards[x.id].img}" alt="${cards[x.id].name}"></button>`).join("");
  $("modalOk").textContent = okText; $("modalCancel").textContent = cancelText;
  $("modal").classList.add("active");
  document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{
    sound("card");
    const v = isNaN(+b.dataset.pick) ? b.dataset.pick : +b.dataset.pick;
    if (selected.has(v)) { selected.delete(v); b.classList.remove("selected"); }
    else if (selected.size < max) { selected.add(v); b.classList.add("selected"); }
  });
  const close = val => { $("modal").classList.remove("active"); awaiting = false; render(); resolve(val); };
  $("modalOk").onclick = () => { if (selected.size < min) return sound("block"); sound("confirm"); close([...selected]); };
  $("modalCancel").onclick = () => { sound("click"); $("modal").classList.remove("active"); awaiting = false; render(); (cancelResolve || resolve)([]); };
  if (!items.length && min===0) $("modalOk").onclick = () => { sound("confirm"); close([]); };
}

async function enterFullscreen() {
  const root = document.documentElement;
  if (document.fullscreenElement) return;
  try {
    if (root.requestFullscreen) await root.requestFullscreen();
    else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    else if (root.msRequestFullscreen) root.msRequestFullscreen();
  } catch {}
}

$("startBtn").onclick = async () => {
  sound("confirm");
  await window.CNationAudio?.unlock?.();
  const button = $("startBtn");
  button.disabled = true;

  try {
    await enterFullscreen();
    await startGame();
  } catch (error) {
    console.error(error);
    sound("warning");
    alert("게임을 시작하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도하세요.");
  } finally {
    button.disabled = false;
  }
};
const titleExitBtn = $("titleExitBtn");
if (titleExitBtn) {
  titleExitBtn.onclick = () => {
    sound("click");
    if (!window.confirm("PC 게임 페이지를 종료할까요?")) return;
    window.close();
    if (!window.closed) {
      alert("브라우저 보안상 이 탭을 자동으로 닫을 수 없습니다. 탭을 직접 닫아 주세요.");
    }
  };
}
$("buyPhaseBtn").onclick = () => { sound("click"); beginBuyPhase(); };
$("selectAllBtn").onclick = selectAllTreasures;
$("endTurnBtn").onclick = () => { sound("confirm"); endTurn(); };
$("restartBtn").onclick = () => { sound("click"); location.reload(); };
window.addEventListener("resize", fitSupplyCards);
initChoices();
