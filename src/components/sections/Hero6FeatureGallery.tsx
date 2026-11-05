import { motion } from 'framer-motion'
import {
  IconBook2,
  IconChartBar,
  IconMessages,
  IconRocket,
  IconShieldCheck,
  IconUserCheck,
  IconWorldWww,
  type Icon,
} from '@tabler/icons-react'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

const CARDS: { title: string; description: string; Icon: Icon }[] = [
  {
    title: '온보딩 및 초기 세팅 지원',
    description: '시스템 실제 오픈 전 대면/비대면 미팅을 통해 온보딩 지원을 드립니다.',
    Icon: IconRocket,
  },
  {
    title: '전담 매니저 배정',
    description: '시스템 사용간 이슈 발생 시 즉각 조치할 수 있도록 전담자를 배정해드립니다.',
    Icon: IconUserCheck,
  },
  {
    title: 'GA 대시보드 제공',
    description:
      '최종제출 인원이 어느 경로에서 인입되었는지 확인할 수 있는 대시보드를 제공해 드립니다. (GA 수집동의 필요)',
    Icon: IconChartBar,
  },
  {
    title: '가이드북 제공',
    description: '커리어링크 사용 온라인 가이드를 제공해 드립니다.',
    Icon: IconBook2,
  },
  {
    title: '실시간 채팅 상담',
    description: '가이드북으로 찾기 어려운 부분을 실시간 채팅을 통해 해소해 드리고 있습니다.',
    Icon: IconMessages,
  },
  {
    title: '홈페이지 제작 지원',
    description: 'HR브랜딩 전문가 NHR이 귀사의 채용 홈페이지 제작을 직접 도와드립니다.',
    Icon: IconWorldWww,
  },
  {
    title: '보안 점검 지원',
    description:
      '안정적인 운영을 위해 안정적인 보안 체계가 중요합니다. 귀사의 정기적 보안 점검에 적극적으로 대응하며 준수합니다.',
    Icon: IconShieldCheck,
  },
]

/** 윗줄 3장, 아랫줄 4장. 일곱 장이 빈칸 없이 한 화면에 들어온다(12칸 격자). */
const spanOf = (index: number) => (index < 3 ? 'lg:col-span-4' : 'lg:col-span-3')

export function Hero6FeatureGallery() {
  return (
    <Section className="flex flex-col items-center pb-12 pt-8 md:pb-24 md:pt-12">
      <Container className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {CARDS.map(({ title, description, Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
            className={`flex flex-col gap-6 rounded-card bg-card p-7 ${spanOf(index)}`}
          >
            <span className="flex size-11 items-center justify-center rounded-[10px] bg-white text-ink shadow-[0_2px_8px_rgba(32,40,45,0.1)]">
              <Icon size={22} stroke={1.8} />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-black">{title}</h3>
              <p className="text-base font-medium leading-[1.5] tracking-[-0.09px] text-black/55">{description}</p>
            </div>
          </motion.div>
        ))}
      </Container>
    </Section>
  )
}
