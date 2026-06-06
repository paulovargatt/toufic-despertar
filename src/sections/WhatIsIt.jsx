import { Section, Container, SectionTitle, Lead, Body } from '../components/Primitives'
import { Check, Refresh, Shield } from '../components/icons'

const isnt = ['teoria difícil', 'decorar frases bonitas', '"pensar positivo" ']

const steps = [
  {
    icon: Refresh,
    title: 'Você vê o padrão',
    text: 'Aquela voz que te faz travar, se diminuir e fugir das conversas que importam fica escancarada.',
  },
  {
    icon: Shield,
    title: 'Você troca a lente',
    text: 'Com práticas simples, sua mente para de te tratar como alguém fraco, invisível ou rejeitável.',
  },
  {
    icon: Check,
    title: 'Você age com presença',
    text: 'Não porque virou outra pessoa — mas porque finalmente se sente firme dentro da própria pele.',
  },
]

const situations = [
  'Falar sem pedir desculpa por existir',
  'Parar de implorar atenção de quem te trata como opção',
  'Entrar em qualquer ambiente sem se sentir menor',
  'Se posicionar sem tremer por dentro',
]

export default function WhatIsIt() {
  return (
    <Section>
      <Container narrow>
        <SectionTitle center className="mb-6">
          O que é o Despertar da Autoconfiança?
        </SectionTitle>
        <Lead center className="mb-12 max-w-2xl">
          Um passo a passo de <span className="text-cyan-grad">7 dias</span> pra calar a voz que te
          diminui e te fazer sentir firme por dentro.
        </Lead>

        {/* O que NÃO é — chips riscados, leves */}
        <div className="reveal mb-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-soft/45">
            Esquece o que vem na sua cabeça
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {isnt.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-sm text-soft/45 line-through decoration-electric/40"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Body className="mb-10 text-center">
          É mais simples — e mais fundo — que isso. Funciona em{' '}
          <span className="text-white">3 movimentos</span>:
        </Body>

        {/* 3 movimentos — fluxo numerado em ciano */}
        <div className="reveal mb-12 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="glass relative rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="text-sm tracking-[0.15em] text-cyan/70"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 text-base font-semibold leading-snug text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-soft/75">{text}</p>
            </div>
          ))}
        </div>

        {/* Resultado prático — checklist ciano */}
        <div className="glass-signal reveal rounded-lg p-7 sm:p-9">
          <p className="mb-5 text-lg font-semibold text-white">
            Na prática, é pra você <span className="text-cyan-grad">conseguir</span>:
          </p>
          <ul className="grid gap-3.5 sm:grid-cols-2">
            {situations.map((text) => (
              <li key={text} className="flex gap-3 text-soft/85">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-cyan">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Body className="mt-10 text-center max-w-2xl">
          Você não precisa entender de cérebro nem de psicologia. Só seguir o processo por 7 dias e
          deixar sua mente receber um novo comando:{' '}
          <strong className="text-white">"eu não sou menor do que ninguém".</strong>
        </Body>
      </Container>
    </Section>
  )
}
