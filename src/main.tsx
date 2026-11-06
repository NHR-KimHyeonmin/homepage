import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CiPage } from './pages/CiPage'

// 페이지가 둘뿐이라 라우터 대신 경로만 본다.
const isCi = window.location.pathname.replace(/\/+$/, '') === '/ci'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCi ? <CiPage /> : <App />}
  </StrictMode>,
)
