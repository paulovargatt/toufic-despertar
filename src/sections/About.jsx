import { Section, Container, Eyebrow, SectionTitle, Body } from '../components/Primitives'
import expert from '../assets/expert.webp'

export default function About() {
  return (
    <Section alt>
      <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        {/* Retrato — silhueta emergindo do preto, sem moldura */}
        <div className="reveal relative mx-auto w-full max-w-xs sm:max-w-sm">
          {/* glow roxo escuro e difuso atrás da silhueta */}
          <div
            className="absolute left-1/2 top-1/3 -z-10 h-[110%] w-[120%] -translate-x-1/2 -translate-y-1/3 blur-[80px]"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(91,33,182,0.6), rgba(76,29,149,0.25) 55%, transparent 78%)',
            }}
            aria-hidden
          />
          {/* foto limpa — sem filtros, sem blend modes, sem máscaras */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={expert}
              alt="Toufic, criador do Despertar da Autoconfiança"
              className="aspect-[4/5] w-full object-cover object-top"
              loading="lazy"
            />
            {/* fade suave na base para fundir com o fundo da página */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
              style={{ background: 'linear-gradient(to top, #050508 0%, transparent 100%)' }}
            />
          </div>
        </div>

        <div>
          <Eyebrow>Quem vai te guiar</Eyebrow>
          <SectionTitle className="mb-6">
            Eu também já fui refém da minha{' '}
            <span className="text-grad">própria insegurança</span>
          </SectionTitle>

          <Body className="mb-5">
            Meu nome é <strong className="text-white">Toufic</strong>. Já fui o cara que se sentia
            invisível, que se comparava com todo mundo e via gente menos preparada ocupando os
            espaços que eu queria — enquanto eu travava dentro da própria cabeça.
          </Body>

          {/* A virada — pull-quote em ciano (o sinal novo) */}
          <figure className="glass-signal reveal my-7 rounded-lg p-6 sm:p-7">
            <span
              aria-hidden
              className="block text-3xl leading-none text-cyan/50"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              “
            </span>
            <blockquote className="-mt-3 text-lg leading-snug text-white sm:text-xl">
              Até cair a ficha: eu não precisava de{' '}
              <span className="text-soft/60 line-through decoration-electric/50">mais autoestima</span>
              . Eu precisava <span className="text-cyan-grad font-semibold">reprogramar a identidade</span>{' '}
              que eu tinha aceitado como minha.
            </blockquote>
          </figure>

          <Body>
            Foi aí que nasceu este caminho direto: quebrar crenças antigas, reconstruir sua
            autoimagem e ativar uma confiança{' '}
            <strong className="text-white">natural, firme e magnética</strong> — sem virar um
            personagem que não é você.
          </Body>
        </div>
      </Container>
    </Section>
  )
}
