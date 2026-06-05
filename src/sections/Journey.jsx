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

export default function Journey() {
  return (
    <Section alt>
      <Container>
        <Eyebrow center>O cronograma</Eyebrow>
        <SectionTitle center className="mb-6">
          Sua jornada de <span className="text-grad">7 dias</span>
        </SectionTitle>
        <Lead center className="mb-14 max-w-2xl">
          7 dias não são para "resolver sua vida inteira". São para{' '}
          <span className="text-grad">iniciar uma ruptura</span> — uma quebra no automático.
        </Lead>

        <ol className="mx-auto max-w-2xl space-y-1">
          {days.map(([num, title, text]) => (
            <li
              key={num}
              className="reveal group flex gap-5 rounded-lg px-5 py-5 transition-colors duration-200 hover:bg-white/[0.02]"
            >
              {/* Badge estilo [ 01 ] */}
              <span
                className="mt-0.5 inline-flex h-fit shrink-0 items-center rounded border border-electric/30 bg-electric/[0.06] px-2.5 py-1 transition-all duration-200 group-hover:border-electric/55 group-hover:bg-electric/[0.12]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(196, 181, 253, 0.7)',
                }}
              >
                [ {num} ]
              </span>

              {/* Conteúdo */}
              <div className="flex-1">
                {/* Linha de separação com gradiente à esquerda */}
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1.5 w-px self-stretch shrink-0 rounded-full"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(124,90,245,0.6), rgba(124,90,245,0.05))',
                      minHeight: '2.5rem',
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-soft/65">{text}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
