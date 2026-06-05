// Ícones minimalistas em line-art (stroke, sem preenchimento) — herdam currentColor.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Heart = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-4.35-9.5-8.5C.8 9.5 2.3 6 5.5 6 7.5 6 9 7.2 12 10c3-2.8 4.5-4 6.5-4 3.2 0 4.7 3.5 3 6.5C19 16.65 12 21 12 21z" />
  </svg>
)

export const Briefcase = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
)

export const Users = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
    <path d="M16 6a3 3 0 0 1 0 5" />
    <path d="M18 15c2 .6 3 2.2 3 5" />
  </svg>
)

export const Chat = (p) => (
  <svg {...base} {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
  </svg>
)

export const Play = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M10 8 16 12 10 16Z" />
  </svg>
)

export const Refresh = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20a8 8 0 1 0-8-8" />
    <path d="M4 4v4h4" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const UserCircle = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
)

export const Bulb = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z" />
    <path d="M9 22h6" />
  </svg>
)

export const Magnet = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="m4.9 4.9 2.8 2.8" />
    <path d="m16.3 16.3 2.8 2.8" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Shield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const Check = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
)

export const Cross = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
