import { useEffect, useRef } from 'react'

const N = 44
const MAX_D = 185
const SPD = 0.2

export default function NeuralBg({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let nodes = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const init = () => {
      resize()
      nodes = Array.from({ length: N }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        vx:    (Math.random() - 0.5) * SPD,
        vy:    (Math.random() - 0.5) * SPD,
        r:     Math.random() * 1.1 + 0.7,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const n of nodes) {
        n.x = (n.x + n.vx + w) % w
        n.y = (n.y + n.vy + h) % h
        n.phase += 0.011
      }

      /* ── linhas com glow ── */
      ctx.lineWidth = 0.8
      for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d >= MAX_D) continue

          const t     = 1 - d / MAX_D
          const alpha = t * t * 0.85
          const lilac = (i * 5 + j * 3) % 4 === 0

          const rgb = lilac ? '167,139,250' : '139,92,246'
          ctx.strokeStyle  = `rgba(${rgb},${alpha})`
          ctx.shadowColor  = `rgba(${rgb},${alpha * 0.55})`
          ctx.shadowBlur   = 6
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
      ctx.shadowBlur = 0

      /* ── nós pulsantes com halo ── */
      for (const n of nodes) {
        const p = 0.62 + 0.38 * Math.sin(n.phase)

        /* halo suave */
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 5 * p, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196,181,253,${0.07 * p})`
        ctx.fill()

        /* núcleo brilhante */
        ctx.shadowColor  = 'rgba(230,220,255,0.95)'
        ctx.shadowBlur   = 7
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * p, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(235,228,255,${0.88 * p})`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(tick)
    }

    init()
    tick()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  )
}
