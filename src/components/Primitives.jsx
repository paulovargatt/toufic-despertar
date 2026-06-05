// Primitivas de layout e tipografia reutilizadas em todas as seções.

export function Container({ narrow = false, className = '', children }) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-6 ${narrow ? 'max-w-3xl' : 'max-w-6xl'} ${className}`}
    >
      {children}
    </div>
  )
}

export function Section({ id, alt = false, className = '', children }) {
  return (
    <section
      id={id}
      className={`relative py-14 sm:py-20 ${className}`}
      style={
        alt
          ? {
              background:
                'linear-gradient(180deg, transparent, rgba(80, 20, 180, 0.028) 12%, rgba(80, 20, 180, 0.028) 88%, transparent)',
            }
          : {}
      }
    >
      {children}
    </section>
  )
}

export function Eyebrow({ center = false, className = '', children }) {
  return (
    <p
      className={`reveal mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent ${
        center ? 'text-center' : ''
      } ${className}`}
    >
      {children}
    </p>
  )
}

export function SectionTitle({ center = false, className = '', children }) {
  return (
    <h2
      className={`reveal text-[1.75rem] font-bold leading-[1.15] sm:text-[2rem] md:text-[2.35rem] ${
        center ? 'text-center' : ''
      } ${className}`}
    >
      {children}
    </h2>
  )
}

export function Lead({ center = false, className = '', children }) {
  return (
    <p
      className={`reveal text-xl font-medium leading-snug text-white sm:text-2xl ${
        center ? 'mx-auto text-center' : ''
      } ${className}`}
    >
      {children}
    </p>
  )
}

export function Body({ center = false, className = '', children }) {
  return (
    <p
      className={`reveal text-[1.0625rem] leading-relaxed text-soft/80 ${
        center ? 'mx-auto text-center' : ''
      } ${className}`}
    >
      {children}
    </p>
  )
}

export function Cta({
  href = '#oferta',
  large = false,
  block = false,
  checkout = false,
  className = '',
  children,
}) {
  return (
    <a
      href={href}
      {...(checkout ? { 'data-checkout': '' } : {})}
      className={`btn-primary group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight ${
        large ? 'px-8 py-4 text-base sm:px-10 sm:text-lg' : 'px-6 py-3 text-sm'
      } ${block ? 'flex w-full' : ''} ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  )
}
