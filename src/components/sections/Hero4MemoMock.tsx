import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  IconBold,
  IconClearFormatting,
  IconHighlight,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMinus,
  IconNote,
  IconPlus,
  IconTextColor,
  IconTrash,
  IconUnderline,
  IconX,
} from '@tabler/icons-react'
import { useFitScale } from '../../hooks/useFitScale'

/** 설계 좌표. 자동평가 연출(Hero4AutoEvalMock)과 같은 크기의 창이다. */
const DESIGN_WIDTH = 684
const DESIGN_HEIGHT = 448

const STROKE = 1.8
const PURPLE = '#e2d4fa'
const SWATCHES = ['#fbd0e6', '#fbc9b4', '#fde08a', '#d3eda0', '#c7e7fb', PURPLE]

type Target = 'start' | 'yellowStart' | 'yellowEnd' | 'blueStart' | 'blueEnd' | 'purple' | 'memo'
export type Point = { x: number; y: number }

interface Scene {
  cursor: Target
  /** 커서가 다음 자리로 가는 시간(ms). 긋는 동안은 형광펜과 같은 속도로 간다. */
  move: number
  drawing: boolean
  cursorShown: boolean
  down: boolean
  yellow: boolean
  blue: boolean
  purple: boolean
  palette: boolean
  memo: boolean
}

const FIRST: Scene = {
  cursor: 'start',
  move: 0,
  drawing: false,
  cursorShown: true,
  down: false,
  yellow: false,
  blue: false,
  purple: false,
  palette: false,
  memo: false,
}

const DRAW_MS = 950

/** [이 장면을 머무는 시간(ms), 앞 장면에서 바뀌는 것] */
const STEPS: [number, Partial<Scene>][] = [
  [900, {}],
  [650, { cursor: 'yellowStart', move: 600 }],
  [120, { down: true }],
  [DRAW_MS, { yellow: true, cursor: 'yellowEnd', move: DRAW_MS, drawing: true }],
  [320, { down: false, drawing: false, move: 600 }],
  [650, { cursor: 'blueStart' }],
  [120, { down: true }],
  [DRAW_MS, { blue: true, cursor: 'blueEnd', move: DRAW_MS, drawing: true }],
  // "수단" 끝에서 멈췄다가 보라색 칸으로 가서 누르고, 포인터와 도구가 사라진다.
  [800, { down: false, drawing: false, move: 280, palette: true }],
  [520, { cursor: 'purple' }],
  [300, { down: true }],
  [550, { down: false, purple: true }],
  [350, { palette: false, cursorShown: false }],
  // 보이지 않는 동안 메모 버튼으로 옮겼다가 다시 나타나 누른다.
  [450, { cursor: 'memo', move: 0 }],
  [450, { cursorShown: true }],
  [260, { down: true }],
  [3800, { down: false, cursorShown: false, memo: true }],
]

const SCENES = STEPS.reduce<Scene[]>((scenes, [, patch]) => {
  scenes.push({ ...(scenes.at(-1) ?? FIRST), ...patch })
  return scenes
}, [])

/**
 * 왼쪽에서 오른쪽으로 그어지는 형광펜. 칠을 글자색이 아니라 배경 크기로 늘려서
 * 글자 자리는 움직이지 않는다. 지울 때는 되감기지 않고 바로 사라진다.
 */
function Marker({
  on,
  color,
  recolor,
  spanRef,
  children,
}: {
  on: boolean
  color: string
  /** 있으면 칠해 둔 색이 이 색으로 바로 바뀐다. */
  recolor?: string
  spanRef: React.Ref<HTMLSpanElement>
  children: ReactNode
}) {
  const paint = recolor ?? color
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${paint}, ${paint})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: on ? '100% 100%' : '0% 100%',
    transition: on ? `background-size ${DRAW_MS}ms linear` : 'none',
  }
  return (
    <span ref={spanRef} style={style}>
      {children}
    </span>
  )
}

/** 평가 도구 연출들이 함께 쓰는 데모 커서. */
export function StagePointer({
  point,
  move,
  linear = false,
  shown,
  down,
}: {
  point: Point
  move: number
  linear?: boolean
  shown: boolean
  down: boolean
}) {
  const easing = linear ? 'linear' : 'ease-in-out'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20"
      style={{
        left: point.x,
        top: point.y,
        opacity: shown ? 1 : 0,
        transition: `left ${move}ms ${easing}, top ${move}ms ${easing}, opacity 250ms`,
      }}
    >
      <span
        className={`block size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_2px_10px_rgba(10,17,40,0.3)] transition-[scale,background-color] duration-150 ${
          down ? 'scale-[0.85] bg-[#4d5761]/90' : 'bg-[#4d5761]/70'
        }`}
      />
      {/* 누르는 순간 퍼지는 파동. 커서 크기 변화만으로는 클릭이 잘 안 보인다. */}
      {down && (
        <span className="absolute left-0 top-0 size-[30px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#4d5761]/40" />
      )}
    </div>
  )
}

