(() => {
  "use strict";

  const EFFECTS = {
    copper: "재화 +1",
    silver: "재화 +2",
    gold: "재화 +3",
    estate: "승점 +1",
    duchy: "승점 +3",
    province: "승점 +6",
    curse: "승점 -1",
    cellar: "+1 액션 · 원하는 만큼 버리고 같은 수만큼 뽑기",
    moat: "+2 카드 · 공격 방어",
    village: "+1 카드 · +2 액션",
    woodcutter: "+1 구입 · 재화 +2",
    workshop: "비용 4 이하 카드 획득",
    moneylender: "동 1장 폐기 · 재화 +3",
    remodel: "카드 1장 폐기 · 비용 +2 이하 획득",
    smithy: "+3 카드",
    spy: "+1 카드 · +1 액션 · 덱 위 확인",
    thief: "상대 재화 공개 · 폐기 또는 획득",
    throne: "액션 카드 1장을 두 번 사용",
    militia: "재화 +2 · 상대 손을 3장까지 줄임",
    council: "+4 카드 · +1 구입 · 상대 +1 카드",
    festival: "+2 액션 · +1 구입 · 재화 +2",
    laboratory: "+2 카드 · +1 액션",
    library: "손이 7장 될 때까지 뽑기",
    market: "+1 카드 · +1 액션 · +1 구입 · 재화 +1",
    secret: "버린 카드마다 재화 +1 · 공격 방어",
    witch: "+2 카드 · 상대 저주 획득",
    adventurer: "재화 카드 2장이 나올 때까지 공개",
    chancellor: "재화 +2 · 덱을 버릴 수 있음",
    feast: "이 카드 폐기 · 비용 5 이하 획득",
    mine: "재화 폐기 · 비용 +3 재화를 손으로 획득",
    chapel: "손에서 최대 4장 폐기",
    gardens: "보유 카드 10장마다 승점 +1"
  };

  const TYPE_LABELS = {
    treasure: "재화",
    victory: "승점",
    curse: "저주",
    action: "액션",
    attack: "공격",
    reaction: "반응"
  };

  function typeKey(cd) {
    if (cd.type === "treasure") return "treasure";
    if (cd.type === "victory") return "victory";
    if (cd.type === "curse") return "curse";
    if (cd.type.includes("attack")) return "attack";
    if (cd.type.includes("reaction")) return "reaction";
    return "action";
  }

  function text(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function cardBody(id, compact = false) {
    const cd = cards[id];
    const kind = typeKey(cd);
    return `
      <span class="mini-card-top">
        <span class="mini-cost" aria-label="비용 ${cd.cost}">${cd.cost}</span>
        <span class="mini-type">${TYPE_LABELS[kind]}</span>
      </span>
      <strong class="mini-name">${text(cd.name)}</strong>
      <span class="mini-effect ${compact ? "compact" : ""}">${text(EFFECTS[id] || "")}</span>
    `;
  }

  let topAreaObserver = null;

  function topAreaInfo() {
    if (!state) return {condition: "", kingdom: ""};
    const mode = modes[state.mode];
    const preset = presets[state.preset];
    return {
      condition: `${mode.label} · ${mode.desc}`,
      kingdom: `왕국 조합 · ${preset?.title || ""}`
    };
  }

  function addTopAreaControls() {
    const cpuHand = document.getElementById("cpuHand");
    if (!cpuHand || !state) return;

    let tools = cpuHand.querySelector(".mini-opponent-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "mini-opponent-tools";
      tools.innerHTML = `
        <button type="button" class="mini-exit-button">게임 종료</button>
        <div class="mini-win-condition">
          <strong>승리 조건</strong>
          <span class="mini-win-rule"></span>
          <span class="mini-win-kingdom"></span>
        </div>
      `;
      tools.querySelector(".mini-exit-button").onclick = () => {
        if (!window.confirm("현재 게임을 종료하고 타이틀 화면으로 돌아갈까요?")) return;
        sound("click");
        location.reload();
      };
      cpuHand.appendChild(tools);
    }

    const info = topAreaInfo();
    tools.querySelector(".mini-win-rule").textContent = info.condition;
    tools.querySelector(".mini-win-kingdom").textContent = info.kingdom;
  }

  function watchTopArea() {
    const cpuHand = document.getElementById("cpuHand");
    if (!cpuHand || topAreaObserver) return;

    topAreaObserver = new MutationObserver(addTopAreaControls);
    topAreaObserver.observe(cpuHand, {childList: true});
    addTopAreaControls();
  }

  function injectStyles() {
    if (document.getElementById("cnationMiniStyles")) return;
    const style = document.createElement("style");
    style.id = "cnationMiniStyles";
    style.textContent = `
      .app.mini-mode {
        --mini-treasure: #8d6b19;
        --mini-victory: #27633c;
        --mini-curse: #633675;
        --mini-action: #2f5f83;
        --mini-attack: #833c35;
        --mini-reaction: #276b69;
        --mini-equal-card-height: calc(clamp(104px, 28vw, 116px) * 0.9);
      }
      .app.mini-mode .game { height: 100%; }
      .app.mini-mode .game .center { flex: 1 0 auto; min-height: 0; padding: 6px; }
      .app.mini-mode .opponent { height: auto; min-height: 80px; padding: 5px 7px; }
      .app.mini-mode .player { min-height: 0; padding: 5px 7px max(7px, env(safe-area-inset-bottom)); }
      .app.mini-mode .bar { height: 30px; gap: 5px; justify-content: flex-start; overflow: hidden; }
      .app.mini-mode .section-label { min-width: 60px; height: 25px; padding: 0 8px; font-size: 14px; }
      .app.mini-mode .stats { gap: 4px; flex: 1 1 auto; }
      .app.mini-mode .pill { padding: 2px 5px; font-size: 10px; }
      .app.mini-mode .supply { flex: 0 0 auto; min-height: 0; display: block; }
      .app.mini-mode .supply-title { min-height: 28px; margin-bottom: 5px; }
      .app.mini-mode .supply-title::after {
        content: "텍스트 미니 모드";
        padding: 3px 7px;
        border: 1px solid #8e7148;
        border-radius: 999px;
        color: #f5dcaa;
        font-size: 10px;
        font-weight: 800;
      }
      .app.mini-mode .supply-grid {
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 4px;
        overflow: visible;
        padding-bottom: 2px;
      }
      /* 17 supply cards on a 5-column grid always leave the last row's 3 right-hand
         cells empty (7 base + 10 kingdom cards = 17 = 5+5+5+2). Float the button
         stack over that dead space instead of growing the message box's row. */
      .app.mini-mode .center { position: relative; }
      .app.mini-mode .status { min-height: 78px; margin-top: 6px; grid-template-columns: 1fr; gap: 5px; }
      .app.mini-mode .message { padding: 6px 7px; padding-right: 92px; font-size: 10.5px; }
      .app.mini-mode .actions {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 82px;
        height: calc(78px + 6px + var(--mini-equal-card-height));
        flex-direction: column;
        gap: 0;
        z-index: 1;
      }
      .app.mini-mode .action-btn { min-width: 54px; min-height: 44px; flex: 0 0 44px; padding: 0 5px; font-size: 11px; }
      /* double the gap above 재화카드 전체선택, triple the gap above 턴 종료, so an
         intended 전체선택 tap can't slide into an accidental 턴 종료 tap */
      .app.mini-mode .action-btn.select-all { min-width: 86px; font-size: 9.5px; margin-top: 10px; }
      .app.mini-mode .action-btn.primary { margin-top: 15px; }
      .app.mini-mode .hand { height: auto; min-height: 44px; gap: 4px; align-items: stretch; }
      .app.mini-mode .player .hand {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-auto-rows: var(--mini-equal-card-height);
        gap: 4px;
        /* only tall enough for one full row; a 6th+ card's row is clipped down to a
           peeking sliver so it's clear more cards are held without pushing the layout */
        max-height: calc(var(--mini-equal-card-height) * 1.22 + 4px);
        overflow: hidden;
        align-content: start;
      }
      .app.mini-mode .mini-card,
      .app.mini-mode .supply-card {
        color: #fffdf1;
        border: 1px solid #ffffff4a;
        box-shadow: 0 2px 5px #0007;
      }
      .app.mini-mode .mini-card {
        width: 66px;
        height: 73px;
        min-width: 0;
        padding: 4px;
        aspect-ratio: auto;
        border-radius: 6px;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }
      .app.mini-mode .player .mini-card {
        width: 100%;
        min-width: 0;
        max-width: none;
        height: var(--mini-equal-card-height);
        min-height: var(--mini-equal-card-height);
        aspect-ratio: auto;
      }
      .app.mini-mode .opponent .hand { overflow-x: auto; }
      .app.mini-mode .opponent .mini-card.mini-back {
        width: 42px;
        height: 44px;
        display: grid;
        place-items: center;
        flex: 0 0 42px;
        background: #3b2b21;
        border-color: #927755;
        color: #f6d89f;
        font-size: 10px;
        font-weight: 900;
        text-align: center;
      }
      .app.mini-mode .mini-opponent-tools {
        flex: 1 0 150px;
        min-width: 150px;
        height: 52px;
        display: grid;
        grid-template-columns: minmax(50px, .65fr) minmax(96px, 1.35fr);
        gap: 3px;
        margin-left: 3px;
      }
      .app.mini-mode .mini-exit-button {
        width: 100%;
        min-height: 20px;
        padding: 1px 5px;
        border: 1px solid #c98e65;
        border-radius: 5px;
        background: #713b2d;
        color: #fff7df;
        font-size: 9.5px;
        font-weight: 900;
        line-height: 1;
      }
      .app.mini-mode .mini-win-condition {
        min-width: 0;
        padding: 2px 5px;
        border: 1px solid #765c3f;
        border-radius: 5px;
        background: #2f231a;
        color: #f7e7c5;
        font-size: 8px;
        line-height: 1.08;
        overflow: hidden;
      }
      .app.mini-mode .mini-win-condition strong,
      .app.mini-mode .mini-win-condition span {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .app.mini-mode .mini-win-condition strong {
        color: #f4cf6d;
        font-size: 8.5px;
      }
      .app.mini-mode .mini-win-condition .mini-win-kingdom {
        margin-top: 2px;
        color: #f0d58f;
        font-weight: 800;
      }
      .app.mini-mode .supply-card.mini-supply,
      .app.mini-mode .modal .supply-card.mini-supply {
        position: relative;
        min-height: 82px;
        height: auto;
        padding: 5px;
        border-radius: 6px;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 3px;
        overflow: hidden;
      }
      .app.mini-mode .modal .supply-card.mini-supply { min-height: 96px; }
      .app.mini-mode #supplyGrid .supply-card.mini-supply {
        width: 100%;
        min-width: 0;
        max-width: none;
        height: var(--mini-equal-card-height);
        min-height: var(--mini-equal-card-height);
        padding: 4px;
      }
      .app.mini-mode .type-treasure { background: var(--mini-treasure); }
      .app.mini-mode .card-copper { background: #8d6b19; }
      .app.mini-mode .card-silver {
        background: linear-gradient(145deg, #aeb7c0, #596570);
        color: #fff;
        text-shadow: 0 1px 1px #0008;
      }
      .app.mini-mode .card-gold {
        background: linear-gradient(145deg, #d9ad25, #8b6006);
        color: #fffdf0;
        text-shadow: 0 1px 1px #0008;
      }
      .app.mini-mode .type-victory { background: var(--mini-victory); }
      .app.mini-mode .type-curse { background: var(--mini-curse); }
      .app.mini-mode .type-action { background: var(--mini-action); }
      .app.mini-mode .type-attack { background: var(--mini-attack); }
      .app.mini-mode .type-reaction { background: var(--mini-reaction); }
      .app.mini-mode .mini-card.disabled { opacity: .68; }
      .app.mini-mode .mini-card.selected {
        opacity: 1;
        border-color: #fff1a6;
        box-shadow: 0 0 0 3px #f4cf6d, 0 5px 12px #0008;
        transform: translateY(-3px);
      }
      .app.mini-mode .mini-supply.empty { opacity: .38; filter: grayscale(.55); }
      .app.mini-mode .mini-supply.selected { outline: 3px solid #f4cf6d; outline-offset: -3px; }
      .app.mini-mode .mini-card-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 3px; }
      .app.mini-mode .mini-cost {
        min-width: 19px;
        height: 19px;
        display: inline-grid;
        place-items: center;
        padding: 0 4px;
        border-radius: 999px;
        background: #f8d66d;
        color: #281b0d;
        border: 1px solid #3a291b;
        font-size: 11px;
        font-weight: 1000;
      }
      .app.mini-mode .mini-type {
        color: #fff7d6;
        font-size: 9px;
        font-weight: 800;
        white-space: nowrap;
      }
      .app.mini-mode .mini-name {
        display: block;
        color: #fff;
        font-size: 13px;
        line-height: 1.08;
        font-weight: 1000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .app.mini-mode .mini-effect {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #fff8dc;
        font-size: 9px;
        line-height: 1.17;
        word-break: keep-all;
      }
      .app.mini-mode .mini-effect.compact { -webkit-line-clamp: 4; font-size: 8px; }
      .app.mini-mode #supplyGrid .mini-effect {
        -webkit-line-clamp: 4;
        font-size: 8px;
        line-height: 1.18;
      }
      .app.mini-mode .mini-count {
        position: absolute;
        right: 4px;
        bottom: 4px;
        min-width: 21px;
        height: 18px;
        display: grid;
        place-items: center;
        padding: 0 4px;
        border-radius: 999px;
        background: #15100dcc;
        border: 1px solid #f2dab18a;
        color: #fff;
        font-size: 10px;
        font-weight: 900;
      }
      .app.mini-mode .mini-count.warn {
        color: #ffb347;
        border-color: #ffb347;
      }
      .app.mini-mode .mini-count.danger {
        color: #ff4d42;
        border-color: #ff4d42;
      }
      .app.mini-mode .modal .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
      .app.mini-mode .modal-box { padding: 10px; }
      .app.mini-mode .modal h2 { font-size: 16px; }
      .app.mini-mode .end { padding: 8px; }
      .app.mini-mode .end-card { width: 100%; max-height: calc(100dvh - 16px); padding: 10px; border-radius: 10px; overflow: auto; }
      .app.mini-mode .end-card h2 { font-size: 22px; margin-bottom: 6px; }
      .app.mini-mode .result-summary { padding: 9px; border-radius: 8px; }
      .app.mini-mode .result-summary strong { font-size: 18px; }
      .app.mini-mode .result-summary span { font-size: 12px; }
      .app.mini-mode .result-summary p,
      .app.mini-mode .result-summary small { font-size: 11px; }
      .app.mini-mode .result-board { grid-template-columns: 1fr; gap: 8px; margin-top: 8px; }
      .app.mini-mode .result-player { padding: 8px; }
      .app.mini-mode .result-player-head h3 { font-size: 15px; }
      .app.mini-mode .result-player-head strong { font-size: 18px; }
      .app.mini-mode .result-player-head span { font-size: 10px; }
      .app.mini-mode .result-holdings { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; max-height: 180px; }
      .app.mini-mode .result-card-mini { min-height: 78px; padding: 4px; border-radius: 6px; position: relative; }
      .app.mini-mode .result-card-mini .mini-name { font-size: 10px; }
      .app.mini-mode .result-card-mini .mini-effect { font-size: 7px; -webkit-line-clamp: 3; }
      .app.mini-mode .result-card-mini .result-count { position: absolute; right: 3px; bottom: 3px; padding: 1px 4px; border-radius: 999px; background: #0009; color: #fff1a6; font-size: 9px; font-weight: 900; }
      .app.mini-mode .result-score { font-size: 11px; max-height: 120px; }
      .app.mini-mode #restartBtn { width: 100%; height: 42px; margin-top: 8px; font-size: 15px; }
      @media (min-width: 561px) {
        .app.mini-mode .supply-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        .app.mini-mode .player .hand { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      }
      @media (max-width: 360px) {
        .app.mini-mode { --mini-equal-card-height: 92px; }
        .app.mini-mode .supply-grid,
        .app.mini-mode .player .hand { gap: 3px; }
        .app.mini-mode #supplyGrid .mini-name,
        .app.mini-mode #playerHand .mini-name { font-size: 10.5px; }
        .app.mini-mode #supplyGrid .mini-effect,
        .app.mini-mode #playerHand .mini-effect.compact { font-size: 7.4px; }
      }
      @media (orientation: landscape) and (max-height: 560px) {
        .app.mini-mode .game .center { flex-basis: auto; min-height: 0; }
        .app.mini-mode .supply-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        .app.mini-mode .supply-card.mini-supply { min-height: var(--mini-equal-card-height); }
      }
    `;
    document.head.appendChild(style);
  }

  function arrangeMiniControls() {
    const status = document.querySelector(".app.mini-mode .status");
    const actions = document.querySelector(".app.mini-mode .player .actions");
    if (status && actions && actions.parentElement !== status) status.appendChild(actions);
  }

  // 주소창/하단 툴바 때문에 실제로 보이는 화면 높이가 줄어드는 브라우저 탭 환경에서도
  // 미니게임 전체(공급처 맨 아래 "내 덱"까지)가 스크롤 없이 한 화면에 들어오도록,
  // 내용이 화면보다 크면 비율을 유지한 채 축소한다.
  let fitObserver = null;
  let fitRaf = null;

  function fitToViewport() {
    const game = document.querySelector(".app.mini-mode .game");
    if (!game) return;
    game.style.transform = "none";
    const available = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const natural = game.scrollHeight;
    const scale = natural > available ? Math.max(available / natural, 0.72) : 1;
    game.style.transformOrigin = "top center";
    game.style.transform = scale < 1 ? `scale(${scale})` : "none";
  }

  function scheduleFit() {
    if (fitRaf) cancelAnimationFrame(fitRaf);
    fitRaf = requestAnimationFrame(fitToViewport);
  }

  function watchViewportFit() {
    scheduleFit();
    if (fitObserver) return;
    const game = document.querySelector(".app.mini-mode .game");
    if (game) {
      fitObserver = new MutationObserver(scheduleFit);
      fitObserver.observe(game, {childList: true, subtree: true});
    }
    window.addEventListener("resize", scheduleFit);
    window.addEventListener("orientationchange", scheduleFit);
    window.visualViewport?.addEventListener("resize", scheduleFit);
  }

  window.CNationMini = {
    enabled: false,

    enable() {
      this.enabled = true;
      injectStyles();
      document.body.classList.add("mini-game-active");
      document.querySelector(".app")?.classList.add("mini-mode");
      arrangeMiniControls();
      watchTopArea();
      watchViewportFit();
    },

    handHtml(c, index, human) {
      const cd = cards[c.id];
      const kind = typeKey(cd);
      const playable = human && (
        (state.phase === "action" && cd.type.includes("action") && state.players[0].actions > 0) ||
        (state.phase === "buy" && cd.type === "treasure")
      );
      const selected = selectedTreasures.has(c.uid);
      return `<button type="button" class="mini-card mini-text-card type-${kind} card-${c.id} ${playable ? "" : "disabled"} ${selected ? "selected" : ""}" data-hand="${index}" aria-label="${text(cd.name)}, 비용 ${cd.cost}, ${text(EFFECTS[c.id] || "")}">${cardBody(c.id, true)}</button>`;
    },

    cardBackHtml() {
      return `<div class="mini-card back mini-back" aria-label="컴퓨터 손패">?</div>`;
    },

    supplyHtml(id) {
      const cd = cards[id];
      const kind = typeKey(cd);
      const count = state.supply[id] || 0;
      const countState = count <= 1 ? "danger" : count <= 3 ? "warn" : "";
      return `<button type="button" class="supply-card mini-supply type-${kind} card-${id} ${count <= 0 ? "empty" : ""}" data-buy="${id}" aria-label="${text(cd.name)}, 비용 ${cd.cost}, 남은 카드 ${count}, ${text(EFFECTS[id] || "")}">${cardBody(id)}<span class="mini-count ${countState}" aria-label="남은 수량 ${count}">${count}</span></button>`;
    },

    modalCardHtml(item) {
      const cd = cards[item.id];
      const kind = typeKey(cd);
      return `<button type="button" class="supply-card mini-supply type-${kind} card-${item.id}" data-pick="${text(item.uid)}" aria-label="${text(cd.name)}, 비용 ${cd.cost}, ${text(EFFECTS[item.id] || "")}">${cardBody(item.id)}</button>`;
    },

    resultCardHtml(id, count) {
      const cd = cards[id];
      const kind = typeKey(cd);
      return `<figure class="result-card result-card-mini type-${kind} card-${id}" aria-label="${text(cd.name)} ${count}장">${cardBody(id, true)}<span class="result-count">${count}장</span></figure>`;
    }
  };
})();
