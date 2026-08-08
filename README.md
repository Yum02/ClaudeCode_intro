# ClaudeCode_intro

Claude Code를 활용한 바이브코딩(Vibe Coding) 학습 기록 저장소입니다.
직접 프로젝트를 만들어보며 익힌 내용, 시행착오, 배운 점을 정리합니다.

## 목적

- Claude Code의 기능과 사용법을 실습하며 익히기
- 바이브코딩 워크플로우(자연어로 요청 → 결과 확인 → 반복 개선)에 익숙해지기
- 학습 과정에서 얻은 팁과 실수를 기록해 다음에 참고하기

## 기록 방식

새로운 것을 시도할 때마다 아래 [학습 로그](#학습-로그) 섹션에 날짜별로 항목을 추가합니다.

```
### YYYY-MM-DD - 주제
- 시도한 것:
- 배운 점 / 느낀 점:
- 다음에 해볼 것:
```

## 학습 로그

### 2026-08-08 - 시작 및 파일 정리 연습
- 시도한 것: 저장소 생성, README 작성, CLAUDE.md 작성, `examples/` 폴더에 정리 연습용 파일 14개(보고서·스프레드시트·프레젠테이션·이미지 등) 생성 후 종류별로 `images/`, `documents/`, `spreadsheets/`, `presentations/` 폴더로 분류 정리
- 배운 점 / 느낀 점: Claude Code에게 자연어로 정리 기준(종류별 폴더명)을 지정하면 파일 분류와 이동을 한 번에 처리해줌
- 다음에 해볼 것: 이름이 모호한 파일(Untitled.txt 등) 정리 기준 세분화, 다른 정리 시나리오(중복 파일, 날짜별 정리 등) 연습

### 2026-08-08 - Express API 디버깅 및 테스트 작성
- 시도한 것: `debug-express-api`의 `server.js`를 실행하고 body 없이 `POST /users` 요청을 보내 에러 재현. 원인 분석 후 두 가지 버그 수정 — (1) `req.body`가 undefined일 때 구조분해로 크래시 나던 것을 `req.body || {}`와 email 존재 검증으로 방어, (2) `GET /users/:id`에서 문자열 `req.params.id`와 숫자 `user.id`를 `===`로 비교해 항상 조회 실패하던 것을 `Number()` 변환으로 수정. `server.js`가 `require.main === module`일 때만 `listen`하도록 바꿔 `app`을 export하고, Jest + supertest로 두 버그에 대한 회귀 테스트(`server.test.js`) 작성 후 `npm test`로 통과 확인
- 배운 점 / 느낀 점: 에러를 실제로 재현(curl로 요청 보내기)한 뒤 스택 트레이스를 근거로 원인을 짚어야 정확한 수정이 가능함. 서버를 테스트 가능하게 만들려면 `app.listen`과 `module.exports`를 분리(`require.main === module` 패턴)해야 supertest로 실제 서버 포트 없이 테스트할 수 있음
- 다음에 해볼 것: 에러 케이스(존재하지 않는 id 조회, 잘못된 JSON body 등) 테스트 추가, 입력값 검증 라이브러리(zod 등) 도입 검토

## 참고 자료

- [Claude Code 공식 문서](https://docs.claude.com/en/docs/claude-code)
