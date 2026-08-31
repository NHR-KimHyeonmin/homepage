# 대화 기록 — 커리어링크 ATS 마이크로페이지 Figma → React 구현

프로젝트: `c:\Users\h.kim.NHR\Downloads\새 폴더 (6)` (Vite + React + TypeScript + Tailwind CSS v4)
Figma 파일: `9kfrW4KkjAUmvoAqLbbd8y` ("커리어링크 홈페이지 리뉴얼")

---

## 1. 최초 요청 — Figma 프레임을 React + TypeScript로 구현

**사용자 요청**: 첨부된 Figma 프레임(node-id=2230-131)을 분석해서 동일하게 React + TypeScript 컴포넌트로 구현. 기존 프로젝트의 디자인 토큰과 컴포넌트 구조를 최대한 재사용. 채용 ATS 상품을 소개하는 마이크로페이지이며, 추후 인터렉션/영상이 추가될 예정.

**진행 과정**:
- 작업 디렉토리가 완전히 비어 있어, 재사용할 기존 프로젝트가 있는지 확인 → 사용자가 "디자인 토큰이 따로 없으니 이 Figma 화면의 색상과 구조를 활용해달라"고 답변
- Figma 프레임 분석 결과: 헤더 + 22개 섹션으로 구성된 대형 마이크로페이지(전체 높이 약 15,181px)를 확인
- Vite + React + TypeScript + Tailwind CSS v4로 프로젝트 스캐폴딩 생성
- `src/styles/tokens.css`에 Figma에서 추출한 색상/그림자/폰트(Pretendard) 토큰 정의
- 공통 UI 프리미티브 작성: `Container`, `Button`, `Section`(배경 이미지가 있는 섹션에서 `-z-10` 스태킹 컨텍스트 버그를 방지하는 `isolate` 포함)
- Header + Hero1(메인 배너)을 직접 구현하여 컨벤션을 확립
  - **버그 발견 및 수정**: `-z-10` 배경 레이어가 `relative`만 있고 `isolate`가 없는 부모 아래에서 문서 전체의 흰 배경 아래로 가라앉는 CSS 스태킹 컨텍스트 버그 → `Section`에 `isolate` 추가로 해결
  - **버그 발견 및 수정**: 헤더 로고 이미지가 완전 투명(alpha=0)한 깨진 애셋으로 다운로드됨 → `download_assets`의 raw fill 이미지를 사용하고 `brightness-0 invert` CSS로 흰색 워드마크 구현
- 나머지 20여 개 섹션은 6개의 백그라운드 에이전트에 병렬로 위임(공통 컨벤션·토큰·재사용 규칙을 상세히 명시한 브리핑 제공)
- 완료 후 App.tsx에 전체 섹션을 순서대로 조립, Playwright로 전체 페이지 스크린샷을 찍어 슬라이스 단위로 시각 검수
- 미사용 애셋 정리, 이미지 WebP 압축, TypeScript/lint 통과 확인

**결과물**: Header, Hero1~Hero8, Testimonials, FAQ, Marquee(→ CtaBanner로 판명), Footer 등 전체 페이지 완성.

---

## 2. Figma 원본 수정사항 반영 (섹션 순서/신규 콘텐츠)

**사용자 요청**: Figma 프레임 내용을 일부 수정했으니 다시 반영해달라.

**진행 과정**:
- 최신 Figma 메타데이터를 다시 가져와 이전 버전과 구조 비교(28개 최상위 노드로 증가)
- 주요 변경사항 파악:
  - 여러 섹션에 개별적으로 있던 타이틀들이 하나의 재사용 컴포넌트("Hero 2-Title")로 통합됨
  - "지원서 접수" 관련 새 콘텐츠 블록 추가(OG설정/공고홍보 카드, 지원서 양식 편집기 스크린샷 등)
  - "일반전형/간편전형 비교" 섹션 삭제
  - 테마 쇼케이스와 고객사 로고 섹션 순서 교체
- 공용 `SectionTitle` 컴포넌트 신설, 중복되던 개별 타이틀 컴포넌트 4개 제거
- 2개의 백그라운드 에이전트에 위임: (1) 신규 "지원서 접수" 콘텐츠 블록, (2) 기존 섹션들의 콘텐츠 변경 여부 검증·반영
- App.tsx 재조립 후 전체 재검수

**후속 소규모 수정**:
- "안정적인 채용을 도와드립니다" 섹션 레이아웃을 3열 매스너리 → 4×2 균일 그리드로 변경(Figma 최신 반영)
- FAQ 본문 최대 너비를 1592px → 1208px로 변경

---

## 3. 메인 배너 이미지 인터렉션 — 1차 (이미지 스왑 방식)

**사용자 요청**: 메인 배너 대시보드 이미지에서, 좌측 탭 "채용 공고 관리" 버튼을 클릭하면 화면이 두 번째 이미지(menu-1 프레임)로 전환되는 인터렉션 구현. 참고 Figma 프레임 2개(node-id 2306-15130 "home", 2309-23124 "menu-1") 제공.

**진행 과정**:
- 두 프레임의 메타데이터에서 "채용 공고 관리" 버튼 좌표를 픽셀 단위로 정밀 측정
- 두 프레임을 고해상도로 다운로드 → 브라우저 크롬(테두리) 제거하고 크롭 → WebP 저장
- Hero1.tsx에 `useState`로 두 이미지를 교차 크로스페이드(framer-motion)하는 투명 클릭 히트박스 구현
- Playwright로 클릭→전환→재클릭→복귀 전 과정을 직접 테스트하여 검증

---

## 4. 실제 DOM 재구현 시도 → 사용자가 작업 중단 요청

**사용자 요청**: 이미지화하지 말고 실제 텍스트/도형/개체로 구현해달라(레이아웃 틀어짐·화질 저하 문제). 전달한 2개 프레임 안의 개체만 사용하고 기존 것은 삭제.

**진행 과정**:
- 백그라운드 에이전트에 "사이드바 전체를 실제 DOM으로 재구현" 작업 위임
- 사용자가 **"작업을 중단해줘"** 요청 → `TaskStop`으로 에이전트 즉시 중단
- 에이전트가 남긴 스크래치 파일들은 아직 없었음(중단 시점 확인, 프로젝트는 이전 상태로 정상 동작 유지)

---

## 5. 메인 배너 이미지 인터렉션 — 2차 (고해상도 이미지로 재작업)

**사용자 요청**: home/menu-1 프레임 안 여백·버튼을 소량 수정했다. 이미지화는 다시 괜찮으나(화질 문제만 해결), 1920px 이상 모니터에서도 깨지지 않도록 고해상도로 처리해달라.

**진행 과정**:
- Figma에서 두 프레임을 **3배 해상도**(3840×2220px)로 재다운로드, 정밀 크롭 후 WebP 저장
- 2560px 뷰포트 + 2배 고밀도 디스플레이(실질 5120px)에서 텍스트 선명도 직접 테스트
- 사이드바 여백 변경을 반영해 "채용 공고 관리" 버튼 클릭 히트박스 좌표 재측정

---

## 6. 3가지 추가 수정 요청 처리 중 → 새 인터렉션 요청 접수

**사용자 요청**:
1. 첨부 영상 참고하여 "채용 공고 관리 > 채용 공고 현황" 클릭 시 Main 영역이 바뀌도록 인터렉션 수정
2. 상단 점3개+URL 개체 삭제
3. "채용공고 관리" 버튼 높이를 다른 버튼과 동일하게(36px→44px 개념) 수정

**진행 과정**:
- 첨부 영상이 실제로는 전달되지 않아 확인 불가 → 사용자에게 알리고, 명확한 항목(2, 3번)부터 우선 처리
  - 상단 URL바+트래픽라이트 점 UI 완전 제거
  - "채용 공고 관리" 클릭 히트박스 높이를 인접 행과 동일하게(상하 여백 균등) 재측정
- 1번 인터렉션 방식에 대해 `AskUserQuestion`으로 명확화 요청 → 사용자가 **"2단계 아코디언 방식"** 선택
  - "채용 공고 관리" 클릭 → 하위 메뉴 펼침(Main 불변)
  - "채용 공고 현황" 클릭 → Main 전환
