import { Container, Cta } from '../components/Primitives'
import { lazy, Suspense, useState, useEffect, useRef } from 'react'

// Code-split: o player + hls.js saem do bundle principal e só carregam quando o Hero monta
const HLSPlayer = lazy(() => import('../components/HLSPlayer'))

/* ════════════════════════════════════════════════════════════════════════════
   Sequência cinematográfica de load
   ────────────────────────────────────────────────────────────────────────────
   stage 0 → cérebro carregando (BgFx). Hero invisível, mas com layout reservado.
   stage 1 → pré-headline digita  (> DESPERTAR DA AUTOCONFIANÇA)
   stage 2 → headline digita      (Faça Uma Lavagem Cerebral Em Si Mesmo)
   stage 3 → subheadline entra
   stage 4 → VSL + card entram

   O cérebro (BgFx) dispara o evento `brain:ready`; só então a 1ª linha começa a
   digitar. Cada elemento, ao terminar, libera o próximo → experiência "em
   progresso" que força o usuário a acompanhar.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Caret estilo terminal (ciano) ── */
function Caret({ done = false, gone = false, style }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: '0.5ch',
        height: '0.9em',
        marginLeft: '1px',
        verticalAlign: '-0.1em',
        background: 'rgba(34, 211, 238, 0.9)',
        boxShadow: '0 0 12px rgba(34, 211, 238, 0.55)',
        // sólido enquanto digita (acompanha a ponta) → pisca quando termina → some
        animation: done && !gone ? 'cursor-blink 0.8s step-end infinite' : 'none',
        opacity: gone ? 0 : 1,
        transition: 'opacity 0.45s ease',
        ...style,
      }}
    />
  )
}

/* ── Motor de digitação: avança 1 "tick" por caractere ──
   Os caracteres ficam SEMPRE no layout (apenas visibility) → sem reflow e sem o
   texto "respirando" ao centralizar enquanto cresce. */
function useTyper({ total, start, instant, msPerChar, onDone }) {
  const [n, setN] = useState(instant ? total : 0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (instant) { setN(total); return }
    if (!start) return
    let i = 0
    setN(0)
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= total) {
        clearInterval(id)
        if (onDoneRef.current) onDoneRef.current()
      }
    }, msPerChar)
    return () => clearInterval(id)
  }, [start, instant, total, msPerChar])

  return n
}

/* ── Pré-headline do terminal ── */
const PRE_TEXT = 'DESPERTAR DA AUTOCONFIANÇA'

function PreHead({ start, instant, gone, onDone }) {
  const n = useTyper({ total: PRE_TEXT.length, start, instant, msPerChar: 46, onDone })
  const started = start || instant
  const done = n >= PRE_TEXT.length
  const chars = [...PRE_TEXT]

  const out = []
  let placed = false
  chars.forEach((ch, i) => {
    if (started && i === n) { out.push(<Caret key="caret" />); placed = true }
    out.push(
      <span key={i} style={{ visibility: i < n ? 'visible' : 'hidden' }}>
        {ch === ' ' ? ' ' : ch}
      </span>,
    )
  })
  if (started && !placed) out.push(<Caret key="caret" done={done} gone={gone} />)

  return <span style={{ whiteSpace: 'nowrap' }}>{out}</span>
}

/* ── Headline ──
   Parte branca = reveal por caractere (visibility).
   "Si Mesmo" = um único span (mantém o foil dourado contínuo) revelado por um
   clip em degraus de 1 caractere, com o caret correndo na borda do clip. */
const HEAD_WHITE = [
  ...[...'Faça Uma Lavagem'].map((ch) => ({ ch })),
  { br: true },
  ...[...'Cerebral Em '].map((ch) => ({ ch })),
]
const GOLD_TEXT = 'Si Mesmo'
const GOLD_START = HEAD_WHITE.length
const HEAD_TOTAL = GOLD_START + GOLD_TEXT.length

function Headline({ start, instant, gone, onDone }) {
  const n = useTyper({ total: HEAD_TOTAL, start, instant, msPerChar: 38, onDone })
  const started = start || instant

  // — parte branca —
  const white = []
  let whiteCaret = false
  HEAD_WHITE.forEach((tk, i) => {
    if (started && i === n) { white.push(<Caret key="wc" />); whiteCaret = true }
    if (tk.br) white.push(<br key={`b${i}`} />)
    else
      white.push(
        <span key={i} style={{ visibility: i < n ? 'visible' : 'hidden' }}>
          {tk.ch}
        </span>,
      )
  })

  // — "Si Mesmo" dourado (clip em degraus) —
  const goldRaw = Math.max(0, Math.min(GOLD_TEXT.length, n - GOLD_START))
  const goldFrac = goldRaw / GOLD_TEXT.length
  const goldHiddenRight = (1 - goldFrac) * 100
  const headDone = n >= HEAD_TOTAL
  const showGoldCaret = started && !whiteCaret && n >= GOLD_START

  return (
    <h1 className="headline-glow max-w-4xl text-[2.3rem] font-extrabold leading-[1.24] sm:text-2xl md:text-5xl">
      {white}
      <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'baseline' }}>
        <span
          className="text-gold-shimmer"
          style={{
            display: 'inline-block',
            clipPath: `inset(0 ${goldHiddenRight}% 0 0)`,
            WebkitClipPath: `inset(0 ${goldHiddenRight}% 0 0)`,
          }}
        >
          {GOLD_TEXT}
        </span>
        {showGoldCaret && (
          <Caret
            done={headDone}
            gone={gone}
            style={{
              position: 'absolute',
              top: '10%',
              left: `${goldFrac * 100}%`,
              height: '0.82em',
              marginLeft: 0,
            }}
          />
        )}
      </span>
    </h1>
  )
}

