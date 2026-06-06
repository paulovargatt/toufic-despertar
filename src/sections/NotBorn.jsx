import { Section, Container, SectionTitle, Body } from '../components/Primitives'

const conclusions = [
  '"melhor eu me esconder."',
  '"melhor eu não incomodar."',
  '"melhor eu não tentar."',
  '"melhor eu aceitar qualquer coisa."',
  '"melhor eu não ser muito eu."',
]

export default function NotBorn() {
  return (
    <Section alt>
      <Container narrow>
        <SectionTitle className="mb-8">
          Você não nasceu inseguro.
          <br />
          <span className="text-grad">Você foi programado para duvidar de si.</span>
        </SectionTitle>

        <Body className="mb-6">
          Ninguém nasce achando que não tem valor. Ninguém nasce com medo de aparecer. Ninguém nasce
          se comparando com todo mundo. Ninguém nasce acreditando que precisa implorar por amor,
          aprovação ou atenção.
        </Body>
        <Body className="mb-10">
          <strong className="text-white">Isso foi sendo instalado.</strong> Pelas rejeições que você
          viveu. Pelas comparações que fizeram com você. Pelas vezes em que você tentou se expressar e
          foi ridicularizado. Pelos ambientes onde você aprendeu que ser você era perigoso.
        </Body>

        {/* Terminal-style conclusions block */}
        <div className="glass reveal rounded-lg overflow-hidden">
          {/* Terminal header bar */}
          <div
            className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
            <span
              className="ml-2 text-[0.6rem] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(196,181,253,0.35)' }}
            >
              Programações instaladas
            </span>
          </div>

          {/* Log lines */}
          <ul className="p-5 space-y-2">
            {conclusions.map((c, i) => (
              <li
                key={c}
                className="flex items-start gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
              >
                <span style={{ color: 'rgba(124, 90, 245, 0.6)', userSelect: 'none', flexShrink: 0 }}>
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                <span style={{ color: 'rgba(196, 181, 253, 0.75)' }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10">
          E essa conclusão virou identidade. Mas a sua insegurança{' '}
          <strong className="text-white">não é a sua essência</strong> — é só um comando antigo. Uma
          lavagem cerebral que a vida fez em você sem pedir licença.
        </Body>

        {/* A virada — o sinal novo acende em ciano */}
        <div className="reveal mt-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full bg-cyan"
              style={{
                animation: 'signal-pulse 1.6s ease-in-out infinite',
                boxShadow: '0 0 10px 2px rgba(34,211,238,0.6)',
              }}
            />
            <span
              className="text-[0.62rem] uppercase tracking-[0.25em] text-cyan/60"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              novo comando disponível
            </span>
          </div>
          <p
            className="text-2xl font-semibold leading-snug text-white sm:text-3xl"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            Agora é hora de fazer o caminho inverso.
            <br />
            <span className="text-cyan-grad">Uma lavagem cerebral consciente.</span>
          </p>
        </div>
      </Container>
    </Section>
  )
}
