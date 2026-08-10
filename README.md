# ClaudeCode_intro


Claude Code를 활용한 바이브코딩(Vibe Coding) 학습 기록 저장소입니다.
직접 프로젝트를 만들어보며 익힌 내용, 시행착오, 배운 점을 정리합니다.

조코딩 유튜브를 통해 학습하며, 실습을 하는 것을 정리합니다.
해당 유튜브 링크 : 
https://www.youtube.com/watch?v=P3jFI-VpyLg&t=4472s

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

### 2026-08-09 - 실제 웹사이트 기획부터 배포까지
- 시도한 것: 로또 번호 추천 페이지(RandomLotto) 제작 및 다크/화이트 모드 토글 구현, Cloudflare Pages + GitHub 연동 배포 및 Build output directory 설정 문제 트러블슈팅, Formspree 연동 제휴 문의 폼(Contact) 제작, 여러 페이지를 안내하는 랜딩 페이지 제작, Disqus 댓글 기능 추가, Teachable Machine 이미지 모델을 활용한 동물상 테스트(AnimalTest) 페이지 제작, Google AdSense 스크립트/메타태그 및 ads.txt 추가, AdSense 심사 통과를 위한 사이트 품질 개선(소개 페이지, 개인정보처리방침 페이지, 공통 푸터 내비게이션, 설명 콘텐츠 보강, robots.txt, sitemap.xml 추가)
- 배운 점 / 느낀 점: Cloudflare Pages는 Build output directory 설정에 따라 정적 사이트의 어느 폴더를 서빙할지 결정되며, 여러 하위 프로젝트를 한 저장소에 둘 때는 공통 상위 폴더를 output directory로 지정해야 각 하위 경로(/RandomLotto/, /Contact/ 등)가 모두 접근 가능해짐. 재배포(Retry deployment)가 최신 설정을 반영하지 못할 때는 새 커밋을 push해 완전히 새 빌드를 트리거하는 것이 확실함. AdSense 승인을 노릴 때는 도구 자체 기능뿐 아니라 개인정보처리방침, 사이트 소개, 충분한 설명 텍스트, 내비게이션 구조 같은 "사이트 완성도" 요소가 함께 필요함
- 다음에 해볼 것: 커스텀 도메인 연결, AdSense 실제 심사 결과 확인 후 필요시 콘텐츠 추가 보완, 다른 아이디어로 새 미니 웹앱 페이지 추가

### 2026-08-10 - 구글 태그(gtag.js) / MS Clarity 추가 및 배포 트러블슈팅
- 시도한 것: Google 태그(gtag.js, Google Analytics) 스크립트를 사이트의 모든 페이지(index, About, Contact, Privacy, AnimalTest, RandomLotto) `<head>`에 추가하고 커밋/푸시. curl로 raw HTML을 확인해보니 실제 배포 사이트에는 미반영 상태였고, 원인은 Cloudflare Pages의 GitHub 연동이 끊긴 것이었음(사용자가 재연결). 재연결 후에도 과거 push분이 자동 반영되지 않아 빈 커밋(`git commit --allow-empty`)을 push해 새 빌드를 강제로 트리거했고, Monitor 도구로 배포 완료(gtag 반영)를 자동 확인함. 이어서 Microsoft Clarity 추적 코드도 동일한 6개 페이지 `<head>`에 추가
- 배운 점 / 느낀 점: GitHub 연동이 끊긴 상태에서 push해도 Git 자체는 성공하지만 Cloudflare Pages 빌드는 트리거되지 않음. 연동을 복구해도 끊긴 동안의 과거 push는 자동으로 재배포되지 않을 수 있어, 빈 커밋으로 새 push 이벤트를 만들어 webhook을 다시 발동시키는 방법이 확실함. 배포 확인은 curl로 raw HTML의 태그 유무를 직접 검사하는 것이 정확하고, Monitor 도구로 배포 완료를 폴링해두면 기다리는 동안 다른 작업을 계속할 수 있음
- 다음에 해볼 것: Cloudflare 대시보드에서 GitHub 연동이 다시 끊기지 않는지 주기적으로 확인, Microsoft Clarity 실제 히트맵/세션 리플레이 데이터 확인, 커스텀 도메인 연결

### 2026-08-10 - 퍼스널 스타일리스트 미니 앱(personalstylist-studio) 제작 및 AI 연동
- 시도한 것: `260810/` 폴더에 Vite + React + TypeScript 템플릿(personalstylist-studio)을 새로 생성하고, 사진 업로드 + 키/몸무게 입력 폼 화면 제작. 별도의 Cloudflare Pages 프로젝트로 배포(Root directory `260810`, Framework preset React (Vite)). 이후 사진과 신체 정보를 바탕으로 AI 스타일 컨설팅 보고서를 생성하는 기능을 Cloudflare Pages Function(`/api/consult`)으로 추가. 연습용 프로젝트라 비용이 드는 OpenAI API 대신, Cloudflare 계정에 이미 있는 Workers AI(무료 사용량 제공)를 `wrangler.toml`의 AI 바인딩으로 연동
- 배운 점 / 느낀 점: Workers AI 바인딩은 대시보드(Settings → Functions → Bindings)에 추가한 시점 이후의 새 배포부터만 적용되므로, 바인딩 추가 후에는 재배포(또는 빈 커밋 push)가 필요함. 일부 Workers AI 모델(`llama-3.2-11b-vision-instruct`)은 계정 단위로 최초 1회 라이선스 동의(`prompt: "agree"`)를 하지 않으면 매 요청이 500 에러(AiError 5016)로 실패함 — 동의 절차가 필요 없는 다른 비전 모델(`llava-1.5-7b-hf`)로 교체해 해결. `wrangler login` 후 `wrangler pages deployment tail`로 실시간 로그를 직접 스트리밍하면, 사용자가 매번 대시보드 스크린샷을 찍어줄 필요 없이 정확한 예외 메시지를 바로 확인할 수 있어 트러블슈팅이 훨씬 빨라짐. 다만 무료 소형 비전 모델은 응답에 60초 안팎이 걸려 실사용성은 아쉬움
- 다음에 해볼 것: 지금은 연습 목적이라 무료 Workers AI로 두지만, 추후 실제 서비스로 발전시키게 되면 OpenAI/Gemini 같은 유료 API로 교체해 응답 속도와 보고서 품질 개선. 실제 인물 사진으로 보고서 품질 확인, 로딩 대기 중 진행 표시 등 UX 개선