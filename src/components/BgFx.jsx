// src/components/BgFx.jsx
import { useEffect, useRef } from 'react'

// ─── Brain blueprint (side-profile silhouette, normalized −1..1) ────────────────
const BRAIN_BLUEPRINT = [
  // Cerebrum outer contour
  { rx: -0.85, ry: -0.15 }, { rx: -0.80, ry: -0.38 }, { rx: -0.65, ry: -0.62 },
  { rx: -0.45, ry: -0.80 }, { rx: -0.18, ry: -0.90 }, { rx:  0.10, ry: -0.90 },
  { rx:  0.38, ry: -0.80 }, { rx:  0.60, ry: -0.65 }, { rx:  0.78, ry: -0.45 },
  { rx:  0.85, ry: -0.20 }, { rx:  0.88, ry:  0.05 }, { rx:  0.80, ry:  0.28 },
  { rx:  0.62, ry:  0.42 },
  // Temporal lobe
  { rx: -0.52, ry:  0.32 }, { rx: -0.72, ry:  0.12 }, { rx: -0.82, ry:  0.08 },
  // Cerebellum
  { rx:  0.35, ry:  0.58 }, { rx:  0.52, ry:  0.66 }, { rx:  0.68, ry:  0.58 },
  { rx:  0.74, ry:  0.42 },
  // Brain stem
  { rx:  0.05, ry:  0.52 }, { rx:  0.00, ry:  0.78 }, { rx: -0.05, ry:  0.95 },
  // Deep structures (firing core)
  { rx: -0.45, ry: -0.15 }, { rx: -0.20, ry: -0.45 }, { rx:  0.15, ry: -0.45 },
  { rx:  0.48, ry: -0.25 }, { rx: -0.35, ry:  0.08 }, { rx:  0.00, ry: -0.10 },
  { rx:  0.32, ry:  0.02 }, { rx:  0.50, ry:  0.18 }, { rx: -0.12, ry:  0.28 },
  { rx:  0.18, ry:  0.32 }, { rx: -0.25, ry: -0.02 }, { rx:  0.22, ry: -0.18 },
  { rx:  0.06, ry:  0.16 },
]

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const easeOutCubic = t => 1 - Math.pow(1 - t, 3)