- 좌측 사이드바 전체를 실제 DOM(로고, 콤보박스, 12개 nav 항목, 아코디언, 6개 하위메뉴)으로 재구현하는 작업을 백그라운드 에이전트에 위임하여 완료
  - `Hero1Sidebar.tsx`, `Hero1SidebarIcons.tsx` 신설, 실제 아이콘 SVG 다운로드
  - 우측 메인 콘텐츠 영역은 계속 고해상도 이미지 크로스페이드 유지(사이드바 폭만큼 크롭)
- 대기 중 사용자가 보낸 추가 피드백(패딩 비대칭)도 즉시 반영: "채용 공고 관리" 버튼 상하 여백을 글자/아이콘 중심 기준 대칭으로 재조정
- 에이전트 완료 후 4단계 전체 플로우(홈→펼침→전환→복귀)를 Playwright로 검증

---

## 7. 컬러 테마 피커 인터렉션

**사용자 요청**: "채용 홍보" 아래 PC 미리보기 화면의 컬러 팔레트(5가지 색상) 중 하나를 클릭하면, 지정된 outline 스타일(`border-radius: 62.4375rem; border: 2.6px solid #0042B7`)이 적용되고, Figma의 "Frame117"·"Frame131" 안에 있는 `#6E23D7` 색상이 클릭한 색상으로 일괄 변경되는 인터렉션 구현.

**진행 과정**:
- Figma 메타데이터에서 Frame117(테마 에디터+실제 채용사이트 미리보기, node 2255:299), Frame131(플로팅 컬러피커 팝업, node 2280:639) 식별
- 두 프레임 모두 실제 DOM으로 재구현해야 동적 리컬러링 가능 → 백그라운드 에이전트에 위임
  - `lib/colorShades.ts`: hex↔HSL 변환 및 Figma 참조 램프(진하게/연하게 단계) 기반 색상 파생 헬퍼
  - `Hero2ThemeFrame117.tsx`: 관리자 패널 + 실시간 미리보기(네비바, 버튼, 배지, 카드) 전체 실DOM화
  - `Hero2ThemeColorPicker.tsx`: HSV 그라디언트, 휴 슬라이더, 테마 색상 램프 6단계 실DOM화
  - `Hero2ThemeShowcase.tsx`: 5개 팔레트 스와치를 실제 버튼으로, 선택 시 outline 적용
- Playwright로 청록색/주황색/초록색 등 선택 테스트, 색상 램프 재계산 확인

**후속 요청**: 우측 상단 "속성 패널"의 보라색 스와치 2개가 연동되지 않음 → 이 패널은 Figma상 실제 레이어 없는 통짜 이미지였음을 확인, 3개 스와치의 정확한 픽셀 좌표를 찾아 이미지에서 지우고 그 자리에 실제 색상 연동 DOM 원(circle)을 오버레이하여 해결.

---

## 8. 대규모 13개 항목 수정 요청

**사용자 요청** (한 번에 13개 항목, "토큰이 소진되면 다음 세션에서 자동으로 이어서 진행"):

1. Hero1 대시보드 이미지의 "총회원수"/"채용 공고 현황" 좌측 모서리 아티팩트 제거, "공고 현황" 텍스트 깨짐 수정
2. 메인 헤드라인에 1회성 타이핑 애니메이션
3. Hero2Title 쉐브론 화살표 바운스 애니메이션 + 클릭 시 스크롤 이동 + 여백 3배
4. "지원자 모집" 텍스트 흰 배경 제거
5. 컬러 팔레트 섹션 배경색을 `#f8f9fa`로 통일
6. 태블릿 화면에서 회색 점 2개 + URL 입력창 삭제
7. `right-panel.png` 삭제 + 화면 높이 710px 고정
8. 컬러피커의 특정 스와치+hex 입력 행(`class="flex items-center pt-2"`) 삭제
9. "도입 문의하기" 버튼 색상 `#3379F3`/흰 글자로 변경
10. "SEO 설정"/"애널리틱스" 카드 섹션의 80px 패딩 제거
11. "검증된 DB 기반 지원서" 카드 콘텐츠를 최신 Figma로 업데이트
12. "회원·비회원 서류접수", "모바일 반응형 지원서" 카드를 최신 Figma로 교체
13. "평가" 섹션 카드를 화면에 1.7개가 보이도록 확대

**진행 과정** (컨텍스트 소진 후 자동 재개하여 완료):
- **항목 1**: Figma에서 두 프레임을 3배 해상도로 재다운로드. 이전 보정이 남긴 아티팩트의 정체가 "사이드바 접기 버튼"의 잔여물(반경 ~54px 원형)임을 대비(contrast-enhance)로 정밀 특정 → 반경 76px + 페더링 92px의 원형 마스크로 주변 배경색을 정확히 샘플링하여 제거. 이전 시도가 광범위한 사각형 영역을 지워 실제 "채용 공고 현황" 텍스트까지 훼손했던 것을 확인하고 훨씬 좁은 범위로 재작업.
- **항목 2**: `Hero1TypedHeadline.tsx` 신설 — 문자 단위 타이핑(45ms/자, 300ms 지연 후 시작) + 완료 후 깜빡이는 커서. `tokens.css`에 `hero1-cursor-blink` keyframe 추가.
- **항목 9**: Tailwind 클래스 캐스케이드 충돌을 피하기 위해 `Button` 컴포넌트에 `accent` variant(`bg-[#3379f3]`) 신설.
- **항목 3**: 클릭 시 `document.getElementById('hero2-headline')?.scrollIntoView({behavior:'smooth'})`, framer-motion으로 `y:[0,10,0]` 무한 반복 바운스, `gap-8`→`gap-24`(96px, 3배).
- **항목 4**: "지원자 모집" 텍스트를 감싸던 `bg-white` div 제거.
- **항목 5~8**: `Hero2ThemeShowcase.tsx`에서 URL바/점 UI 및 `right-panel.png` 오버레이 전체 제거, 섹션 배경 `#f8f9fa`, 카드 높이 `h-[710px]` 고정. `Hero2ThemeColorPicker.tsx`에서 스와치+hex 입력 행과 관련 아이콘·상태 제거.
- **항목 10**: `Hero2SeoAnalyticsGrid.tsx` Section의 `py-20`(80px) 제거.
- **항목 11~12**: Figma 최신 버전(`get_design_context`, node 2230:275) 재조회 → "검증된 DB 기반 지원서" 카드가 겹쳐진 스크린샷 방식에서 로고 2개(대학알리미/YBM) + 실제 DOM 필드카드(외국어시험, 대학교) 방식으로 전면 개편된 것을 확인, 새 `FieldCard` 컴포넌트로 재구현. "공고별 OG 설정" 카드가 삭제되고 "회원·비회원 서류접수"로 교체된 것을 확인(동일 폰 목업 이미지 재사용, 텍스트만 교체), "모바일 반응형 지원서"는 위치만 좌측으로 이동.
- **항목 13**: `Hero4FeatureCards.tsx`를 2열 그리드 → 가로 스크롤 방식(`overflow-x-auto`)으로 전환, 카드 폭을 `w-[58%]`로 설정하여 1440px 화면에서 약 1.7장이 보이도록 계산(`c = (100% - gap) / 1.7`).
- 전체 13개 항목을 Playwright로 순차 스크린샷 검증(타이핑 애니메이션, 모서리 복구, 버튼 색상, 쉐브론 여백, 팔레트 섹션 UI, DB 카드 신규 레이아웃, 평가 카드 비율 등).
- 미사용 애셋 정리(이전 단계에서 남은 Hero00 아이콘 6개 등), TypeScript·lint 최종 통과 확인.

---

## 9. 대규모 후속 세션 (2026-08-28 ~ 2026-08-31) — 메인 배너 인트로 재구성, 사이드바 인터렉션, 전 섹션 디테일 다듬기, 배포

이 세션은 매우 길고 요청이 세분화되어 진행됨. 아래는 기능/컴포넌트별로 묶은 요약이며, 각 항목은 실제로는 사용자의 여러 번의 후속 피드백(세부 조정·버그 수정)을 거쳐 지금 상태에 도달함.

### 9-1. `Hero1.tsx` / `Hero1TypedHeadline.tsx` — 메인 배너 인트로 시퀀스 (여러 차례 재작업)

최종 상태: 상태 머신 `IntroPhase = 'typing' | 'holding' | 'exiting' | 'paused' | 'revealing' | 'done'`.

