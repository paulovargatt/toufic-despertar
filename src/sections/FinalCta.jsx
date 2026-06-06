import { Section, Container, Body, Cta } from '../components/Primitives'
import { Check, Cross } from '../components/icons'

const pillars = ['7 dias', 'Um novo comando mental', 'Uma nova presença no mundo']

const stay = [
  'Seguir chamando sua insegurança de "personalidade"',
  'Deixar o medo decidir por você',
  'Se diminuir pra caber onde devia se impor',
]

const change = [
  'Apagar os comandos antigos',
  'Quebrar as crenças que te diminuem',
  'Reconstruir sua autoimagem de dentro pra fora',
  'Despertar uma confiança que não depende de ninguém',
]

export default function FinalCta() {
  return (
    <Section className="overflow-hidden">
      <Container narrow className="text-center">
        <h2 className="reveal text-4xl font-extrabold sm:text-5xl">
          Agora é a <span className="text-grad">sua escolha</span>
        </h2>

        <Body center className="mx-auto mt-6 max-w-xl">
          Os próximos meses vão passar de qualquer jeito. A única pergunta é por qual desses dois
          caminhos.
        </Body>

        {/* Bifurcação: o loop (roxo apagado) vs. o despertar (ciano aceso) */}
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          {/* Caminho 1 — continuar no automático */}
          <div className="reveal rounded-lg border border-white/[0.06] bg-white/[0.015] p-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-soft/40">
              Continuar no automático
            </p>
            <ul className="space-y-3">
              {stay.map((t) => (
                <li key={t} className="flex gap-3 text-soft/55">
                  <Cross className="mt-1 h-4 w-4 shrink-0 text-soft/35" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/5 pt-4 text-sm text-soft/40">
              …e daqui a um ano, o mesmo personagem.
            </p>
          </div>

          {/* Caminho 2 — o despertar */}
          <div className="glass-signal reveal rounded-lg p-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan/70">
              Fazer a lavagem cerebral consciente
            </p>
            <ul className="space-y-3">
              {change.map((t) => (
                <li key={t} className="flex gap-3 text-soft/90">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan/40 text-cyan">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-cyan/10 pt-4 text-sm font-medium text-cyan-soft/80">
              …e daqui a um ano, uma versão sua que você nem reconheceria hoje.
            </p>
          </div>
        </div>

        <ul className="reveal mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {pillars.map((p) => (
            <li
              key={p}
              className="rounded-full border border-cyan/20 bg-cyan/[0.06] px-5 py-2 text-sm font-medium text-cyan-soft/90"
            >
              {p}
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 flex flex-col items-center gap-4">
          {/* TODO: trocar href="#" pelo link real de checkout */}
          <Cta href="#" checkout large className="btn-pulse">
            Quero despertar minha autoconfiança
          </Cta>
          <span className="text-sm text-soft/60">
            <span className="font-semibold text-amber-soft">R$ 47</span> · Garantia incondicional de 7
            dias
          </span>
        </div>
      </Container>
    </Section>
  )
}
