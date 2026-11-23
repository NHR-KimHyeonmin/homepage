/**
 * 빌드 때만 쓰는 서버 렌더 진입점 — scripts/prerender.mjs 가 페이지별 HTML 을 미리 그려
 * JS 를 실행하지 않는 AI·검색 크롤러도 본문을 읽게 한다. 브라우저는 여전히 main.tsx 로 그린다.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { CiPage } from './pages/CiPage'
import { InquiryPage } from './pages/InquiryPage'

export { FAQS } from './components/sections/FaqList'

export function render(path: string) {
  return renderToString(<StrictMode>{path === '/ci' ? <CiPage /> : path === '/inquiry' ? <InquiryPage /> : <App />}</StrictMode>)
}
