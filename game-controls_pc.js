(() => {
  "use strict";

  let cpuHandObserver = null;

  function victoryCondition() {
    if (typeof state === "undefined" || !state) {
      return {label: "", description: "", kingdom: ""};
    }
    const mode = modes[state.mode];
    const preset = presets[state.preset];
    return {
      label: mode.label,
      description: mode.desc,
      kingdom: preset?.title || ""
    };
  }

  function exitToTitle() {
    if (!window.confirm("현재 게임을 종료하고 타이틀 화면으로 돌아갈까요?")) return;
    if (typeof sound === "function") sound("click");
    location.reload();
  }

  function createControls() {
    const tools = document.createElement("div");
    tools.className = "pc-opponent-tools";
    tools.innerHTML = `
      <button type="button" class="pc-exit-button">게임 종료</button>
      <div class="pc-win-condition">
        <strong>승리 조건</strong>
        <span class="pc-win-mode"></span>
        <small class="pc-win-description"></small>
        <small class="pc-win-kingdom"></small>
      </div>
    `;
    tools.querySelector(".pc-exit-button").onclick = exitToTitle;
    return tools;
  }

  function syncControls() {
    const cpuHand = document.getElementById("cpuHand");
    if (!cpuHand || typeof state === "undefined" || !state) return;

    const oldTools = cpuHand.querySelector(".pc-opponent-tools");
    const tools = oldTools || createControls();
    if (!oldTools) cpuHand.appendChild(tools);

    const condition = victoryCondition();
    tools.querySelector(".pc-win-mode").textContent = condition.label;
    tools.querySelector(".pc-win-description").textContent = condition.description;
    tools.querySelector(".pc-win-kingdom").textContent = `왕국 조합 · ${condition.kingdom}`;
  }

  function injectStyles() {
    if (document.getElementById("pcOpponentControlStyles")) return;
    const style = document.createElement("style");
    style.id = "pcOpponentControlStyles";
    style.textContent = `
      .pc-opponent-tools {
        flex: 1 1 360px;
        min-width: 320px;
        height: 100%;
        display: grid;
        grid-template-columns: 130px minmax(190px, 1fr);
        gap: 8px;
        align-self: stretch;
      }
      .pc-exit-button {
        height: 100%;
        border: 1px solid #c98e65;
        border-radius: 7px;
        background: linear-gradient(180deg, #86503c, #653225);
        color: #fff7df;
        box-shadow: inset 0 1px 0 #ffffff20, 0 3px 8px #0006;
        font-size: var(--fs-3);
        font-weight: 900;
      }
      .pc-exit-button:active { transform: translateY(1px); }
      .pc-win-condition {
        min-width: 0;
        height: 100%;
        padding: 6px 10px;
        border: 1px solid #7b6141;
        border-radius: 7px;
        background: linear-gradient(145deg, #38291f, #291d16);
        color: #f7e7c5;
        box-shadow: inset 0 1px 0 #ffffff14;
        overflow: hidden;
      }
      .pc-win-condition strong,
      .pc-win-condition span,
      .pc-win-condition small { display: block; }
      .pc-win-condition strong {
        color: #f4cf6d;
        font-size: var(--fs-1);
        line-height: 1;
      }
      .pc-win-mode {
        margin-top: 4px;
        color: #fff4d2;
        font-size: var(--fs-3);
        font-weight: 900;
        line-height: 1.05;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pc-win-description {
        margin-top: 3px;
        color: #d8c5a4;
        font-size: var(--fs-1);
        line-height: 1.12;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pc-win-kingdom {
        margin-top: 4px;
        color: #f0d58f;
        font-size: var(--fs-1);
        font-weight: 800;
        line-height: 1.12;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(style);
  }

  function watchCpuHand() {
    const cpuHand = document.getElementById("cpuHand");
    if (!cpuHand || cpuHandObserver) return;
    cpuHandObserver = new MutationObserver(syncControls);
    cpuHandObserver.observe(cpuHand, {childList: true});
    syncControls();
  }

  function init() {
    injectStyles();
    watchCpuHand();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once: true});
  } else {
    init();
  }
})();
