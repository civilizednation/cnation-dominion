(() => {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentState() {
    return typeof state === "undefined" ? null : state;
  }

  /*
   * 기본 안내는 메시지 목록의 첫 줄에 한 번만 보여 준다.
   * state.log는 최신 항목이 앞에 있으므로 화면에는 역순으로 배치한다.
   */
  function installMessageRenderer() {
    if (typeof messageHtml !== "function") return;

    messageHtml = function () {
      const gameState = currentState();
      const logs = gameState && Array.isArray(gameState.log)
        ? gameState.log.slice(0, 30).reverse()
        : [];

      const guide = `
        <div class="message-entry message-guide">
          게임 시작 · 액션 카드를 사용한 뒤 구매 단계에서 재화 카드를
          사용하고, 공급처에서 원하는 카드를 구매하세요.
        </div>
      `;

      const history = logs.map((line, index) => {
        const isLatest = index === logs.length - 1;

        return `
          <div class="message-entry ${isLatest ? "latest" : ""}">
            ${escapeHtml(line)}
          </div>
        `;
      }).join("");

      return `<div class="message-stream">${guide}${history}</div>`;
    };
  }

  function scrollMessageToLatest() {
    const message = document.getElementById("message");
    if (!message) return;

    requestAnimationFrame(() => {
      message.scrollTop = message.scrollHeight;
    });
  }

  function watchMessage() {
    const message = document.getElementById("message");
    if (!message) return;

    new MutationObserver(scrollMessageToLatest).observe(message, {
      childList: true,
      subtree: true
    });

    scrollMessageToLatest();
  }

  function injectStyles() {
    if (document.getElementById("cnationGameUiFixStyles")) return;

    const style = document.createElement("style");
    style.id = "cnationGameUiFixStyles";
    style.textContent = `
      /* 본게임 메시지 영역 높이를 고정한다. */
      .status {
        height: 74px;
        min-height: 74px;
        max-height: 74px;
        overflow: hidden;
        align-items: stretch;
      }

      #message {
        height: 100%;
        min-height: 0;
        max-height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      #message .message-stream {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      #message .message-entry {
        color: #d8c3a1;
        font-weight: 400;
        line-height: 1.32;
      }

      #message .message-entry.message-guide {
        color: #ead7b8;
        font-weight: 400;
      }

      #message .message-entry.latest {
        color: #fff6d4;
        font-weight: 900;
      }

      /* 미니게임은 작은 글씨를 고려해 조금 더 높은 고정 영역을 사용한다. */
      .app.mini-mode .status {
        height: 88px;
        min-height: 88px;
        max-height: 88px;
      }

      @media (max-width: 560px) {
        .status {
          height: 72px;
          min-height: 72px;
          max-height: 72px;
        }

        .app.mini-mode .status {
          height: 88px;
          min-height: 88px;
          max-height: 88px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    installMessageRenderer();
    injectStyles();
    watchMessage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once: true});
  } else {
    init();
  }
})();
=