function Answer({ label, count, children, className }: { label: string; count: string; children: ReactNode; className: string }) {
  return (
    <div>
      <div className="flex items-center justify-between pb-1.5 text-[13px] text-ink">
        <span>{label}</span>
        <span className="text-[12px] text-[#8b919a]">{count}</span>
      </div>
      <div className={`overflow-hidden rounded-[6px] border border-[#d2d6db] bg-white px-3 py-2.5 text-[13px] leading-[1.65] text-ink ${className}`}>
        {children}
      </div>
    </div>
  )
}

function MemoPopup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{ transformOrigin: 'bottom right' }}
      className="absolute bottom-[68px] right-4 z-10 flex h-[286px] w-[340px] flex-col overflow-hidden rounded-[10px] bg-[#eef2fd] shadow-[0_14px_36px_-10px_rgba(32,40,45,0.38)]"
    >
      <div className="flex items-center gap-1.5 px-3.5 pb-2 pt-3">
        <IconNote size={17} stroke={STROKE} className="text-ink" />
        <span className="text-[13px] font-semibold text-ink">김윤서</span>
        <span className="ml-auto text-[11px] text-[#8b919a]">2026.06.01 14:20:32</span>
        <IconX size={16} stroke={STROKE} className="ml-1 text-[#4d5761]" />
      </div>
      <div className="flex items-center gap-2 border-y border-[#dfe5f5] px-3.5 py-1.5 text-[#4d5761]">
        {[IconTextColor, IconHighlight, IconBold, IconItalic, IconUnderline, IconLink, IconListNumbers, IconList, IconClearFormatting].map((Icon, i) => (
          <Icon key={i} size={15} stroke={STROKE} />
        ))}
      </div>
      <div className="flex flex-col gap-1 px-3.5 py-3 text-[14px] leading-[1.5] text-ink">
        <p className="font-bold">면접 확인 사항</p>
        <p>브랜드 리뉴얼 프로젝트에서 맡은 역할과 기여도 확인</p>
        <p>데이터 기반 개선 사례를 구체적으로 질문하기</p>
        <p className="pt-2 font-bold">검토 의견</p>
        <p>협업 경험이 구체적이라 실무 면접 추천</p>
        <p>입사 가능일은 면접 때 다시 확인</p>
      </div>
      {/* 운영 화면의 크기 조절 손잡이 */}
      <span aria-hidden className="absolute bottom-0 right-0 size-3 bg-[#c9d3ee] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
    </motion.div>
  )
}

/**
 * "메모·형광펜" 의 그림 자리를 대신하는 연출. 지원서 글에 형광펜을 긋고, 다
 * 그으면 메모 버튼을 눌러 작성된 메모를 띄운다.
 *
 * 커서의 자리는 글자의 실제 위치를 재서 쓴다. 글꼴이나 화면 배율이 바뀌면 줄
 * 위치도 달라져서, 좌표를 숫자로 적어 두면 형광펜과 커서가 어긋난다.
 */
