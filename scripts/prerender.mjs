/**
 * vite build 뒤에 페이지별 HTML 을 미리 그려 dist 에 쓴다.
 * www.careerlink.kr 은 이 앱을 iframe 으로 감싸므로, 그 부모 페이지(parent-site/index.html)의
 * 메타·구조화 데이터도 여기서 같이 만든다 — 부모 서버에 올리는 건 사람이 한다.
 * AI·검색 크롤러 대부분은 JS 를 실행하지 않아, 이게 없으면 빈 <div id="root"> 만 본다.
 * 브라우저는 main.tsx 의 createRoot 가 이 마크업을 그대로 갈아끼운다.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/** 검색·AI 에 보일 대표 주소(iframe 부모). parent 가 있는 페이지만 이 주소를 쓴다. */
const SITE = 'https://www.careerlink.kr'
/** 실제 앱 주소 — 부모에 없는 페이지(/ci)는 이쪽이 정식 주소다. */
const APP = 'https://homepage-sandy-theta.vercel.app'
const { render, FAQS } = await import('../dist-ssr/entry-server.js')
const template = readFileSync('dist/index.html', 'utf8')

const PAGES = [
  { path: '/', file: 'index.html', parent: 'index.html' },
  {
    path: '/inquiry',
    file: 'inquiry.html',
    parent: 'inquiry/index.html',
    title: '도입 문의 - 커리어링크',
    description: '커리어링크 도입을 문의하세요. 기업 채용 규모와 운영 방식에 맞춘 상담과 맞춤 견적을 안내해 드립니다.',
  },
  {
    path: '/ci',
    file: 'ci.html',
    title: '커리어링크 CI',
    description: '커리어링크 로고와 브랜드 컬러 등 CI 가이드와 다운로드.',
  },
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
}
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const page of PAGES) {
  let html = template.replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`)
  const url = (page.parent ? SITE : APP) + page.path
  html = html.replace(/(rel="canonical" href=")[^"]*/, `$1${url}`).replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
  if (page.title) {
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
      .replace(/(property="og:title" content=")[^"]*/, `$1${attr(page.title)}`)
  }
  if (page.description) {
    html = html.replace(/(name="description" content=")[^"]*/, `$1${attr(page.description)}`).replace(/(property="og:description" content=")[^"]*/, `$1${attr(page.description)}`)
  }
  // FAQ 답변은 접힌 상태라 본문 HTML 엔 없다 — 구조화 데이터로 전부 넣는다.
  if (page.path === '/') html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n</head>`)
  writeFileSync(`dist/${page.file}`, html)
  console.log(`prerendered ${page.path} → dist/${page.file}`)
  if (page.parent) writeParent(html, page)
}

/** 그 페이지의 <head> 에서 메타·구조화 데이터만 남기고 앱을 iframe 으로 띄우는 부모 페이지. */
function writeParent(html, page) {
  const head = html
    .split('<head>')[1]
    .split('</head>')[0]
    .replace(/\s*<script type="module"[^>]*><\/script>/g, '')
    .replace(/\s*<link rel="(modulepreload|stylesheet)"[^>]*>/g, '')
    .replace(/(rel="icon"[^>]*href=")\//, `$1${APP}/`)
  const out = `parent-site/${page.parent}`
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(
    out,
    `<!doctype html>
<html lang="ko">
<head>${head.trimEnd()}
  <style>html,body{margin:0;height:100%;overflow:hidden}iframe{display:block;width:100%;height:100%;border:0}</style>
</head>
<body>
  <!-- 실제 화면은 Vercel 앱. 위 <head> 의 메타·구조화 데이터가 이 주소(www.careerlink.kr)의 검색·AI 노출을 맡는다.
       scripts/prerender.mjs 가 만든 파일 — 직접 고치지 말고 앱을 빌드해 다시 만든다. -->
  <iframe src="${APP}${page.path}" title="${page.title ?? '커리어링크 - 채용 ATS'}"></iframe>
</body>
</html>
`,
  )
  console.log(`wrote ${out}`)
}
rmSync('dist-ssr', { recursive: true, force: true })
