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

## 참고

카드 이미지는 이 프로젝트용으로 생성한 비공식 프로토타입 이미지입니다.
