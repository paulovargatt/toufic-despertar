import { useState } from 'react'
import { Section, Container, SectionTitle } from '../components/Primitives'
import { Plus } from '../components/icons'

const faqs = [
  {
    q: 'Preciso ter experiência com desenvolvimento pessoal?',
    a: 'Não. O conteúdo foi criado para ser simples, direto e aplicável. Você não precisa ter estudado nada antes — só precisa estar disposto a olhar para seus padrões com honestidade.',
  },
  {
    q: 'Funciona mesmo em 7 dias?',
    a: 'Em 7 dias você pode começar a perceber mudanças de clareza, postura e consciência. A transformação fica mais forte com a prática. O programa foi criado para iniciar uma reprogramação — não para vender uma fantasia de mudança instantânea sem esforço.',
  },
  {
    q: 'Isso serve para relacionamentos?',
    a: 'Sim. Muitos problemas nos relacionamentos vêm de crenças de rejeição, medo de abandono, carência e falta de valor pessoal. Quando você muda a forma como se enxerga, muda também o tipo de amor que aceita.',
  },
  {
    q: 'Isso serve para trabalho e oportunidades?',
    a: 'Sim. A insegurança afeta sua fala, sua postura, sua capacidade de aparecer, vender, cobrar, negociar e ocupar espaço. Autoconfiança não muda só sua vida emocional — muda sua presença no mundo.',
  },
  {
    q: 'Por quanto tempo terei acesso?',
    a: 'Você terá acesso ao conteúdo para assistir no seu ritmo e rever sempre que precisar reforçar sua nova programação.',
  },
  {
    q: 'Existe garantia?',
    a: 'Sim. Você tem 7 dias de garantia incondicional. Se não gostar, basta pedir reembolso dentro do prazo.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass reveal overflow-hidden rounded-lg">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-medium text-white sm:text-lg">{q}</span>
        <Plus
          className={`h-5 w-5 shrink-0 text-cyan transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-soft/75">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <Section alt>
      <Container narrow>
        <SectionTitle center className="mb-12">
          Perguntas frequentes
        </SectionTitle>
        <div className="space-y-4">
          {faqs.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
