import applicantPhoto from '../../assets/sections/hero2-application-builder/applicant-photo.webp'
import iconBirth from '../../assets/sections/hero2-application-builder/icon-contact-birth.svg'
import iconMail from '../../assets/sections/hero2-application-builder/icon-contact-mail.svg'
import iconMobile from '../../assets/sections/hero2-application-builder/icon-contact-mobile.svg'
import iconPhone from '../../assets/sections/hero2-application-builder/icon-contact-phone.svg'
import starEmpty from '../../assets/sections/hero2-application-builder/icon-star-empty.svg'
import starFilled from '../../assets/sections/hero2-application-builder/icon-star-filled.svg'
import type { Field, FormSection, Group } from './Hero2FormBuilderData'

const HEADER_GRADIENT = 'linear-gradient(174.15deg, rgb(243, 244, 246) 0%, rgb(229, 231, 235) 100%)'

function FieldCell({ field }: { field: Field }) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <p className="whitespace-nowrap text-[14px] leading-[14px] text-[#8e949e]">{field.label}</p>
      <p className="text-[16px] leading-[16px] text-[#212121]">{field.value}</p>
    </div>
  )
}

function GroupBox({ group }: { group: Group }) {
  return (
    <div className="flex flex-1 flex-col rounded-ui border border-[#e5e7eb] bg-white p-2">
      {(group.dateRange || group.badge) && (
        <div className="flex items-center gap-2 px-2 pt-1">
          {group.dateRange && <span className="text-[14px] leading-[21px] text-[#8e949e]">{group.dateRange}</span>}
          {group.badge && (
            <span className="rounded-full bg-[#e6ecf8] px-2 py-0.5 text-[12px] leading-[18px] text-[#0042b7]">
              {group.badge}
            </span>
          )}
        </div>
      )}
      {group.title && (
        <p className="px-2 pb-1 pt-2 text-[16px] font-semibold leading-[24px] text-[#212121]">{group.title}</p>
      )}
      <div className="grid grid-cols-2">
        {group.fields.map((field) => (
          <FieldCell key={field.label + field.value} field={field} />
        ))}
      </div>
    </div>
  )
}

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <img loading="lazy" decoding="async" key={n} src={n <= stars ? starFilled : starEmpty} alt="" className="size-4" />
      ))}
    </span>
  )
}

function ProfileBody() {
  const contacts = [
    { icon: iconPhone, text: '+82)010-1234-5678' },
    { icon: iconMail, text: 'honggildong@nhr.kr' },
    { icon: iconMobile, text: '+82)010-1234-5678' },
    { icon: iconBirth, text: '1996.12.31 (만 29세)' },
  ]

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-5" style={{ backgroundImage: HEADER_GRADIENT }}>
        <div className="flex w-[150px] shrink-0 flex-col gap-1">
          <p className="text-[20px] font-semibold leading-[30px] text-[#212121]">
            홍길동 <span className="text-[16px] font-normal">(남)</span>
          </p>
          <p className="text-[14px] leading-[21px] text-[#8e949e]">HONG GILDONG</p>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {contacts.map((contact) => (
            <div key={contact.text + contact.icon} className="flex items-center gap-2">
              <img loading="lazy" decoding="async" src={contact.icon} alt="" className="size-[18px] shrink-0" />
              <span className="text-[15px] leading-[22px] text-[#212121]">{contact.text}</span>
            </div>
          ))}
        </div>
        <img loading="lazy" decoding="async"
          src={applicantPhoto}
          alt="지원자 증명사진"
          className="h-[150px] w-[116px] shrink-0 rounded-ui object-cover shadow-[0px_2px_14px_0px_rgba(32,40,45,0.2)]"
        />
      </div>
      <div className="grid w-full grid-cols-2 px-6 py-4">
        {[
          { label: '취미', value: '독서,영화감상' },
          { label: '특기', value: '축구' },
        ].map((field) => (
          <FieldCell key={field.label} field={field} />
        ))}
        {[
          { label: '병역', value: '[군필]공군 병장 정보 (2015.01.01~2016.12.30) 만기제대' },
          { label: '주소', value: '(07727) 서울 강서구 까치산로 23, NHR Tower' },
          { label: 'SNS주소', value: 'https://careerlink.kr' },
        ].map((field) => (
          <div key={field.label} className="col-span-2">
            <FieldCell field={field} />
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * One preview card in the centre column. Card chrome (white, 1px #e5e7eb,
 * 8px radius) and the gradient title bar are shared; only the body differs
 * per section.
 */
export function FormPreviewCard({ section }: { section: FormSection }) {
  const body = section.body
  if (!body) return null

  return (
    <div className="mt-4 w-full overflow-hidden rounded-ui border border-[#e5e7eb] bg-white first:mt-0">
      {body.kind === 'profile' ? (
        <ProfileBody />
      ) : (
        <>
          <div className="flex w-full items-center p-4" style={{ backgroundImage: HEADER_GRADIENT }}>
            <p className="text-[16px] font-semibold leading-[24px] text-[#212121]">{section.label}</p>
          </div>
          <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
            {body.kind === 'fields' && (
              <div className="grid grid-cols-2">
                {body.fields.map((field) => (
                  <FieldCell key={field.label} field={field} />
                ))}
              </div>
            )}

            {body.kind === 'groups' && (
              <div className={body.columns === 2 ? 'flex items-stretch gap-4' : 'flex flex-col gap-4'}>
                {body.groups.map((group) => (
                  <GroupBox key={group.title ?? group.dateRange} group={group} />
                ))}
              </div>
            )}

            {body.kind === 'ratings' && (
              <div className="grid grid-cols-2 gap-4">
                {body.languages.map((language) => (
                  <div key={language.name} className="rounded-ui border border-[#e5e7eb] bg-white p-2">
                    <p className="px-2 py-2 text-[16px] font-semibold leading-[24px] text-[#212121]">{language.name}</p>
                    {language.levels.map((level) => (
                      <div key={level.label} className="flex items-center justify-between px-2 py-2">
                        <span className="text-[14px] leading-[21px] text-[#8e949e]">{level.label}</span>
                        <StarRow stars={level.stars} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