- **트리거**: 스크롤 유도 방식(스크롤을 가로채 트리거하는 "scroll-jack") → 이후 **완전히 제거**하고 페이지 로드 즉시 타이핑 시작으로 단순화(사용자가 "딜레이 없이 바로 시작"을 요청).
- **커서 깜빡임**: 타이핑 시작 전 `PRE_TYPE_BLINKS`회 깜빡임. 처음 2회로 설정했다가 사용자가 "3번처럼 보인다"고 해서 1회로 축소(체감상 "번쩍이는 순간"을 세는 사용자 감각에 맞춤 — 실제 코드상 dip 횟수와 사용자가 세는 방식이 다를 수 있음에 유의).
- **타이핑 속도**: `MS_PER_CHAR` 45 → 70 → 55ms로 조정(점점 빠르게).
- **완료 후 유지 시간**: 타이핑 완료 후 곧바로 사라지지 않고 `HOLD_TITLE_MS`(1500ms) 동안 완성된 문구를 유지한 뒤 페이드아웃.
- **다음 요소 등장까지 딜레이**: 타이틀 완전히 사라진 후 `POST_TITLE_PAUSE_MS`. 2000ms → 300ms로 축소(유지시간이 이미 "읽을 시간" 역할을 하므로).
- **"밀리는" 버그 수정**: 서브타이틀/CTA/이미지를 각각 다른 시점에 개별 마운트했더니 새 요소가 삽입될 때마다 `justify-center`가 즉시 재계산되며 이미 보이던 요소가 순간 이동하는 것처럼 보였음(원인: framer-motion `layout` prop의 FLIP 스케일 아티팩트이기도 했음 — 처음엔 `layout` prop을 썼다가 "작아졌다 커지는" 버그가 발생해 완전히 제거). **해결**: `revealed` 플래그 하나로 서브타이틀·메인텍스트2·CTA·이미지를 **동시에 마운트**하고, 각 요소의 `transition.delay`만 다르게 줘서(`REVEAL_STAGGER_MS=500`) 시각적 스태거링만 남김 — 한 번의 리플로우로 모든 레이아웃 공간이 예약되므로 이후 트랜스폼만 애니메이션됨.
- **높이**: 섹션을 `min-h-screen`(정확히 100vh)으로 고정, 콘텐츠는 `justify-center`로 중앙 정렬.
- **콘텐츠 문구 변경**: 서브타이틀 "새로운 채용브랜딩의 시작" → "채용 브랜딩부터 지원자 관리까지". 타이핑 완료 후 타이틀이 사라지고 새로 등장하는 "메인텍스트2"("채용의 모든 것을 / 커리어링크에서 해결하세요.") 신설 — 타이핑되는 헤드라인과 동일한 폰트 크기(`text-[40px] md:text-[64px] font-bold`)로 그 자리를 대신함.
- **커스텀 커서** (Figma node 2323:26304): 화살표+"careerlink" 배지 형태. Figma 원본 export가 검은 배경이 구워져 있어 투명 PNG가 아니었음 → 포인터 아이콘의 실제 SVG 벡터 경로와 기존 화이트 로고 애셋을 헤드리스 브라우저(Playwright)로 합성해 투명 배경 PNG를 새로 제작(`src/assets/sections/hero1/cursor/cursor.png`, hotspot 22,27). 처음엔 대시보드 스크린샷 이미지 영역에만 적용했다가, 이후 "왼쪽 사이드바 포함 전체"로 범위 확장 — 최종적으로 `<div className="relative w-full" style={{aspectRatio, cursor: url(...)}}>` (사이드바+이미지를 함께 감싸는 최상위 div)에 적용.
  - **버튼 커서 상속 버그**: `<button>` 요소는 브라우저 기본 UA 스타일시트가 `cursor: default`를 강제해서 부모의 커스텀 커서 상속이 끊김 → `cursor-[inherit]`(Tailwind arbitrary value)로 해결. **주의**: Tailwind 기본 cursor 스케일에는 `inherit` 키워드가 없어서 `cursor-inherit`(bare utility)는 아무 효과가 없다 — 반드시 arbitrary value 문법(`cursor-[inherit]`)을 써야 함.

### 9-2. `Hero1Sidebar.tsx` / `Hero1SidebarIcons.tsx` — 사이드바 구조 개편 (최신)

- **1-depth 구조로 전환**: 기존 "채용 공고 관리" 펼침/접힘 토글 + 서브메뉴(5개 항목)와, 다른 모든 행에 붙어있던 장식용 화살표 아이콘을 **전부 제거**. `jobsExpanded`/`onToggleJobs` state·prop 삭제.
- **뷰 전환 방식 통합**: 개별 콜백(`onSelectHome`/`onToggleJobs`/`onSelectJobPostings`) 대신 **단일 콜백** `onSelectView: (view: Hero1MainView) => void`로 통일. "채용 공고 관리" 버튼 자체가 클릭 시 화면 전환을 담당(이전엔 서브메뉴의 "채용 공고 현황"이 담당했음).
- **`Hero1MainView` 확장**: `'home' | 'jobPostings'` → `'home' | 'jobPostings' | 'hiringProcess' | 'applicants' | 'sending' | 'siteBuilder'` 6종.
- **클릭 가능 항목**: 대시보드, 채용 공고 관리, 채용 사이트 빌더, 채용 전형 관리, 지원자 관리, 발송 관리 (총 6개, opacity 100%).
- **미연결 항목**: 채용 사이트 바로가기, 1:1 문의, 채용 사이트, 평가 관리, 관리자 사이트, 개인정보 로그 — `opacity-30`으로 표시(추후 순차 연결 예정, 사용자가 명시).
- **아이콘 hover/active 색상**: 새로 클릭 가능해진 4개 항목(채용 사이트 빌더/채용 전형 관리/지원자 관리/발송 관리)은 원래 `<img>` 라스터 아이콘이라 CSS로 재색상할 수 없었음 → `Hero1SidebarIcons.tsx`에 `SiteBuilderIcon`/`HiringProcessIcon`/`ApplicantsIcon`/`SendIcon`을 `currentColor` 기반 SVG 컴포넌트로 신규 작성(경로 데이터는 원본 SVG에서 그대로 복사, `stroke="#4D5761"`만 `currentColor`로 교체) — 기존 `DashboardIcon`/`JobPostingsIcon` 패턴과 동일. 미연결(opacity-30) 항목들은 여전히 정적 `<img>` 유지(색상 안 바뀌므로 무관).
- **4개 신규 화면 에셋** (Figma 노드 → `src/assets/sections/hero1/views/*.webp`):
  - 채용 전형 관리 ← node 2326-1284
  - 지원자 관리 ← node 2326-2564
  - 발송 관리 ← node 2326-7812
  - 채용 사이트 빌더 ← node 2326-9378
  - **중요 기법**: 처음엔 전체 프레임(1280×740)을 export한 뒤 왼쪽 260px(사이드바 몫)를 수동으로 crop했음. 이후 사용자가 "Main 레이어 안의 내용만 반영해달라"고 명시 → 각 프레임의 메타데이터에서 실제로 `name="Main"`인 자식 노드 ID를 찾아(`get_metadata`가 너무 커서 파일로 저장되면 `grep -oE`로 노드ID+좌표 직접 파싱) 그 노드 ID를 **직접** `download_assets`에 전달 → 사이드바뿐 아니라 바깥 창 크롬(둥근 모서리 테두리)까지 자동으로 빠진 순수 콘텐츠 패널을 얻음. 이 방식이 수동 crop보다 훨씬 정확하고 안전함 — 향후 유사 작업 시 최우선으로 사용할 것.
- **파일 삭제**: 더 이상 안 쓰는 `ChevronIcon`/`BulletIcon` 컴포넌트를 `Hero1SidebarIcons.tsx`에서 제거.

### 9-3. `Hero2ThemeFrame117.tsx` — 관리자 상단 툴바 정리

- 되돌리기/다시하기 아이콘 2개, "100%" 확대율 텍스트, "페이지 ID" 입력창(`aria-label="페이지 ID"`) 전부 제거.
- 타이틀 텍스트 "01 기본형 (A Type)_신규" → "홈페이지 빌더 템플릿 (2026년 업데이트 버전)".
- 미사용된 `iconUndo` import 제거.

### 9-4. `Hero4FeatureCards.tsx` ("평가" 섹션) — 캐러셀 방식 전환 + 디테일

