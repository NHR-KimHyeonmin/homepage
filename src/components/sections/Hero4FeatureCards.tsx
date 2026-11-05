import { useState, type ComponentType } from 'react'
import {
  IconArrowAutofitHeight,
  IconColumns,
  IconEyeOff,
  IconFileSearch,
  IconFilter,
  IconHighlight,
  IconLayersIntersect,
  IconListCheck,
  IconMessageQuestion,
  IconNote,
  IconPlusMinus,
  IconPrinterOff,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hero4AiQuestionMock } from './Hero4AiQuestionMock'
import { Hero4AutoEvalMock } from './Hero4AutoEvalMock'
import { Hero4BlindMock } from './Hero4BlindMock'
import { Hero4CompareView } from './Hero4CompareView'
import { Hero4MemoMock } from './Hero4MemoMock'
import { Container } from '../ui/Container'
import { PillSwitch } from '../ui/PillSwitch'
import { Section } from '../ui/Section'

type CardId = 'autoEval' | 'compare' | 'memo' | 'blind' | 'aiQuestion'

const CARDS: {
  id: CardId
  /** 스위치에 적히는 짧은 이름. 네 칸이 한 줄에 서야 해서 제목보다 짧다. */
  label: string
  title: string
  description: string
  /** 본문 아래에 접었다 펴는 하위 항목. 지금은 자동평가만 가진다. */
  details?: { title: string; body: string; Icon: ComponentType<{ size?: number; stroke?: number; className?: string }> }[]
}[] = [
  {
    id: 'autoEval',
    label: '자동평가',
    title: '자동평가',
    description:
      '채용에 필요한 항목을 기준과 배점으로 설정해\n지원자를 정량적으로 평가합니다.',
    details: [
      {
        title: '필터형',
        body: '특정 조건을 모두 만족하는 지원자를 선별하여 PASS, FAIL을 부여합니다.',
        Icon: IconFilter,
      },
      {
        title: '가산점형',
        body: '조건에 부합할 경우 가산점 또는 감산점을 부여합니다.',
        Icon: IconPlusMinus,
      },
      {
        title: '복합형',
        body: '지원자에게 PASS/FAIL과 가산점/감산점을 모두 적용합니다.',
        Icon: IconLayersIntersect,
      },
    ],
  },
  {
    id: 'compare',
    label: '지원자 비교',
    title: '지원자 비교',
    description: '여러 지원자의 지원서를 나란히 놓고\n동시평가를 진행할 수 있습니다.',
    details: [
      {
        title: '비교 인원 조절',
        body: '최대 4명까지 동시에 지원서를 조회할 수 있습니다.',
        Icon: IconColumns,
      },
      {
        title: '전체 스크롤',
        body: '지원서를 함께 스크롤하며 같은 항목을 나란히 확인합니다.',
        Icon: IconArrowAutofitHeight,
      },
    ],
  },
  {
    id: 'memo',
    label: '메모·형광펜',
    title: '메모·형광펜',
    description: '검토 내용을 지원서 위에 바로 남기고\n다음 평가 단계에서 다시 확인합니다.',
    details: [
      {
        title: '메모',
        body: '지원자에 대한 판단이나 확인할 사항을 메모로 남깁니다.',
        Icon: IconNote,
      },
      {
        title: '형광펜',
        body: '지원서를 검토하며 중요한 내용을 형광펜으로 표시합니다.',
        Icon: IconHighlight,
      },
    ],
  },
  {
    id: 'blind',
    label: '평가 미노출',
    title: '평가 미노출',
    description: '지원서 내 특정 정보를 평가자 화면과\n출력물에 보이지 않도록 설정합니다.',
    details: [
      {
        title: '평가자 미노출',
        body: '평가에 불필요한 정보를 평가자 화면에 보이지 않게 합니다.',
        Icon: IconEyeOff,
      },
      {
        title: '출력 미노출',
        body: '지원서를 출력할 때 지정한 정보가 나오지 않게 합니다.',
        Icon: IconPrinterOff,
      },
    ],
  },
  {
    id: 'aiQuestion',
    label: 'AI 직무 질문',
    title: 'AI 직무 질문 생성',
    description: 'AI가 지원 직무와 이력서를 분석해\n직무 적합성 확인 질문을 생성합니다.',
    details: [
      {
        title: '지원서 분석',
        body: '지원 직무와 이력서 속 경력·기술·프로젝트 정보를 분석합니다.',
        Icon: IconFileSearch,
      },
      {
        title: '면접 질문 생성',
        body: '직무 적합성을 확인할 수 있는 면접 질문을 생성합니다.',
        Icon: IconMessageQuestion,
      },
      {
        title: '체계적인 인터뷰',
        body: '직무별 핵심 역량에 맞춘 질문으로 인터뷰를 진행합니다.',
        Icon: IconListCheck,
      },
    ],
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
 * 오른쪽 칸은 탭마다 움직이는 목업이 들어간다.
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
        <PillSwitch
          items={CARDS}
          value={active}
          onChange={setActive}
          label="평가 기능 선택"
          className="mt-9 mb-10 md:mt-12 md:mb-14"
        />

        <div className="flex w-full flex-col gap-10 md:flex-row md:items-stretch md:gap-10">
          {/* 글은 한 뭉치로 묶어 그림 높이의 한가운데 세운다. 위아래로 갈라
              붙여 봤더니(justify-between) 이 구역은 제목이 짧아 가운데가
              통째로 빈 구멍이 됐다 — 레퍼런스들도 글 덩어리는 뭉쳐 두고
              그림만 크게 쓴다. */}
          <div className="flex min-w-0 flex-1 flex-col md:justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex flex-col"
              >
                <div>
                  <h4 className="text-[15px] font-bold leading-[1.5] tracking-[-0.09px] text-[#3379f3]">{card.title}</h4>
                  <p className="whitespace-pre-line pt-4 text-[24px] font-semibold leading-[1.55] tracking-[-0.12px] text-[#212121]">{card.description}</p>
                </div>

                {card.details && (
                  <div className="flex flex-col gap-5 pt-[60px]">
                    {card.details.map((detail) => (
                      <div key={detail.title}>
                        <h5 className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.09px] text-gray-300">
                          <detail.Icon size={18} stroke={1.8} className="shrink-0" />
                          {detail.title}
                        </h5>
                        <p className="pt-1.5 text-[16px] leading-[1.55] tracking-[-0.08px] text-black/55">
                          {detail.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-media md:aspect-[716/544] md:w-[59%] md:shrink-0"
            style={{
              boxShadow: '0 18px 48px -14px rgba(32,40,45,0.22)',
              // 흰 판 위에 흰 목업을 올리면 경계가 사라져 그림이 아니라 글의
              // 일부처럼 보인다. 구역 색(#f4f8ff)과 같은 계열로 옅게 깔아
              // 목업이 그 위에 떠 있게 한다.
              backgroundImage: 'linear-gradient(135deg, #eaf0f9 0%, #f7f9fc 52%, #e7eef8 100%)',
            }}>
            {/* 탭을 고를 때마다 새로 붙어 연출이 처음부터 돈다. */}
            <div className="absolute inset-0 flex items-center justify-center p-4 md:px-8">
              {active === 'autoEval' && <Hero4AutoEvalMock />}
              {active === 'compare' && <Hero4CompareView />}
              {active === 'memo' && <Hero4MemoMock />}
              {active === 'blind' && <Hero4BlindMock />}
              {active === 'aiQuestion' && <Hero4AiQuestionMock />}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
