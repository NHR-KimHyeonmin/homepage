/**
 * vite build 뒤에 페이지별 HTML 을 미리 그려 dist 에 쓴다.
 * AI·검색 크롤러 대부분은 JS 를 실행하지 않아, 이게 없으면 빈 <div id="root"> 만 본다.
 * 브라우저는 main.tsx 의 createRoot 가 이 마크업을 그대로 갈아끼운다.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const SITE = 'https://www.careerlink.kr'
const { render, FAQS } = await import('../dist-ssr/entry-server.js')
const template = readFileSync('dist/index.html', 'utf8')

const PAGES = [
  { path: '/', file: 'index.html' },
  {
    path: '/inquiry',
    file: 'inquiry.html',
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
  const url = SITE + page.path
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
}
rmSync('dist-ssr', { recursive: true, force: true })
