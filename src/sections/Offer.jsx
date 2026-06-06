import { Section, Container, Cta } from '../components/Primitives'
import { Shield, Check } from '../components/icons'

const CHECKOUT = 'https://pay.kiwify.com.br/SoVEdo7'

// Stack de valor — cada entrega com seu valor percebido. Soma = R$ 297 (a âncora).
const stack = [
  ['Programa Despertar da Autoconfiança · 7 aulas', 'R$ 97'],
  ['Exercícios de reprogramação mental', 'R$ 47'],
  ['Ferramentas para reconstruir sua autoimagem', 'R$ 37'],
  ['Estratégias contra medo, ansiedade e comparação', 'R$ 37'],
  ['Método do Capital Magnético', 'R$ 79'],
]

export default function Offer() {
  return (
    <Section id="oferta">
      <Container narrow>
        {/* Caixa de oferta com glow roxo */}
        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 rounded-[2.5rem] blur-3xl"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 32%, rgba(255,138,31,0.30), var(--color-grape) 48%, transparent 76%)',
              opacity: 0.5,
            }}
          />
          <div className="glass reveal rounded-xl p-8 text-center sm:p-12">
            <span className="inline-block rounded-full border border-amber/35 bg-amber/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-soft">
              Valor promocional
            </span>
            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Comece sua reprogramação hoje</h2>
            <p className="mx-auto mt-4 max-w-xl text-soft/75">
              Um processo de reprogramação mental aplicado à autoconfiança poderia custar muito mais.
              O objetivo do Despertar é ser acessível para quem está pronto para começar.
            </p>

            {/* Stack de valor — tudo que está incluído + valor percebido de cada item */}
            <div className="mx-auto mt-8 max-w-md text-left">
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-soft/45">
                Tudo que você leva
              </p>
              <ul className="space-y-3">
                {stack.map(([label, value]) => (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3"
                  >
                    <span className="flex items-start gap-2.5 text-sm text-soft/85">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-cyan">
                        <Check className="h-3 w-3" />
                      </span>
                      {label}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-soft/70">{value}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-soft/55">
                    Valor total
                  </span>
                  <span className="shrink-0 text-lg font-semibold text-soft/60 line-through decoration-amber/40">
                    R$ 297
                  </span>
                </li>
              </ul>
            </div>

            <div className="my-8 flex flex-col items-center">
              <span className="text-sm text-soft/55">hoje, por apenas</span>
              <span className="mt-1 flex items-start font-display font-extrabold leading-none">
                <span className="mt-3 mr-1 text-2xl text-amber-soft">R$</span>
                <span className="text-amber-grad text-7xl sm:text-8xl">47</span>
              </span>
              <span className="mt-2 text-sm text-soft/60">
                pagamento único · <span className="text-cyan-soft/80">acesso imediato</span>
              </span>
            </div>

            <Cta href={CHECKOUT} checkout block large className="btn-pulse">
              Quero despertar minha autoconfiança
            </Cta>

            <p className="mt-5 text-sm text-amber-soft/80">
              ⚡ Esse preço é promocional e pode mudar a qualquer momento.
            </p>
          </div>
        </div>

        {/* Garantia */}
        <div className="glass reveal mt-8 flex flex-col items-center gap-5 rounded-xl p-8 text-center sm:flex-row sm:text-left">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan/25 bg-cyan/[0.06] text-cyan">
            <Shield className="h-8 w-8" />
          </span>
          <div>
            <h3 className="mb-1 text-xl font-semibold">Garantia incondicional de 7 dias</h3>
            <p className="text-sm leading-relaxed text-soft/80">
              Entre, assista e pratique. Se sentir que não é para você, peça o reembolso dentro do
              prazo e receba <strong className="text-white">100% do seu dinheiro de volta</strong>.
              Sem burocracia, sem enrolação. O risco é meu. A decisão é sua.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
