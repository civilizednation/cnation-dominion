(() => {
  "use strict";

  let titleScroll = 0;

  const esc = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  const cardExampleIds = ["copper", "village", "smithy", "market", "province", "curse"];

  function cardFigure(id, caption) {
    const cd = cards[id];
    return `
      <figure class="rules-card">
        <img src="${IMG + cd.img}" alt="${esc(cd.name)} 카드" loading="eager">
        <figcaption><strong>${esc(cd.name)}</strong><small>${esc(caption)}</small></figcaption>
      </figure>
    `;
  }

  function addStyles() {
    if (document.getElementById("rulesGuideStyles")) return;

    const style = document.createElement("style");
    style.id = "rulesGuideStyles";
    style.textContent = `
      .title .start-actions{display:grid;grid-template-columns:1.02fr .92fr 1fr .96fr;gap:6px;flex:0 0 46px}
      .title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start,.title .start-actions .rules-guide-start{width:100%;min-width:0;max-width:none;height:46px;padding:0 5px;font-size:13px;white-space:nowrap}
      .title .start-actions .rules-guide-start{background:#72512a;color:#fff6df;border:1px solid #d5b56b}
      .rules-guide-screen{display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;background:radial-gradient(circle at 80% 5%,#8a653455 0,transparent 30%),radial-gradient(circle at 8% 26%,#356b6550 0,transparent 28%),#21150f;padding:0}
      .rules-guide-screen.active{display:block}
      .rules-guide-wrap{width:min(100%,820px);min-height:100%;margin:0 auto;padding:18px 14px max(22px,env(safe-area-inset-bottom))}
      .rules-hero{position:relative;overflow:hidden;padding:18px;border:1px solid #80633f;border-radius:15px;background:linear-gradient(145deg,#3b281b,#2a1c14);box-shadow:0 12px 30px #0006}
      .rules-hero:after{content:"";position:absolute;width:170px;height:170px;right:-75px;top:-90px;border-radius:50%;border:28px solid #d7a93f18}
      .rules-kicker{position:relative;z-index:1;display:flex;justify-content:space-between;gap:8px;color:#e3c983;font-size:11px;font-weight:900;letter-spacing:.05em}
      .rules-hero h1{position:relative;z-index:1;margin:9px 0 7px;color:#fff4d2;font-family:Georgia,"Times New Roman","Malgun Gothic",serif;font-size:clamp(27px,6vw,42px);line-height:1.05}
      .rules-lead{position:relative;z-index:1;max-width:720px;margin:0;color:#dfcfb3;font-size:13px;line-height:1.55;word-break:keep-all}
      .rules-tags{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}
      .rules-tag{padding:5px 9px;border:1px solid #9c7c4f;border-radius:999px;background:#18100b80;color:#f5dfad;font-size:10px;font-weight:800}
      .rules-section{margin-top:13px;padding:14px;border:1px solid #6b5036;border-radius:13px;background:#302016e8;box-shadow:0 8px 20px #0004}
      .rules-heading{display:flex;align-items:end;justify-content:space-between;gap:8px;margin-bottom:11px}
      .rules-heading h2{margin:0;color:#fff0c8;font-size:17px}.rules-heading span{color:#bda886;font-size:10px}
      .rules-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
      .rules-copy h3{margin:0 0 8px;color:#f2cf76;font-size:15px}.rules-copy p,.rules-copy li{color:#dfcfb5;font-size:12px;line-height:1.55;word-break:keep-all}
      .rules-copy p{margin:0}.rules-copy ul,.rules-copy ol{margin:0;padding-left:20px}.rules-copy li+li{margin-top:7px}
      .rules-cards{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}
      .rules-card{min-width:0;margin:0;padding:4px 4px 6px;border:1px solid #806645;border-radius:8px;background:#1c130e;box-shadow:0 5px 12px #0007}
      .rules-card img{width:100%;aspect-ratio:31/48;display:block;object-fit:cover;border-radius:5px;background:#493522}
      .rules-card figcaption{min-width:0;padding:5px 1px 0}.rules-card strong,.rules-card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .rules-card strong{color:#fff0c8;font-size:10px}.rules-card small{margin-top:2px;color:#bfa984;font-size:8px}
      .rules-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
      .rules-step{padding:11px;border:1px solid #72583b;border-radius:10px;background:#211711}
      .rules-step b{display:block;margin-bottom:6px;color:#ffe7a4;font-size:13px}.rules-step p{margin:0;color:#dcc8a7;font-size:11px;line-height:1.45;word-break:keep-all}
      .rules-callout{margin-top:13px;padding:13px 14px;border-left:4px solid #d7a93f;border-radius:6px 11px 11px 6px;background:#4b3321}
      .rules-callout strong{display:block;margin-bottom:5px;color:#ffe7a4;font-size:13px}.rules-callout p{margin:0;color:#e2d0b2;font-size:12px;line-height:1.5;word-break:keep-all}
      .rules-credit{margin-top:13px;padding:12px 14px;border:1px solid #80633f;border-radius:12px;background:#241811;color:#dfcfb5;box-shadow:0 8px 20px #0004}
      .rules-credit div+div{margin-top:5px}.rules-credit strong{color:#ffe7a4}
      .rules-back{width:min(360px,100%);height:48px;display:block;margin:16px auto 0;border:1px solid #f3d47d;border-radius:10px;background:#d7a93f;color:#27180d;font-size:16px;font-weight:1000;box-shadow:0 7px 18px #0006}
      @media(max-width:560px){.title .start-actions{grid-template-columns:1fr 1fr;grid-auto-rows:42px;gap:5px;flex:0 0 auto}.title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start,.title .start-actions .rules-guide-start{height:42px;font-size:11.5px}.rules-guide-wrap{padding:10px 9px max(18px,env(safe-area-inset-bottom))}.rules-hero{padding:14px;border-radius:12px}.rules-lead{font-size:11.5px}.rules-section{padding:9px}.rules-grid{grid-template-columns:1fr;gap:9px}.rules-cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.rules-card{padding:3px 3px 5px;border-radius:6px}.rules-card strong{font-size:8.5px}.rules-card small{font-size:7px}.rules-steps{grid-template-columns:1fr 1fr;gap:6px}.rules-step{padding:8px}}
      @media(max-width:340px){.title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start,.title .start-actions .rules-guide-start{font-size:10px}.rules-steps{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function addScreen() {
    const screen = document.createElement("section");
    screen.id = "rulesGuideScreen";
    screen.className = "screen rules-guide-screen";
    screen.setAttribute("aria-label", "도미니언 게임 규칙 설명");
    screen.innerHTML = '<div id="rulesGuideContent" class="rules-guide-wrap"></div>';
    document.getElementById("titleScreen").insertAdjacentElement("afterend", screen);
  }

  function addButton() {
    const button = document.createElement("button");
    button.id = "rulesGuideBtn";
    button.type = "button";
    button.className = "start rules-guide-start";
    button.textContent = "게임 규칙";
    button.onclick = show;
    document.querySelector("#titleScreen .start-actions").appendChild(button);
  }

  function render() {
    const examples = [
      cardFigure("copper", "재화"),
      cardFigure("village", "액션"),
      cardFigure("smithy", "드로우"),
      cardFigure("market", "종합 보조"),
      cardFigure("province", "승점"),
      cardFigure("curse", "감점")
    ].join("");

    document.getElementById("rulesGuideContent").innerHTML = `
      <header class="rules-hero">
        <div class="rules-kicker"><span>HOW TO PLAY</span><span>처음 하는 사람용</span></div>
        <h1>도미니언 기본 규칙</h1>
        <p class="rules-lead">도미니언은 내 덱을 직접 만들어 가는 카드 게임입니다. 처음에는 약한 카드 10장으로 시작하지만, 매 턴 더 좋은 카드를 구매해 덱을 성장시키고 게임 종료 시 승점이 가장 높은 플레이어가 이깁니다.</p>
        <div class="rules-tags"><span class="rules-tag">덱 만들기</span><span class="rules-tag">재화로 구매</span><span class="rules-tag">액션 연계</span><span class="rules-tag">승점 경쟁</span></div>
      </header>

      <section class="rules-section">
        <div class="rules-heading"><h2>카드를 읽는 법</h2><span>카드 이미지를 기준으로 이해하세요</span></div>
        <div class="rules-cards">${examples}</div>
        <div class="rules-callout"><strong>카드에서 가장 중요한 것</strong><p>왼쪽 아래 숫자는 구입 비용입니다. 가운데 종류는 재화, 액션, 승점처럼 카드의 역할을 알려줍니다. 아래 설명은 그 카드를 사용하거나 게임이 끝났을 때 어떤 효과가 있는지 알려줍니다.</p></div>
      </section>

      <section class="rules-section">
        <div class="rules-heading"><h2>한 턴의 흐름</h2><span>액션 단계 → 구매 단계 → 턴 종료</span></div>
        <div class="rules-steps">
          <div class="rules-step"><b>1. 액션 단계</b><p>손에 액션 카드가 있고 액션 수가 남아 있으면 액션 카드를 사용할 수 있습니다.</p></div>
          <div class="rules-step"><b>2. 구매 단계</b><p>재화 카드를 선택해 재화를 만들고, 공급처에서 살 카드를 고릅니다.</p></div>
          <div class="rules-step"><b>3. 카드 획득</b><p>구매한 카드는 보통 버림 더미로 들어갑니다. 바로 손에 들어오지 않아도 다음 순환 때 사용됩니다.</p></div>
          <div class="rules-step"><b>4. 턴 종료</b><p>남은 손패와 사용한 카드를 버리고 새 카드 5장을 뽑습니다.</p></div>
        </div>
      </section>

      <div class="rules-grid">
        <section class="rules-section rules-copy">
          <h3>처음 덱 구성</h3>
          <p>처음에는 보통 동 7장과 사유지 3장으로 시작합니다. 동은 구매에 필요한 재화를 만들고, 사유지는 승점이지만 게임 중에는 아무 효과가 없습니다.</p>
        </section>
        <section class="rules-section rules-copy">
          <h3>무엇을 사야 할까?</h3>
          <ul>
            <li>초반에는 은, 마을, 대장장이처럼 덱을 강하게 만드는 카드를 사면 좋습니다.</li>
            <li>중반에는 시장, 축제, 실험실처럼 한 턴을 길게 만들어 주는 카드를 모읍니다.</li>
            <li>후반에는 속령, 공작령 같은 승점 카드를 사서 점수를 확보합니다.</li>
          </ul>
        </section>
      </div>

      <div class="rules-grid">
        <section class="rules-section rules-copy">
          <h3>카드 종류</h3>
          <ul>
            <li><b>재화</b>: 구매 단계에서 사용해 재화를 얻습니다.</li>
            <li><b>액션</b>: 액션 단계에서 사용해 카드 뽑기, 추가 액션, 추가 구입 등을 얻습니다.</li>
            <li><b>승점</b>: 게임 종료 시 점수가 됩니다. 게임 중에는 대체로 손패를 막습니다.</li>
            <li><b>저주</b>: 게임 종료 시 점수를 깎습니다.</li>
          </ul>
        </section>
        <section class="rules-section rules-copy">
          <h3>게임 종료와 승리</h3>
          <p>기본 규칙에서는 속령 더미가 비거나, 여러 카드 더미가 고갈되면 게임이 끝납니다. 그때 내 덱, 손패, 버림 더미에 있는 모든 승점과 저주를 계산해 점수가 높은 쪽이 승리합니다.</p>
        </section>
      </div>

      <section class="rules-section rules-copy">
        <h3>초보자가 기억하면 좋은 운영 팁</h3>
        <ol>
          <li>재화 카드만 많이 사면 덱은 단순하지만 안정적입니다. 은과 금은 언제나 기본이 됩니다.</li>
          <li>액션 카드는 강하지만, 액션 수가 없으면 손에 있어도 못 씁니다. 마을, 축제처럼 액션을 늘리는 카드가 중요합니다.</li>
          <li>승점 카드는 이기기 위해 필요하지만 너무 일찍 많이 사면 손패가 막힙니다. 덱이 충분히 강해진 뒤 사는 편이 좋습니다.</li>
          <li>카드를 뽑는 카드와 액션을 늘리는 카드를 함께 모으면 한 턴에 여러 장을 사용할 수 있습니다.</li>
        </ol>
      </section>

      <aside class="rules-credit">
        <div><strong>제작자 :</strong> 문명국</div>
        <div><strong>제작일시 :</strong> 2026년 8월</div>
        <div><strong>문의/건의 :</strong> mmk75@naver.com</div>
      </aside>

      <button id="rulesGuideBackBtn" type="button" class="rules-back">타이틀 화면으로 돌아가기</button>
    `;
    document.getElementById("rulesGuideBackBtn").onclick = hide;
  }

  function show() {
    if (typeof sound === "function") sound("click");
    window.CNationAudio?.playGuide?.();
    const title = document.getElementById("titleScreen");
    titleScroll = title.scrollTop;
    render();
    title.classList.remove("active");
    const screen = document.getElementById("rulesGuideScreen");
    screen.classList.add("active");
    screen.scrollTop = 0;
  }

  function hide() {
    if (typeof sound === "function") sound("click");
    window.CNationAudio?.playTitle?.();
    document.getElementById("rulesGuideScreen").classList.remove("active");
    const title = document.getElementById("titleScreen");
    title.classList.add("active");
    title.scrollTop = titleScroll;
  }

  function init() {
    if (document.getElementById("rulesGuideBtn")) return;
    if (typeof cards === "undefined" || typeof IMG === "undefined") {
      console.error("게임 규칙 설명을 초기화할 수 없습니다. game.js 다음에 rules-guide.js를 불러오세요.");
      return;
    }
    addStyles();
    addScreen();
    addButton();
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && document.getElementById("rulesGuideScreen").classList.contains("active")) hide();
    });
  }

  init();
})();
