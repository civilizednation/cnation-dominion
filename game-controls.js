(() => {
  "use strict";

  let cpuHandObserver = null;

  function isMiniGame() {
    return Boolean(
      window.CNationMini?.enabled ||
      document.querySelector(".app")?.classList.contains("mini-mode")
    );
  }

  function victoryCondition() {
    if (typeof state === "undefined" || !state) {
      return {label: "", description: ""};
    }

    const mode = modes[state.mode];

    return {
      label: mode.label,
      description: mode.desc
    };
  }

  function exitToTitle() {
    const shouldExit = window.confirm(
      "현재 게임을 종료하고 타이틀 화면으로 돌아갈까요?"
    );

    if (!shouldExit) return;

    if (typeof sound === "function") sound("click");
    location.reload();
  }

  function createControls() {
    const tools = document.createElement("div");
    tools.className = "game-opponent-tools";
    tools.innerHTML = `
      <button type="button" class="game-exit-button">
        게임 종료
      </button>

      <div class="game-win-condition">
        <strong>승리 조건</strong>
        <span class="game-win-mode"></span>
        <small class="game-win-description"></small>
      </div>
    `;

    tools.querySelector(".game-exit-button").onclick = exitToTitle;
    return tools;
  }

  function syncControls() {
    const cpuHand = document.getElementById("cpuHand");
    if (!cpuHand) return;

    const oldTools = cpuHand.querySelector(".game-opponent-tools");

    if (
      isMiniGame() ||
      typeof state === "undefined" ||
      !state
    ) {
      oldTools?.remove();
      return;
    }

    const tools = oldTools || createControls();
    if (!oldTools) cpuHand.appendChild(tools);

    const condition = victoryCondition();
    const modeElement = tools.querySelector(".game-win-mode");
    const descriptionElement = tools.querySelector(".game-win-description");

    if (modeElement.textContent !== condition.label) {
      modeElement.textContent = condition.label;
    }

    if (descriptionElement.textContent !== condition.description) {
      descriptionElement.textContent = condition.description;
    }
  }

  function injectStyles() {
    if (document.getElementById("gameOpponentControlStyles")) return;

    const style = document.createElement("style");
    style.id = "gameOpponentControlStyles";
    style.textContent = `
      .app:not(.mini-mode) .game-opponent-tools {
        flex: 0 0 clamp(78px, 22vw, 150px);
        width: clamp(78px, 22vw, 150px);
        height: 96px;
        display: grid;
        grid-template-rows: 32px minmax(0, 1fr);
        gap: 5px;
        align-self: center;
      }

      .app:not(.mini-mode) .game-exit-button {
        width: 100%;
        min-width: 0;
        padding: 3px 6px;
        border: 1px solid #c98e65;
        border-radius: 7px;
        background: linear-gradient(180deg, #86503c, #653225);
        color: #fff7df;
        box-shadow: inset 0 1px 0 #ffffff20, 0 3px 8px #0006;
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
      }

      .app:not(.mini-mode) .game-exit-button:active {
        transform: translateY(1px);
      }

      .app:not(.mini-mode) .game-win-condition {
        min-width: 0;
        padding: 6px 7px;
        border: 1px solid #7b6141;
        border-radius: 7px;
        background: linear-gradient(145deg, #38291f, #291d16);
        color: #f7e7c5;
        box-shadow: inset 0 1px 0 #ffffff14;
        overflow: hidden;
      }

      .app:not(.mini-mode) .game-win-condition strong,
      .app:not(.mini-mode) .game-win-condition span,
      .app:not(.mini-mode) .game-win-condition small {
        display: block;
      }

      .app:not(.mini-mode) .game-win-condition strong {
        color: #f4cf6d;
        font-size: 10px;
        line-height: 1;
      }

      .app:not(.mini-mode) .game-win-mode {
        margin-top: 4px;
        color: #fff4d2;
        font-size: 11px;
        font-weight: 900;
        line-height: 1.05;
      }

      .app:not(.mini-mode) .game-win-description {
        margin-top: 3px;
        color: #d8c5a4;
        font-size: 9px;
        line-height: 1.18;
        white-space: normal;
        word-break: keep-all;
      }

      @media (max-width: 560px) {
        .app:not(.mini-mode) .game-opponent-tools {
          flex-basis: clamp(68px, 18vw, 96px);
          width: clamp(68px, 18vw, 96px);
          height: 84px;
          grid-template-rows: 27px minmax(0, 1fr);
          gap: 4px;
        }

        .app:not(.mini-mode) .game-exit-button {
          padding: 2px 4px;
          border-radius: 6px;
          font-size: 10px;
        }

        .app:not(.mini-mode) .game-win-condition {
          padding: 4px 5px;
          border-radius: 6px;
        }

        .app:not(.mini-mode) .game-win-condition strong {
          font-size: 8.5px;
        }

        .app:not(.mini-mode) .game-win-mode {
          margin-top: 3px;
          font-size: 9px;
        }

        .app:not(.mini-mode) .game-win-description {
          margin-top: 2px;
          font-size: 7.5px;
          line-height: 1.12;
        }
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