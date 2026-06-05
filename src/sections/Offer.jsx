import { Section, Container, Cta } from '../components/Primitives'
import { Shield } from '../components/icons'

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
                'radial-gradient(60% 60% at 50% 40%, var(--color-grape), var(--color-violet) 55%, transparent 75%)',
              opacity: 0.45,
            }}
          />
          <div className="glass reveal rounded-xl p-8 text-center sm:p-12">
            <span className="inline-block rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Valor promocional
            </span>
            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Comece sua reprogramação hoje</h2>
            <p className="mx-auto mt-4 max-w-xl text-soft/75">
              Um processo de reprogramação mental aplicado à autoconfiança poderia custar muito mais.
              O objetivo do Despertar é ser acessível para quem está pronto para começar.
            </p>

            <div className="my-8 flex flex-col items-center">
              <span className="text-sm text-soft/55">
                de <s>R$ 297</s> por apenas
              </span>
              <span className="mt-1 flex items-start font-display font-extrabold leading-none text-white">
                <span className="mt-3 mr-1 text-2xl text-accent">R$</span>
                <span className="text-7xl sm:text-8xl">47</span>
              </span>
              <span className="mt-2 text-sm text-soft/60">pagamento único · acesso imediato</span>
            </div>

            {/* TODO: trocar href="#" pelo link real de checkout */}
            <Cta href="#" checkout block large>
              Quero despertar minha autoconfiança
            </Cta>

            <p className="mt-5 text-sm text-accent/80">
              ⚡ Esse preço é promocional e pode mudar a qualquer momento.
            </p>
          </div>
        </div>

        {/* Garantia */}
        <div className="glass reveal mt-8 flex flex-col items-center gap-5 rounded-xl p-8 text-center sm:flex-row sm:text-left">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-electric/25 bg-electric/5 text-electric">
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
