/**
 * Sidebar icons whose color changes with interaction state (active nav).
 * Path data is copied verbatim from the Figma-exported SVGs in
 * `src/assets/sections/hero1/icons/` (dashboard, job-postings) — only the
 * hardcoded stroke color was swapped for `currentColor` so a single glyph
 * can render both the gray (inactive) and blue (active) states via a
 * Tailwind text-color class. All other sidebar icons are static (always
 * gray) and are rendered directly from their exported SVG files via <img>.
 */

interface IconProps {
  className?: string
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 19.99 19.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2.49855 2.49855V17.4911H17.4911"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6583 14.9925V17.4911"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3267 13.3267V17.4909"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.995 10.8279V17.4907"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66333 13.3267V17.4909"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.49875 9.16208C7.49625 9.16208 6.66333 4.9975 9.995 4.9975C13.3267 4.9975 12.4938 9.16208 17.4913 9.16208"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function JobPostingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10.8333 4.16667H17.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8333 7.5H15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8333 12.5H17.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8333 15.8333H15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M2.5 4.16667C2.5 3.94565 2.5878 3.73369 2.74408 3.57741C2.90036 3.42113 3.11232 3.33333 3.33333 3.33333H6.66667C6.88768 3.33333 7.09964 3.42113 7.25592 3.57741C7.4122 3.73369 7.5 3.94565 7.5 4.16667V7.5C7.5 7.72101 7.4122 7.93298 7.25592 8.08926C7.09964 8.24554 6.88768 8.33333 6.66667 8.33333H3.33333C3.11232 8.33333 2.90036 8.24554 2.74408 8.08926C2.5878 7.93298 2.5 7.72101 2.5 7.5V4.16667Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.5C2.5 12.279 2.5878 12.067 2.74408 11.9107C2.90036 11.7545 3.11232 11.6667 3.33333 11.6667H6.66667C6.88768 11.6667 7.09964 11.7545 7.25592 11.9107C7.4122 12.067 7.5 12.279 7.5 12.5V15.8333C7.5 16.0543 7.4122 16.2663 7.25592 16.4226C7.09964 16.5789 6.88768 16.6667 6.66667 16.6667H3.33333C3.11232 16.6667 2.90036 16.5789 2.74408 16.4226C2.5878 16.2663 2.5 16.0543 2.5 15.8333V12.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SiteBuilderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 19.99 19.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5.83022 8.32897H8.32897V5.83022L5.41376 2.91501C6.34632 2.46963 7.39402 2.32431 8.4126 2.49907C9.43117 2.67383 10.3705 3.16007 11.1013 3.89084C11.832 4.6216 12.3183 5.56094 12.493 6.57952C12.6678 7.59809 12.5225 8.64579 12.0771 9.57835L17.0746 14.5758C17.406 14.9072 17.5921 15.3566 17.5921 15.8252C17.5921 16.2938 17.406 16.7432 17.0746 17.0746C16.7432 17.406 16.2938 17.5921 15.8252 17.5921C15.3566 17.5921 14.9072 17.406 14.5758 17.0746L9.57835 12.0771C8.64579 12.5225 7.59809 12.6678 6.57952 12.493C5.56094 12.3183 4.6216 11.832 3.89084 11.1013C3.16007 10.3705 2.67383 9.43117 2.49907 8.4126C2.32431 7.39402 2.46963 6.34632 2.91501 5.41376L5.83022 8.32897Z"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HiringProcessIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 19.99 19.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M7.49625 4.16458H5.83042C5.38861 4.16458 4.9649 4.34009 4.65249 4.65249C4.34009 4.9649 4.16458 5.38861 4.16458 5.83042V15.8254C4.16458 16.2672 4.34009 16.6909 4.65249 17.0033C4.9649 17.3157 5.38861 17.4913 5.83042 17.4913H14.1596C14.6014 17.4913 15.0251 17.3157 15.3375 17.0033C15.6499 16.6909 15.8254 16.2672 15.8254 15.8254V5.83042C15.8254 5.38861 15.6499 4.9649 15.3375 4.65249C15.0251 4.34009 14.6014 4.16458 14.1596 4.16458H12.4938"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49625 4.16445C7.49625 3.72268 7.67174 3.299 7.98412 2.98662C8.2965 2.67424 8.72018 2.49875 9.16195 2.49875H10.8277C11.2694 2.49875 11.6931 2.67424 12.0055 2.98662C12.3179 3.299 12.4934 3.72268 12.4934 4.16445C12.4934 4.60622 12.3179 5.0299 12.0055 5.34228C11.6931 5.65466 11.2694 5.83015 10.8277 5.83015H9.16195C8.72018 5.83015 8.2965 5.65466 7.98412 5.34228C7.67174 5.0299 7.49625 4.60622 7.49625 4.16445Z"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.49625 9.995H7.50458" stroke="currentColor" strokeWidth="1.24937" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8279 9.995H12.4936" stroke="currentColor" strokeWidth="1.24937" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.49625 13.3267H7.50458" stroke="currentColor" strokeWidth="1.24937" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8279 13.3267H12.4936" stroke="currentColor" strokeWidth="1.24937" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ApplicantsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 19.99 19.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5.14033 8.18581C4.51557 7.56105 4.16458 6.71369 4.16458 5.83015C4.16458 4.94661 4.51557 4.09925 5.14033 3.47449C5.76509 2.84974 6.61244 2.49875 7.49598 2.49875C8.37953 2.49875 9.22688 2.84974 9.85164 3.47449C10.4764 4.09925 10.8274 4.94661 10.8274 5.83015C10.8274 6.71369 10.4764 7.56105 9.85164 8.18581C9.22688 8.81056 8.37953 9.16155 7.49598 9.16155C6.61244 9.16155 5.76509 8.81056 5.14033 8.18581Z"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.49875 17.4909V15.8252C2.49875 14.9416 2.84974 14.0943 3.47449 13.4695C4.09925 12.8447 4.94661 12.4938 5.83015 12.4938H9.16155C10.0451 12.4938 10.8924 12.8447 11.5172 13.4695C12.142 14.0943 12.4929 14.9416 12.4929 15.8252V17.4909"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3267 2.60703C14.0433 2.79051 14.6784 3.20727 15.132 3.7916C15.5856 4.37594 15.8317 5.09461 15.8317 5.83432C15.8317 6.57404 15.5856 7.29271 15.132 7.87705C14.6784 8.46138 14.0433 8.87814 13.3267 9.06162"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4911 17.4909V15.8252C17.4868 15.0899 17.2395 14.3767 16.7875 13.7967C16.3356 13.2167 15.7044 12.8025 14.9925 12.6187"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 19.99 19.99" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2.49875 5.83042C2.49875 5.38861 2.67426 4.9649 2.98666 4.65249C3.29907 4.34009 3.72278 4.16458 4.16458 4.16458H15.8254C16.2672 4.16458 16.6909 4.34009 17.0033 4.65249C17.3157 4.9649 17.4913 5.38861 17.4913 5.83042V14.1596C17.4913 14.6014 17.3157 15.0251 17.0033 15.3375C16.6909 15.6499 16.2672 15.8254 15.8254 15.8254H4.16458C3.72278 15.8254 3.29907 15.6499 2.98666 15.3375C2.67426 15.0251 2.49875 14.6014 2.49875 14.1596V5.83042Z"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.49875 5.83042L9.995 10.8279L17.4913 5.83042"
        stroke="currentColor"
        strokeWidth="1.24937"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
