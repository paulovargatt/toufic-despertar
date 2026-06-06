import { Section, Container, Eyebrow, SectionTitle, Lead } from '../components/Primitives'
import proof1 from '../assets/proof-1.webp'
import proof2 from '../assets/proof-2.jpg'
import proof3 from '../assets/proof-3.webp'

// Prints reais recebidos pelo Toufic (pasta /deps). Para remover um, basta apagar a linha.
const proofs = [
  { src: proof3, caption: 'Aluno · WhatsApp' },
  { src: proof1, caption: 'Aluno · WhatsApp' },
  { src: proof2, caption: 'Aluna · WhatsApp' },
]

export default function Proof() {
  return (
    <Section alt>
      <Container>
        <Eyebrow center>Provas reais</Eyebrow>
        <SectionTitle center className="mb-6">
          Não acredite só na <span className="text-cyan-grad">minha palavra</span>
        </SectionTitle>
        <Lead center className="mb-14 max-w-2xl">
          Mensagens reais de quem decidiu parar de viver refém da própria cabeça.
        </Lead>

        {/* Mural de prints — colunas masonry para respeitar a altura natural de cada captura */}
        <div className="mx-auto max-w-4xl columns-1 gap-5 sm:columns-2 lg:columns-3">
          {proofs.map(({ src, caption }, i) => (
            <figure
              key={i}
              className="reveal mb-5 break-inside-avoid overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]"
            >
              <img
                src={src}
                alt="Mensagem real de aluno do Toufic recebida no WhatsApp"
                loading="lazy"
                className="w-full"
              />
              <figcaption className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-xs text-soft/55">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-cyan"
                  style={{ boxShadow: '0 0 7px 1px rgba(34,211,238,0.6)' }}
                />
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
