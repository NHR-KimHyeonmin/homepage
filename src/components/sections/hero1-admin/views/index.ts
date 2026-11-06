import type { ComponentType } from 'react'
import type { AdminView, Crumbs } from '../AdminShell'
import { ApplicantsView } from './ApplicantsView'
import { EvaluationView } from './EvaluationView'
import { HiringProcessView } from './HiringProcessView'
import { HomeView } from './HomeView'
import { JobPostingsView } from './JobPostingsView'
import { SendingView } from './SendingView'
import { SiteBuilderView } from './SiteBuilderView'

/** 화면마다 본문 컴포넌트와 브레드크럼(대시보드는 없음). */
export const VIEWS: Record<AdminView, { Component: ComponentType; crumbs?: Crumbs }> = {
  home: { Component: HomeView },
  siteBuilder: { Component: SiteBuilderView, crumbs: { title: '채용 사이트 빌더', trail: ['채용 사이트', '채용 사이트 빌더'] } },
  jobPostings: { Component: JobPostingsView, crumbs: { title: '채용 공고 현황', trail: ['채용 공고 관리', '채용 공고 현황'] } },
  hiringProcess: { Component: HiringProcessView, crumbs: { title: '전형 관리', trail: ['채용 전형 관리', '전형 관리'] } },
  applicants: { Component: ApplicantsView, crumbs: { title: '공고별 지원자', trail: ['지원자 관리', '공고별 지원자'] } },
  sending: { Component: SendingView, crumbs: { title: '발송 등록', trail: ['발송 관리', '발송 등록'] } },
  evaluation: { Component: EvaluationView, crumbs: { title: '평가 현황', trail: ['평가 관리', '평가 현황'] } },
}
