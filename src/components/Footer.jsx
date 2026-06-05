import { Container } from './Primitives'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 pb-28 sm:pb-12">
      <Container className="text-center">
        <p className="font-display text-lg font-semibold text-white">Despertar da Autoconfiança</p>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-soft/45">
          © {new Date().getFullYear()} Toufic. Todos os direitos reservados. Este conteúdo é
          educacional e não substitui acompanhamento psicológico profissional.
        </p>
      </Container>
    </footer>
  )
}
