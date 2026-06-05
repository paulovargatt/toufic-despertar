import { Section, Container, SectionTitle } from '../components/Primitives'
import { Check } from '../components/icons'

const items = [
  'Como sua mente foi condicionada a duvidar de você.',
  'Por que você repete padrões de rejeição, comparação e medo.',
  'Como parar de se enxergar como alguém inferior.',
  'Como quebrar crenças que sabotam sua postura, sua fala e suas decisões.',
  'Como reconstruir sua autoimagem de dentro para fora.',
  'Como parar de buscar validação em quem ativa sua ferida.',
  'Como desenvolver uma confiança natural, sem precisar fingir.',
  'Como se posicionar com mais firmeza.',
  'Como parar de se esconder por medo de julgamento.',
  'Como instalar uma versão mais forte, segura e magnética de você.',
]

export default function Learn() {
  return (
    <Section alt>
      <Container narrow>
        <SectionTitle center className="mb-14">
          O que você vai aprender
        </SectionTitle>

        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((t) => (
            <li
              key={t}
              className="reveal flex items-start gap-3 rounded-xl border border-electric/10 bg-white/[0.02] px-4 py-4"
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-electric/30 text-electric">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-sm leading-relaxed text-soft/85">{t}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