- 카드별 `whileInView` 슬라이드업 진입 애니메이션 **완전 제거**(정적 `<div>`로 전환, 사용자가 "카드별 슬라이드업 없애줘" 요청).
- 카드 설명글 `text-base`(16px) → `text-lg`(18px).
- 카드 순서 변경: "Basic·Retro 뷰"를 2번째 위치로 이동.
- 드래그 스크롤 → **좌우 버튼 캐러셀**로 전환(Figma 화살표 버튼 아이콘, `src/assets/sections/hero4-cards/icon-chevron-{left,right}.svg`). 활성 카드가 스크롤 컨테이너 **정중앙**에 오도록 좌우 여백 스페이서 추가(양 끝 카드도 중앙 정렬 가능하도록).

### 9-5. `Hero8Gallery.tsx` ("채용을 더 완벽하게" 섹션)

- 마우스 드래그 스크롤 추가(`useDragScroll` 훅 신설, `src/hooks/useDragScroll.ts` — 여러 섹션에서 재사용 가능한 범용 훅).
- 평가 섹션과 같은 좌우 버튼도 **추가**(우측 하단 배치, 평가 섹션과 달리 중앙 정렬 로직 없이 단순 `scrollIntoView`). 드래그와 버튼 두 방식 공존.

### 9-6. `FaqList.tsx`

- 질문 앞에 "Q. " 프리픽스 추가, `font-medium`(500) 적용.
- 시브런 아이콘이 실제로는 좌/우 화살표였음(파일명은 "chevron-down"인데 path data가 hero4-cards의 좌측 화살표와 동일) → 실제 위/아래 방향 chevron으로 신규 제작(`src/assets/sections/text-list-2/chevron-down{,-active}.svg`, tabler-chevron-down 패턴 재사용) — 접힘=아래, 펼침=180도 회전(위).
- 두 번째 질문에 `highlighted: true`가 박혀 있어 접혀 있어도 항상 파란색이었음 → 제거, 이제 `isOpen` 상태만으로 색상 결정.
- 질문 버튼에 `cursor-pointer` 추가(버튼 기본 `cursor:default` 이슈, 9-1의 사이드바와 같은 원인).

### 9-7. `CtaBanner.tsx` (맨 아래 섹션)

- 배경 오버레이 `bg-black/20` → `bg-black/10`.
- 버튼 2개 → "도입 문의하기" 1개만 남기고 `rounded-[99px]`(완전 원형)로 변경.

### 9-8. `Hero2ThemeShowcase.tsx` / `Hero2ThemeColorPicker.tsx` ("지원자 모집" 섹션)

- 상단 5개 테마 색상 원형 스와치: 크기 48px → 44px, 버튼 자체 padding(4px) 제거, 행 `gap`을 `gap-[2px]`로 재조정(여러 차례 미세 조정).
- 플로팅 컬러피커 팝업: "테마 색상" 라벨 위 회색 구분선(border-top) 제거, 라벨 위 여백 축소, 폰트 14px로 확대.
- 팔레트 박스 위치를 "메인 색상" 스와치 바로 아래·"모서리 둥글기" 행과 같은 높이로 재배치(`top-[161px] left-[77px]`, 실측 기반 좌표 — Figma 원본 팝업 오프셋은 다른 목업 폭을 가정해서 그대로 쓸 수 없었음).

### 9-9. `Hero2DbOgMobileGrid.tsx` / `Hero2ApplicationCards.tsx` / `Hero2SeoAnalyticsGrid.tsx` — 여백·폰트 통일

- "검증된 DB 기반 지원서"/"모바일 반응형 지원서"/"회원·비회원 서류접수"/"SEO 설정"/"애널리틱스 · 태그 설정" 카드 설명글 전부 `text-base`(16px) → `text-lg`(18px)로 통일.
- "채용 사이트 방문자의 데이터를 수집하여~" 문단과 아래 카드 사이 60px 여백 — **처음엔 엉뚱한 섹션(Hero2ApplicationCards)에 적용했다가**, App.tsx의 실제 섹션 순서를 재확인(`Hero2Highlight`의 본문 바로 다음은 `Hero2DbOgMobileGrid`)하고 정정.
- `Hero2SeoAnalyticsGrid` 섹션 상단 여백 80px 추가.

### 9-10. `Testimonials.tsx` ("보안" 섹션) — 스크롤 연동 섹션 높이 확장

- **1차 시도(사용자가 정정)**: 배경 이미지에만 `scale(0.7→1)` 트랜스폼 적용 — 사용자가 "배경만 확대되는 게 아니라 섹션 자체가 커져야 하고, 안의 텍스트/카드 크기는 그대로여야 한다"고 정정.
- **최종**: `useScroll`+`useTransform`으로 **섹션 자체의 `min-height`**를 스크롤 진행도에 따라 `70vh → 100vh`로 애니메이션(섹션이 뷰포트 정중앙에 오면 100vh 도달). 내부 콘텐츠는 `justify-center`로 중앙 정렬만 되고 폰트·카드 크기는 불변.
- `Section` 컴포넌트에 `style` prop을 추가(Container와 동일 패턴)해서 `as={motion.section}` + 스크롤 연동 `minHeight` 값을 그대로 통과시킬 수 있게 함 — 앞으로 다른 섹션에서도 재사용 가능.
- 참고: 이 섹션의 실제 콘텐츠(제목+카드 6개) 자연 높이가 이미 ~820px라서 900px 뷰포트 기준 70vh(630px)보다 크기 때문에, 스크롤 초반부는 min-height가 콘텐츠보다 작아 시각적 효과가 없다가 후반부(진행도가 자연높이를 추월하는 시점)부터 실제로 커지는 게 보임 — 콘텐츠 크기를 줄이지 말라는 요청 때문에 의도적으로 그대로 둠.

### 9-11. Git / GitHub / Vercel 배포

- 이 디렉토리는 원래 git 저장소가 아니었음 → `git init`, 로컬 identity(`hmkim1217` / `hmkim1217@users.noreply.github.com`) 설정, `main` 브랜치, `origin` = `https://github.com/hmkim1217/homepage.git` 연결, 전체 파일 커밋(`node_modules`/`dist`는 기존 `.gitignore`가 이미 제외).
- **이 환경엔 GitHub 인증 수단이 전혀 없음**(gh CLI 미설치, git credential 미설정) → 실제 `git push`는 사용자가 로컬 터미널/GitHub Desktop에서 직접 수행하기로 함.
- **⚠️ 중요 규칙(사용자가 두 번 강조)**: 이후 어떤 변경을 하더라도 **사용자가 명시적으로 "깃허브에 올려줘" 등으로 요청하기 전까지는 절대 `git add`/`commit`/`push`를 자동으로 실행하지 말 것.**
- 사용자가 Vercel에 별도로 배포 완료(`https://homepage-teal-delta-87.vercel.app/`) — Playwright로 라이브 사이트가 최신 로컬 작업(메인 배너 인트로, 커스텀 커서, FAQ 아코디언, 카드 캐러셀, 보안 섹션 등)을 정상 반영하고 있음을 확인(콘솔 에러 0건).
- 로컬 개발 서버 포트가 세션마다 다를 수 있음에 유의(5180 → 이후 5173으로 바뀜, `npm run dev` 실행 후 실제 출력된 포트를 확인할 것).

---

## 10. 9개 항목 수정 요청 (2026-08-31)

### 10-1. 메인 배너 우측 패널 재구성 (요청 1·3)

- **문제**: `views/*.webp`(1020x680)를 `object-cover`로 1020x740 박스에 넣어 좌우 각 45px가 잘려 나갔음.
- **해결**: 우측 패널을 `flex-col`로 바꾸고 **60px 흰색 상단바를 실제 DOM**(`Hero1TopBar.tsx`, Figma node 2330:12759)으로 분리 — 뷰가 바뀌어도 고정. 그 아래 스크린샷은 `w-full`(높이 auto)로만 크기가 정해져 가로가 절대 잘리지 않음.
- 상단바 우측에 **로그인 연장 타이머(00:27:36) + "로그인 연장" 버튼 + 프로필 아바타(김 + chevron)** 배치. chevron은 Figma 에셋(`icons/icon-profile-chevron.svg`).
- 모든 뷰 이미지의 프레이밍을 1020x680(콘텐츠 패널)으로 통일 — `dashboard-home-main.webp` / `dashboard-jobpostings-main.webp`는 원래 포함돼 있던 상단 60px 빈 흰색 띠를 PIL로 잘라내고 2x(2041x1360)로 리샘플.
- 카드 폭이 1280px보다 좁을 때 이미지 아래 남는 띠는 이미지에서 실측한 페이지 배경색 `#f0f4f9`로 채움.

