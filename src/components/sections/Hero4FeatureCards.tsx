import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import cardAutoEval from '../../assets/sections/hero4-cards/card1-auto-eval.webp'
import cardBlind from '../../assets/sections/hero4-cards/card3-blind.webp'
import cardMemoHighlight from '../../assets/sections/hero4-cards/card2-memo-highlight.webp'
import cardAiQuestion from '../../assets/sections/hero4-cards/card5-ai-question.webp'
import { Container } from '../ui/Container'
import { PillSwitch } from '../ui/PillSwitch'
import { Section } from '../ui/Section'

type CardId = 'autoEval' | 'memo' | 'blind' | 'aiQuestion'

const CARDS: {
  id: CardId
  /** 스위치에 적히는 짧은 이름. 네 칸이 한 줄에 서야 해서 제목보다 짧다. */
  label: string
  title: string
  description: string
  image: string
}[] = [
  {
    id: 'autoEval',
    label: '자동평가',
    title: '자동평가',
    description:
      '경력, 보유 스킬, 자격증, 학력, 근무 가능 조건 등 채용에 필요한 항목을 기준과 배점으로 설정해 지원자를 정량적으로 평가합니다. 사전에 설정한 조건을 기반으로 모든 지원서를 빠짐없이 확인해, 검토 누락 가능성을 낮춥니다.',
    image: cardAutoEval,
  },
  {
    id: 'memo',
    label: '메모·하이라이트',
    title: '메모·하이라이트',
    description:
      '지원서를 검토하며 중요한 내용은 하이라이트로 표시하고, 지원자에 대한 판단이나 확인할 사항은 메모로 남겨 보세요. 면접과 평가 단계에서 검토 내용을 다시 빠르게 확인하며, 더 일관된 판단을 내릴 수 있습니다.',
    image: cardMemoHighlight,
  },
  {
    id: 'blind',
    label: '블라인드·비공개 설정',
    title: '블라인드·평가자 비공개 설정',
    description:
      '공공기관 채용의 공정성과 블라인드 채용 원칙에 맞춰, 지원서 내 특정 정보를 평가자에게 보이지 않도록 설정할 수 있습니다. 평가에 불필요한 개인정보를 최소화하고, 지원자의 역량과 경험에 집중하는 채용을 지원합니다.',
    image: cardBlind,
  },
  {
    id: 'aiQuestion',
    label: 'AI 직무 질문 설정',
    title: 'AI 직무 질문 생성',
    description:
      'AI가 지원자의 지원 직무와 이력서 속 경력·기술·프로젝트 정보를 분석해, 직무 적합성을 확인할 수 있는 면접 질문을 생성합니다. 직무별 핵심 역량에 맞춘 질문으로 보다 체계적인 인터뷰를 진행할 수 있습니다.',
    image: cardAiQuestion,
  },
]

/**
 * 제목·본문을 가운데 세우고, 그 아래 알약 스위치로 네 기능을 고른다. 고른
 * 기능의 설명은 왼쪽, 그림은 오른쪽이다.
 *
 * 전에는 왼쪽 그림 + 오른쪽 아코디언이었다. 네 줄이 늘 펼쳐져 있어 어느
 * 것부터 읽을지가 안 정해졌고, 제목 네 개가 세로로 쌓이면서 그림이 설명에
 * 딸린 삽화처럼 보였다. 스위치로 올리면 고르는 자리가 한 줄로 모이고,
 * 아래 두 칸은 "고른 하나" 만 보여 주면 된다.
 *
 * 왼쪽 글과 오른쪽 그림은 아래를 맞춘다(md:items-end). 글이 그림보다 훨씬
 * 짧아서 위를 맞추면 왼쪽 아래가 통째로 비는데, 아래를 맞추면 두 칸이 같은
 * 바닥에 서서 한 덩어리로 읽힌다.
 *
 * 그림은 네 장을 겹쳐 두고 투명도만 바꾼다 — 고른 순간 바로 떠야 하는데,
 * 그때 받아 오기 시작하면 빈 칸이 한 번 보인다.
 */
export function Hero4FeatureCards() {
  const [active, setActive] = useState<CardId>('autoEval')
  const card = CARDS.find((item) => item.id === active) ?? CARDS[0]

  return (
    <Section className="bg-gradient-to-b from-white from-60% to-surface-blue pb-28 pt-16 md:pb-[220px] md:pt-32">
      <Container className="flex flex-col items-center">
        <h3 className="text-center text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[48px]">
          <span className="block">지원서를 읽는 일만</span>
          <span className="block">남기는 평가 도구</span>
        </h3>
        <p className="max-w-[720px] pt-5 text-center text-[20px] font-medium leading-[1.45] tracking-[-0.1px] text-black/55">
          기준을 세워 걸러내고, 읽은 흔적을 남기고, 볼 것과 가릴 것을 정합니다.
        </p>

        <PillSwitch
          items={CARDS}
          value={active}
          onChange={setActive}
          label="평가 기능 선택"
          className="mt-9 mb-10 md:mt-12 md:mb-14"
        />

        <div className="flex w-full flex-col gap-10 md:flex-row md:items-end md:gap-12">
          {/* 글은 그림보다 먼저 멈춰야 읽힌다 — 바뀔 때 한 번 흐려졌다
              올라온다. 높이를 비워 두면 줄 수가 다른 설명끼리 오갈 때
              그림 바닥도 같이 들썩이므로, 아래 맞춤은 행이 맡는다. */}
          <div className="flex min-w-0 flex-1 flex-col md:pb-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <h4 className="text-[28px] font-bold leading-[1.35] tracking-[-0.56px] text-ink">{card.title}</h4>
                <p className="pt-4 text-[18px] leading-[1.55] tracking-[-0.08px] text-black/55">{card.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative aspect-[952/580] w-full overflow-hidden rounded-media md:w-[64%] md:shrink-0">
            {CARDS.map((item) => (
              <img
                key={item.id}
                loading={item.id === 'autoEval' ? 'eager' : 'lazy'}
                decoding="async"
                src={item.image}
                alt={item.id === active ? item.title : ''}
                aria-hidden={item.id !== active}
                className={clsx(
                  'absolute inset-0 size-full object-cover transition-opacity duration-500',
                  item.id === active ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
