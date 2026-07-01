import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

interface ParticleBackgroundProps {
  emotion: string
  isActive: boolean
}

export default function ParticleBackground({ emotion, isActive }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const getEmotionColors = (emo: string) => {
      const colors: Record<string, string[]> = {
        joy: ["#fbbf24", "#f59e0b", "#f97316"], // Yellows / Oranges
        sadness: ["#3b82f6", "#60a5fa", "#1d4ed8"], // Blues
        anger: ["#ef4444", "#f87171", "#dc2626"], // Reds
        fear: ["#8b5cf6", "#a78bfa", "#6d28d9"], // Purples
        surprise: ["#06b6d4", "#22d3ee", "#3b82f6"], // Cyans / Blues
        disgust: ["#10b981", "#34d399", "#059669"], // Greens
        neutral: ["#9ca3af", "#cbd5e1", "#6b7280"], // Slate / Grays
        love: ["#ec4899", "#f472b6", "#be185d"], // Pinks / Roses
        excitement: ["#f97316", "#fbbf24", "#ea580c"], // Bright Orange / Yellow
        desire: ["#be123c", "#f43f5e", "#fda4af"], // Deep Reds / Pinks
        optimism: ["#10b981", "#6ee7b7", "#3b82f6"], // Emerald / Blue
        approval: ["#059669", "#34d399", "#0d9488"], // Greens / Teals
        realization: ["#6366f1", "#818cf8", "#4f46e5"], // Indigo
        annoyance: ["#f97316", "#ef4444", "#b91c1c"], // Orange / Red
      }
      return colors[emo] || colors.neutral
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const colors = getEmotionColors(emotion)
      particles = []
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isActive ? 1.5 : 0.4),
          vy: (Math.random() - 0.5) * (isActive ? 1.5 : 0.4),
          size: Math.random() * 2.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const colors = getEmotionColors(emotion)

      particles.forEach((p) => {
        // Move particle
        p.x += p.vx
        p.y += p.vy

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Speed adjustment if state changed
        const targetSpeedMultiplier = isActive ? 1.5 : 0.4
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (currentSpeed > 0) {
          const ratio = targetSpeedMultiplier / currentSpeed
          // Smoothly interpolate speed
          p.vx += (p.vx * ratio - p.vx) * 0.05
          p.vy += (p.vy * ratio - p.vy) * 0.05
        }

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.shadowBlur = isActive ? 12 : 6
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (isActive ? 1.3 : 1.0), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Add elegant faint digital grid network effect when active
      if (isActive) {
        ctx.strokeStyle = colors[0]
        ctx.lineWidth = 0.15
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              ctx.globalAlpha = (1 - dist / 100) * 0.15
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [emotion, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  )
}
