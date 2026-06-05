import { Section, Container, SectionTitle } from '../components/Primitives'
import { Check, Cross } from '../components/icons'

const yes = [
  'Se diminui perto dos outros.',
  'Tem medo de ser julgado, rejeitado ou ridicularizado.',
  'Vive buscando aprovação.',
  'Sente que não é bom o suficiente.',
  'Trava na hora de se posicionar.',
  'Aceita menos do que merece nos relacionamentos.',
  'Se compara demais.',
  'Tem dificuldade de aparecer, vender, falar, cobrar ou ocupar espaço.',
  'Sente que existe uma versão mais forte dentro de você — mas não consegue acessá-la.',
  'Já tentou mudar, mas sempre volta para os mesmos padrões.',
]

const no = [
  'Quer uma solução mágica sem prática.',
  'Só quer assistir aulas e seguir repetindo os mesmos comportamentos.',
  'Quer fingir ser superior aos outros.',
  'Busca manipular pessoas.',
  'Quer uma fórmula vazia de "atração" sem olhar para a própria identidade.',
]

export default function ForWhom() {
  return (
    <Section>
      <Container>
        <SectionTitle center className="mb-14">
          É para você?
        </SectionTitle>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* É para você */}
          <div className="glass reveal rounded-lg p-8 sm:p-10">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-electric/15 text-electric">
                <Check className="h-5 w-5" />
              </span>
              É para você que…
            </h3>
            <ul className="space-y-3">
              {yes.map((t) => (
                <li key={t} className="flex gap-3 text-soft/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-electric" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Não é para você */}
          <div className="glass reveal rounded-lg p-8 sm:p-10">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-soft/60">
                <Cross className="h-5 w-5" />
              </span>
              Não é para você que…
            </h3>
            <ul className="space-y-3">
              {no.map((t) => (
                <li key={t} className="flex gap-3 text-soft/65">
                  <Cross className="mt-1 h-4 w-4 shrink-0 text-soft/40" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-accent/90">
              Este programa é para quem está disposto a olhar para dentro, quebrar padrões antigos e
              agir como uma nova versão de si mesmo.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
