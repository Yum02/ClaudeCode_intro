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

### 2026-08-10 - 구글 태그(gtag.js) 추가 및 배포 확인
- 시도한 것: Google 태그(gtag.js, Google Analytics) 스크립트를 사이트의 모든 페이지(index, About, Contact, Privacy, AnimalTest, RandomLotto) `<head>` 바로 아래에 추가하고 GitHub에 커밋/푸시. 이후 실제 배포된 사이트(claudecode-intro.pages.dev)에 태그가 반영됐는지 curl로 raw HTML을 확인
- 배운 점 / 느낀 점: GitHub에 푸시가 성공해도 Cloudflare Pages 빌드가 실패하면 실제 서비스 중인 사이트에는 반영되지 않음. WebFetch처럼 HTML을 마크다운으로 변환하는 도구는 `<script>` 태그가 걸러질 수 있어 확인용으로 부적합하고, curl로 raw HTML을 직접 받아 태그 유무를 확인하는 게 정확함
- 다음에 해볼 것: Cloudflare Pages 대시보드에서 실패한 배포의 빌드 로그를 확인해 오류 원인 파악 후 재배포, 배포 성공 후 실제 사이트에서 gtag가 정상 동작하는지(Google Analytics 실시간 리포트 등으로) 재확인