import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import chevronDownActive from '../../assets/sections/text-list-2/chevron-down-active.svg'
import chevronDown from '../../assets/sections/text-list-2/chevron-down.svg'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'ATS(입사지원시스템)을 처음 이용해보는 사람도 사용할 수 있을까요?',
    answer:
      '네, 가능합니다. 커리어링크 도입 시 온보딩 교육을 진행해 드리며, 관리자뿐만 아니라 평가자를 대상으로 한 맞춤 교육도 함께 제공하고 있습니다. 화상 미팅으로도 진행 가능하며, 원하시는 시간에 맞춰 일정을 조율해 드리니 부담 없이 이용해 보세요.',
  },
  {
    question: '커리어링크는 어떤 점이 특별한가요?',
    answer:
      '커리어링크는 채용 전문 기업 NHR에서 제작된 솔루션입니다. 필요하신 경우 NHR 채용 마케팅, 브랜딩, 컨설팅 서비스를 별도로 연계해 한 곳에서 빠르고 원활하게 채용을 준비하실 수 있습니다.',
  },
  {
    question: '인적성 검사를 커리어링크에서 진행할 수 있나요?',
    answer:
      '네, 가능합니다. NHR의 ‘커리어앤’ 등 다양한 인적성 검사 상품과 연동하여 이용하실 수 있습니다. 각 검사 상품은 별도 구매가 필요하며, 구매 후 연동하면 외부 솔루션으로 이동하지 않고 커리어링크 내에서 지원자에게 검사를 요청하고 결과지를 확인하실 수 있습니다.',
  },
  {
    question: '이용 금액과 최소 이용기간이 어떻게 되나요?',
    answer:
      '접수 인원, 이용 기간, 부가 서비스 이용 여부 등에 따라 금액이 다르기 때문에 자세한 금액은 아래 [문의하기]를 통해 연락처를 남겨주시면 빠르게 안내해 드리겠습니다.',
  },
]

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Section className="flex flex-col items-center pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
        <ul className="flex w-full flex-col gap-2">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            const isActive = isOpen

            return (
              <li key={item.question}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
                  className="flex w-full flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-3 p-6 text-left"
                  >
                    <h5 className={`flex-1 text-2xl font-medium leading-none tracking-[-0.4px] ${isActive ? 'text-[#3379f3]' : 'text-black'}`}>
                      Q. {item.question}
                    </h5>
                    <motion.img
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      src={isActive ? chevronDownActive : chevronDown}
                      alt=""
                      className="size-7 shrink-0"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-xl leading-[1.58] tracking-[-0.32px] text-gray-300">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {index < FAQS.length - 1 && <div className="h-px w-full bg-[#eceef2]" />}
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
