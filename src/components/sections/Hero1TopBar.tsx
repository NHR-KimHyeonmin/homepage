import iconProfileChevron from '../../assets/sections/hero1/icons/icon-profile-chevron.svg'

/**
 * Figma node 2330:12759 — the admin shell's top bar (60px, white) that sits
 * above the main content pane, to the right of the sidebar. It is real DOM
 * rather than part of the screenshot so it stays put while the pane's
 * screenshot swaps between views, and it carries the session cluster on the
 * far right: remaining-session timer, "로그인 연장" button and the profile
 * avatar.
 *
 * `cursor-[inherit]` on the buttons: a `<button>` gets `cursor: default`
 * from the UA stylesheet, which would break inheritance of the custom
 * careerlink cursor set on the dashboard card above.
 */
export function Hero1TopBar() {
  return (
    <div className="flex h-[60px] shrink-0 items-center justify-end bg-white pl-4 pr-4">
      <div className="flex items-center rounded-lg bg-[#e6ecf8] py-1 pl-2 pr-1">
        <span className="w-[50px] text-xs font-medium leading-5 text-[#0042b7]">00:27:36</span>
        <button
          type="button"
          className="ml-2 min-w-[64px] cursor-[inherit] rounded-lg bg-white px-2.5 pb-1 pt-[3.33px] text-[13px] font-medium leading-[19.5px] text-black"
        >
          로그인 연장
        </button>
      </div>

      <button type="button" aria-label="프로필 메뉴" className="ml-2 flex cursor-[inherit] items-center">
        <span className="flex size-[30px] items-center justify-center rounded-full bg-[#0042b7] text-sm font-semibold leading-none text-white">
          김
        </span>
        <img src={iconProfileChevron} alt="" className="size-5" />
      </button>
    </div>
  )
}
