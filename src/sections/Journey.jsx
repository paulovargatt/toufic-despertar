import { Section, Container, Eyebrow, SectionTitle, Lead } from '../components/Primitives'

const days = [
  ['01', 'A origem do comando', 'Como sua mente foi condicionada a duvidar de você.'],
  ['02', 'O padrão invisível', 'Por que você repete ciclos de rejeição, comparação e medo.'],
  ['03', 'Quebrando crenças', 'Parar de se enxergar como inferior e desmontar o que te sabota.'],
  ['04', 'Nova autoimagem', 'Reconstruir a forma como você se vê — de dentro para fora.'],
  ['05', 'Fim da validação', 'Parar de buscar aprovação em quem ativa a sua ferida.'],
  ['06', 'Presença e posição', 'Se posicionar com firmeza e parar de se esconder.'],
  ['07', 'Capital Magnético', 'Instalar uma versão mais forte, segura e magnética de você.'],
]

function dayColor(i, alpha = 1) {
  const t = i / (days.length - 1)
  const r = Math.round(124 - 90 * t)
  const g = Math.round(90 + 121 * t)
  const b = Math.round(245 - 7 * t)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const lineGradient = (opacity = 1) =>
  `linear-gradient(to bottom, ${dayColor(0, 0.45 * opacity)}, ${dayColor(3, 0.5 * opacity)}, ${dayColor(6, 0.4 * opacity)})`

function Dot({ i, isLast }) {
  const c = dayColor(i)
  return (
    <span
      style={{
        display: 'block',
        width: '0.8rem',
        height: '0.8rem',
        borderRadius: '50%',
        background: c,
        boxShadow: `0 0 0 3px ${dayColor(i, 0.14)}, 0 0 14px 3px ${dayColor(i, 0.48)}`,
        ...(isLast && { animation: 'signal-pulse 1.6s ease-in-out infinite' }),
      }}
    />
  )
}

function Card({ num, title, text, i, isLast, right = false }) {
  const c = dayColor(i)
  return (
    <div
      className={`h-full rounded-2xl border p-5 transition-all duration-300 hover:bg-white/[0.04] ${right ? 'text-right' : 'text-left'}`}
      style={{ borderColor: dayColor(i, 0.2), background: dayColor(i, 0.055) }}
    >
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          color: c,
        }}
      >
        [ DIA {num} ]
      </span>
      <h3
        className={`mt-2 flex items-center gap-2 text-base font-semibold text-white sm:text-[1.05rem] ${right ? 'flex-row-reverse justify-start' : ''}`}
      >
        {isLast && (
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"
            style={{
              animation: 'signal-pulse 1.6s ease-in-out infinite',
              boxShadow: '0 0 8px 1px rgba(34,211,238,0.7)',
            }}
          />
        )}
        {title}
      </h3>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-soft/62">{text}</p>
    </div>
  )
}

export default function Journey() {
  return (
    <Section alt>
      <Container>
        <Eyebrow center>O cronograma</Eyebrow>
        <SectionTitle center className="mb-6">
          Sua jornada de <span className="text-cyan-grad">7 dias</span>
        </SectionTitle>
        <Lead center className="mb-14 max-w-2xl">
          7 dias não são para "resolver sua vida inteira". São para{' '}
          <span className="text-cyan-grad">iniciar uma ruptura</span> — uma quebra no automático.
        </Lead>

        <div className="relative mx-auto max-w-3xl">
          {/* Mobile connector line — left side */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-2 md:hidden"
            style={{ left: '0.4rem', width: '1px', background: lineGradient() }}
          />
          {/* Desktop connector line — centered */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-2 hidden md:block"
            style={{ left: '50%', width: '1px', transform: 'translateX(-50%)', background: lineGradient() }}
          />

          <ol className="space-y-5">
            {days.map(([num, title, text], i) => {
              const even = i % 2 === 0
              const isLast = i === days.length - 1

              return (
                <li key={num} className="reveal relative">

                  {/* ── Desktop: alternating ── */}
                  <div className="hidden md:grid md:grid-cols-[1fr_3.5rem_1fr] md:items-center">
                    {/* Left slot */}
                    <div className="pr-5 flex justify-end">
                      {even && <div className="w-full"><Card num={num} title={title} text={text} i={i} isLast={isLast} right /></div>}
                    </div>
                    {/* Dot */}
                    <div className="flex justify-center">
                      <Dot i={i} isLast={isLast} />
                    </div>
                    {/* Right slot */}
                    <div className="pl-5">
                      {!even && <Card num={num} title={title} text={text} i={i} isLast={isLast} />}
                    </div>
                  </div>

                  {/* ── Mobile: dot left, card right ── */}
                  <div className="flex items-start gap-4 md:hidden">
                    <div className="relative z-10 mt-[1.25rem] shrink-0" style={{ marginLeft: '0.025rem' }}>
                      <Dot i={i} isLast={isLast} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Card num={num} title={title} text={text} i={i} isLast={isLast} />
                    </div>
                  </div>

                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
