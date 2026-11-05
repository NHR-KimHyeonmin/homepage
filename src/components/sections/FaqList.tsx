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
      '네, 가능합니다. 커리어링크 도입 시 온보딩 교육을 진행해 드리며, 관리자뿐만 아니라 평가자를 대상으로 한 맞춤 교육도 함께 제공하고 있습니다.\n화상 미팅으로도 진행 가능하며, 원하시는 시간에 맞춰 일정을 조율해 드리니 부담 없이 이용해 보세요.',
  },
  {
    question: '커리어링크 도입 및 초기 구축 기간은 얼마나 걸리나요?',
    answer:
      '기업별 채용 규모와 운영 방식에 따라 달라질 수 있습니다.\n빠른 오픈이 필요한 경우 전담 매니저가 밀착 지원하여 최단 2~3일 이내 구축 및 오픈이 가능합니다.',
  },
  {
    question: '이용요금은 어떤 기준으로 산정되나요?',
    answer:
      '이용요금은 최종 제출을 완료한 지원자 수를 기준으로 산정되며, 채용 일정에 따라 단건형 또는 연간형으로 이용할 수 있습니다.\n지속적으로 채용을 진행하는 기업에는 더욱 합리적인 연간형 이용을 추천드립니다.',
  },
  {
    question: '구체적인 이용요금은 어디에서 확인할 수 있나요?',
    answer:
      '기업별 예상 지원자 수와 채용 운영 방식에 따라 이용요금이 달라질 수 있습니다.\n상담 또는 미팅을 통해 고객사의 상황에 적합한 맞춤형 견적을 안내해 드립니다.',
  },
  {
    question: 'AI 역량검사 또는 인·적성검사를 진행할 수 있나요?',
    answer:
      '네, 가능합니다. 커리어링크는 우수 인재 선발을 지원하기 위해 AI 역량검사 및 인·적성검사 서비스와 연동되어 있으며, 전형 결과를 시스템에서 편리하게 관리할 수 있습니다.',
  },
  {
    question: '계약금액 외에 추가 비용이 발생하나요?',
    answer:
      '계약기간 내 커리어링크 이용과 운영 지원에 대해서는 계약금액 외 별도의 추가 비용이 발생하지 않습니다.\n다만, AI 역량검사 및 인·적성검사 등 외부 제휴 서비스를 이용하는 경우에는 선택한 상품에 따라 별도 비용이 발생할 수 있습니다.',
  },
]
export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Section className="content-pt section-pb flex flex-col items-center">
      <Container>
        <ul className="flex w-full flex-col">
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
                    className="group flex w-full cursor-pointer items-center gap-3 px-6 py-[18px] text-left"
                  >
                    <h5 className={`flex-1 text-[22px] font-medium leading-[1.4] tracking-[-0.4px] ${isActive ? 'text-title' : 'text-body group-hover:text-title'}`}>
                      <span className="mr-2 text-brand-700">Q.</span>{item.question}
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
                        <p className="whitespace-pre-line px-6 pb-[18px] text-[18px] leading-[1.58] tracking-[-0.32px] text-body">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {index < FAQS.length - 1 && <div className="h-px w-full bg-brand-100" />}
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
