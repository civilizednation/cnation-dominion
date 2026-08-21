# Dominion 1:1 Webgame

태블릿 세로 화면 기준으로 만든 1:1 도미니언 웹게임 프로토타입입니다.

## 실행 방법

가장 간단한 방법은 `index.html`을 브라우저로 여는 것입니다.

로컬 서버로 실행하려면 Node.js가 설치된 환경에서 아래 명령을 실행하세요.

```bash
node static-server.mjs
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5177/
```

## GitHub Pages

이 폴더 전체를 GitHub 저장소에 올린 뒤, GitHub Pages를 `main` 브랜치의 root 폴더로 설정하면 바로 실행할 수 있습니다.

## 폴더 구조

```text
dominion-github-ready/
├─ index.html
├─ static-server.mjs
├─ README.md
├─ .gitignore
└─ assets/
   └─ cards/
      └─ 32 card PNG files
```

## Dominion Echo (BGM 플레이어)

`echo/` 폴더에 게임 배경음악 20곡(10테마 × 2곡)을 골라 들을 수 있는 미래형 기기 컨셉의 별도 플레이어가 있습니다.

```bash
node static-server.mjs
```

```text
http://localhost:5177/echo/
```

기기 셸 이미지(`echo/assets/device.png`)와 테마별 화면 아트(`echo/assets/themes/{테마id}.webp`, 10장)가 포함되어 있습니다. 둘 다 없어도 자리표시자 배경으로 정상 동작하니, 다른 이미지로 교체하고 싶으면 같은 경로에 덮어쓰면 됩니다.

## 참고

카드 이미지는 이 프로젝트용으로 생성한 비공식 프로토타입 이미지입니다.