export default function Hero() {
  const titleRef = useRef(null) // terminal + h1 — camada da frente (sobe mais)
  const subRef = useRef(null)   // subheadline — camada de trás (sobe menos)

  const [stage, setStage] = useState(0)
  const [reduce, setReduce] = useState(false)

  // ── Dispara a sequência quando o cérebro estiver pronto (ou fallback) ──
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (m?.matches) { setReduce(true); setStage(4); return }

    let begun = false
    const begin = () => { if (begun) return; begun = true; setStage((s) => Math.max(s, 1)) }
    window.addEventListener('brain:ready', begin)
    const fallback = setTimeout(begin, 2300) // segurança caso o evento não chegue
    return () => { window.removeEventListener('brain:ready', begin); clearTimeout(fallback) }
  }, [])

  // ── sub → resto (VSL + card) ──
  useEffect(() => {
    if (stage !== 3) return
    const t = setTimeout(() => setStage(4), 460)
    return () => clearTimeout(t)
  }, [stage])

  const onPreDone = () => setTimeout(() => setStage((s) => Math.max(s, 2)), 240)
  const onHeadDone = () => setTimeout(() => setStage((s) => Math.max(s, 3)), 260)

  // ── Parallax de scroll (camadas divergem → profundidade) ──
  useEffect(() => {
    const title = titleRef.current
    const sub = subRef.current
    if (!title && !sub) return
    let raf = 0
    const smooth = (t) => t * t * (3 - 2 * t)
    const apply = () => {
      raf = 0
      const sy = window.scrollY || 0
      const vh = window.innerHeight
      const p = Math.min(1, sy / (vh * 0.85))
      const e = smooth(p)
      if (title) {
        title.style.transform = `translate3d(0, ${-e * 150}px, 0) scale(${1 - e * 0.12})`
        title.style.opacity = String(Math.max(0, 1 - e * 1.15))
        title.style.filter = e > 0.001 ? `blur(${e * 6}px)` : 'none'
      }
      if (sub) {
        sub.style.transform = `translate3d(0, ${-e * 88}px, 0)`
        sub.style.opacity = String(Math.max(0, 1 - e * 1.3))
        sub.style.filter = e > 0.001 ? `blur(${e * 4}px)` : 'none'
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const subVisible = stage >= 3
  const restVisible = stage >= 4
  const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

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
            className="mb-2 mt-18 flex items-center justify-center gap-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.20em',
              opacity: stage >= 1 ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <span style={{ color: 'rgba(34, 211, 238, 0.7)' }}>{'>'}_</span>
            <span style={{ color: 'rgba(196, 181, 253, 0.55)' }}>
              <PreHead start={stage >= 1} instant={reduce} gone={stage >= 2} onDone={onPreDone} />
            </span>
          </div>

          <Headline start={stage >= 2} instant={reduce} gone={stage >= 4} onDone={onHeadDone} />
        </div>

        {/* ── Back layer: subheadline — sobe menos → diverge ── */}
        <div ref={subRef} style={{ willChange: 'transform, opacity, filter' }}>
          <p
            className="mt-6 max-w-2xl mb-6 text-lg text-soft/80 sm:text-xl"
            style={{
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? 'none' : 'translateY(22px)',
              transition: `opacity 0.7s ${easeOut}, transform 0.7s ${easeOut}`,
            }}
          >
            Reprograme sua mente em <strong className="text-white">7 dias</strong> para parar de
            viver como alguém inseguro, invisível e rejeitável.
          </p>
        </div>

        {/* VSL Player — 9:16 portrait */}
        <div
          className="relative mx-auto mb-8"
          style={{
            width: 'min(280px, 70vw)',
            opacity: restVisible ? 1 : 0,
            transform: restVisible ? 'none' : 'translateY(26px)',
            transition: `opacity 0.8s ${easeOut}, transform 0.8s ${easeOut}`,
          }}
        >
          {/* Halo discreto atrás do mockup — roxo contido, só pra dar profundidade */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
            style={{
              transform: 'scale(2.2) translateY(8%)',
              background: 'radial-gradient(ellipse at 50% 45%, rgba(109,40,217,0.07) 0%, transparent 62%)',
              filter: 'blur(52px)',
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

        <div
          className=" mx-auto max-w-2xl px-7 py-2"
          style={{
            opacity: restVisible ? 1 : 0,
            transform: restVisible ? 'none' : 'translateY(26px)',
            transition: `opacity 0.8s ${easeOut} 0.15s, transform 0.8s ${easeOut} 0.15s`,
          }}
        >
          <p className="text-md leading-relaxed text-soft/85 sm:text-xl">
            Quantos relacionamentos, oportunidades, conversas, trabalhos e momentos importantes
            você ainda vai perder obedecendo a uma versão de si mesmo{' '}
            <span className="text-accent">que você nem escolheu ser?</span>
          </p>
        </div>

      </Container>
    </header>
  )
}
