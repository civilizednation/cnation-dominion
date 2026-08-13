(() => {
  "use strict";

  const GUIDES = [
    {
      label: "균형 입문",
      tags: ["기본기", "균형", "첫 엔진"],
      summary: "액션, 카드 뽑기, 추가 구입, 공격과 방어, 폐기와 카드 변환까지 도미니언의 핵심 규칙을 한 번에 익히는 입문 조합입니다.",
      detail: "특정 전략 하나에 치우치지 않고 여러 기본 메커니즘을 고르게 경험할 수 있습니다. 마을이 액션 수를 늘리고 대장장이와 시장이 손패를 보충하므로, 단순히 재화만 내는 덱에서 액션을 이어 가는 엔진형 덱으로 발전하는 과정을 배우기 좋습니다.",
      tips: ["마을과 대장장이를 함께 확보해 액션과 카드 뽑기의 균형을 맞춥니다.", "작업장과 개조로 필요한 카드를 얻고 광산으로 재화를 강화합니다.", "후반에는 시장으로 재화와 구입을 보충하며 속령 구매 타이밍을 잡습니다."],
      combo: "마을 → 대장장이 또는 시장이 가장 이해하기 쉬운 기본 연계입니다. 민병대와 해자를 통해 공격과 방어의 상호작용도 익힐 수 있습니다."
    },
    {
      label: "압축과 성장",
      tags: ["폐기", "재화 강화", "고비용"],
      summary: "불필요한 시작 카드를 빠르게 줄이고 남은 덱의 평균 성능을 높여 강한 카드와 속령을 안정적으로 구매하는 조합입니다.",
      detail: "예배당과 대부업자는 동, 사유지, 저주처럼 후반 효율이 낮은 카드를 정리합니다. 카드 수가 줄수록 시장, 실험실, 집회소 같은 강력한 카드가 더 자주 손에 들어오며 광산과 모험가는 고급 재화를 빠르게 확보하도록 돕습니다.",
      tips: ["초반 예배당으로 사유지와 일부 동을 폐기하되 구매력이 사라질 정도로 줄이지 않습니다.", "대부업자와 광산으로 남은 동을 재화 또는 은으로 바꿉니다.", "연회와 알현실을 활용해 시장, 실험실, 집회소를 빠르게 확보합니다."],
      combo: "알현실로 실험실이나 집회소를 두 번 사용하면 압축된 덱을 빠르게 순환할 수 있습니다. 덱이 정리된 뒤에는 모험가가 은과 금을 안정적으로 찾아 줍니다."
    },
    {
      label: "공격과 방어",
      tags: ["견제", "손패 압박", "반응"],
      summary: "상대의 손패와 덱 구성을 지속적으로 흔들면서 자신의 공격은 해자로 방어하는 대결 중심 조합입니다.",
      detail: "민병대는 상대 손패를 줄이고 마녀는 저주를 넣으며 도둑은 재화를 노립니다. 첩자는 덱 위 카드를 조절해 다음 손패의 품질까지 방해합니다. 공격 카드가 많아 서로의 엔진이 쉽게 끊기므로 방어와 손패 회복이 중요합니다.",
      tips: ["해자를 적당히 확보해 핵심 공격을 막고 카드 뽑기에도 활용합니다.", "마을과 축제로 액션을 확보한 뒤 공격 카드를 연속 사용합니다.", "공격 카드만 과도하게 모으지 말고 도서관과 집회소로 손패를 회복합니다."],
      combo: "축제로 액션과 재화를 확보한 뒤 민병대, 첩자, 마녀를 이어 사용하면 상대의 현재 손패와 다음 턴을 함께 약화시킬 수 있습니다."
    },
    {
      label: "수량 승점",
      tags: ["정원", "대량 획득", "특수 승리"],
      summary: "정원의 ‘보유 카드 10장마다 승점 +1’ 효과를 중심으로 카드 수를 빠르게 늘려 승리하는 독특한 조합입니다.",
      detail: "일반적인 덱 압축과 반대로 전체 카드 수를 늘리는 것이 목표입니다. 작업장과 연회는 구매 외의 추가 획득 수단을 제공하고 나무꾼은 추가 구입을 만들어 한 턴에 여러 장을 얻게 합니다. 정원의 가치는 덱 크기에 따라 계속 올라갑니다.",
      tips: ["작업장으로 비용 4 이하인 정원과 보조 액션을 꾸준히 얻습니다.", "나무꾼의 추가 구입으로 값싼 카드라도 매 턴 여러 장 확보합니다.", "정원 더미의 감소 속도를 확인하며 상대보다 먼저 정원을 모읍니다."],
      combo: "마을과 실험실로 덱을 순환하면서 작업장을 반복 사용하면 카드 수가 빠르게 증가합니다. 예배당은 불필요한 저주를 조절하는 안전장치입니다."
    },
    {
      label: "연쇄 엔진",
      tags: ["다중 액션", "연속 드로우", "긴 턴"],
      summary: "액션 수와 손패를 계속 보충해 한 턴에 여러 액션 카드를 연쇄적으로 사용하는 엔진 구축형 조합입니다.",
      detail: "마을과 축제가 액션을 공급하고 대장장이와 도서관이 손패를 채우며 시장이 카드, 액션, 구입, 재화를 모두 보충합니다. 엔진이 완성되면 덱 대부분을 한 턴에 사용하면서 필요한 카드를 안정적으로 찾을 수 있습니다.",
      tips: ["카드 뽑기 카드보다 액션 공급 카드를 약간 더 충분히 확보합니다.", "지하옥과 개조로 덱을 다듬어 엔진이 멈추는 확률을 줄입니다.", "엔진이 안정되면 시장과 나무꾼의 추가 구입으로 여러 장을 구매합니다."],
      combo: "마을 → 대장장이 → 축제 → 도서관·시장 흐름이 핵심입니다. 액션 공급 없이 드로우 카드만 늘리면 손에 든 액션을 사용할 수 없습니다."
    },
    {
      label: "격차 확대",
      tags: ["덱 압축", "재화 견제", "공격"],
      summary: "자신의 약한 카드는 제거하고 상대의 손패와 재화를 공격해 양쪽 덱의 성능 차이를 크게 벌리는 조합입니다.",
      detail: "예배당과 대부업자로 자신의 동과 사유지를 줄이고 광산으로 남은 재화를 강화합니다. 동시에 민병대, 도둑, 마녀가 상대의 손패를 줄이고 재화를 빼앗거나 저주를 추가합니다. 자신의 덱은 얇고 강해지고 상대 덱은 두껍고 느려집니다.",
      tips: ["예배당과 대부업자를 초반에 확보해 약한 시작 카드를 정리합니다.", "상대가 은과 금을 확보한 뒤 도둑을 사용하면 효과가 커집니다.", "시장과 대장장이로 공격 후 부족해진 손패와 구매력을 보충합니다."],
      combo: "알현실로 마녀나 대장장이를 두 번 사용하면 덱 성능 차이를 크게 벌릴 수 있습니다. 해자는 상대의 역공을 막아 주는 방어 카드입니다."
    },
    {
      label: "재화 순환",
      tags: ["보물 탐색", "재화 강화", "빠른 순환"],
      summary: "덱을 빠르게 돌려 은과 금을 손으로 모으고 높은 구매력을 반복적으로 만드는 재화 중심 조합입니다.",
      detail: "광산은 동을 은으로, 은을 금으로 바꾸면서 보유 카드 수를 늘리지 않고 재화의 질을 높입니다. 모험가는 덱에서 재화 두 장을 찾아 손으로 가져오며 실험실과 대장장이는 강한 재화를 더 자주 사용하게 합니다.",
      tips: ["작업장과 연회로 실험실, 시장, 광산 등 핵심 카드를 확보합니다.", "광산으로 재화를 단계적으로 강화하고 지하옥으로 손패를 교환합니다.", "금이 충분히 쌓인 뒤 모험가를 사용해 구매력을 안정적으로 높입니다."],
      combo: "알현실로 광산을 두 번 사용하면 한 턴에 재화 두 장을 강화할 수 있습니다. 실험실과 시장으로 뽑은 뒤 모험가를 사용하면 고급 재화가 손에 모입니다."
    },
    {
      label: "획득과 변환",
      tags: ["빠른 획득", "카드 변환", "고성능 덱"],
      summary: "작업장과 연회로 카드를 추가 획득하고 개조, 광산, 대부업자로 약한 카드를 더 강한 카드로 바꾸는 성장형 조합입니다.",
      detail: "구매 단계만 기다리지 않고 액션 효과로 카드를 얻을 수 있어 덱 성장이 빠릅니다. 작업장은 비용 4 이하의 기반 카드를, 연회는 비용 5 이하의 핵심 카드를 가져옵니다. 개조와 광산은 이미 가진 카드의 가치를 높입니다.",
      tips: ["작업장으로 마을, 대장장이, 개조 같은 기반 카드를 확보합니다.", "연회를 폐기해 시장이나 집회소 같은 비용 5 카드를 가져옵니다.", "개조와 광산으로 초반 카드의 가치를 높여 평균 성능을 올립니다."],
      combo: "마을이 액션을 공급하고 대장장이와 집회소가 손패를 채워 여러 변환 액션을 한 턴에 사용할 수 있게 합니다."
    },
    {
      label: "저주와 혼란",
      tags: ["저주", "손패 방해", "회복"],
      summary: "저주와 손패 압박으로 상대의 계획을 무너뜨리고 자신의 덱은 예배당과 드로우 카드로 회복하는 방해 중심 조합입니다.",
      detail: "마녀가 상대 덱에 저주를 추가하고 민병대가 손패를 줄이며 첩자가 다음 카드를 통제합니다. 상대는 원하는 카드를 제때 사용하기 어려워집니다. 자신의 덱은 예배당으로 저주와 약한 카드를 제거하고 도서관과 대장장이로 손패를 채웁니다.",
      tips: ["마을과 축제로 액션 기반을 만든 뒤 마녀와 첩자를 이어 사용합니다.", "민병대로 상대 손패를 압박하면서 자신의 구매력도 확보합니다.", "예배당을 준비해 상대 마녀가 넣은 저주를 제거합니다."],
      combo: "축제는 액션과 재화를 동시에 제공해 공격을 이어 가기 좋고 도서관은 줄어든 손패를 채웁니다. 해자는 같은 공격 전략을 방어합니다."
    },
    {
      label: "고비용 경영",
      tags: ["고급 카드", "대량 드로우", "안정 운영"],
      summary: "연회와 광산으로 고비용 카드와 고급 재화를 빠르게 확보한 뒤 풍부한 액션과 드로우로 덱을 안정적으로 운영하는 조합입니다.",
      detail: "비용 5 카드가 많지만 연회가 초기 진입 비용을 낮춰 줍니다. 실험실, 시장, 축제는 액션을 유지하고 집회소와 도서관은 손패를 크게 늘립니다. 광산은 구매력을 높여 후반에는 금과 속령을 자연스럽게 확보하게 합니다.",
      tips: ["연회로 실험실, 시장, 축제, 집회소 중 필요한 카드를 확보합니다.", "마을과 축제로 액션 수를 준비한 뒤 드로우 카드를 연결합니다.", "광산으로 재화를 강화하고 시장의 추가 구입을 활용합니다."],
      combo: "알현실로 실험실, 시장, 집회소를 두 번 사용하면 무거운 덱도 빠르게 움직입니다. 개조는 저비용 카드를 더 비싼 카드로 바꿔 줍니다."
    }
  ];

  let titleScroll = 0;

  const esc = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  function typeName(cardData) {
    if (cardData.type === "treasure") return "재화";
    if (cardData.type === "victory") return "승점";
    if (cardData.type === "curse") return "저주";
    if (cardData.type.includes("attack")) return "공격";
    if (cardData.type.includes("reaction")) return "반응";
    return "액션";
  }

  function addStyles() {
    const style = document.createElement("style");
    style.id = "deckIntroStyles";
    style.textContent = `
      .title .start-actions{display:grid;grid-template-columns:1.08fr .92fr 1fr;gap:7px;flex:0 0 46px}
      .title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start{width:100%;min-width:0;max-width:none;height:46px;font-size:14px;white-space:nowrap}
      .title .start-actions .deck-intro-start{background:#5d3f76;color:#fff6df;border:1px solid #d5b56b}
      .deck-intro-screen{display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;background:radial-gradient(circle at 82% 4%,#79562b55 0,transparent 30%),radial-gradient(circle at 8% 26%,#356b6550 0,transparent 28%),#21150f;padding:0}
      .deck-intro-screen.active{display:block}
      .deck-intro-wrap{width:min(100%,820px);min-height:100%;margin:0 auto;padding:18px 14px max(22px,env(safe-area-inset-bottom))}
      .deck-intro-hero{position:relative;overflow:hidden;padding:18px;border:1px solid #80633f;border-radius:15px;background:linear-gradient(145deg,#3b281b,#2a1c14);box-shadow:0 12px 30px #0006}
      .deck-intro-hero:after{content:"";position:absolute;width:170px;height:170px;right:-75px;top:-90px;border-radius:50%;border:28px solid #d7a93f18}
      .deck-intro-kicker{position:relative;z-index:1;display:flex;justify-content:space-between;gap:8px;color:#e3c983;font-size:11px;font-weight:900;letter-spacing:.05em}
      .deck-intro-hero h1{position:relative;z-index:1;margin:9px 0 7px;color:#fff4d2;font-family:Georgia,"Times New Roman","Malgun Gothic",serif;font-size:clamp(27px,6vw,42px);line-height:1.05}
      .deck-intro-lead{position:relative;z-index:1;max-width:690px;margin:0;color:#dfcfb3;font-size:13px;line-height:1.55}
      .deck-intro-tags{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}
      .deck-intro-tag{padding:5px 9px;border:1px solid #9c7c4f;border-radius:999px;background:#18100b80;color:#f5dfad;font-size:10px;font-weight:800}
      .deck-intro-section{margin-top:13px;padding:14px;border:1px solid #6b5036;border-radius:13px;background:#302016e8;box-shadow:0 8px 20px #0004}
      .deck-intro-heading{display:flex;align-items:end;justify-content:space-between;gap:8px;margin-bottom:11px}
      .deck-intro-heading h2{margin:0;color:#fff0c8;font-size:17px}.deck-intro-heading span{color:#bda886;font-size:10px}
      .deck-intro-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
      .deck-intro-card{min-width:0;margin:0;padding:4px 4px 6px;border:1px solid #806645;border-radius:8px;background:#1c130e;box-shadow:0 5px 12px #0007}
      .deck-intro-card img{width:100%;aspect-ratio:31/48;display:block;object-fit:cover;border-radius:5px;background:#493522}
      .deck-intro-card figcaption{min-width:0;padding:5px 1px 0}.deck-intro-card strong,.deck-intro-card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .deck-intro-card strong{color:#fff0c8;font-size:10px}.deck-intro-card small{margin-top:2px;color:#bfa984;font-size:8px}
      .deck-intro-details{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:13px}
      .deck-intro-copy h2{margin:0 0 8px;color:#f2cf76;font-size:16px}.deck-intro-copy p,.deck-intro-copy li{color:#dfcfb5;font-size:12px;line-height:1.55;word-break:keep-all}
      .deck-intro-copy p{margin:0}.deck-intro-copy ol{margin:0;padding-left:20px}.deck-intro-copy li+li{margin-top:7px}
      .deck-intro-synergy{margin-top:13px;padding:13px 14px;border-left:4px solid #d7a93f;border-radius:6px 11px 11px 6px;background:#4b3321}
      .deck-intro-synergy strong{display:block;margin-bottom:5px;color:#ffe7a4;font-size:13px}.deck-intro-synergy p{margin:0;color:#e2d0b2;font-size:12px;line-height:1.5;word-break:keep-all}
      .deck-intro-back{width:min(360px,100%);height:48px;display:block;margin:16px auto 0;border:1px solid #f3d47d;border-radius:10px;background:#d7a93f;color:#27180d;font-size:16px;font-weight:1000;box-shadow:0 7px 18px #0006}
      @media(max-width:560px){.title .start-actions{grid-template-columns:1fr .94fr 1.08fr;gap:5px;flex-basis:42px}.title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start{height:42px;padding:0 4px;font-size:11.5px}.deck-intro-wrap{padding:10px 9px max(18px,env(safe-area-inset-bottom))}.deck-intro-hero{padding:14px;border-radius:12px}.deck-intro-lead{font-size:11.5px}.deck-intro-section{padding:9px}.deck-intro-cards{gap:4px}.deck-intro-card{padding:3px 3px 5px;border-radius:6px}.deck-intro-card strong{font-size:8.5px}.deck-intro-card small{font-size:7px}.deck-intro-details{grid-template-columns:1fr;gap:9px}}
      @media(max-width:340px){.title .start-actions .start,.title .start-actions .mini-start,.title .start-actions .deck-intro-start{font-size:10px}.deck-intro-card strong{font-size:7.5px}}
    `;
    document.head.appendChild(style);
  }

  function addScreen() {
    const screen = document.createElement("section");
    screen.id = "deckIntroScreen";
    screen.className = "screen deck-intro-screen";
    screen.setAttribute("aria-label", "왕국 카드 조합 소개");
    screen.innerHTML = '<div id="deckIntroContent" class="deck-intro-wrap"></div>';
    document.getElementById("titleScreen").insertAdjacentElement("afterend", screen);
  }

  function addButton() {
    const button = document.createElement("button");
    button.id = "deckIntroBtn";
    button.type = "button";
    button.className = "start deck-intro-start";
    button.textContent = "카드 조합 소개";
    button.onclick = show;
    document.querySelector("#titleScreen .start-actions").appendChild(button);
  }

  function render() {
    const preset = presets[selectedPreset];
    const guide = GUIDES[selectedPreset] || GUIDES[0];
    const number = String(selectedPreset + 1).padStart(2, "0");
    const figures = preset.ids.map(id => {
      const cd = cards[id];
      return `<figure class="deck-intro-card"><img src="${IMG + cd.img}" alt="${esc(cd.name)} 카드" loading="eager"><figcaption><strong>${esc(cd.name)}</strong><small>비용 ${cd.cost} · ${typeName(cd)}</small></figcaption></figure>`;
    }).join("");
    const tags = guide.tags.map(tag => `<span class="deck-intro-tag">${esc(tag)}</span>`).join("");
    const tips = guide.tips.map(tip => `<li>${esc(tip)}</li>`).join("");

    document.getElementById("deckIntroContent").innerHTML = `
      <header class="deck-intro-hero"><div class="deck-intro-kicker"><span>KINGDOM GUIDE · ${number}</span><span>현재 선택된 조합</span></div><h1>${esc(preset.title)}</h1><p class="deck-intro-lead">${esc(guide.summary)}</p><div class="deck-intro-tags">${tags}</div></header>
      <section class="deck-intro-section"><div class="deck-intro-heading"><h2>구성 카드 10장</h2><span>${esc(guide.label)}</span></div><div class="deck-intro-cards">${figures}</div></section>
      <div class="deck-intro-details"><section class="deck-intro-section deck-intro-copy"><h2>이 조합의 성격</h2><p>${esc(guide.detail)}</p></section><section class="deck-intro-section deck-intro-copy"><h2>추천 운영 순서</h2><ol>${tips}</ol></section></div>
      <aside class="deck-intro-synergy"><strong>핵심 카드 연계</strong><p>${esc(guide.combo)}</p></aside>
      <button id="deckIntroBackBtn" type="button" class="deck-intro-back">타이틀 화면으로 돌아가기</button>`;
    document.getElementById("deckIntroBackBtn").onclick = hide;
  }

  function show() {
    if (typeof sound === "function") sound("click");
    const title = document.getElementById("titleScreen");
    titleScroll = title.scrollTop;
    render();
    title.classList.remove("active");
    const screen = document.getElementById("deckIntroScreen");
    screen.classList.add("active");
    screen.scrollTop = 0;
  }

  function hide() {
    if (typeof sound === "function") sound("click");
    document.getElementById("deckIntroScreen").classList.remove("active");
    const title = document.getElementById("titleScreen");
    title.classList.add("active");
    title.scrollTop = titleScroll;
  }

  function init() {
    if (document.getElementById("deckIntroBtn")) return;
    if (typeof presets === "undefined" || typeof cards === "undefined" || typeof selectedPreset === "undefined") {
      console.error("카드 조합 소개 기능을 초기화할 수 없습니다. game.js 다음에 deck-intro.js를 불러오세요.");
      return;
    }
    addStyles();
    addScreen();
    addButton();
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && document.getElementById("deckIntroScreen").classList.contains("active")) hide();
    });
  }

  init();
})();