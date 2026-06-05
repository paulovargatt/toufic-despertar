// src/components/BgFx.jsx
import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAIN_BLUEPRINT = [
  // Cerebrum Outer Contour
  { rx: -0.85, ry: -0.15, group: 'outer' },
  { rx: -0.80, ry: -0.38, group: 'outer' },
  { rx: -0.65, ry: -0.62, group: 'outer' },
  { rx: -0.45, ry: -0.80, group: 'outer' },
  { rx: -0.18, ry: -0.90, group: 'outer' },
  { rx:  0.10, ry: -0.90, group: 'outer' },
  { rx:  0.38, ry: -0.80, group: 'outer' },
  { rx:  0.60, ry: -0.65, group: 'outer' },
  { rx:  0.78, ry: -0.45, group: 'outer' },
  { rx:  0.85, ry: -0.20, group: 'outer' },
  { rx:  0.88, ry:  0.05, group: 'outer' },
  { rx:  0.80, ry:  0.28, group: 'outer' },
  { rx:  0.62, ry:  0.42, group: 'outer' },
  // Temporal Lobe
  { rx: -0.52, ry:  0.32, group: 'temporal' },
  { rx: -0.72, ry:  0.12, group: 'temporal' },
  { rx: -0.82, ry:  0.08, group: 'temporal' },
  // Cerebellum
  { rx:  0.35, ry:  0.58, group: 'cerebellum' },
  { rx:  0.52, ry:  0.66, group: 'cerebellum' },
  { rx:  0.68, ry:  0.58, group: 'cerebellum' },
  { rx:  0.74, ry:  0.42, group: 'cerebellum' },
  // Brain Stem
  { rx:  0.05, ry:  0.52, group: 'stem' },
  { rx:  0.00, ry:  0.78, group: 'stem' },
  { rx: -0.05, ry:  0.95, group: 'stem' },
  // Deep Structures
  { rx: -0.45, ry: -0.15, group: 'deep' },
  { rx: -0.20, ry: -0.45, group: 'deep' },
  { rx:  0.15, ry: -0.45, group: 'deep' },
  { rx:  0.48, ry: -0.25, group: 'deep' },
  { rx: -0.35, ry:  0.08, group: 'deep' },
  { rx:  0.00, ry: -0.10, group: 'deep' },
  { rx:  0.32, ry:  0.02, group: 'deep' },
  { rx:  0.50, ry:  0.18, group: 'deep' },
  { rx: -0.12, ry:  0.28, group: 'deep' },
  { rx:  0.18, ry:  0.32, group: 'deep' },
]

const GROUP_COLORS = {
  outer:      { h: 263, s: 75, l: 70 },
  temporal:   { h: 280, s: 80, l: 75 },
  cerebellum: { h: 245, s: 70, l: 72 },
  stem:       { h: 300, s: 60, l: 68 },
  deep:       { h: 270, s: 85, l: 78 },
}

// Easing functions
const easeOutCubic   = t => 1 - Math.pow(1 - t, 3)
const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
const easeOutElastic = t => {
  if (t === 0 || t === 1) return t
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

// ─── Utility ──────────────────────────────────────────────────────────────────
const getBezierPoint = (p0, ctrl, p2, t) => {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * ctrl.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * ctrl.y + t * t * p2.y,
  }
}

const lerp = (a, b, t) => a + (b - a) * t

