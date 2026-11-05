import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { IconBriefcase, IconMail, IconPhone } from '@tabler/icons-react'
import photo from '../../assets/sections/hero4-cards/photo-yoonseo.webp'
import { useFitScale } from '../../hooks/useFitScale'
import { StagePointer, type Point } from './Hero4MemoMock'

/** 설계 좌표. 다른 평가 도구 연출과 같은 크기의 창이다. */
const DESIGN_WIDTH = 684
const DESIGN_HEIGHT = 448

const STROKE = 1.8
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
const YEAR_WIDTH = 100
/** 전화번호를 골랐을 때 설정 박스 자리. 전화번호 줄과 겹치지 않게 위에 둔다. */
const PHONE_BOX: Point = { x: 282, y: 18 }

type Field = 'phone' | 'address'
type Target = 'start' | 'phone' | 'print' | 'address' | 'evaluator'

interface Scene {
  cursor: Target
  cursorShown: boolean
  down: boolean
  selected: Field | null
  /** 설정 박스가 붙어 있는 항목. 사라지는 동안에도 자리를 지키도록 표시 여부와 나눈다. */
  anchor: Field
  boxesShown: boolean
  printOn: boolean
  evaluatorOn: boolean
  phoneGone: boolean
  addressGone: boolean
}

const FIRST: Scene = {
  cursor: 'start',
  cursorShown: true,
  down: false,
  selected: null,
  anchor: 'phone',
  boxesShown: false,
  printOn: true,
  evaluatorOn: true,
  phoneGone: false,
  addressGone: false,
}

/** [이 장면을 머무는 시간(ms), 앞 장면에서 바뀌는 것] */
const STEPS: [number, Partial<Scene>][] = [
  [900, {}],
  [650, { cursor: 'phone' }],
  [220, { down: true }],
  [850, { down: false, selected: 'phone', boxesShown: true }],
  [650, { cursor: 'print' }],
  [220, { down: true }],
  [450, { down: false, printOn: false }],
  [800, { phoneGone: true, selected: null, boxesShown: false }],
  [650, { cursor: 'address', printOn: true }],
  [220, { down: true }],
  [750, { down: false, selected: 'address', anchor: 'address', boxesShown: true }],
  [650, { cursor: 'evaluator' }],
  [220, { down: true }],
  [450, { down: false, evaluatorOn: false }],
  [2400, { addressGone: true, selected: null, boxesShown: false, cursorShown: false }],
]

const SCENES = STEPS.reduce<Scene[]>((scenes, [, patch]) => {
  scenes.push({ ...(scenes.at(-1) ?? FIRST), ...patch })
  return scenes
}, [])

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-[8px] border border-[#e8eaed] bg-white">
      <p className="flex h-[34px] items-center bg-[#eceef1] px-3.5 text-[13px] font-bold text-ink">{title}</p>
      {children}
    </div>
  )
}

export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-4 py-2.5">
      <p className="text-[11px] text-[#8b919a]">{label}</p>
      <p className="pt-0.5 text-[13px] text-ink">{children}</p>
    </div>
  )
}

