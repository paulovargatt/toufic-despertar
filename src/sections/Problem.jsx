import { Section, Container, Lead, Body } from '../components/Primitives'

const trained = [
  'Treinada para esperar rejeição.',
  'Treinada para duvidar de si.',
  'Treinada para se comparar.',
  'Treinada para acreditar que você precisa provar valor para ser amado, respeitado ou escolhido.',
]

const moments = [
  ['Na hora de aparecer,', 'você trava.'],
  ['Na hora de falar,', 'você mede cada palavra.'],
  ['Na hora de se posicionar,', 'você sente culpa.'],
  ['Na hora de ser visto,', 'você se esconde.'],
  ['Na hora de receber amor, respeito ou dinheiro,', 'algo dentro de você sabota.'],
]

export default function Problem() {
  return (
    <Section>
      <Container narrow>
        <Lead className="mb-12 text-center">
          Talvez você pense que o problema é falta de confiança.
          <br />
          <span className="text-grad">Mas talvez seja pior do que isso.</span>
        </Lead>

        <div className="glass reveal rounded-lg p-8 sm:p-10">
          <p className="mb-5 text-lg font-medium text-white">
            Talvez a sua mente tenha sido <span className="text-accent">treinada para se diminuir</span>:
          </p>
          <ul className="space-y-3">
            {trained.map((t) => (
              <li key={t} className="flex gap-3 text-soft/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10">
          E quando uma mente foi treinada por anos para funcionar assim, não adianta apenas dizer:{' '}
          <em className="text-accent">"vou ser mais confiante."</em>
        </Body>

        <ul className="reveal mt-8 space-y-px overflow-hidden rounded-lg border border-white/[0.07]">
          {moments.map(([a, b]) => (
            <li key={a} className="flex flex-col gap-1 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-soft/70">{a}</span>
              <strong className="text-white">{b}</strong>
            </li>
          ))}
        </ul>

        <Body className="mt-10">
          Não porque você é fraco. Mas porque existe uma{' '}
          <strong className="text-white">programação antiga</strong> rodando dentro da sua cabeça. E
          enquanto ela não for quebrada, você pode tentar mudar mil vezes… mas vai continuar voltando
          para o mesmo personagem.
        </Body>
      </Container>
    </Section>
  )
}
