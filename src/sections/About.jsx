import { useEffect, useRef } from 'react'
import { Eyebrow, Body } from '../components/Primitives'
import expert from '../assets/expert2.webp'

/* ════════════════════════════════════════════════════════════════════════════
   Seção do expert — tratamento cinematográfico
   ────────────────────────────────────────────────────────────────────────────
   Desktop: a foto do Toufic fica "presa" (sticky) preenchendo a tela como
   cenário. Conforme rola, o container de texto sobe de baixo e se assenta —
   título sobre o retrato → Toufic ao centro → bio emergindo da escuridão.
   Dirigido por scroll de forma imperativa (refs + rAF, sem re-render).

   Mobile: empilhado e robusto (retrato que emerge do preto + card abaixo) —
   evita cortar o texto quando a cópia é mais longa que a viewport.

   Respeita prefers-reduced-motion.
   ════════════════════════════════════════════════════════════════════════════ */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const smooth = (t) => t * t * (3 - 2 * t)

/* Cópia da bio — reutilizada no mobile e no desktop (forçada visível: o painel
   sobe escondido e o conteúdo precisa já estar pintado). */
function BioCopy() {
  return (
    <>
      <Body className="!opacity-100 !translate-y-0 mb-4 text-[1rem] sm:mb-5 sm:text-[1.0625rem]">
        Meu nome é <strong className="text-white">Toufic</strong>. Já fui o cara que se sentia
        invisível, que se comparava com todo mundo e via gente menos preparada ocupando os espaços
        que eu queria — enquanto eu travava dentro da própria cabeça.
      </Body>

      {/* A virada — pull-quote em ciano (o sinal novo) */}
      <figure className="glass-signal my-5 rounded-lg p-4 sm:my-6 sm:p-7">
        <span
          aria-hidden
          className="block text-3xl leading-none text-cyan/50"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          “
        </span>
        <blockquote className="-mt-3 text-[1.05rem] leading-snug text-white sm:text-xl">
          Até cair a ficha: eu não precisava de{' '}
          <span className="text-soft/60 line-through decoration-electric/50">mais autoestima</span>. Eu
          precisava <span className="text-cyan-grad font-semibold">reprogramar a identidade</span> que
          eu tinha aceitado como minha.
        </blockquote>
      </figure>

      <Body className="!opacity-100 !translate-y-0 text-[1rem] sm:text-[1.0625rem]">
        Foi aí que nasceu este caminho direto: quebrar crenças antigas, reconstruir sua autoimagem e
        ativar uma confiança <strong className="text-white">natural, firme e magnética</strong> — sem
        virar um personagem que não é você.
      </Body>
    </>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const titleRef = useRef(null)
  const panelRef = useRef(null)
  const veilRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      if (titleRef.current) { titleRef.current.style.opacity = '1'; titleRef.current.style.transform = 'none' }
      if (panelRef.current) panelRef.current.style.transform = 'none'
      if (veilRef.current) veilRef.current.style.opacity = '0.55'
      return
    }

    let raf = 0
    const apply = () => {
      raf = 0
      // Efeito só no desktop — no mobile o bloco fica display:none (layout empilhado).
      if (window.innerWidth < 640) return
      const vh = window.innerHeight
      const rect = section.getBoundingClientRect()
      const total = rect.height - vh // distância de scroll com o stage "preso"
      if (total <= 0) return
      const p = clamp(-rect.top / total, 0, 1) // 0 → acabou de prender · 1 → vai soltar

      // Título + eyebrow sobre o retrato — entram cedo
      const tin = smooth(clamp(p / 0.22, 0, 1))
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tin)
        titleRef.current.style.transform = `translate3d(0, ${(1 - tin) * 26}px, 0)`
      }

      // Imagem — Ken Burns lento (parallax + leve aproximação)
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(0, ${p * -5}%, 0) scale(${1.06 + p * 0.07})`
      }

      // Container de texto sobe de baixo e se assenta (0 → 0.72 da progressão)
      const rise = smooth(clamp(p / 0.72, 0, 1))
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(0, ${(1 - rise) * 100}%, 0)`
      }

      // Véu escurece a imagem conforme o texto sobe → foco migra pra leitura
      if (veilRef.current) {
        veilRef.current.style.opacity = String(0.12 + rise * 0.46)
      }
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="sobre" className="relative">
      {/* ═══════════════ MOBILE — empilhado, sem corte ═══════════════ */}
      <div className="sm:hidden">
        {/* Retrato — emerge do preto no topo e funde no preto na base */}
        <div className="relative h-[72vh] overflow-hidden bg-ink">
          <img
            src={expert}
            alt="Toufic em seu escritório — criador do Despertar da Autoconfiança"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          {/* topo: a imagem nasce do preto (sem corte seco) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{ background: 'linear-gradient(to bottom, #040404 0%, rgba(4,4,4,0.6) 24%, transparent 62%)' }}
            aria-hidden
          />
          {/* base: funde no preto, de onde o título emerge */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
            style={{ background: 'linear-gradient(to top, #040404 14%, rgba(4,4,4,0.55) 48%, transparent 100%)' }}
            aria-hidden
          />
          {/* roxo contido (marca) */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[28rem] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(76,29,149,0.2) 0%, transparent 68%)', filter: 'blur(80px)' }}
            aria-hidden
          />
          {/* título sobre a base do retrato */}
          <div
            className="absolute inset-x-0 bottom-0 px-5 pb-6 text-center"
            style={{ textShadow: '0 2px 26px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.7)' }}
          >
            <Eyebrow center className="!opacity-100 !translate-y-0 !mb-2">Quem vai te guiar</Eyebrow>
            <h2 className="text-[1.6rem] font-bold leading-[1.18]">
              Eu também já fui refém da minha <span className="text-red-300">própria insegurança</span>
            </h2>
          </div>
        </div>

        {/* Bio — card que continua do retrato */}
        <div className="bg-ink px-4 pb-14">
          <div
            className="mx-auto -mt-2 max-w-xl rounded-2xl border border-white/10 p-5"
            style={{
              background: 'linear-gradient(180deg, rgba(10,10,15,0.92), rgba(8,8,12,0.98))',
              boxShadow: '0 -10px 50px -28px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <BioCopy />
          </div>
        </div>
      </div>

      {/* ═══════════════ DESKTOP — pin cinematográfico ═══════════════ */}
      <div ref={sectionRef} className="hidden h-[210vh] sm:block">
        {/* Stage cinematográfico — preso enquanto a seção rola */}
        <div className="sticky top-0 h-screen overflow-hidden bg-ink">
          {/* Retrato full-bleed (escritório do Toufic) */}
          <img
            ref={imgRef}
            src={expert}
            alt="Toufic em seu escritório — criador do Despertar da Autoconfiança"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ transform: 'scale(1.06)', willChange: 'transform' }}
            loading="lazy"
          />

          {/* Vinheta — escurece bordas e foca o centro */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(125% 85% at 50% 32%, transparent 28%, rgba(4,4,4,0.5) 72%, #040404 100%)',
            }}
            aria-hidden
          />
          {/* Topo — a imagem EMERGE do preto da página (sem corte seco) e dá contraste
             pro título/headline que entra em seguida */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-3/4"
            style={{
              background:
                'linear-gradient(to bottom, #040404 0%, rgba(4,4,4,0.94) 9%, rgba(4,4,4,0.6) 24%, rgba(4,4,4,0.22) 42%, transparent 62%)',
            }}
            aria-hidden
          />
          {/* Base sólida — de onde o container de texto "emerge" */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
            style={{ background: 'linear-gradient(to top, #040404 6%, rgba(4,4,4,0.7) 34%, transparent 100%)' }}
            aria-hidden
          />
          {/* Toque roxo contido no topo (marca) */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(76,29,149,0.18) 0%, transparent 68%)', filter: 'blur(90px)' }}
            aria-hidden
          />
          {/* Véu dinâmico — adensa conforme o texto sobe */}
          <div ref={veilRef} className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: 0.12 }} aria-hidden />

          {/* Eyebrow + título — legenda cinematográfica sobre o retrato */}
          <div
            ref={titleRef}
            className="absolute inset-x-0 top-[10%] z-10 px-5"
            style={{ opacity: 0, transform: 'translate3d(0,26px,0)', willChange: 'transform, opacity' }}
          >
            <div
              className="mx-auto max-w-3xl text-center"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.75), 0 1px 4px rgba(0,0,0,0.7)' }}
            >
              <Eyebrow center className="!opacity-100 !translate-y-0">Quem vai te guiar</Eyebrow>
              <h2 className="text-[2rem] font-bold leading-[1.15] md:text-[2.35rem]">
                Eu também já fui refém da minha <span className="text-red-300">própria insegurança</span>
              </h2>
            </div>
          </div>

          {/* Container de texto — sobe de baixo e completa a seção */}
          <div
            ref={panelRef}
            className="absolute inset-x-0 bottom-0 z-20"
            style={{ transform: 'translate3d(0,100%,0)', willChange: 'transform' }}
          >
            <div className="mx-auto w-full max-w-2xl px-6 pb-20">
              <div
                className="rounded-2xl border border-white/10 p-8"
                style={{
                  background: 'linear-gradient(180deg, rgba(10,10,15,0.82), rgba(8,8,12,0.96))',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 -10px 60px -24px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <BioCopy />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
