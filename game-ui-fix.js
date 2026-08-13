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
   * 본게임과 미니게임이 함께 사용하는 메시지 출력 방식을 바꾼다.
   * state.log는 최신 메시지가 앞에 저장되므로 화면에는 역순으로 출력한다.
   */
  if (typeof messageHtml === "function") {
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

  function tagMiniHandCards() {
    const gameState = currentState();
    if (!gameState || !gameState.players || !gameState.players[0]) return;

    const hand = gameState.players[0].hand || [];

    document.querySelectorAll("#playerHand [data-hand]").forEach(element => {
      const index = Number(element.dataset.hand);
      const item = hand[index];

      if (item && item.id) element.dataset.cardId = item.id;
    });
  }

  function watchRenderedAreas() {
    const message = document.getElementById("message");
    const playerHand = document.getElementById("playerHand");

    if (message) {
      new MutationObserver(scrollMessageToLatest).observe(message, {
        childList: true,
        subtree: true
      });
    }

    if (playerHand) {
      new MutationObserver(tagMiniHandCards).observe(playerHand, {
        childList: true,
        subtree: true
      });
    }

    scrollMessageToLatest();
    tagMiniHandCards();
  }

  function injectStyles() {
    if (document.getElementById("cnationGameUiFixStyles")) return;

    const style = document.createElement("style");
    style.id = "cnationGameUiFixStyles";
    style.textContent = `
      /* 본게임 + 미니게임 공통 메시지 창 */
      #message {
        overscroll-behavior: contain;
        scroll-behavior: smooth;
      }

      #message .message-stream {
        min-height: 100%;
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

      /* 미니게임: 공급처와 내 덱을 같은 5열 카드로 통일 */
      .app.mini-mode {
        --mini-equal-card-height: clamp(104px, 28vw, 116px);
      }

      .app.mini-mode .center #supplyGrid,
      .app.mini-mode .player #playerHand {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 4px !important;
        align-items: stretch;
      }

      .app.mini-mode .center #supplyGrid {
        overflow: visible;
      }

      .app.mini-mode .center #supplyGrid .supply-card.mini-supply,
      .app.mini-mode .player #playerHand .mini-card {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: var(--mini-equal-card-height) !important;
        min-height: var(--mini-equal-card-height) !important;
        padding: 4px !important;
        aspect-ratio: auto !important;
      }

      .app.mini-mode .center #supplyGrid .mini-name,
      .app.mini-mode .player #playerHand .mini-name {
        font-size: 11.5px;
      }

      .app.mini-mode .center #supplyGrid .mini-effect,
      .app.mini-mode .player #playerHand .mini-effect.compact {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        font-size: 8px;
        line-height: 1.18;
        overflow: hidden;
      }

      .app.mini-mode .center #supplyGrid .mini-cost,
      .app.mini-mode .player #playerHand .mini-cost {
        min-width: 18px;
        height: 18px;
        padding: 0 3px;
        font-size: 10px;
      }

      .app.mini-mode .center #supplyGrid .mini-type,
      .app.mini-mode .player #playerHand .mini-type {
        font-size: 8px;
      }

      /* 동은 기존 청동색 유지 */
      .app.mini-mode #supplyGrid [data-buy="copper"],
      .app.mini-mode #playerHand [data-card-id="copper"] {
        background: #8d6b19;
      }

      /* 은은 차가운 은회색 */
      .app.mini-mode #supplyGrid [data-buy="silver"],
      .app.mini-mode #playerHand [data-card-id="silver"] {
        background: linear-gradient(145deg, #aeb7c0, #596570);
        color: #ffffff;
        text-shadow: 0 1px 1px #0008;
      }

      /* 금은 밝은 황금색 */
      .app.mini-mode #supplyGrid [data-buy="gold"],
      .app.mini-mode #playerHand [data-card-id="gold"] {
        background: linear-gradient(145deg, #d9ad25, #8b6006);
        color: #fffdf0;
        text-shadow: 0 1px 1px #0008;
      }

      @media (max-width: 360px) {
        .app.mini-mode {
          --mini-equal-card-height: 102px;
        }

        .app.mini-mode .center #supplyGrid,
        .app.mini-mode .player #playerHand {
          gap: 3px !important;
        }

        .app.mini-mode .center #supplyGrid .mini-name,
        .app.mini-mode .player #playerHand .mini-name {
          font-size: 10.5px;
        }

        .app.mini-mode .center #supplyGrid .mini-effect,
        .app.mini-mode .player #playerHand .mini-effect.compact {
          font-size: 7.4px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  injectStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchRenderedAreas, {
      once: true
    });
  } else {
    watchRenderedAreas();
  }
})();
