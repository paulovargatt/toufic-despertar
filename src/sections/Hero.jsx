import { Container, Cta } from '../components/Primitives'
import HLSPlayer from '../components/HLSPlayer'
import { Suspense, useState, useEffect } from 'react'

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
          background: 'rgba(196, 181, 253, 0.65)',
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
  return (
    <header className="relative overflow-hidden pt-28 pb-8 sm:pt-32 sm:pb-28">
      <Container className="flex flex-col items-center text-center">

        {/* ── Terminal prompt ── */}
        <div
          className="reveal mb-2 mt-16 flex items-center gap-2"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.20em' }}
        >
          <span style={{ color: 'rgba(124, 90, 245, 0.5)' }}>{'>'}_</span>
          <span style={{ color: 'rgba(196, 181, 253, 0.55)' }}>
            <TypewriterText text="O DESPERTAR DA AUTOCONFIANÇA" />
          </span>
        </div>

        

        <h1 className="reveal max-w-4xl text-[2.3rem] font-extrabold leading-[1.24] sm:text-2xl md:text-5xl">
          Faça Uma Lavagem
          <br />
          Cerebral Em <span className="text-grad">Si Mesmo</span>
        </h1>

        <p className="reveal mt-6 max-w-2xl mb-6 text-lg text-soft/80 sm:text-xl">
          Reprograme sua mente em <strong className="text-white">7 dias</strong> para parar de
          viver como alguém inseguro, invisível e rejeitável.
        </p>

        {/* VSL Player — 9:16 portrait */}
        <div className="relative mx-auto mb-8" style={{ width: 'min(300px, 70vw)' }}>
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