// ─── Component ──────────────────────────────────────────────────────────────────
export default function BgFx() {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Mutable state bucket (kept off React to avoid re-renders)
    const S = {
      nodes: [], edges: [], adj: [], signals: [],
      W: 0, H: 0, isMobile: false,
      clock: 0, intro: 0,
      ignited: false, introGlow: 0,         // revela suavemente 0→1 quando o boot termina
      viewX: 0, viewY: 0,                 // parallax offset eased toward cursor
      mouse: { x: 0, y: 0, active: false },
      fireTimer: 0.6,
    }

    // ── Pre-rendered glow sprites (built once, blitted per frame) ───────────────
    // Drawing a cached sprite with drawImage is far cheaper than allocating a
    // radial gradient every frame — this is the core of the optimization.
    const makeSprite = (stops) => {
      const size = 128
      const c = document.createElement('canvas')
      c.width = c.height = size
      const g = c.getContext('2d')
      const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      stops.forEach(([o, col]) => grd.addColorStop(o, col))
      g.fillStyle = grd
      g.fillRect(0, 0, size, size)
      return c
    }
    const haloSprite = makeSprite([
      [0,    'rgba(150,116,255,0.55)'],
      [0.35, 'rgba(124,90,245,0.26)'],
      [1,    'rgba(124,90,245,0)'],
    ])
    const coreSprite = makeSprite([
      [0,    'rgba(255,255,255,1)'],
      [0.2,  'rgba(224,212,255,0.95)'],
      [0.5,  'rgba(150,116,255,0.5)'],
      [1,    'rgba(124,90,245,0)'],
    ])
    // Sinais coloridos — ciano (o novo comando) e âmbar (energia/ação)
    const coreSpriteCyan = makeSprite([
      [0,    'rgba(255,255,255,1)'],
      [0.22, 'rgba(190,246,255,0.95)'],
      [0.5,  'rgba(34,211,238,0.55)'],
      [1,    'rgba(34,211,238,0)'],
    ])
    const coreSpriteAmber = makeSprite([
      [0,    'rgba(255,255,255,1)'],
      [0.22, 'rgba(255,224,178,0.95)'],
      [0.5,  'rgba(255,138,31,0.6)'],
      [1,    'rgba(255,138,31,0)'],
    ])
    const spriteFor = (c) =>
      c === 'cyan' ? coreSpriteCyan : c === 'amber' ? coreSpriteAmber : coreSprite
    const pickSignalColor = () => {
      const r = Math.random()
      return r < 0.3 ? 'cyan' : r < 0.45 ? 'amber' : 'core'
    }
    const blit = (sprite, x, y, r, a) => {
      if (a <= 0.002 || r <= 0.2) return
      ctx.globalAlpha = a > 1 ? 1 : a
      ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
    }

    // ── Build the neural network ────────────────────────────────────────────────
    const initNetwork = () => {
      const { W, H } = S
      S.isMobile = W < 768
      const R  = Math.min(W, H) * (S.isMobile ? 0.18 : 0.24)
      const cx = W * 0.5
      const cy = S.isMobile ? H * 0.14 : H * 0.16

      S.nodes = BRAIN_BLUEPRINT.map(pt => {
        const bx = cx + pt.rx * R
        const by = cy + pt.ry * R
        return {
          bx, by, x: bx, y: by,
          phx: Math.random() * Math.PI * 2, phy: Math.random() * Math.PI * 2,
          spx: 0.5 + Math.random() * 0.4,   spy: 0.5 + Math.random() * 0.4,
          r:   1.0 + Math.random() * 0.9,
          energy: 0, cool: 0,
          order: Math.hypot(pt.rx, pt.ry),  // intro stagger: center fires out first
        }
      })
      const maxOrder = Math.max(...S.nodes.map(n => n.order)) || 1
      S.nodes.forEach(n => { n.order /= maxOrder })

      // Edges: K nearest neighbors *within* a distance threshold → tight, tissue-like
      const K = 3
      const maxD = R * 0.62
      const edges = []
      const seen  = new Set()
      for (let i = 0; i < S.nodes.length; i++) {
        const a = S.nodes[i]
        const near = []
        for (let j = 0; j < S.nodes.length; j++) {
          if (i === j) continue
          const dx = S.nodes[j].bx - a.bx, dy = S.nodes[j].by - a.by
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < maxD) near.push({ j, d })
        }
        near.sort((p, q) => p.d - q.d)
        for (let k = 0; k < Math.min(K, near.length); k++) {
          const j   = near[k].j
          const key = i < j ? i + '-' + j : j + '-' + i
          if (seen.has(key)) continue
          seen.add(key)
          const b   = S.nodes[j]
          const dx  = b.bx - a.bx, dy = b.by - a.by
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          edges.push({
            from: i, to: j,
            nx: -dy / len, ny: dx / len,
            bend: len * 0.16 * (Math.random() < 0.5 ? 1 : -1),
            control: { x: 0, y: 0 },
          })
        }
      }
      S.edges = edges
      S.adj   = S.nodes.map(() => [])
      edges.forEach((e, idx) => {
        S.adj[e.from].push({ to: e.to,   edge: idx })
        S.adj[e.to  ].push({ to: e.from, edge: idx })
      })
      S.signals = []
    }

    // ── Neuron firing ───────────────────────────────────────────────────────────
    const maxSignals = () => (S.isMobile ? 7 : 16)
    const SIG_SPEED  = 0.85
    const fireNode = (i, strength, spread, exclude = -1) => {
      const n = S.nodes[i]
      if (!n) return
      n.energy = Math.min(1.6, n.energy + strength)
      if (spread <= 0) return
      const cap = maxSignals()
      for (const a of S.adj[i]) {
        if (a.to === exclude) continue
        if (S.signals.length >= cap) break
        if (Math.random() < spread) {
          S.signals.push({
            edge: a.edge, s: i, e: a.to, t: 0,
            speed: SIG_SPEED * (0.8 + Math.random() * 0.5),
            str: strength,
            color: pickSignalColor(),
          })
        }
      }
    }

    // Quadratic-bezier point helpers (for signals traveling along curved synapses)
    const qx = (a, c, b, t) => { const u = 1 - t; return u * u * a.x + 2 * u * t * c.x + t * t * b.x }
    const qy = (a, c, b, t) => { const u = 1 - t; return u * u * a.y + 2 * u * t * c.y + t * t * b.y }

    // ── Resize ──────────────────────────────────────────────────────────────────
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      S.W = rect.width
      S.H = rect.height
      canvas.width  = Math.round(S.W * dpr)
      canvas.height = Math.round(S.H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)   // reset + scale (no accumulation)
      initNetwork()
      if (reduceMotion) renderStatic()
    }

    // ── Draw a single frame ─────────────────────────────────────────────────────
    const draw = (dt) => {
      const { W, H } = S
      const isMobile = S.isMobile
      ctx.clearRect(0, 0, W, H)

      if (S.intro < 1) S.intro = Math.min(1, S.intro + dt / 1.6)
      const introE = easeOutCubic(S.intro)

      // Ignição: quando o cérebro termina de "baixar", um surto explode do centro
      if (S.intro >= 1 && !S.ignited) {
        S.ignited = true
        for (let i = 0; i < S.nodes.length; i++) {
          if (S.nodes[i].order < 0.4) fireNode(i, 1.5, 0.9)
        }
      }
      if (S.ignited && S.introGlow < 1) S.introGlow = Math.min(1, S.introGlow + dt / 1.8)

      // Parallax eased toward cursor (very subtle)
      const tX = S.mouse.active ? (S.mouse.x - W / 2) * 0.012 : 0
      const tY = S.mouse.active ? (S.mouse.y - H / 2) * 0.012 : 0
      S.viewX += (tX - S.viewX) * Math.min(1, dt * 3)
      S.viewY += (tY - S.viewY) * Math.min(1, dt * 3)

      const breath = 1 + Math.sin(S.clock * 0.5) * 0.012
      const cx = W * 0.5
      const cy = isMobile ? H * 0.14 : H * 0.16
      const drift = isMobile ? 1.6 : 2.8

      // Update nodes (drift + breathing + energy decay)
      for (const n of S.nodes) {
        n.x = cx + (n.bx - cx) * breath + Math.sin(n.phx + S.clock * n.spx) * drift
        n.y = cy + (n.by - cy) * breath + Math.cos(n.phy + S.clock * n.spy) * drift
        n.energy *= Math.exp(-dt * 2.3)
        if (n.energy < 0.001) n.energy = 0
        if (n.cool > 0) n.cool -= dt
      }

      // Cursor proximity → light up nearby neurons + occasionally fire them
      if (!isMobile && S.mouse.active && S.intro > 0.5) {
        const Rc2 = 150 * 150
        for (let i = 0; i < S.nodes.length; i++) {
          const n  = S.nodes[i]
          const dx = n.x - S.mouse.x, dy = n.y - S.mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < Rc2) {
            const f = 1 - Math.sqrt(d2) / 150
            if (f * 0.7 > n.energy) n.energy = f * 0.7
            if (f > 0.75 && n.cool <= 0) { fireNode(i, 0.5, 0.4); n.cool = 0.45 }
          }
        }
      }

      // Update edge control points from live node positions
      for (const e of S.edges) {
        const a = S.nodes[e.from], b = S.nodes[e.to]
        e.control.x = (a.x + b.x) / 2 + e.nx * e.bend
        e.control.y = (a.y + b.y) / 2 + e.ny * e.bend
      }

      ctx.save()
      ctx.translate(S.viewX, S.viewY)

      // 1 — Synapses (subtle web, source-over). Active edges brighten.
      const edgeReveal = clamp((introE - 0.15) / 0.85, 0, 1)
      if (edgeReveal > 0) {
        ctx.lineCap   = 'round'
        ctx.lineWidth = isMobile ? 0.6 : 0.9
        for (const e of S.edges) {
          const a  = S.nodes[e.from], b = S.nodes[e.to]
          const en = (a.energy + b.energy) * 0.5
          const alpha = (0.05 + en * 0.5) * edgeReveal
          if (alpha < 0.004) continue
          ctx.strokeStyle = en > 0.05
            ? `rgba(178,150,255,${alpha})`
            : `rgba(130,108,246,${alpha})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.quadraticCurveTo(e.control.x, e.control.y, b.x, b.y)
          ctx.stroke()
        }
      }

      // 2 — Glow layer (additive → overlapping glows bloom like firing neurons)
      ctx.globalCompositeOperation = 'lighter'

      // Nodes
      for (const n of S.nodes) {
        const reveal = clamp(introE * 1.4 - n.order * 0.5, 0, 1)
        if (reveal <= 0) continue
        const glow = 0.12 + Math.sin(S.clock * 0.8 + n.phx) * 0.03 + n.energy + easeOutCubic(S.introGlow) * 0.45
        blit(haloSprite, n.x, n.y,
          (isMobile ? 7 : 11) * n.r * (0.5 + glow),
          (0.05 + glow * 0.4) * reveal)
        blit(coreSprite, n.x, n.y,
          (isMobile ? 1.7 : 2.4) * n.r * (0.7 + glow * 0.7),
          (0.16 + glow * 0.75) * reveal)
      }

      // Signals (electric pulses traveling synapse → synapse, with a short trail)
      const trailR = isMobile ? 2.4 : 3.6
      const alive  = []
      for (const sig of S.signals) {
        sig.t += sig.speed * dt
        if (sig.t >= 1) {
          const ns = sig.str * 0.6                    // cascade decays each hop
          fireNode(sig.e, ns, ns > 0.28 ? 0.4 : 0, sig.s)
          continue
        }
        alive.push(sig)
        const a = S.nodes[sig.s], b = S.nodes[sig.e], c = S.edges[sig.edge].control
        for (let q = 0; q < 3; q++) {
          const tt = sig.t - q * 0.05
          if (tt < 0) break
          const fade = 1 - q * 0.35
          blit(spriteFor(sig.color), qx(a, c, b, tt), qy(a, c, b, tt), trailR * fade, 0.9 * fade * S.intro)
        }
      }
      S.signals = alive

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.restore()

      // 3 — Spontaneous firing keeps the brain alive
      if (S.intro > 0.6) {
        S.fireTimer -= dt
        if (S.fireTimer <= 0 && S.signals.length < maxSignals() * 0.62) {
          fireNode((Math.random() * S.nodes.length) | 0, 1.0, 0.65)
          S.fireTimer = 0.5 + Math.random() * 1.1
        }
      }
    }

    // One calm static frame for reduced-motion users
    const renderStatic = () => {
      S.intro = 1
      S.ignited = true
      S.introGlow = 1
      for (const n of S.nodes) { n.x = n.bx; n.y = n.by; n.energy = 0 }
      draw(0)
    }

    // ── Loop control (pauses when hidden / scrolled away) ───────────────────────
    let running = false, raf = 0, lastT = 0
    const loop = (t) => {
      if (!running) return
      raf = requestAnimationFrame(loop)
      let dt = (t - lastT) / 1000
      lastT = t
      if (dt > 0.05) dt = 0.05   // clamp big gaps (after pause / tab switch)
      if (dt < 0) dt = 0
      S.clock += dt
      draw(dt)
    }
    const heroVisible = () => (window.scrollY || 0) < window.innerHeight * 0.95
    const startLoop = () => {
      if (running || reduceMotion) return
      running = true
      lastT = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stopLoop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0 }

    // ── Scroll: parallax + fade + pause, driven via refs (no React re-render) ───
    let scrollScheduled = false
    const applyScroll = () => {
      scrollScheduled = false
      const sy = window.scrollY || 0
      const vh = window.innerHeight
      const fadeStart = vh * 0.55
      const op = clamp(1 - (sy - fadeStart) / (fadeStart * 0.75), 0, 1)
      wrap.style.transform = `translate3d(0, ${sy * 0.5}px, 0)`
      wrap.style.opacity   = String(Math.min(0.8, op * 0.8))
      if (!document.hidden && sy < vh * 0.95) startLoop()
      else stopLoop()
    }
    const onScroll = () => {
      if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(applyScroll) }
    }

    // ── Input ───────────────────────────────────────────────────────────────────
    const onMove  = (e) => { S.mouse.x = e.clientX; S.mouse.y = e.clientY; S.mouse.active = true }
    const onLeave = ()  => { S.mouse.active = false }
    const onClick = (e) => {
      if (!S.nodes.length || !heroVisible()) return
      let best = -1, bd = 200 * 200
      for (let i = 0; i < S.nodes.length; i++) {
        const dx = S.nodes[i].x - e.clientX, dy = S.nodes[i].y - e.clientY
        const d2 = dx * dx + dy * dy
        if (d2 < bd) { bd = d2; best = i }
      }
      if (best >= 0) fireNode(best, 1.0, 0.75)
    }
    const onVis = () => {
      if (document.hidden) stopLoop()
      else if (heroVisible()) startLoop()
    }

    window.addEventListener('resize',     resize)
    window.addEventListener('scroll',     onScroll, { passive: true })
    window.addEventListener('mousemove',  onMove,   { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('click',      onClick)
    document.addEventListener('visibilitychange', onVis)

    resize()
    applyScroll()
    if (reduceMotion) renderStatic()
    else startLoop()

    return () => {
      stopLoop()
      window.removeEventListener('resize',     resize)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('click',      onClick)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <>
      {/* ── Static atmospheric layer ─────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Atmospheric glows */}
        <span
          className="absolute -top-40 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: '56rem', height: '56rem',
            background: 'radial-gradient(circle, rgba(76,29,149,0.07) 0%, rgba(50,10,120,0.03) 45%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <span
          className="absolute top-8 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: '28rem', height: '28rem',
            background: 'radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        <span
          className="absolute top-[38%] -left-56 rounded-full"
          style={{
            width: '44rem', height: '44rem',
            background: 'radial-gradient(circle, rgba(88,28,135,0.05) 0%, transparent 68%)',
            filter: 'blur(140px)',
          }}
        />
        <span
          className="absolute top-[52%] -right-56 rounded-full"
          style={{
            width: '48rem', height: '48rem',
            background: 'radial-gradient(circle, rgba(109,40,217,0.045) 0%, transparent 70%)',
            filter: 'blur(140px)',
          }}
        />
        <span
          className="absolute bottom-0 -right-40 rounded-full"
          style={{
            width: '40rem', height: '40rem',
            background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <span
          className="absolute bottom-[8%] -left-40 rounded-full"
          style={{
            width: '36rem', height: '36rem',
            background: 'radial-gradient(circle, rgba(76,29,149,0.04) 0%, transparent 65%)',
            filter: 'blur(110px)',
          }}
        />

        {/* Perspective grid */}
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 900"
          aria-hidden="true"
          style={{ opacity: 0.028 }}
        >
          <defs>
            <linearGradient id="gfade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0"   />
              <stop offset="30%"  stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="72%"  stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
            </linearGradient>
            <mask id="gmask">
              <rect width="1440" height="900" fill="url(#gfade)" />
            </mask>
          </defs>
          <g mask="url(#gmask)" stroke="#7c3aed" strokeWidth="0.55" fill="none">
            {Array.from({ length: 16 }, (_, i) => {
              const t = i / 15
              const y = 280 + t * 620
              const s = t * 0.9
              return <line key={`h${i}`} x1={720 - s * 720} y1={y} x2={720 + s * 720} y2={y} />
            })}
            {Array.from({ length: 19 }, (_, i) => {
              const vx = 720 + (i - 9) * 85
              return <line key={`v${i}`} x1={720} y1={280} x2={vx} y2={900} />
            })}
          </g>
        </svg>

        {/* Film grain */}
        <span
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scanlines */}
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Neural canvas (parallax + fade handled imperatively via ref) ───────── */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -9,
          pointerEvents: 'none',
          opacity: 0.8,
          willChange: 'transform, opacity',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
    </>
  )
}