/** 지원서의 요약정보 칸. */
export function SummaryChart() {
  return (
    <Block title="요약정보">
      <div className="relative h-[150px]">
        <div className="absolute left-[120px] top-[10px] flex items-center gap-1.5 text-[12px] text-ink">
          <span className="rounded-[3px] bg-[#2f9e96] px-1 py-px text-[10px] text-white">대학교</span>
          서울대학교
        </div>
        <div className="absolute left-[36px] top-[26px] flex items-center gap-1.5 text-[12px] text-ink">
          <span className="rounded-[3px] bg-[#4c8df0] px-1 py-px text-[10px] text-white">고등</span>
          검정고시
        </div>
        <span className="absolute left-[36px] top-[44px] h-[52px] w-0.5 bg-[#a9c6f3]" />
        <span className="absolute left-[120px] top-[32px] h-[64px] w-[412px] bg-[#8ac6c6]" />
        <div className="absolute inset-x-0 top-[96px]">
          {YEARS.map((year, i) => (
            <span
              key={year}
              className="absolute top-1 -translate-x-1/2 text-[11px] text-[#6c737f]"
              style={{ left: 20 + i * YEAR_WIDTH }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
    </Block>
  )
}

/** 주소는 정보 줄과 꼴이 달라 따로 둔다. 숨겨지면 칸이 접혀 아래 내용이 올라온다. */
function AddressRow({ gone, selected, rowRef }: { gone: boolean; selected: boolean; rowRef: React.Ref<HTMLDivElement> }) {
  return (
    <AnimatePresence initial={false}>
      {!gone && (
        <motion.div exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
          <div className="px-2.5 py-1.5">
            <div
              ref={rowRef}
              className={`w-fit rounded-[5px] px-1.5 py-1 outline-offset-[-1px] ${
                selected ? 'outline-[1.5px] outline-dashed outline-[#0042b7]' : ''
              }`}
            >
              <p className="text-[11px] text-[#8b919a]">주소</p>
              <p className="pt-0.5 text-[13px] text-ink">(07727) 서울 강서구 까치산로 23 (화곡동, NHR타워), 301동 2001호</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** 스위치가 꺼지면 줄이 접히며 지원서에서 완전히 빠진다. 흐리게 가리지 않는다. */
function InfoRow({
  gone,
  selected,
  rowRef,
  children,
}: {
  gone: boolean
  selected: boolean
  rowRef?: React.Ref<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {!gone && (
        <motion.div
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-visible"
        >
          <div
            ref={rowRef}
            className={`flex h-[26px] w-fit items-center gap-2 rounded-[5px] px-1.5 text-[13px] text-ink outline-offset-1 ${
              selected ? 'outline-[1.5px] outline-dashed outline-[#0042b7]' : ''
            }`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SettingCard({
  label,
  on,
  switchRef,
}: {
  label: string
  on: boolean
  switchRef: React.Ref<HTMLSpanElement>
}) {
  return (
    <div className="flex h-[40px] items-center justify-between gap-5 rounded-[10px] bg-white px-3.5 text-[14px] font-medium text-ink shadow-[0_6px_18px_-4px_rgba(32,40,45,0.25)]">
      {label}
      <span ref={switchRef} className="relative block h-[18px] w-[36px] shrink-0">
        <span
          className={`absolute inset-x-0 top-[3px] h-3 rounded-full transition-colors duration-200 ${on ? 'bg-[#c9d6f5]' : 'bg-[#dfe2e6]'}`}
        />
        <motion.span
          initial={false}
          animate={{ x: on ? 18 : 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
          className={`absolute left-0 top-0 size-[18px] rounded-full shadow-[0_1px_3px_rgba(32,40,45,0.35)] transition-colors duration-200 ${
            on ? 'bg-[#0042b7]' : 'bg-white'
          }`}
        />
      </span>
    </div>
  )
}

/**
 * "평가 미노출" 의 그림 자리를 대신하는 연출. 전화번호를 눌러 고르고 출력
 * 노출을 꺼서 숨기고, 주소를 눌러 고른 뒤 평가자 공개를 꺼서 숨긴다.
 */
export function Hero4BlindMock() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const scene = SCENES[step]

  const stageRef = useRef<HTMLDivElement>(null)
  const boxesRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const printRef = useRef<HTMLSpanElement>(null)
  const evaluatorRef = useRef<HTMLSpanElement>(null)
  const [layout, setLayout] = useState<{ phone: Point; address: Point; addressBottom: number; print: Point; evaluator: Point } | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const measure = () => {
      const boxes = boxesRef.current
      const phone = phoneRef.current
      const address = addressRef.current
      const print = printRef.current
      const evaluator = evaluatorRef.current
      // 항목이 숨겨진 동안에는 잴 수 없으니 먼저 재 둔 값을 그대로 쓴다.
      if (!boxes || !phone || !address || !print || !evaluator) return
      const base = stage.getBoundingClientRect()
      const k = base.width / DESIGN_WIDTH
      if (!k) return
      const origin = boxes.getBoundingClientRect()
      const offset = (el: HTMLElement): Point => {
        const r = el.getBoundingClientRect()
        return { x: (r.left + r.width / 2 - origin.left) / k, y: (r.top + r.height / 2 - origin.top) / k }
      }
      const center = (el: HTMLElement): Point => {
        const c = el.getBoundingClientRect()
        return { x: (c.left + c.width / 2 - base.left) / k, y: (c.top + c.height / 2 - base.top) / k }
      }
      const r = address.getBoundingClientRect()
      setLayout({
        phone: center(phone),
        address: center(address),
        addressBottom: (r.bottom - base.top) / k,
        print: offset(print),
        evaluator: offset(evaluator),
      })
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

  const addressBox: Point = { x: 28, y: (layout?.addressBottom ?? 0) + 8 }
  const box = scene.anchor === 'phone' ? PHONE_BOX : addressBox
  const cursor: Point | null = !layout
    ? null
    : scene.cursor === 'start'
      ? { x: 500, y: 300 }
      : scene.cursor === 'phone'
        ? layout.phone
        : scene.cursor === 'address'
        ? layout.address
        : scene.cursor === 'print'
          ? { x: PHONE_BOX.x + layout.print.x, y: PHONE_BOX.y + layout.print.y }
          : { x: addressBox.x + layout.evaluator.x, y: addressBox.y + layout.evaluator.y }

  return (
    <div
      ref={ref}
      role="img"
      aria-label="지원서의 전화번호와 주소 항목을 골라 노출 설정을 끄면 항목이 지원서에서 숨겨지는 화면"
      className="w-full"
      style={{ height: DESIGN_HEIGHT * scale }}
    >
      <div
        ref={stageRef}
        className="relative font-sans"
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="absolute inset-0 flex flex-col gap-2.5 overflow-hidden rounded-[12px] bg-white p-3 shadow-[0_12px_32px_-12px_rgba(32,40,45,0.22)]">
          <Block title="지원정보">
            <Labeled label="지원 직무">커리어링크 기획 &gt; 디자인</Labeled>
          </Block>

          <div className="shrink-0 overflow-hidden rounded-[8px] border border-[#e8eaed] bg-white">
            <div className="flex h-[112px] items-center bg-[#eef0f3] pl-4 pr-3">
              <p className="w-[250px] shrink-0 text-[18px] font-medium text-ink">김윤서 (여)</p>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <InfoRow gone={scene.phoneGone} selected={scene.selected === 'phone'} rowRef={phoneRef}>
                  <IconPhone size={15} stroke={STROKE} className="shrink-0 text-[#4d5761]" />
                  +82)010-9999-0000
                </InfoRow>
                <InfoRow gone={false} selected={false}>
                  <IconMail size={15} stroke={STROKE} className="shrink-0 text-[#4d5761]" />
                  kimyunseo@careerlink.kr
                </InfoRow>
                <InfoRow gone={false} selected={false}>
                  <IconBriefcase size={15} stroke={STROKE} className="shrink-0 text-[#4d5761]" />
                  2000.03.02 (만 26세)
                </InfoRow>
              </div>
              <img src={photo} alt="" className="h-[96px] w-[74px] shrink-0 rounded-[6px] object-cover" />
            </div>
            <AddressRow gone={scene.addressGone} selected={scene.selected === 'address'} rowRef={addressRef} />
          </div>

          <SummaryChart />
        </div>

        {/* 재서 쓰는 박스라 늘 붙여 두고 투명도로만 감춘다. */}
        <motion.div
          ref={boxesRef}
          initial={false}
          animate={{ opacity: scene.boxesShown ? 1 : 0, y: scene.boxesShown ? 0 : 12 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{ left: box.x, top: box.y }}
          className="absolute z-10 flex w-[210px] flex-col gap-1.5"
        >
          <SettingCard label="출력 노출 설정" on={scene.printOn} switchRef={printRef} />
          <SettingCard label="평가자 공개 설정" on={scene.evaluatorOn} switchRef={evaluatorRef} />
        </motion.div>

        {cursor && <StagePointer point={cursor} move={scene.cursor === 'start' ? 0 : 600} shown={scene.cursorShown} down={scene.down} />}
      </div>
    </div>
  )
}
