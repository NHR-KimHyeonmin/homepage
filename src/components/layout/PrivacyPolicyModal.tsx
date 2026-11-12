import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import policy20260821 from '../../assets/privacy/privacy-2026-08-21.webp'
import { Dropdown } from '../ui/Dropdown'

/**
 * 개인정보 처리방침 판. 방침이 바뀌면 맨 위에 새 판을 넣고, 이전 판의 label 에서
 * [현행] 을 뗀다. 드롭다운으로 지난 판도 그대로 볼 수 있다.
 */
const VERSIONS = [{ label: '[현행] 2026년 08월 21일 시행안', image: policy20260821 }]

/**
 * 푸터의 "개인정보처리방침" 을 누르면 뜨는 창. 방침 원문은 법무 검토를 거친
 * 그림 한 장이라 그대로 띄운다.
 */
export function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  const [version, setVersion] = useState(VERSIONS[0].label)
  const current = VERSIONS.find((item) => item.label === version) ?? VERSIONS[0]

  // 떠 있는 동안 뒤 페이지는 스크롤되지 않게 하고, Esc 로 닫는다.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10263a]/50 p-4 backdrop-blur-[2px] md:p-8"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full max-h-[92vh] w-full max-w-[960px] flex-col overflow-hidden rounded-card bg-white shadow-float"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#eceff3] px-5 py-4 md:px-6">
          <h2 id="privacy-title" className="text-[18px] font-bold text-title md:text-[20px]">
            개인정보 처리방침
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            autoFocus
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-sub transition-colors hover:bg-[#f1f3f5] hover:text-title"
          >
            <IconX size={22} stroke={1.8} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
          <Dropdown
            options={VERSIONS.map((item) => item.label)}
            value={version}
            onChange={setVersion}
            label="개인정보 처리방침 시행일 선택"
            buttonClassName="h-11 w-full rounded-ui border border-[#d6dade] bg-white px-4 text-[15px] text-title outline-none transition-colors hover:border-[#b8c2cc] focus:border-primary"
            className="w-full sm:w-[300px]"
          />
          <img
            src={current.image}
            alt={`주식회사 엔에이치알 개인정보 처리방침 (${current.label.replace('[현행] ', '')})`}
            decoding="async"
            className="mx-auto mt-5 w-full max-w-[860px]"
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