// ─── Component ────────────────────────────────────────────────────────────────
export default function BgFx() {
  const canvasRef   = useRef(null)
  const stateRef    = useRef({})   // mutable canvas state (avoids closure issues)
  const [scrollY, setScrollY] = useState(0)

  // ── Scroll tracking ──
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Canvas engine ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr    = Math.min(window.devicePixelRatio || 1, 2)
    const S      = stateRef.current

    // Mutable state bucket
    Object.assign(S, {
      nodes:          [],
      edges:          [],
      adj:            [],
      pulses:         [],
      particles:      [],
      mouse:          { x: null, y: null, active: false },
      width:          0,
      height:         0,
      animId:         null,
      // ── Logo intro animation ──
      introPhase:     'idle',   // 'idle' | 'nodes' | 'edges' | 'pulses' | 'done'
      introStart:     0,
      introNodeReveal: 0,       // 0→1 nodes appear
      introEdgeReveal: 0,       // 0→1 edges draw-on
      introPulseAlpha: 0,       // 0→1 pulses fade-in
      breathScale:    1,        // gentle breathing 0.98→1.02
      // Hovered node
      hoveredNode:    -1,
    })

    // ── Particle System (background) ──────────────────────────────────────────
    class Particle {
      constructor(w, h) { this.reset(w, h, true) }

      reset(w, h, initial = false) {
        this.x   = Math.random() * w
        this.y   = initial ? Math.random() * h : h + 10
        this.vx  = (Math.random() - 0.5) * 0.18
        this.vy  = -(0.08 + Math.random() * 0.22)
        this.r   = 0.6 + Math.random() * 1.4
        this.alpha = 0.04 + Math.random() * 0.12
        this.life  = 0
        this.maxLife = 220 + Math.random() * 300
      }

      update(w, h) {
        this.x   += this.vx
        this.y   += this.vy
        this.life += 1
        if (this.life > this.maxLife || this.y < -10) this.reset(w, h)
      }

      draw(ctx) {
        const progress = this.life / this.maxLife
        const fade     = progress < 0.15
          ? progress / 0.15
          : progress > 0.75
            ? 1 - (progress - 0.75) / 0.25
            : 1
        ctx.globalAlpha = this.alpha * fade
        ctx.fillStyle   = `hsl(263, 70%, ${68 + this.r * 4}%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // ── Pulse class ──────────────────────────────────────────────────────────
    class Pulse {
      constructor(edgeIndex, reverse = false, speed = null) {
        this.edgeIndex = edgeIndex
        this.reverse   = reverse
        this.progress  = 0
        this.speed     = speed || (0.003 + Math.random() * 0.003)
        this.id        = Math.random()
      }

      update() {
        this.progress += this.speed
        return this.progress >= 1
      }
    }

    // ── Network init ─────────────────────────────────────────────────────────
    const initNetwork = (w, h) => {
      const isMobile = w < 768
      const R        = Math.min(w, h) * (isMobile ? 0.17 : 0.23)
      const cx       = w * 0.5
      const cy       = isMobile ? h * 0.13 : h * 0.15

      S.nodes = BRAIN_BLUEPRINT.map((pt, i) => {
        const bx = cx + pt.rx * R
        const by = cy + pt.ry * R
        const col = GROUP_COLORS[pt.group]
        return {
          baseX:   bx,
          baseY:   by,
          x:       bx,
          y:       by,
          phaseX:  Math.random() * Math.PI * 2,
          phaseY:  Math.random() * Math.PI * 2,
          speedX:  0.00035 + Math.random() * 0.0003,
          speedY:  0.00035 + Math.random() * 0.0003,
          radius:  1.1 + Math.random() * 0.9,
          pulseVal: 0,
          group:   pt.group,
          // Color per group
          hue:     col.h + (Math.random() - 0.5) * 12,
          sat:     col.s,
          lit:     col.l,
          // Intro reveal timing — staggered by distance from center
          revealDelay: Math.hypot(pt.rx, pt.ry) * 0.5 + Math.random() * 0.15,
        }
      })

      // ── Build edges ──
      const newEdges = []
      const maxConn  = 3

      for (let i = 0; i < S.nodes.length; i++) {
        const n1    = S.nodes[i]
        const dists = []
        for (let j = 0; j < S.nodes.length; j++) {
          if (i === j) continue
          const dx = S.nodes[j].baseX - n1.baseX
          const dy = S.nodes[j].baseY - n1.baseY
          dists.push({ index: j, dist: Math.hypot(dx, dy) })
        }
        dists.sort((a, b) => a.dist - b.dist)

        for (let k = 0; k < Math.min(maxConn, dists.length); k++) {
          const ti = dists[k].index
          if (newEdges.some(e => (e.from === i && e.to === ti) || (e.from === ti && e.to === i))) continue

          const n2   = S.nodes[ti]
          const dx   = n2.baseX - n1.baseX
          const dy   = n2.baseY - n1.baseY
          const dist = Math.hypot(dx, dy)
          const nx   = -dy / dist
          const ny   =  dx / dist
          const bend = dist * 0.20 * (Math.random() < 0.5 ? 1 : -1)

          newEdges.push({
            from:    i,
            to:      ti,
            normalX: nx,
            normalY: ny,
            bendDist: bend,
            control:  { x: 0, y: 0 },
            // Intro: each edge gets a reveal order index
            revealOrder: 0,   // filled below
          })
        }
      }

      // Sort edges by average node revealDelay for sequential draw-on
      newEdges.forEach(e => {
        e.revealOrder =
          (S.nodes[e.from].revealDelay + S.nodes[e.to].revealDelay) / 2
      })
      newEdges.sort((a, b) => a.revealOrder - b.revealOrder)
      // Normalize revealOrder 0→1
      const maxRO = newEdges[newEdges.length - 1]?.revealOrder || 1
      newEdges.forEach(e => { e.revealOrder /= maxRO })

      S.edges = newEdges
      S.adj   = Array.from({ length: S.nodes.length }, () => [])
      S.edges.forEach((e, idx) => {
        S.adj[e.from].push({ nodeIdx: e.to,   edgeIdx: idx, isReverse: false })
        S.adj[e.to  ].push({ nodeIdx: e.from, edgeIdx: idx, isReverse: true  })
      })

      S.pulses = []
    }

    // ── Intro animation trigger ───────────────────────────────────────────────
    const startIntro = (timestamp) => {
      S.introPhase     = 'nodes'
      S.introStart     = timestamp
      S.introNodeReveal = 0
      S.introEdgeReveal = 0
      S.introPulseAlpha = 0
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    const handleResize = () => {
      const rect    = canvas.getBoundingClientRect()
      S.width       = rect.width
      S.height      = rect.height
      canvas.width  = S.width  * dpr
      canvas.height = S.height * dpr
      ctx.scale(dpr, dpr)

      initNetwork(S.width, S.height)

      // Re-init particles
      const count  = Math.floor((S.width * S.height) / 14000)
      S.particles  = Array.from({ length: count }, () => new Particle(S.width, S.height))
    }

    // ── Input handlers ────────────────────────────────────────────────────────
    const handleMouseMove = (e) => {
      S.mouse.x      = e.clientX
      S.mouse.y      = e.clientY
      S.mouse.active = true
    }
    const handleMouseLeave = () => {
      S.mouse.active = false
      S.mouse.x      = null
      S.mouse.y      = null
    }
    const handleClick = (e) => {
      if (!S.nodes.length) return
      let closest = -1
      let minD    = 180
      S.nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - e.clientX, n.y - e.clientY)
        if (d < minD) { minD = d; closest = i }
      })
      if (closest === -1) return
      const paths = S.adj[closest]
      if (paths?.length) {
        const path = paths[Math.floor(Math.random() * paths.length)]
        S.pulses.push(new Pulse(path.edgeIdx, path.isReverse, 0.008 + Math.random() * 0.004))
        S.nodes[closest].pulseVal = 1.0
      }
    }

    window.addEventListener('resize',     handleResize)
    window.addEventListener('mousemove',  handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click',      handleClick)
    handleResize()

    // ── Draw helpers ─────────────────────────────────────────────────────────

    // Draws a single edge with a progress clip (for draw-on animation)
    const drawEdge = (edge, alpha, highlight, drawProgress = 1, isMobile) => {
      const n1 = S.nodes[edge.from]
      const n2 = S.nodes[edge.to]
      if (!n1 || !n2) return

      const steps = Math.max(2, Math.floor(drawProgress * (isMobile ? 6 : 12)))

      const lineW = highlight ? 1.6 : (isMobile ? 0.7 : 1.0)
      const col   = highlight
        ? `rgba(216, 180, 254, ${alpha})`
        : `rgba(139, 92, 246, ${alpha})`

      ctx.strokeStyle = col
      ctx.lineWidth   = lineW
      ctx.lineCap     = 'round'
      ctx.beginPath()
      for (let s = 0; s <= steps; s++) {
        const t  = (s / steps) * drawProgress
        const pt = getBezierPoint(n1, edge.control, n2, t)
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()

      // Subtle secondary glow line
      if (!isMobile && highlight) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.4})`
        ctx.lineWidth   = 3.5
        ctx.beginPath()
        for (let s = 0; s <= steps; s++) {
          const t  = (s / steps) * drawProgress
          const pt = getBezierPoint(n1, edge.control, n2, t)
          s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()
      }
    }

    const drawNode = (node, alpha = 1, scale = 1, isMobile) => {
      const { x, y, radius, hue, sat, lit, pulseVal } = node
      const r = radius * scale * (isMobile ? 0.65 : 1.0)

      // Outer glow ring
      if (!isMobile) {
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4)
        grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${lit}%, ${0.18 * alpha})`)
        grd.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit}%, 0)`)
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Mid ring
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${0.35 * alpha})`
      ctx.beginPath()
      ctx.arc(x, y, r * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Core dot
      const coreGrd = ctx.createRadialGradient(x, y, 0, x, y, r)
      coreGrd.addColorStop(0, `rgba(255,255,255,${alpha})`)
      coreGrd.addColorStop(0.6, `hsla(${hue}, ${sat}%, ${lit}%, ${alpha})`)
      coreGrd.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit - 10}%, 0)`)
      ctx.fillStyle = coreGrd
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()

      // Pulse flare
      if (pulseVal > 0.01) {
        const flareR = r * 1.5 + (isMobile ? 6 : 12) * pulseVal

        const flareGrd = ctx.createRadialGradient(x, y, 0, x, y, flareR)
        flareGrd.addColorStop(0, `hsla(${hue}, 90%, 85%, ${pulseVal * 0.7 * alpha})`)
        flareGrd.addColorStop(0.5, `hsla(${hue}, 80%, 70%, ${pulseVal * 0.35 * alpha})`)
        flareGrd.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`)

        ctx.fillStyle = flareGrd
        ctx.beginPath()
        ctx.arc(x, y, flareR, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawPulse = (pulse, alphaScale = 1, isMobile) => {
      const edge = S.edges[pulse.edgeIndex]
      if (!edge) return
      const nS   = S.nodes[pulse.reverse ? edge.to   : edge.from]
      const nE   = S.nodes[pulse.reverse ? edge.from : edge.to  ]
      if (!nS || !nE) return

      const startT = Math.max(0, pulse.progress - 0.28)
      const endT   = pulse.progress
      const steps  = isMobile ? 6 : 12

      // Outer glow (desktop only)
      if (!isMobile) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.35 * alphaScale})`
        ctx.lineWidth   = 4.5
        ctx.lineCap     = 'round'
        ctx.beginPath()
        for (let s = 0; s <= steps; s++) {
          const t  = startT + (endT - startT) * (s / steps)
          const pt = getBezierPoint(nS, edge.control, nE, t)
          s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()
      }

      // Mid core
      ctx.strokeStyle = `rgba(216, 180, 254, ${0.9 * alphaScale})`
      ctx.lineWidth   = isMobile ? 1.5 : 2.2
      ctx.beginPath()
      for (let s = 0; s <= steps; s++) {
        const t  = startT + (endT - startT) * (s / steps)
        const pt = getBezierPoint(nS, edge.control, nE, t)
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()

      // White hot center
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * alphaScale})`
      ctx.lineWidth   = isMobile ? 0.5 : 0.8
      ctx.beginPath()
      for (let s = 0; s <= steps; s++) {
        const t  = startT + (endT - startT) * (s / steps)
        const pt = getBezierPoint(nS, edge.control, nE, t)
        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
    }

    // ── Main animation loop ───────────────────────────────────────────────────
    let firstFrame = true

    const animate = (timestamp) => {
      S.animId = requestAnimationFrame(animate)

      // Skip render if scrolled past hero
      const sy = window.scrollY || 0
      if (sy > window.innerHeight * 0.95) return

      // Trigger intro on first real frame
      if (firstFrame) {
        startIntro(timestamp)
        firstFrame = false
      }

      const { width: W, height: H } = S
      const isMobile = W < 768

      ctx.clearRect(0, 0, W, H)

      const time = timestamp

      // ── 1. Update intro phase ─────────────────────────────────────────────
      const elapsed     = timestamp - S.introStart
      const nodesDur    = 1200  // ms — nodes pop in
      const edgesDur    = 1400  // ms — edges draw
      const pulsesDur   = 600   // ms — pulses fade in

      if (S.introPhase === 'nodes') {
        S.introNodeReveal = Math.min(1, elapsed / nodesDur)
        if (S.introNodeReveal >= 1) {
          S.introPhase  = 'edges'
          S.introStart  = timestamp
        }
      } else if (S.introPhase === 'edges') {
        S.introNodeReveal = 1
        S.introEdgeReveal = Math.min(1, elapsed / edgesDur)
        if (S.introEdgeReveal >= 1) {
          S.introPhase  = 'pulses'
          S.introStart  = timestamp
        }
      } else if (S.introPhase === 'pulses') {
        S.introEdgeReveal = 1
        S.introPulseAlpha = Math.min(1, elapsed / pulsesDur)
        if (S.introPulseAlpha >= 1) {
          S.introPhase = 'done'
        }
      } else {
        // done
        S.introNodeReveal = 1
        S.introEdgeReveal = 1
        S.introPulseAlpha = 1
      }

      // ── 2. Breathing scale ────────────────────────────────────────────────
      // Gentle 0.985 → 1.015 breathing on the whole brain
      S.breathScale = 1 + Math.sin(time * 0.00045) * 0.015

      // ── 3. Update nodes ───────────────────────────────────────────────────
      const drift = isMobile ? 1.8 : 3.2
      S.nodes.forEach(node => {
        const ox = Math.sin(node.phaseX + time * node.speedX) * drift
        const oy = Math.cos(node.phaseY + time * node.speedY) * drift
        // Apply breathing around center
        const cx = W * 0.5
        const cy = isMobile ? H * 0.13 : H * 0.15
        const bx = node.baseX
        const by = node.baseY
        const breathX = cx + (bx - cx) * S.breathScale
        const breathY = cy + (by - cy) * S.breathScale
        node.x = breathX + ox
        node.y = breathY + oy

        if (node.pulseVal > 0.01) node.pulseVal *= 0.90
        else node.pulseVal = 0
      })

      // ── 4. Update edge control points ────────────────────────────────────
      S.edges.forEach(edge => {
        const n1 = S.nodes[edge.from]
        const n2 = S.nodes[edge.to]
        if (!n1 || !n2) return
        const mx = (n1.x + n2.x) / 2
        const my = (n1.y + n2.y) / 2
        edge.control.x = mx + edge.normalX * edge.bendDist
        edge.control.y = my + edge.normalY * edge.bendDist
      })

      // ── 5. Hovered node detection ─────────────────────────────────────────
      S.hoveredNode = -1
      if (!isMobile && S.mouse.active && S.mouse.x != null) {
        let minD = 110
        S.nodes.forEach((n, i) => {
          const d = Math.hypot(n.x - S.mouse.x, n.y - S.mouse.y)
          if (d < minD) { minD = d; S.hoveredNode = i }
        })
      }

      // ── 6. Background particles ───────────────────────────────────────────
      S.particles.forEach(p => {
        p.update(W, H)
        p.draw(ctx)
      })

      // ── 7. Draw edges (with intro draw-on) ───────────────────────────────
      const edgeReveal  = easeInOutQuart(S.introEdgeReveal)

      S.edges.forEach(edge => {
        if (edgeReveal <= 0) return
        // Each edge has revealOrder 0→1, only draw if edgeReveal > revealOrder
        const localProgress = Math.max(0, Math.min(1,
          (edgeReveal - edge.revealOrder * 0.6) / 0.4
        ))
        if (localProgress <= 0) return

        const isHigh   = S.hoveredNode !== -1 &&
                         (edge.from === S.hoveredNode || edge.to === S.hoveredNode)
        const baseAlpha = isHigh ? 0.40 : 0.12

        drawEdge(edge, baseAlpha * localProgress, isHigh, localProgress, isMobile)
      })

      // ── 8. Update & draw pulses ───────────────────────────────────────────
      const maxPulses = isMobile ? 2 : 5
      const nextPulses = []

      S.pulses.forEach(pulse => {
        const done = pulse.update()
        const edge = S.edges[pulse.edgeIndex]
        if (!edge) return

        if (done) {
          const arrivedIdx = pulse.reverse ? edge.from : edge.to
          const originIdx  = pulse.reverse ? edge.to   : edge.from
          if (S.nodes[arrivedIdx]) {
            S.nodes[arrivedIdx].pulseVal = 1.0
            const opts    = S.adj[arrivedIdx]
            if (opts?.length && S.pulses.length < maxPulses) {
              const fwd    = opts.filter(o => o.nodeIdx !== originIdx)
              const pool   = fwd.length ? fwd : opts
              const next   = pool[Math.floor(Math.random() * pool.length)]
              nextPulses.push(new Pulse(next.edgeIdx, next.isReverse, pulse.speed))
            }
          }
        } else {
          nextPulses.push(pulse)
          drawPulse(pulse, S.introPulseAlpha, isMobile)
        }
      })

      S.pulses = nextPulses

      // Spawn ambient pulses
      const targetAmbient = isMobile ? 1 : 3
      if (S.pulses.length < targetAmbient && S.edges.length && S.introPhase !== 'idle' && S.introEdgeReveal > 0.8) {
        const ei = Math.floor(Math.random() * S.edges.length)
        S.pulses.push(new Pulse(ei, Math.random() < 0.5))
      }

      // ── 9. Draw nodes (with intro staggered reveal) ───────────────────────
      S.nodes.forEach((node, _i) => {
        const nodeReveal = easeInOutQuart(S.introNodeReveal)
        // Stagger by revealDelay (0→~1)
        const localT = Math.max(0, Math.min(1,
          (nodeReveal - node.revealDelay * 0.6) / 0.4
        ))
        if (localT <= 0) return

        const scale    = easeOutElastic(localT)
        const alpha    = easeOutCubic(localT)
        const isHov    = _i === S.hoveredNode

        // Extra glow for hovered node
        if (isHov && !isMobile) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 9)
          glow.addColorStop(0, `hsla(${node.hue}, 85%, 75%, 0.20)`)
          glow.addColorStop(1, `hsla(${node.hue}, 85%, 65%, 0)`)
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius * 9, 0, Math.PI * 2)
          ctx.fill()
        }

        drawNode(node, alpha, scale * (isHov ? 1.4 : 1.0), isMobile)
      })

      // ── 10. Logo label (text watermark) — appears after edges are drawn ──
      if (!isMobile && S.introEdgeReveal > 0.85) {
        const textAlpha = easeOutCubic(Math.min(1, (S.introEdgeReveal - 0.85) / 0.15))
        const cy        = H * 0.15
        const R         = Math.min(W, H) * 0.23

        ctx.save()
        ctx.globalAlpha = textAlpha * 0.50
        ctx.font        = '500 10px "Inter", system-ui, sans-serif'
        ctx.letterSpacing = '0.22em'
        ctx.textAlign   = 'center'
        ctx.fillStyle   = 'rgba(216, 180, 254, 1)'
        ctx.globalAlpha = 1
        ctx.restore()
      }
    }

    S.animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize',     handleResize)
      window.removeEventListener('mousemove',  handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click',      handleClick)
      cancelAnimationFrame(S.animId)
    }
  }, [])

  // ── Parallax & fade ──────────────────────────────────────────────────────────
  const parallaxY   = scrollY * 0.38
  const vh          = typeof window !== 'undefined' ? window.innerHeight : 800
  const fadeStart   = vh * 0.55
  const canvasOpacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeStart * 0.75))

  return (
    <>
      {/* ── Static background layer ────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* ── Atmospheric glows ── */}
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

        {/* ── Perspective grid ── */}
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

        {/* ── Film grain ── */}
        <span
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Scanlines ── */}
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Neural canvas (parallax + fade) ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:  'fixed',
          inset:      0,
          zIndex:    -9,
          pointerEvents: 'none',
          transform: `translateY(${parallaxY}px)`,
          opacity:    Math.min(0.80, canvasOpacity * 0.80),
          willChange: 'transform, opacity',
          transition: 'opacity 0.12s linear',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
    </>
  )
}