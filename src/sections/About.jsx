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
            Foi por isso que criei o <span className="text-grad">Despertar da Autoconfiança</span>
          </SectionTitle>
          <Body className="mb-5">
            Meu nome é <strong className="text-white">Toufic</strong>. Criei esse processo para
            pessoas que cansaram de viver como reféns da própria insegurança — pessoas que sabem que
            existe uma versão maior dentro delas, mas ainda se sentem presas a uma mente antiga.
          </Body>
          <Body className="mb-5">
            Eu conheço essa prisão porque já estive nela. Também já fui o cara que se sentia
            invisível, que se comparava, que tinha medo de errar, que via pessoas menos preparadas
            ocupando espaços que eu queria — enquanto eu continuava preso dentro da minha própria
            cabeça.
          </Body>
          <Body>
            Até entender uma coisa: eu não precisava apenas melhorar minha autoestima.{' '}
            <strong className="text-white">
              Eu precisava reprogramar a identidade que tinha aceitado como minha.
            </strong>{' '}
            Foi aí que nasceu este caminho direto para quebrar crenças antigas, reconstruir sua
            autoimagem e ativar uma confiança mais natural, firme e magnética.
          </Body>
        </div>
      </Container>
    </Section>
  )
}
