import { useState } from 'react'
import clsx from 'clsx'
import cardAutoEval from '../../assets/sections/hero4-cards/card1-auto-eval.webp'
import cardBlind from '../../assets/sections/hero4-cards/card3-blind.webp'
import cardMemoHighlight from '../../assets/sections/hero4-cards/card2-memo-highlight.webp'
import cardAiQuestion from '../../assets/sections/hero4-cards/card5-ai-question.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

const CARDS = [
  {
    image: cardAutoEval,
    title: '자동평가',
    description:
      '경력, 보유 스킬, 자격증, 학력, 근무 가능 조건 등 채용에 필요한 항목을 기준과 배점으로 설정해 지원자를 정량적으로 평가합니다. 사전에 설정한 조건을 기반으로 모든 지원서를 빠짐없이 확인해, 검토 누락 가능성을 낮춥니다.',
  },
  {
    image: cardMemoHighlight,
    title: '메모·하이라이트',
    description:
      '지원서를 검토하며 중요한 내용은 하이라이트로 표시하고, 지원자에 대한 판단이나 확인할 사항은 메모로 남겨 보세요. 면접과 평가 단계에서 검토 내용을 다시 빠르게 확인하며, 더 일관된 판단을 내릴 수 있습니다.',
  },
  {
    image: cardBlind,
    title: '블라인드·평가자 비공개 설정',
    description:
      '공공기관 채용의 공정성과 블라인드 채용 원칙에 맞춰, 지원서 내 특정 정보를 평가자에게 보이지 않도록 설정할 수 있습니다. 평가에 불필요한 개인정보를 최소화하고, 지원자의 역량과 경험에 집중하는 채용을 지원합니다.',
  },
  {
    image: cardAiQuestion,
    title: 'AI직무 질문 생성',
    description:
      'AI가 지원자의 지원 직무와 이력서 속 경력·기술·프로젝트 정보를 분석해, 직무 적합성을 확인할 수 있는 면접 질문을 생성합니다. 직무별 핵심 역량에 맞춘 질문으로 보다 체계적인 인터뷰를 진행할 수 있습니다.',
  },
]

/**
 * 왼쪽 그림 한 장, 오른쪽 제목 목록. 제목을 누르면 그 기능의 그림으로
 * 바뀌고 설명이 그 자리에서 펼쳐진다.
 *
 * 다섯 줄을 모두 펼쳐 두면 설명 글이 다섯 덩이라 어느 것도 안 읽힌다.
 * 제목만 세워 두면 다섯 가지가 있다는 건 한눈에 들어오고, 읽을 하나만
 * 열린다. 그림이 같이 바뀌니 "지금 보는 게 이것" 이라는 게 글 없이 맞는다.
 *
 * 그림은 다섯 장을 겹쳐 두고 투명도만 바꾼다 — 고른 순간 바로 떠야 하는데,
 * 그때 받아 오기 시작하면 빈 칸이 한 번 보인다.
 */
export function Hero4FeatureCards() {
  const [active, setActive] = useState(0)

  return (
    <Section className="bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="relative aspect-[952/580] w-full overflow-hidden rounded-media md:w-[56%] md:shrink-0">
          {CARDS.map((card, index) => (
            <img
              key={card.title}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              src={card.image}
              alt={index === active ? card.title : ''}
              aria-hidden={index !== active}
              className={clsx(
                'absolute inset-0 size-full object-cover transition-opacity duration-500',
                index === active ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {CARDS.map((card, index) => {
            const isOpen = index === active
            return (
              <div key={card.title} className="border-t border-black/10 last:border-b">
                <h5>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-expanded={isOpen}
                    aria-controls={`eval-feature-${index}`}
                    className={clsx(
                      'w-full cursor-pointer py-5 text-left text-[24px] font-bold leading-[1.3] tracking-[-0.48px] transition-colors',
                      isOpen ? 'text-ink' : 'text-black/35 hover:text-black/60',
                    )}
                  >
                    {card.title}
                  </button>
                </h5>
                {/* 0fr → 1fr. 글 높이를 재서 px 로 넣지 않아도 브라우저가
                    펴 준다 — 줄 수가 달라져도 손댈 데가 없다. */}
                <div
                  id={`eval-feature-${index}`}
                  className={clsx(
                    'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-[18px] leading-[1.45] tracking-[-0.08px] text-black/55">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
