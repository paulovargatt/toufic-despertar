import { Section, Container, SectionTitle, Body } from '../components/Primitives'
import { Heart, Briefcase, Users, Chat } from '../components/icons'

const cards = [
  {
    Icon: Heart,
    title: 'No amor',
    text: 'Você se entrega demais, aceita pouco e ainda sente medo de ser abandonado.',
  },
  {
    Icon: Briefcase,
    title: 'No trabalho',
    text: 'Você faz o seu melhor, mas trava na hora de se posicionar, cobrar, aparecer ou ocupar espaço.',
  },
  {
    Icon: Users,
    title: 'Nas amizades',
    text: 'Você está sempre disponível para os outros, mas quase nunca é prioridade.',
  },
  {
    Icon: Chat,
    title: 'Na vida social',
    text: 'Você mede palavras, evita conflitos, tenta agradar — e depois se sente vazio.',
  },
]

export default function Cycle() {
  return (
    <Section>
      <Container>
        <SectionTitle center className="mb-12">
          O mesmo ciclo,
          <br />
          em toda área da sua vida
        </SectionTitle>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ Icon, title, text }) => (
            <article key={title} className="glass glass-hover reveal rounded-lg p-7">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-electric/20 bg-electric/5 text-electric">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-soft/75">{text}</p>
            </article>
          ))}
        </div>

        <Body center className="mt-14 max-w-3xl">
          Por fora, talvez ninguém perceba. Mas por dentro você sabe.{' '}
          <strong className="text-white">Isso não é apenas timidez. Isso é programação mental.</strong>{' '}
          E uma programação mental não muda só com motivação — ela muda quando você reprograma a forma
          como se vê, sente, pensa e age.
        </Body>
      </Container>
    </Section>
  )
}
