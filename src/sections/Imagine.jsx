import { Section, Container, SectionTitle, Body } from '../components/Primitives'

const lines = [
  <>
    Imagine <strong className="text-white">acordar sem sentir que precisa provar valor</strong> para
    todo mundo.
  </>,
  <>Imagine conversar sem ficar se policiando o tempo inteiro.</>,
  <>Imagine se posicionar sem sentir culpa por ter opinião.</>,
  <>Imagine parar de aceitar migalhas só para não ficar sozinho.</>,
  <>
    Imagine olhar para uma oportunidade e pensar:{' '}
    <em className="text-accent">"eu posso ocupar esse espaço."</em>
  </>,
  <>
    Imagine ser visto, ouvido e respeitado{' '}
    <strong className="text-white">sem forçar uma personalidade que não é sua.</strong>
  </>,
]

export default function Imagine() {
  return (
    <Section>
      <Container narrow>
        <SectionTitle center className="mb-12">
          Imagine isso acontecendo com você
        </SectionTitle>

        <div className="space-y-4">
          {lines.map((line, i) => (
            <p
              key={i}
              className="reveal rounded-lg border border-white/[0.07] bg-gradient-to-r from-electric/[0.06] to-transparent px-6 py-5 text-lg leading-relaxed text-soft/85"
            >
              {line}
            </p>
          ))}
        </div>

        <Body center className="mt-12 max-w-2xl">
          Isso não acontece porque você decorou frases motivacionais. Acontece porque sua mente recebe{' '}
          <strong className="text-white">um novo comando</strong>. E quando você muda a forma como se
          percebe, o mundo começa a responder diferente também.
        </Body>
      </Container>
    </Section>
  )
}
