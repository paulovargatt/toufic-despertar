import { Section, Container, Lead, Body, Cta } from '../components/Primitives'

const pillars = ['7 dias', 'Um novo comando mental', 'Uma nova presença no mundo']

export default function FinalCta() {
  return (
    <Section className="overflow-hidden">
      <Container narrow className="text-center">
        <h2 className="reveal text-4xl font-extrabold sm:text-5xl">
          Agora é a <span className="text-grad">sua escolha</span>
        </h2>

        <Body center className="mt-8 max-w-2xl">
          Você pode continuar chamando sua insegurança de personalidade. Pode continuar dizendo{' '}
          <em className="text-accent">"eu sou assim"</em>. Pode continuar aceitando que o medo decida
          por você e se diminuindo para caber em lugares onde deveria se posicionar.
        </Body>

        <Lead center className="mx-auto mt-8 max-w-xl">
          Ou pode começar a fazer uma{' '}
          <span className="text-grad">lavagem cerebral consciente</span> em si mesmo.
        </Lead>

        <Body center className="mx-auto mt-8 max-w-2xl">
          Apagar os comandos antigos. Quebrar crenças que te diminuem. Reconstruir sua autoimagem. E
          despertar uma autoconfiança que não depende mais da aprovação dos outros.
        </Body>

        <ul className="reveal mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {pillars.map((p) => (
            <li
              key={p}
              className="rounded-full border border-electric/20 bg-electric/5 px-5 py-2 text-sm font-medium text-accent"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="reveal mt-12 flex flex-col items-center gap-4">
          {/* TODO: trocar href="#" pelo link real de checkout */}
          <Cta href="#" checkout large>
            Quero despertar minha autoconfiança
          </Cta>
          <span className="text-sm text-soft/60">
            R$ 47 · Garantia incondicional de 7 dias
          </span>
        </div>
      </Container>
    </Section>
  )
}
