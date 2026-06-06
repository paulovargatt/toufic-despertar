import { Section, Container, Lead, Body } from '../components/Primitives'

// O que instalaram na sua mente (a "programação antiga" — roxo)
const trained = [
  'a esperar rejeição antes de tentar',
  'a duvidar de você antes de agir',
  'a se comparar com todo mundo',
  'a achar que precisa provar valor pra ser amado, respeitado ou escolhido',
]

// Estímulo (sinal que chega — ciano) → resposta automática (o bug)
const moments = [
  ['Hora de aparecer', 'você trava'],
  ['Hora de falar', 'você mede cada palavra'],
  ['Hora de se posicionar', 'você sente culpa'],
  ['Hora de ser visto', 'você se esconde'],
  ['Hora de receber amor ou dinheiro', 'algo dentro sabota'],
]

export default function Problem() {
  return (
    <Section>
      <Container narrow>
        <Lead className="mb-12 text-center">
          Você jura que o problema é falta de confiança.
          <br />
          <span className="text-grad">A verdade é mais incômoda que isso.</span>
        </Lead>

        {/* Diagnóstico: o que treinaram na sua mente */}
        <div className="glass reveal rounded-lg p-7 sm:p-9">
          <p className="mb-6 text-lg font-medium text-white">
            Sua mente foi <span className="text-accent">treinada para te diminuir</span>:
          </p>
          <ul className="space-y-3.5">
            {trained.map((t) => (
              <li key={t} className="flex items-start gap-3 text-soft/85">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-electric"
                  style={{ boxShadow: '0 0 8px 1px rgba(124,90,245,0.6)' }}
                />
                <span>
                  Treinada <span className="text-white">{t}</span>.
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10 text-center">
          Por isso não adianta só repetir{' '}
          <em className="text-soft/60">"vou ser mais confiante"</em>. Toda vez que a vida aperta,
          o automático assume o controle:
        </Body>

        {/* Mapa estímulo → resposta automática (o circuito com bug) */}
        <div className="reveal mt-8 overflow-hidden rounded-lg border border-white/[0.07]">
          <div
            className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <span
              className="text-[0.6rem] uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(103,232,249,0.5)' }}
            >
              estímulo
            </span>
            <span
              className="text-[0.6rem] uppercase tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: 'rgba(196,181,253,0.4)' }}
            >
              resposta automática
            </span>
          </div>
          <ul>
            {moments.map(([trigger, reaction], i) => (
              <li
                key={trigger}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 bg-white/[0.02]"
                style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : undefined}
              >
                <span className="text-cyan-soft/85 text-[0.9rem] sm:text-base">{trigger}</span>
                <span aria-hidden className="text-electric/45 text-lg leading-none">→</span>
                <span className="text-right text-[0.9rem] font-medium text-white sm:text-base">
                  {reaction}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10 text-center">
          Isso não é fraqueza. É uma{' '}
          <strong className="text-white">programação antiga rodando em loop</strong>. E enquanto ela
          roda, você pode tentar mudar mil vezes — e sempre volta pro mesmo personagem.
        </Body>
      </Container>
    </Section>
  )
}