### 10-2. `views/site-builder.webp` 갱신 (요청 2)

- Figma에서 "기본 디자인" 미리보기 사진이 교체되어 node **2326:9529(`Main` 레이어)**를 2x로 재export → 기존 파일 덮어씀. (9-2의 "Main 레이어 노드 ID를 직접 download_assets에 넘기기" 기법 그대로 재사용.)

### 10-3. 테마 미리보기에 FAQ 블록 추가 (요청 4)

- Figma node **2329:12676**("자주 묻는 질문")을 `Hero2ThemeFrame117`의 채용공고 카드 아래에 **실제 DOM으로** 추가 — 이미지로 붙이면 테마 색상 변경에 반응하지 못하기 때문. "FAQ" 라벨은 `shades.dark1`(#581cac), 활성 탭·언더라인은 `shades.base`.
- **부수 변경**: 목업 창이 `h-[710px]`로 잘려 있어 새 블록이 아예 보이지 않았음 → 고정 높이를 제거해 미리보기 전체가 보이도록 함(섹션이 약 710px → 1400px로 높아짐).
- chevron은 Figma 에셋 1개(`icon-faq-chevron.svg`)만 받아 펼침 행에서 `rotate-180`.

### 10-4. `Hero2ClientShowcase` — 무한 마퀴 → 페이징 캐러셀 (요청 5)

- 무한 횡스크롤 제거, "평가" 섹션과 동일한 좌우 원형 버튼을 우측 상단에 배치(한 번에 카드 1개 이동).
- 카드 상단에 `hero2-highlight` 섹션을 **그대로 복제**한 타이틀 블록 추가(문구도 동일 — 사용자가 요청한 그대로).
- PC(≥1024px)에서 4.5장이 보이도록 카드 폭을 컨테이너 폭에서 계산: `(가용폭 - 4*20) / 4.5`. 태블릿 2.5장, 모바일 1.2장.
- 첫 카드는 타이틀 텍스트와 **정확히 같은 x**에서 시작하고, 페이징하면 화면 밖으로 나갈 수 있음.

### 10-5. 섹션 소제목 CHIP화 (요청 6)

- `src/components/ui/SectionEyebrow.tsx` 신설: padding 4px 20px, `rounded-full`, bg `#E1ECFE`, text `#3379F3`.
- 적용처: `SectionTitle`(전형 운영·평가·외부 검사 연동·운영 지원·FAQ), `Hero2Headline`(지원자 모집), `Hero2ApplicationTitle`(서류 접수), `Testimonials`(보안).
- "보안"만 `tone="onDark"` — 배경 opacity 15%, 텍스트 opacity 80%.

### 10-6. 가로 카드 트랙 좌측 정렬 (요청 5·7)

- `src/hooks/useContentInsetLeft.ts` 신설: 제목 컬럼과 **동일한 중첩 구조**를 가진 0-height 프로브 요소의 실제 left를 측정해 트랙의 `paddingLeft`로 사용.
- **`calc(...100vw...)`를 쓰지 않는 이유**: `100vw`는 세로 스크롤바를 포함해서 데스크톱에서 카드가 텍스트보다 7~8px 오른쪽으로 밀림.
- **주의**: `SectionTitle`의 `paddingClassName`은 **Section**에 붙고 그 안의 `Container`가 자기 padding을 또 갖는다. 프로브도 `px-6 md:px-[100px] lg:px-[168px]` → `mx-auto max-w-[1208px] px-6 md:px-10 lg:px-16` 2중 구조로 똑같이 만들어야 함(처음에 1중으로 만들었다가 104px 어긋남).
- `Hero8Gallery.goTo`는 `scrollIntoView({inline:'start'})`가 카드를 컨테이너 **끝**에 붙여 정렬을 무너뜨리므로 `scrollLeft`를 직접 계산하도록 교체.

### 10-7. `Hero2Title` 삭제 → 고객사 로고 마퀴 (요청 8)

- `Hero2Title.tsx`와 `assets/sections/hero2-title/` 삭제(스크롤 다운 chevron 버튼도 함께 사라짐).
- Figma node **2331:12885**(1920x109 로고 스트립 2장) → `assets/sections/hero2-logo-marquee/logo-row-{1,2}.webp`. 두 벌을 이어 붙이고 기존 `animate-marquee`(0 → -50%)로 무한 루프.
- **함정**: `download_assets`의 export와 `get_screenshot`은 **회색조**, 캔버스 위 겹친 다른 프레임 때문에 컬러로 보였을 뿐 — 픽셀 chroma를 실측해서 회색조가 원본임을 확인(`contentsOnly: true` + 최대 해상도 screenshot 사용).

### 10-8. 배경색 `#f8f9fa` → `#ffffff` (요청 9)

- `Hero2Headline` · `Hero2ThemeShowcase` · `Hero2ClientShowcase` · `Hero2Highlight` · `Hero2SeoAnalyticsGrid` · `Hero2ApplicationCards` — "지원자 모집"부터 "세련된 채용사이트로~" 블록 **전체**를 흰색으로. (뒤쪽 2개는 명시적으로 언급되진 않았지만 같은 회색 덩어리라 남겨두면 블록이 반쪽만 회색이 됨.)
- `Hero7`의 `#f8f9fa`는 범위 밖이라 유지.

---

## 11. 9개 항목 후속 수정 (2026-08-31)

### 11-1. `views/site-builder.webp` — 아이콘 2개 삭제 (요청 1)

- "homepage.careerlink.kr" 우측의 외부링크·복사 아이콘을 PIL로 흰색 칠해서 제거(x 1856~1900 / 1926~1965, y 240~290). 카드 우측 테두리가 x 1966~1967에 있으므로 그 앞에서 멈춤.

### 11-2. 로고 마퀴 갱신 + 감속 (요청 2)

- Figma node 2331:12885가 **1920x109 2장 → 1000x57 3장**으로 변경됨 → `logo-row-{1,2,3}.webp` 재생성, 컴포넌트도 3장 루프로 수정.
- `--animate-marquee` 36s → **60s**(3000px 한 벌 기준 약 50px/s).
- **⚠️ 이 프레임 export의 함정(두 번 헤맴)**:
  - 부모 프레임을 `download_assets`로 export하면 캔버스 위에 겹친 다른 요소 때문에 **x>1920 구간이 회색 상자**로 찍힘(2번째 줄 마지막 SEMES 로고가 반쪽만 회색 박스). `contentsOnly: true` screenshot에는 안 나오지만 그건 1x가 한계.
  - 실제 구조: 각 스트립 레이어가 **opacity 50%**. export는 프레임 흰 배경이 뒤에 있는 구간(x<1920)은 **흰색 위 합성**, 그 밖은 **검정 위 합성**으로 찍힘.
  - **해결**: 자식 노드 3개(2331:12887 / 2331:12889 / 2334:12960)를 각각 3x로 export한 뒤, **열마다 배경 흰점을 재서 `+ (255 - 흰점)`** 을 더해 전부 "흰 배경 위 50%" 상태로 통일. 세 줄 모두 배경 255 / 최암부 127로 맞아떨어짐.
  - 교훈: 회색조/반투명이 섞인 Figma 프레임은 **부모 export를 믿지 말고 자식 노드를 따로 뽑은 뒤 배경 흰점으로 정규화**할 것.

### 11-3. 테마 목업 높이 564px + 좌우 패딩 제거 (요청 3·5)

- `Hero2ThemeShowcase`의 목업 창을 `h-[564px] overflow-hidden`으로 고정(10-3에서 FAQ를 보이게 하려고 풀었던 높이를 다시 잠금).
- Section의 `md:px-16`(64px) 제거 → `md:px-0`. 다만 안쪽 `Container`(maxWidth 1280)가 `lg:px-16`으로 **또 64px**을 갖고 있어서 그것만으로는 카드 폭이 안 늘어남 → `Container`를 `mx-auto w-full max-w-[1280px]` 순수 div로 교체. 결과 카드 폭 1152 → **1280px**.
- **부작용**: 10-3에서 추가한 FAQ 블록이 다시 564px 아래로 잘려 보이지 않음(사용자에게 고지함).

### 11-4. CHIP 크기·여백 (요청 4)

- `SectionEyebrow`: `text-xl`(20px) → `text-lg`(18px), `mb-2`(8px) 추가. 8개 소제목 전부 실측 확인(fontSize 18px / marginBottom 8px).

### 11-5. "고객 사례 더보기" 버튼 (요청 6)

- `Hero2ClientShowcase` 카드 트랙 아래 중앙에 `Button variant="outline"` 추가.

### 11-6. "채용 공고 홍보" 카드 이미지 (요청 7)

- 비어 있던 폰 프레임 → Figma node **2337:13527** 이미지로 교체(`job-promo-channels.webp`).
- **투명도 복원**: `download_assets` export는 알파를 검정 위에 합성해버림 → `contentsOnly` 1x screenshot의 알파 채널을 3x로 업샘플해 마스크로 쓰고, `export_rgb / alpha`로 언프리멀티플라이해서 3x RGBA를 복원. (numpy 사용)

### 11-7. 인트로 타이핑 (요청 8·9)

- `HOLD_TITLE_MS` 1500 → **1000**(유지 시간 0.5초 단축).
- `initialPhase()`: `window.location.hash`가 있고 `#top`이 아니면 `phase`를 처음부터 `'done'`으로 시작 → 타이핑 인트로와 스크롤 잠금을 통째로 건너뜀.
- **함께 고친 것**: SPA라 딥링크의 브라우저 기본 해시 스크롤이 React 렌더 전에 일어나 아무 데도 못 감 → `App`에서 마운트 직후 `requestAnimationFrame`으로 `scrollIntoView({behavior:'instant'})` 한 번 실행(전역 `scroll-behavior: smooth`를 우회하려고 `'instant'`).

---

## 12. 6개 항목 후속 수정 (2026-08-31)

- **로고 마퀴 여백**: `py-16 md:py-24` → `py-4`(상하 16px).
- **테마 목업 높이**: 564px → **760px**. 카드(`motion.div`)에 직접 `h-[760px]`을 주고 안쪽 창은 `size-full`로 채움(콘텐츠 자연 높이 ~1374px이라 꽉 차고 아래가 잘림).
- **색상 팔레트 위치**: 목업 위 가로 배치 → **좌측 세로 배치**. 바깥 래퍼를 `flex-col md:flex-row`, 팔레트를 `flex items-center gap-[2px] md:flex-col`, 카드를 `flex-1 min-w-0`으로. (모바일에서는 기존처럼 위쪽 가로 배치 유지.) 카드 폭 1280 → 1204px.
- **"지원하고 싶은 사이트~" 아래 서브카피 추가**: "커리어링크 사이트빌더로 최신 UI의 채용사이트를 만들어 보세요." — `text-lg md:text-xl / text-black/55`로 "채용 사이트 방문자의 데이터를~"과 동일 스타일.
- **"고객 사례 더보기" 버튼**: `variant="outline"` → `variant="accent"`(bg #3379f3 / 텍스트 #fff, 실측 확인).
- **채용 공고 홍보 이미지 교체**: Figma node 2337:13527 → **2340:16457**(528x409, 연결 화살표 없는 새 구성). 11-6과 같은 방식으로 1x screenshot의 알파를 3x로 업샘플 → 언프리멀티플라이해서 투명 배경 복원. 컴포넌트의 `max-w`도 562 → 528px.

---

## 13. 지원자 모집 레이아웃 되돌리기 + 지원서 편집기 인터렉션 (2026-08-31)

### 13-1. 테마 목업 레이아웃 원복 (요청 1)

- 12-3에서 좌측 세로로 옮겼던 색상 팔레트를 다시 **목업 위 가로 배치**로 되돌림(`Container maxWidth={1280}` + `flex-col items-center gap-10`).
- Section 패딩을 "서류 접수" 섹션과 **동일하게** `px-6 md:px-16`로 맞춤 → 두 목업의 실제 폭이 1152px로 일치.
- **`useFitScale` 훅 신설**(`src/hooks/useFitScale.ts`): 컨테이너 폭이 디자인 폭보다 좁으면 `transform: scale()`로 통째로 축소(1보다 커지진 않음). Frame117은 `min-w-[1000px]`짜리 실제 DOM이라 리플로우가 불가능해서, 창을 줄이면 잘리는 대신 **줄어들도록** 함(스크린샷인 서류 접수 이미지와 같은 거동).
- 컬러피커 팝업도 같은 scale과 `left/top * scale`을 적용해 목업과 함께 축소되도록 함.

### 13-2. `Hero2ApplicationBuilder` — 플랫 스크린샷 → 인터렉티브 DOM (요청 2)

- Figma node **2337:13686**을 실제 DOM으로 재구성. 좌측 탭의 스위치를 누르면 가운데 미리보기에서 해당 카드가 사라지고, 다시 누르면 나타남. 아래 카드들이 자연스럽게 위로 올라옴.
- 활성 7개: 지원정보 / 인적정보 / 가산점 / 대학원 / 외국어시험 / 자격증 / 외국어활용 능력.
- 비활성 7개(`disabled`, 클릭 불가 + 회색 `#d2d6db`): 교육사항 / IT활용 능력 / 경험사항 / 경력사항 / 추가정보(파일/링크) / 경력기술서 / 자기소개서.
- 새 파일: `Hero2FormBuilderMockup.tsx`(셸 + 사이드바 + 스위치), `Hero2FormBuilderCards.tsx`(카드 렌더러), `Hero2FormBuilderData.ts`(14개 행 + 카드 데이터).
- 상단 툴바와 우측 설정 패널은 정적이라 **이미지 그대로**(`builder-toolbar.webp`, `builder-right-panel.webp`). 더 이상 안 쓰는 `form-builder-screenshot.webp` 삭제.
- 스위치 스펙(Figma 2337:13763): 트랙 40x24(p-7, 26x10), 썸 16px, ON `#0042b7` / OFF·disabled `#d2d6db`, 둘 다 트랙은 opacity 50%.

### 13-3. ⚠️ Figma에서 "화면 밖 노드"는 export가 안 된다

- 가운데 미리보기 스택(2337:14260)은 높이 8974px지만 부모가 620.5px로 클리핑 → **클립 밖 카드(가산점 이후)는 `download_assets`도 `get_screenshot(contentsOnly)`도 1x1 투명 PNG를 반환**함. 부모 노드를 export해도 보이는 620px만 나옴.
- 그래서 7개 카드를 전부 **DOM으로 재구성**했고, 텍스트/치수는 `get_design_context`(node 2337:14260) 결과를 파싱해서 뽑음. 카드 3~7은 Figma 렌더 대조가 불가능하므로 **디자인의 텍스트·구조 기반 재구성**임(시각 검수 필요할 수 있음).
- 카드 공통 스펙: `bg-white border-[#e5e7eb] rounded-[8px]`, 헤더 `linear-gradient(174.15deg,#f3f4f6,#e5e7eb)` + 16px SemiBold `#212121`, 라벨 14px `#8e949e`, 값 16px `#212121`.
- 별점(외국어활용 능력)은 `Img - N Star(s)` 레이어명에서 추출: 영어 4/2/1, 일본어 5/2/1.

### 13-4. 한글 텍스트 추출 팁

- Bash 툴 출력이 cp949라 Figma에서 뽑은 한글이 깨져 보임 → 추출 결과를 **UTF-8 파일로 쓴 뒤 Read 툴로 읽을 것**. `get_metadata`의 레이어 이름도 마찬가지로 깨지므로 이름 대신 **좌표·크기·순서**로 노드를 식별하는 편이 안전함.

---

## 14. 섹션 재배치 · 정리 (2026-08-31)

- **`hero2-client-showcase` 이동**: `Hero2ThemeShowcase` 바로 뒤 → `Hero2ApplicationCards`와 `Hero2ApplicationTitle`("서류 접수") 사이로. 배경색 `bg-white` → `bg-surface-blue`(#f4f8ff).
- **"고객 사례 더보기" 버튼 삭제**(12-5에서 추가했던 것) + 미사용 `Button` import 제거.
- **`Hero2ApplicationHighlight` 삭제**("지원자 확보에 유리한 / 지원서 접수 설정" 섹션) — 컴포넌트 파일까지 제거.
- 남은 이슈: 10-4에서 사용자가 요청한 대로 복제해 둔 "세련된 채용사이트로 지원자에게~" 문구가 `hero2-highlight`와 `hero2-client-showcase` 두 곳에 그대로 중복되어 있음. 새 문구를 받으면 교체할 것.

---

## 15. 서류 접수 카드 이미지 교체 + 편집기 스크롤 (2026-08-31)

- **"서류 접수" 3종 카드 갱신**(Figma node **2346:17286**):
  - "검증된 DB 기반 지원서"는 이미 DOM으로 일치 → 그대로 둠.
  - "모바일 반응형 지원서": phone 노드 **2346:17429**를 3x로 재export(`phone-mobile-form.webp`, 370x482). 카드 높이 580 → **680px**, 임시저장/최종제출 버튼을 디자인 좌표대로 `bottom-[22px] right-[45px]`에 배치하고 **순서도 임시저장 → 최종제출**로 정정.
  - "회원 · 비회원 서류접수": 기존 OG 공유 목업(`phone-og-share.webp`) → 로그인/비회원 지원 흐름 일러스트로 **완전 교체**(노드 **2346:17469**, `member-guest-apply.webp`, 587x543). 카드 높이 680px.
  - 참고: 이 두 phone 프레임은 자식 래스터가 프레임 밖으로 넘치기 때문에 export 크기가 프레임 크기와 다름(370x529 → 370x482, 528x488 → 587x543). 프레임 수치가 아니라 **export 실측 크기**로 배치할 것.
- **가운데 미리보기 세로 스크롤**(`w-[580px]` 안쪽): `overflow-hidden` → `overflow-y-auto overscroll-contain` + 스크롤바 숨김. 7개 카드 전체(scrollHeight 2618px)를 훑어볼 수 있음.
- **사이드바 행 버튼 여백**: `py-[3.667px]` → `py-2`(8px). 행 높이 37.3 → **46px**.
- 행이 커지면서 14개 행이 사이드바 높이(609px)를 넘어감 → 사이드바에도 `overflow-y-auto`를 적용(Figma 원본 노드 2337:13751도 auto)해서 "자기소개서"까지 도달 가능하게 함.

---

## 16. 서류 접수 섹션 세부 조정 (2026-08-31)

- **캡션 이동**: "144개의 다양한 지원서 항목을~"을 목업 아래 → **"자유로운 지원서 설정" 타이틀 바로 아래**(`Hero2ApplicationTitle`)로 옮김.
- **편집기 미리보기 카드 항목 정리**(`Hero2FormBuilderData.ts`):
  - 외국어시험(TOEIC·TEPS): 등급/취득시기/등록번호 삭제 → 언어구분·점수만.
  - 자격증: 발행처/등록번호/증빙서류 삭제 → 취득시기만.
  - 외국어활용 능력: 영어·일본어 박스를 `flex flex-col` → **`grid grid-cols-2`**(가로 2열).
- **"회원 · 비회원" / "모바일 반응형" 카드 높이 축소**:
  - `member-guest-apply.webp`의 아래쪽 빈 여백을 잘라냄(1631 → 1560px). 카드 콘텐츠가 166.6+467.2 = **633.8px**로 딱 맞음.
  - 두 카드 모두 고정 `h-[680px]` 제거 → 그리드 행 높이를 "회원·비회원" 카드가 결정하게 함.
  - **핵심 트릭**: "모바일 반응형" 카드의 폰 스크린샷을 **`h-0` 래퍼 안에 `absolute`**로 넣어 레이아웃 높이에 기여하지 않게 함. 그래야 이 카드가 행 높이를 끌어올리지 않고 옆 카드 높이에 맞춰 늘어나며 폰이 아래에서 잘림.
  - 임시저장/최종제출 버튼은 폰이 아니라 **카드 하단(`bottom-6`)**에 고정(`right: calc(50% - 140px)`로 폰 우측 여백에 정렬) — 폰이 얼마나 잘리든 항상 보이도록.

---

## 17. 전형 운영 탭 인터렉션 (2026-08-31)

### 17-1. 커스텀 대시보드 (`Hero3CustomDashboard.tsx`, Figma node 2348:17516)

- 차트 카드 4종을 신규 노드에서 재export(`chart-*.webp`, 390x275 카드 + 그림자). 새 디자인은 카드 안 "50%/100%/→" 컨트롤을 흰 사각형(Rectangle 249)으로 덮어 지웠고, **카드의 × 제거 버튼도 없어짐** → 기존 `icon-close.svg` 오버레이 삭제.
- 좌측은 항상 `grid-cols-2` 고정, 우측 버튼을 누르면 해당 차트가 빠지거나 다시 추가됨(`AnimatePresence mode="popLayout"` + `layout`으로 재배치 애니메이션).
- **아이콘**: 노출 중이면 `−`, 빠져 있으면 `+`. Figma엔 minus 에셋이 없고 `<img>`는 CSS 색상도 못 받으므로, `icon-plus.svg`와 **동일한 path/stroke(1.4, round)** 를 쓰는 인라인 SVG 컴포넌트(`PlusMinusIcon`)로 만들고 세로줄만 조건부 렌더 + `currentColor` 적용.

### 17-2. 일반/간편 전형 (`Hero3ScreeningToggle.tsx`, Figma node 2320:25550)

- 기존 플랫 스크린샷(`tab-general.webp`) 삭제 → 두 목업을 개별 노드에서 export(`screening-standard.webp` = 2320:25553, `screening-simple.webp` = 2320:25552).
- 좌상단 세그먼트 컨트롤(node 2320:25554)은 실제 DOM. 선택한 쪽이 **앞 슬롯(left 192 / top 55, opacity 1, z 2)** 으로 올라오고, 나머지는 **뒤 슬롯(left 23 / top 78, opacity 0.3, z 1)** 으로 내려감. framer-motion으로 위치·투명도 동시 트랜지션.
- 목업 전체는 `useFitScale(1142)`로 좁은 화면에서 통째 축소.
- **함정**: 이 두 노드는 image fill이 CROP이라 export가 노드 크기(820x~500)가 아니라 원본 래스터 크기(928x~590)로 나옴. 슬롯 좌표는 노드 좌표가 아니라 **export 실측 크기 기준**으로 계산해야 함. 맨 아래 1px에 검은 줄 아티팩트가 있어 잘라냄.

### 17-3. 노드 찾기

- 탭별 목업 노드 ID를 모를 땐 페이지 루트(2230:127)의 `get_metadata`를 파일로 받아 **최상위 프레임 목록만 파싱**해서 이름·좌표로 찾는 게 빠름(전체를 읽으려 하면 380만 자라 불가). 이번엔 y≈9779 줄에서 `전형운영>일반/간편전형`(2320:25550), `마이페이지 발송`(2320:25613), `평가그룹`(2320:25679)을 한 번에 확인함.

---

## 18. 전형 운영 — 나머지 두 탭 인터렉션 + 다듬기 (2026-08-31)

- **커스텀 대시보드 빈 상태**: 카드 4개가 모두 빠지면 그래프 영역 중앙에 `#b8baba` 색 "카드를 추가해 보세요." 표시.
- **일반/간편 전형 박스화**: 대시보드와 동일한 `w-full overflow-hidden rounded-2xl bg-white p-8 shadow-card` 안에 인터렉션을 넣음. 두 스크린샷의 흰 여백은 **이미지 자체를 카드 경계로 크롭**해서 제거(그림자 램프가 255→246으로 떨어졌다가 다시 255로 튀는 지점이 카드 경계 — 검출해서 자름. standard/simple 모두 (108,100)~(1748,1096) → 820x498 @2x). 잘려나간 그림자는 CSS `rounded-xl` + shadow로 대체하고, 슬롯 좌표도 export 기준 → **Figma 노드 좌표(246,101 / 77,116)** 로 정정.
- **마이페이지 발송**(`Hero3MypagePreview.tsx`, node 2320:25613): 우측 4개 메뉴가 좌측 미리보기 팝업을 전환. 프로필 카드·메뉴는 DOM, 팝업 4종은 export.
  - 팝업 매핑은 **내용 기준**: 참석여부 = 2349:17738(참석 여부 선택 UI 포함), 전형 안내 = 2349:17807(발송내용 메일), 수험표 = 2349:17873, 자료제출 = 2349:17632. ⚠️ Figma의 기본 상태는 "전형 안내"가 활성인 채로 17738을 보여주고 있어서 이 부분은 사용자 확인이 필요할 수 있음.
  - export 가장자리에 1~2px 크롭 마크가 찍혀 나와 사방 2px씩 잘라냄.
- **평가 그룹 설정**(`Hero3EvalGroups.tsx`, node 2320:25679): 그룹명 + 평가자 1명 이상 + 대상자 1명 이상이면 [그룹 생성] 활성(날짜·장소는 선택). 생성하면 좌측에 카드 추가, [그룹 삭제]로 제거, 최대 4개이며 초과 시 2.5초짜리 토스트. 카드가 넘치면 좌측 패널이 세로 스크롤.
  - `ChipPicker`: 클릭하면 메뉴가 열리고 고른 항목은 deletable chip이 되며 **메뉴 목록에서 빠짐**(칩을 지우면 다시 목록에 등장). 선택 즉시 메뉴를 닫는데, 열어둔 채로 두면 **바로 아래 입력 필드를 덮어 클릭이 막히기 때문**(Playwright 테스트에서 발견).
- 이제 4개 탭 모두 인터렉티브 → `tab-mypage.webp` / `tab-eval-group.webp` / `tab-general.webp` 정적 이미지 전부 삭제.

---

## 19. 간편전형 이미지가 계속 흐리게 보이던 문제 (2026-08-31)

- 증상: [간편 전형]을 눌러도 이미지가 30%처럼 흐릿함. **CSS는 정상**이었음(실측: opacity 1, z 2, left 246/top 101로 정확히 스왑됨).
- 원인: Figma에서 뒤쪽 레이어인 `간편전형`(node 2320:25552)이 **레이어 opacity 30%** 로 놓여 있어서, 그 노드를 export하면 **30%가 픽셀에 구워진 채**로 나옴(최암부가 0이 아니라 173, 흰 배경 위 30% 합성 결과). 그래서 CSS로 opacity 1을 줘도 원래 흐린 이미지가 흐린 채로 보임.
- 해결: `download_assets`의 **`rawImages`(원본 업로드 래스터, 2100x1281, 최암부 0)** 를 받아 그대로 사용. 노드(820x499.9)와 원본의 종횡비가 같아서(1.639) 크롭 없이 1640x1000으로 리사이즈만 하면 됨.
- **교훈**: export한 이미지가 유독 흐리면 CSS를 의심하기 전에 **픽셀 최소값을 재볼 것**. 0이 아니면 Figma 레이어 opacity가 구워진 것이고, 이때는 export 대신 `rawImages`를 쓰면 됨.

---

## 20. 인트로 스크롤 잠금 해제 + 전형 카드 그림자 수정 (2026-08-31)

- **메인 배너 스크롤 잠금 제거**: 타이핑 인트로 동안 `document.body.style.overflow = 'hidden'`으로 스크롤을 막던 `useEffect`를 통째로 삭제. 이제 인트로가 재생되는 중에도 자유롭게 스크롤 가능(실측: 타이핑 중 `body.style.overflow`가 빈 문자열, 휠 스크롤로 scrollY 1200 이동 확인). 인트로 시퀀스 자체는 그대로 진행됨.
- **일반/간편전형 카드 아래쪽 그림자 깨짐**: CSS 그림자 문제가 아니라 `screening-simple.webp`의 **맨 아래 5~6줄이 새까만 띠**였음(원본 스크린샷 래스터에 들어 있던 검은 가장자리). 그게 카드 하단에 실선처럼 찍혀서 그림자가 깨져 보였음.
  - 해결: raw 소스에서 "행의 절반 이상이 어두우면 잘라내기" 방식으로 검은 띠(6줄)를 제거한 뒤 다시 리사이즈. 두 이미지 모두 1640x996으로 크기도 일치.
  - 확인법: 이미지 하단 몇 줄의 평균값을 찍어보면 바로 드러남(수정 전 0.5~3.2 → 수정 후 248~251).

---

## 작업 전반의 주요 컨벤션

- **`Section` 컴포넌트**: 배경 이미지/오버레이가 있는 섹션은 반드시 `relative isolate`를 가진 `Section`을 사용(네거티브 z-index 스태킹 버그 방지).
- **`Container maxWidth`**: 가로 스크롤 콘텐츠·최상단/하단 배너·태블릿 화면 이미지를 제외한 대부분의 섹션은 `1208px`로 통일.
- **애셋**: Figma에서 다운로드한 실제 이미지/아이콘만 사용(직접 그린 SVG 금지), 100KB 이상 사진성 PNG는 WebP로 압축. 다운로드한 PNG는 항상 PIL로 알파 채널을 확인해 깨진(완전 투명/불투명) 애셋을 걸러냄.
- **애니메이션**: framer-motion `whileInView`(1회, `amount:0.3`) 진입 애니메이션 패턴을 전 섹션에 일관 적용.
- **디자인 토큰**: `src/styles/tokens.css`에 색상/그림자/폰트/애니메이션 keyframe 정의, 관리자 목업처럼 사이트 고유 브랜드와 무관한 일회성 색상은 임의값(arbitrary value) 사용.
- **Figma "특정 레이어만" 추출하기**: 복잡한 관리자 목업 화면 중 일부(사이드바 제외, 특정 패널만 등)만 필요할 땐 전체 프레임을 export한 뒤 수동으로 crop하지 말고, `get_metadata`로 원하는 레이어의 정확한 노드 ID를 먼저 찾아(레이어명으로 grep) 그 ID를 직접 `download_assets`에 전달할 것 — 훨씬 정확하고, 바깥 크롬(둥근 테두리 등)까지 자동으로 제외됨. `get_metadata` 결과가 너무 커서 파일로 저장되면 `grep -oE`로 필요한 노드ID+좌표만 뽑아낼 것(전체를 다 읽으려 하지 말 것).
- **`<button>`의 `cursor` 상속 문제**: 브라우저 UA 기본 스타일이 `<button>`에 `cursor: default`를 강제해서 조상 요소의 커스텀 `cursor`(예: `url(...)`)가 상속되지 않음 → `cursor-[inherit]`(Tailwind arbitrary value)로 명시적으로 상속시킬 것. **`cursor-inherit`(bare utility)는 Tailwind 기본 cursor 스케일에 없는 값이라 아무 효과가 없으므로 반드시 arbitrary value 문법을 쓸 것.**
- **아이콘 hover/active 재색상**: 상태에 따라 색이 바뀌어야 하는 아이콘은 절대 `<img src="...">`(라스터/고정 SVG 참조)로 렌더링하지 말 것 — CSS `color`가 적용되지 않는다. `stroke="currentColor"`로 바꾼 인라인 React SVG 컴포넌트를 만들고 `className`으로 Tailwind `text-*` 색상을 넘길 것(`src/components/sections/Hero1SidebarIcons.tsx` 참고).
- **다단계 mount 시 "밀림" 버그**: 같은 flex 컨테이너 안에서 형제 요소들을 서로 다른 타이밍에 각각 mount하면, 새 요소가 삽입될 때마다 `justify-center` 등이 즉시(애니메이션 없이) 재계산되어 이미 보이던 요소가 순간 이동하는 것처럼 보인다. 여러 요소를 "순차적으로 나타나는 것처럼" 보이게 하려면 **동시에 마운트**하고 각 요소의 framer-motion `transition.delay`만 다르게 줄 것 — 리플로우는 한 번만 일어나고 이후엔 트랜스폼만 애니메이션됨. (framer-motion `layout` prop으로 이 문제를 해결하려 하면 FLIP 스케일 트랜지션이 자식들을 일시적으로 확대/축소시키는 새로운 버그가 생기니 피할 것.)
- **스크롤 연동 크기/트랜스폼**: `useScroll({target: ref, offset:['start end','center center']})` + `useTransform`으로 "요소가 화면에 들어오기 시작할 때 0, 뷰포트 정중앙에 오면 1"이 되는 진행도를 얻고, 이를 `scale`이나 `minHeight` 등에 매핑하는 패턴을 이 세션에서 여러 번 사용(Hero2ApplicationBuilder, Testimonials). `Section`에 `style` prop을 추가해뒀으므로 `as={motion.section}` + `style={{minHeight: motionValue}}` 형태로 섹션 자체에도 적용 가능.
- **QA 절차**: 매 변경 후 `npx tsc -p tsconfig.app.json --noEmit`(주의: 그냥 `npx tsc --noEmit`은 루트 tsconfig가 `files:[]`라 아무 것도 안 함) + `npx oxlint .`를 반드시 실행. 그 다음 `npm install -D playwright --no-save`로 임시 설치해 실제 브라우저에서 수치(색상값, opacity, transform, scrollLeft, 타이밍 등)를 실측 검증하고, 검증이 끝나면 반드시 `npm uninstall playwright --no-save`로 제거(영구 devDependency 아님). 임시 QA 스크립트(`qa-*.mjs`)도 검증 후 전부 삭제.
