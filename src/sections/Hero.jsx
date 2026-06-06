import { Container, Cta } from '../components/Primitives'
import HLSPlayer from '../components/HLSPlayer'
import { Suspense, useState, useEffect, useRef } from 'react'

/* ── Typewriter inline component ── */
function TypewriterText({ text, startDelay = 800, charDelay = 45 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, charDelay)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, startDelay, charDelay])

  return (
    <span>
      {displayed}
      {/* Cursor pisca enquanto digita, some depois */}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1.1em',
          background: 'rgba(34, 211, 238, 0.7)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation: done ? 'none' : 'cursor-blink 0.75s step-end infinite',
          opacity: done ? 0 : 1,
          transition: 'opacity 0.4s ease 1s',
        }}
      />
    </span>
  )
}

export default function Hero() {
  const titleRef = useRef(null)   // terminal + h1 — camada da frente (sobe mais)
  const subRef   = useRef(null)   // subheadline — camada de trás (sobe menos)

  useEffect(() => {
    const title = titleRef.current
    const sub   = subRef.current
    if (!title && !sub) return
    let raf = 0
    // smoothstep — entrada/saída suave, sem trancos
    const smooth = t => t * t * (3 - 2 * t)
    const apply = () => {
      raf = 0
      const sy = window.scrollY || 0
      const vh = window.innerHeight
      const p  = Math.min(1, sy / (vh * 0.85))   // progresso 0→1 ao longo de ~85% da tela
      const e  = smooth(p)

      // Camada da frente: sobe forte, encolhe e desfoca (recua para o fundo)
      if (title) {
        title.style.transform = `translate3d(0, ${-e * 150}px, 0) scale(${1 - e * 0.12})`
        title.style.opacity   = String(Math.max(0, 1 - e * 1.15))
        title.style.filter    = e > 0.001 ? `blur(${e * 6}px)` : 'none'
      }
      // Camada de trás: sobe menos → diverge da headline, criando profundidade
      if (sub) {
        sub.style.transform = `translate3d(0, ${-e * 88}px, 0)`
        sub.style.opacity   = String(Math.max(0, 1 - e * 1.3))
        sub.style.filter    = e > 0.001 ? `blur(${e * 4}px)` : 'none'
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <header className="relative overflow-hidden pt-28 pb-8 sm:pt-32 sm:pb-28">
      {/* Grid texture — fades in from top so the neural animation isn't blocked */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(127,127,127,0.025) 0px, rgba(127,127,127,0.035) 1px, transparent 1px, transparent 17px), repeating-linear-gradient(0deg, rgba(127,127,127,0.055) 0px, rgba(127,127,127,0.055) 1px, transparent 1px, transparent 17px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 55%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 55%)',
        }}
      />
      <Container className="flex flex-col items-center text-center">

        {/* ── Front layer: terminal + headline — sobe forte no scroll ── */}
        <div ref={titleRef} style={{ willChange: 'transform, opacity, filter' }}>
          {/* Terminal prompt */}
          <div
            className="reveal mb-2 mt-18 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.20em' }}
          >
            <span style={{ color: 'rgba(34, 211, 238, 0.7)' }}>{'>'}_</span>
            <span style={{ color: 'rgba(196, 181, 253, 0.55)' }}>
              <TypewriterText text="DESPERTAR DA AUTOCONFIANÇA" />
            </span>
          </div>

          <h1 className="reveal headline-glow max-w-4xl text-[2.3rem] font-extrabold leading-[1.24] sm:text-2xl md:text-5xl">
            Faça Uma Lavagem
            <br />
            Cerebral Em <span className="text-gold-shimmer">Si Mesmo</span>
          </h1>
        </div>

        {/* ── Back layer: subheadline — sobe menos → diverge ── */}
        <div ref={subRef} style={{ willChange: 'transform, opacity, filter' }}>
          <p className="reveal mt-6 max-w-2xl mb-6 text-lg text-soft/80 sm:text-xl">
            Reprograme sua mente em <strong className="text-white">7 dias</strong> para parar de
            viver como alguém inseguro, invisível e rejeitável.
          </p>
        </div>

        {/* VSL Player — 9:16 portrait */}
        <div className="relative mx-auto mb-8" style={{ width: 'min(280px, 70vw)' }}>
          {/* Purple glow halo behind mockup */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
            style={{
              transform: 'scale(1.6) translateY(5%)',
              borderRadius: '50%',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
            style={{
              transform: 'scale(2.4) translateY(8%)',
              background: 'radial-gradient(ellipse at 50% 45%, rgba(109,40,217,0.14) 0%, transparent 65%)',
              filter: 'blur(48px)',
              borderRadius: '50%',
            }}
          />
          <div className="relative" style={{ paddingBottom: '177.78%' }}>
           

            <div className="absolute inset-0">
              <Suspense fallback={<div className="w-full h-full bg-black/40" />}>
                <HLSPlayer
                  src="https://video.gumlet.io/69d032cc3dba9e8551222e50/6a232fefbc82cd6f1a8fdd28/main.m3u8"
                  autoplay={true}
                  fakeBar={true}
                  className="w-full h-full shadow-2xl"
                  onTimeUpdate={() => {}}
                  onLoadedData={() => {}}
                  onEnded={() => {}}
                />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="glass reveal mx-auto max-w-2xl px-7 py-2">
          <p className="text-lg leading-relaxed text-soft/85 sm:text-xl">
            Quantos relacionamentos, oportunidades, conversas, trabalhos e momentos importantes
            você ainda vai perder obedecendo a uma versão de si mesmo{' '}
            <span className="text-accent">que você nem escolheu ser?</span>
          </p>
        </div>

      </Container>
    </header>
  )
}
