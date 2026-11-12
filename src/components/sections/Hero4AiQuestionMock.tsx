import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { IconBriefcase, IconCopy, IconMail, IconNote, IconPhone, IconRefresh, IconSparklesFilled, IconX } from '@tabler/icons-react'
import photo from '../../assets/sections/hero4-cards/photo-yoonseo.webp'
import { useFitScale } from '../../hooks/useFitScale'
import { Block, Labeled, SummaryChart } from './Hero4BlindMock'
import { StagePointer, type Point } from './Hero4MemoMock'

/** 설계 좌표. 다른 평가 도구 연출과 같은 크기의 창이다. */
const DESIGN_WIDTH = 684
const DESIGN_HEIGHT = 448

const STROKE = 1.8

const QUESTIONS = [
  '[창의성] 최근에 작업한 디자인 프로젝트 중 가장 창의적이라고 생각하는 부분을 설명해 주세요.',
  '[협업 능력] 팀원과의 협업에서 발생한 갈등 상황과 그 해결 과정을 이야기해 주세요.',
  '[타겟 분석] 특정 타겟 고객을 위한 디자인을 기획한 경험이 있다면, 그 과정을 설명해 주세요.',
  '[사용자 경험] 사용자의 피드백을 반영하여 디자인을 개선한 사례를 소개해 주세요.',
  '[프로젝트 관리] 여러 프로젝트를 동시에 진행할 때 우선순위를 어떻게 정했는지 이야기해 주세요.',
  '[트렌드 이해] 최근 디자인 트렌드 중 하나를 골라, 프로젝트에 어떻게 적용할 수 있을지 설명해 주세요.',
]

interface Scene {
  cursor: 'start' | 'ai'
  cursorShown: boolean
  down: boolean
  popup: boolean
  /** 팝업에 채워진 질문 수. */
  filled: number
}

const FIRST: Scene = { cursor: 'start', cursorShown: true, down: false, popup: false, filled: 0 }

/** [이 장면을 머무는 시간(ms), 앞 장면에서 바뀌는 것] */
const STEPS: [number, Partial<Scene>][] = [
  [400, {}],
  [750, { cursor: 'ai' }],
  [260, { down: true }],
  [450, { down: false, cursorShown: false, popup: true }],
  ...QUESTIONS.map((_, i): [number, Partial<Scene>] => [i === QUESTIONS.length - 1 ? 3200 : 480, { filled: i + 1 }]),
]

const SCENES = STEPS.reduce<Scene[]>((scenes, [, patch]) => {
  scenes.push({ ...(scenes.at(-1) ?? FIRST), ...patch })
  return scenes
}, [])

/**
 * "AI 직무 질문" 의 그림 자리를 대신하는 연출. 지원서 화면의 AI 버튼을 누르면
 * 팝업이 뜨고 면접 질문이 한 줄씩 채워진다.
 */
export function Hero4AiQuestionMock() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const scene = SCENES[step]

  const stageRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLSpanElement>(null)
  const [aiPoint, setAiPoint] = useState<Point | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    const ai = aiRef.current
    if (!stage || !ai) return
    const measure = () => {
      const base = stage.getBoundingClientRect()
      const k = base.width / DESIGN_WIDTH
      if (!k) return
      const r = ai.getBoundingClientRect()
      setAiPoint({ x: (r.left + r.width / 2 - base.left) / k, y: (r.top + r.height / 2 - base.top) / k })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setStep((s) => (s + 1) % SCENES.length), STEPS[step][0])
    return () => clearTimeout(timer)
  }, [inView, step])

  const cursor = scene.cursor === 'ai' ? aiPoint : { x: 360, y: 250 }

  return (
    <div
      ref={ref}
      role="img"
      aria-label="지원서 화면의 AI 버튼을 누르면 팝업에 직무 면접 질문이 채워지는 화면"
      className="w-full"
      style={{ height: DESIGN_HEIGHT * scale }}
    >
      <div
        ref={stageRef}
        className="relative font-sans"
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="absolute inset-0 flex flex-col gap-2.5 overflow-hidden rounded-[12px] bg-white p-3 shadow-[0_12px_32px_-12px_rgba(13,82,140,0.22)]">
          <Block title="지원정보">
            <Labeled label="지원 직무">커리어링크 기획 &gt; 디자인</Labeled>
          </Block>

          <div className="shrink-0 overflow-hidden rounded-[8px] border border-[#e8eaed] bg-white">
            <div className="flex h-[112px] items-center bg-[#eef0f3] pl-4 pr-3">
              <p className="w-[250px] shrink-0 text-[18px] font-medium text-ink">김윤서 (여)</p>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-1.5 text-[13px] text-ink">
                {[
                  [IconPhone, '+82)010-9999-0000'],
                  [IconMail, 'kimyunseo@careerlink.kr'],
                  [IconBriefcase, '2000.03.02 (만 26세)'],
                ].map(([Icon, text]) => (
                  <p key={text as string} className="flex h-[26px] items-center gap-2">
                    <Icon size={15} stroke={STROKE} className="shrink-0 text-[#4d5761]" />
                    {text as string}
                  </p>
                ))}
              </div>
              <img src={photo} alt="" className="h-[96px] w-[74px] shrink-0 rounded-[6px] object-cover" />
            </div>
            <Labeled label="주소">(07727) 서울 강서구 까치산로 23 (화곡동, NHR타워), 301동 2001호</Labeled>
          </div>

          <SummaryChart />
        </div>

        {/* 지원서 우측 하단의 도구 버튼 */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 text-[#0042b7]">
          <span
            ref={aiRef}
            className={`flex size-[40px] items-center justify-center rounded-[8px] border bg-[#eef2fd] ${
              scene.popup ? 'border-[#0042b7]' : 'border-[#c9d3ee]'
            }`}
          >
            <IconSparklesFilled size={21} />
          </span>
          <span className="flex size-[40px] items-center justify-center rounded-[8px] border border-[#c9d3ee] bg-[#eef2fd]">
            <IconNote size={21} stroke={STROKE} />
          </span>
        </div>

        <AnimatePresence>
          {scene.popup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom right' }}
              className="absolute bottom-4 right-[66px] top-4 z-10 flex w-[372px] flex-col overflow-hidden rounded-[10px] border border-[#e1e4e8] bg-white shadow-[0_14px_36px_-10px_rgba(13,82,140,0.38)]"
            >
              <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-[#eceef0] px-3.5 text-[#0042b7]">
                <IconSparklesFilled size={17} />
                <span className="text-[14px] font-semibold text-ink">AI 질문 생성</span>
                <IconX size={16} stroke={STROKE} className="ml-auto text-[#4d5761]" />
              </div>

              <ol className="flex min-h-0 flex-1 flex-col gap-2 px-3.5 py-3 text-[12.5px] leading-[1.45] text-ink">
                {QUESTIONS.slice(0, scene.filled).map((question, i) => (
                  <motion.li
                    key={question}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex gap-1"
                  >
                    <span className="shrink-0">{i + 1}.</span>
                    {question}
                  </motion.li>
                ))}
              </ol>

              <div className="flex h-9 shrink-0 items-center gap-2.5 border-t border-[#eceef0] px-3.5 text-[#6c737f]">
                <IconRefresh size={15} stroke={STROKE} />
                <IconCopy size={15} stroke={STROKE} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {cursor && <StagePointer point={cursor} move={scene.cursor === 'start' ? 0 : 700} shown={scene.cursorShown} down={scene.down} />}
      </div>
    </div>
  )
}
