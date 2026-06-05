import { useEffect, useState } from 'react'

export default function StickyCta() {
  const [scrolled, setScrolled] = useState(false)
  const [offerVisible, setOfferVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Esconde a barra fixa quando a seção de oferta está visível (evita CTA duplicado)
    const offer = document.getElementById('oferta')
    let io
    if (offer && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => setOfferVisible(entry.isIntersecting),
        { rootMargin: '0px 0px -35% 0px' },
      )
      io.observe(offer)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = scrolled && !offerVisible

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-electric/15 bg-ink/85 backdrop-blur-xl transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3">
        <div className="leading-tight">
          <span className="block font-display text-xl font-bold text-white">R$ 47</span>
          <span className="text-xs text-soft/60">acesso hoje · garantia 7 dias</span>
        </div>
        <a
          href="#oferta"
          className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
        >
          Quero agora →
        </a>
      </div>
    </div>
  )
}
