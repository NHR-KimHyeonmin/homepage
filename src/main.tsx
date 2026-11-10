import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CiPage } from './pages/CiPage'

// 페이지가 둘뿐이라 라우터 대신 경로만 본다.
const isCi = window.location.pathname.replace(/\/+$/, '') === '/ci'

// iOS Safari 는 터치 리스너가 하나도 없으면 :active 를 켜지 않는다 — 누르는 동안의 카드 효과를 위해 빈 리스너를 단다.
document.addEventListener('touchstart', () => {}, { passive: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCi ? <CiPage /> : <App />}
  </StrictMode>,
)
