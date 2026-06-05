import { Section, Container, SectionTitle, Lead, Body } from '../components/Primitives'
import { Check, Cross, Refresh, Shield } from '../components/icons'

const isnt = [
  'um curso cheio de teoria difícil',
  'uma aula para decorar frases bonitas',
  '"pense positivo" e finja que está tudo bem',
  'um personagem arrogante para esconder insegurança',
]

const steps = [
  {
    icon: Refresh,
    title: 'Você percebe o padrão',
    text: 'Aquela voz que te faz travar, se diminuir, aceitar pouco ou fugir de conversas importantes.',
  },
  {
    icon: Shield,
    title: 'Você troca a forma de se enxergar',
    text: 'Com práticas simples, sua mente começa a parar de te tratar como alguém fraco, invisível ou rejeitável.',
  },
  {
    icon: Check,
    title: 'Você age com mais presença',
    text: 'Não porque virou outra pessoa. Mas porque começa a se sentir mais firme dentro da própria pele.',
  },
]

const situations = [
  'falar sem pedir desculpa por existir',
  'parar de implorar atenção de quem te trata como opção',
  'entrar em ambientes sem se sentir menor que todo mundo',
  'se posicionar sem tremer por dentro',
]

export default function WhatIsIt() {
  return (
    <Section>
      <Container narrow>
        <SectionTitle center className="mb-6">
          O que é o Despertar da Autoconfiança?
        </SectionTitle>
        <Lead center className="mb-12 max-w-2xl">
          É um passo a passo de <span className="text-grad">7 dias</span> para calar a voz que te
          diminui e começar a se sentir mais seguro por dentro.
        </Lead>

        <div className="glass reveal mb-10 rounded-lg p-8 sm:p-10">
          <p className="mb-5 text-lg font-semibold text-white">Não é:</p>
          <ul className="space-y-3">
            {isnt.map((t) => (
              <li key={t} className="flex items-center gap-3 text-soft/75">
                <Cross className="h-5 w-5 shrink-0 text-electric/60" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mb-8">
          Pense assim: você até sabe o que deveria fazer. Sabe que deveria falar, se impor,
          parar de aceitar migalhas e aparecer mais. Mas na hora, algo dentro de você trava.
          O Despertar foi feito para mexer justamente nesse “algo”.
        </Body>

        <div className="reveal mb-10 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-lg p-5">
              <Icon className="mb-4 h-6 w-6 text-accent" />
              <h3 className="mb-2 text-lg font-semibold leading-snug text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-soft/75">{text}</p>
            </div>
          ))}
        </div>

        <div className="reveal rounded-lg border border-white/[0.06] bg-black/35 p-6 sm:p-8">
          <p className="mb-5 text-lg font-semibold text-white">Na prática, é para você conseguir:</p>
          <ul className="space-y-3">
            {situations.map((text) => (
              <li key={text} className="flex gap-3 text-soft/80">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10">
          Você não precisa entender psicologia, cérebro ou termos complicados. Só precisa seguir o
          processo por 7 dias e deixar sua mente receber uma nova mensagem:{' '}
          <strong className="text-white">“eu não sou menor do que ninguém”.</strong>
        </Body>
      </Container>
    </Section>
  )
}
