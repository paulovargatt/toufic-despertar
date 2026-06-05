import { Section, Container, SectionTitle } from '../components/Primitives'
import { Play, Refresh, UserCircle, Bulb, Magnet, Clock } from '../components/icons'

const features = [
  {
    Icon: Play,
    title: '7 aulas práticas e profundas',
    text: 'Cada aula trabalha uma camada da sua insegurança — de onde ela vem e como quebrar esse padrão.',
  },
  {
    Icon: Refresh,
    title: 'Exercícios de reprogramação',
    text: 'Não é só assistir. Você aplica práticas para mudar sua percepção, sua postura e sua forma de agir.',
  },
  {
    Icon: UserCircle,
    title: 'Ferramentas de autoimagem',
    text: 'Você não sustenta uma vida confiante com uma imagem interna fraca. Aqui você reconstrói essa imagem.',
  },
  {
    Icon: Bulb,
    title: 'Estratégias contra o medo',
    text: 'Perceba os pensamentos que te diminuem — antes que eles comandem suas decisões.',
  },
  {
    Icon: Magnet,
    title: 'Método do Capital Magnético',
    text: 'A presença interna que aparece quando você para de mendigar aprovação e passa a sustentar valor próprio.',
  },
  {
    Icon: Clock,
    title: 'Acesso no seu ritmo',
    text: 'Reveja as aulas sempre que precisar reforçar sua nova programação.',
  },
]

export default function Features() {
  return (
    <Section>
      <Container>
        <SectionTitle center className="mb-12">
          O que você recebe dentro do programa
        </SectionTitle>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, text }) => (
            <article
              key={title}
              className="glass glass-hover reveal group rounded-lg p-8 hover:-translate-y-1"
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-electric/20 bg-electric/5 text-electric transition-colors group-hover:bg-electric/15">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-soft/75">{text}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