export function Hero4MemoMock() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const scene = SCENES[step]

  const stageRef = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLSpanElement>(null)
  const blueRef = useRef<HTMLSpanElement>(null)
  const memoRef = useRef<HTMLSpanElement>(null)
  const [points, setPoints] = useState<Record<Target, Point> | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    const yellow = yellowRef.current
    const blue = blueRef.current
    const memo = memoRef.current
    if (!stage || !yellow || !blue || !memo) return

    const measure = () => {
      const base = stage.getBoundingClientRect()
      const k = base.width / DESIGN_WIDTH
      if (!k) return
      const local = (x: number, y: number): Point => ({ x: (x - base.left) / k, y: (y - base.top) / k })
      const ends = (el: HTMLElement) => {
        const rects = el.getClientRects()
        const first = rects[0]
        const last = rects[rects.length - 1]
        return [local(first.left, first.top + first.height / 2), local(last.right, last.top + last.height / 2)]
      }
      const [yellowStart, yellowEnd] = ends(yellow)
      const [blueStart, blueEnd] = ends(blue)
      const button = memo.getBoundingClientRect()
      setPoints({
        start: { x: 420, y: 330 },
        yellowStart,
        yellowEnd,
        blueStart,
        blueEnd,
        // 색상 도구 안 보라색 칸의 중심. 도구는 파란 형광펜 바로 아래에 뜬다.
        purple: { x: blueStart.x + 161, y: blueStart.y + 30 },
        memo: local(button.left + button.width / 2, button.top + button.height / 2),
      })
    }

    measure()
    let alive = true
    void document.fonts.ready.then(() => {
      if (alive) measure()
    })
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setStep((s) => (s + 1) % SCENES.length), STEPS[step][0])
    return () => clearTimeout(timer)
  }, [inView, step])

  const cursor = points?.[scene.cursor]
  const palette = points?.blueStart

  return (
    <div
      ref={ref}
      role="img"
      aria-label="지원서 답변에 형광펜을 긋고 메모 버튼을 눌러 작성된 메모를 확인하는 화면"
      className="w-full"
      style={{ height: DESIGN_HEIGHT * scale }}
    >
      <div
        ref={stageRef}
        className="relative font-sans"
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_-12px_rgba(32,40,45,0.22)]">
          <div className="flex h-11 items-center gap-2 border-b border-[#e8eaed] px-4 text-[12px] text-[#4d5761]">
            <span className="rounded-[6px] border border-[#d2d6db] px-2.5 py-1 text-ink">지원자 비교</span>
            <span className="flex-1 text-center text-ink">지원서 보기 - 김윤서</span>
            <span className="flex items-center gap-1">
              <IconMinus size={13} stroke={STROKE} />
              100%
              <IconPlus size={13} stroke={STROKE} />
            </span>
            <span className="flex overflow-hidden rounded-[6px] border border-[#d2d6db]">
              <span className="bg-[#f1f3f5] px-2.5 py-1 font-semibold text-ink">Basic</span>
              <span className="px-2.5 py-1">Retro</span>
            </span>
          </div>

          <div className="flex flex-col gap-3 px-4 pt-3">
            <Answer label="질문1) 지원 동기를 작성해주세요." count="367 / 500" className="h-[172px]">
              단순히 ‘보기 좋은 디자인’을 만드는 것을 넘어,{' '}
              <Marker on={scene.yellow} color="#fde08a" spanRef={yellowRef}>
                사용자 경험과 브랜드 메시지를 효과적으로
              </Marker>{' '}
              전달하는 디자인에 매력을 느껴 지원하게 되었습니다. 다양한 프로젝트를 수행하며 디자인은 시각적 결과물에
              그치는 것이 아니라, 사용자의 행동을 유도하고{' '}
              <Marker on={scene.blue} color="#c7e7fb" recolor={scene.purple ? PURPLE : undefined} spanRef={blueRef}>
                브랜드의 방향성을 전달하는 중요한 수단
              </Marker>
              이라는 것을 깨달았습니다. 특히 귀사가 보여주는 일관된 브랜드 아이덴티티와 사용자 중심의 서비스 경험은 제가 지향하는 디자인 방향과 맞닿아 있다고 생각합니다. 저는 데이터를 기반으로 디자인을 개선하고, 협업을
              통해 더 나은 결과물을 만들어내는 과정에 강점을 가지고 있습니다.
            </Answer>
            <Answer label="질문2) 입사 후의 목표를 작성해주세요." count="359 / 500" className="h-[146px]">
              입사 후에는 단기적으로는 조직의 디자인 가이드라인과 업무 프로세스를 빠르게 이해하고, 실무에 안정적으로
              기여하는 디자이너로 성장하는 것을 목표로 하고 있습니다. 특히 다양한 이해관계자와의 협업 속에서 요구사항을
              정확히 파악하고, 이를 시각적으로 효과적으로 구현하는 역량을 강화하고자 합니다. 궁극적으로는 브랜드와 사용자
              경험을 동시에 향상시키는 디자인을 통해 조직의 성과에 기여하고자 합니다.
            </Answer>
          </div>

          <span
            ref={memoRef}
            className={`absolute bottom-4 right-4 z-10 flex size-[44px] items-center justify-center rounded-[8px] border bg-[#eef2fd] text-[#0042b7] transition-transform duration-100 ${
              scene.memo ? 'border-[#0042b7]' : 'border-[#c9d3ee]'
            } ${scene.down && scene.cursor === 'memo' ? 'scale-90' : ''}`}
          >
            <IconNote size={24} stroke={STROKE} />
            {/* 이 지원자에게 남긴 메모가 있다는 표시 */}
            <span aria-hidden className="absolute -left-1 -top-1 size-2.5 rounded-full bg-[#0042b7] ring-2 ring-white" />
          </span>

          <AnimatePresence>{scene.memo && <MemoPopup />}</AnimatePresence>
        </div>

        {/* 글에 형광펜을 칠한 직후 뜨는 색상 도구. */}
        <AnimatePresence>
          {scene.palette && palette && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              style={{ left: palette.x, top: palette.y + 14 }}
              className="absolute z-10 flex items-center gap-1.5 rounded-[8px] border border-[#e1e4e8] bg-white px-2.5 py-1.5 shadow-[0_6px_16px_-6px_rgba(32,40,45,0.3)]"
            >
              <IconHighlight size={15} stroke={STROKE} className="text-[#4d5761]" />
              {SWATCHES.map((color) => (
                <span
                  key={color}
                  className={`size-[18px] rounded-[4px] ${scene.purple && color === PURPLE ? 'ring-2 ring-[#7c5cd6]' : ''}`}
                  style={{ background: color }}
                />
              ))}
              <span className="ml-2 flex items-center gap-0.5 text-[12px] text-[#d92d20]">
                <IconTrash size={14} stroke={STROKE} />
                삭제
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {cursor && <StagePointer point={cursor} move={scene.move} linear={scene.drawing} shown={scene.cursorShown} down={scene.down} />}
      </div>
    </div>
  )
}
