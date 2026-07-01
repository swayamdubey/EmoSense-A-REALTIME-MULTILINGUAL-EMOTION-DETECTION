import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  audioData: Float32Array
  isRecording: boolean
  isAnalyzing: boolean
  emotion: string
}

export default function AudioVisualizer({
  audioData,
  isRecording,
  isAnalyzing,
  emotion,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pulseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const getEmotionColor = (emo: string) => {
      const colors: Record<string, string> = {
        joy: "#fbbf24", // Yellow
        sadness: "#3b82f6", // Blue
        anger: "#ef4444", // Red
        fear: "#8b5cf6", // Purple
        surprise: "#06b6d4", // Cyan
        disgust: "#10b981", // Emerald Green
        neutral: "#14b8a6", // Teal
        love: "#ec4899", // Pink
        excitement: "#f97316", // Orange
        desire: "#be123c", // Rose Red
        optimism: "#34d399", // Mint Green
        approval: "#0d9488", // Dark Teal
        realization: "#6366f1", // Indigo
        annoyance: "#f43f5e", // Rose
      }
      return colors[emo] || colors.neutral
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const color = getEmotionColor(emotion)
      const width = canvas.width
      const height = canvas.height

      // 1. Draw futuristic sci-fi laboratory grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
      ctx.lineWidth = 1
      const gridSize = 20

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Pulse value for smooth secondary animations
      pulseRef.current += 0.05

      // 2. Draw Visualizer based on current active state
      if (isRecording) {
        // DRAW LIVE WAVEFORM / BAR CHART
        const barCount = 64
        const barWidth = width / barCount - 2
        const rawLength = audioData.length

        ctx.fillStyle = color
        ctx.shadowBlur = 10
        ctx.shadowColor = color

        if (rawLength > 0) {
          for (let i = 0; i < barCount; i++) {
            // Map the audioData values to bar heights
            const index = Math.floor((i / barCount) * rawLength)
            const val = audioData[index] || 0
            
            // Normalize value (assuming values are between 0 and 255 if byte data, or normalized if floats)
            // If values are Floats, they might be in range [-1, 1] or [0, 1] for volume
            // Let's support both nicely
            let normVal = Math.abs(val)
            if (normVal > 1) normVal = normVal / 128.0 // handle byte range
            
            const minHeight = 4
            const maxHeight = height * 0.8
            const barHeight = Math.max(minHeight, Math.min(maxHeight, normVal * height * 1.5))

            const x = i * (barWidth + 2)
            const y = (height - barHeight) / 2

            // Rounded bars
            ctx.beginPath()
            ctx.roundRect(x, y, barWidth, barHeight, 4)
            ctx.fill()
          }
        } else {
          // Idle state when recording just started but no data received yet
          ctx.beginPath()
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.moveTo(0, height / 2)
          for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * 0.05 + pulseRef.current) * 4
            ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      } else if (isAnalyzing) {
        // DRAW FUTURISTIC ANALYSIS SCANNING HOLO-RADAR
        ctx.shadowBlur = 15
        ctx.shadowColor = color
        ctx.lineWidth = 2

        // Spinning holographic circle
        const radius = Math.min(width, height) * 0.35
        const centerX = width / 2
        const centerY = height / 2

        ctx.strokeStyle = `rgba(${hexToRgb(color)}, 0.15)`
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()

        // Inner scanning laser line
        const scanY = centerY + Math.sin(pulseRef.current * 1.5) * radius
        const scanWidth = Math.sqrt(Math.max(0, radius * radius - Math.pow(scanY - centerY, 2))) * 2
        const scanXStart = centerX - scanWidth / 2
        const scanXEnd = centerX + scanWidth / 2

        // Glowing scanning bar
        const gradient = ctx.createLinearGradient(scanXStart, scanY, scanXEnd, scanY)
        gradient.addColorStop(0, `rgba(${hexToRgb(color)}, 0)`)
        gradient.addColorStop(0.5, color)
        gradient.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(scanXStart, scanY)
        ctx.lineTo(scanXEnd, scanY)
        ctx.stroke()

        // Rotating radar line
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        const angle = pulseRef.current * 0.8
        const radarX = centerX + Math.cos(angle) * radius
        const radarY = centerY + Math.sin(angle) * radius
        ctx.lineTo(radarX, radarY)
        ctx.stroke()

        // Animated circular equalizer rings
        const ringCount = 3
        for (let r = 0; r < ringCount; r++) {
          const ringRadius = radius * (1 + Math.sin(pulseRef.current * 2 + r * 1.2) * 0.1)
          ctx.strokeStyle = `rgba(${hexToRgb(color)}, ${0.4 / (r + 1)})`
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      } else {
        // DRAW ELEGANT FLATLINE (IDLE) WITH MODULAR CALIBRATING WAVE
        ctx.shadowBlur = 4
        ctx.shadowColor = color
        ctx.strokeStyle = `rgba(${hexToRgb(color)}, 0.4)`
        ctx.lineWidth = 1.5

        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        for (let x = 0; x < width; x++) {
          const distanceToCenter = Math.abs(x - width / 2)
          const damping = Math.max(0, 1 - distanceToCenter / (width * 0.4)) // dampen near edges
          const y = height / 2 + Math.sin(x * 0.02 - pulseRef.current * 0.5) * 6 * damping
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // 3. Draw Cyber HUD Metadata details
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
      ctx.font = "10px 'JetBrains Mono', monospace"

      // Top corner brackets and statuses
      ctx.fillText(`SYSTEM_STATUS: ${isRecording ? "RECORDING" : isAnalyzing ? "ANALYZING" : "STANDBY"}`, 16, 22)
      ctx.fillText(`EMOTION_CHNL: ${emotion.toUpperCase()}`, 16, 36)

      const displayFreq = isRecording ? "16.0 kHz" : "IDLE"
      ctx.fillText(`SAMPLE_RATE: ${displayFreq}`, width - 130, 22)
      ctx.fillText(`CHANNELS: 1 (MONO)`, width - 130, 36)

      // Corner markers
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 1
      const padding = 8
      const cornerSize = 8

      // Top-Left Corner
      ctx.beginPath()
      ctx.moveTo(padding + cornerSize, padding)
      ctx.lineTo(padding, padding)
      ctx.lineTo(padding, padding + cornerSize)
      ctx.stroke()

      // Top-Right Corner
      ctx.beginPath()
      ctx.moveTo(width - padding - cornerSize, padding)
      ctx.lineTo(width - padding, padding)
      ctx.lineTo(width - padding, padding + cornerSize)
      ctx.stroke()

      // Bottom-Left Corner
      ctx.beginPath()
      ctx.moveTo(padding + cornerSize, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.lineTo(padding, height - padding - cornerSize)
      ctx.stroke()

      // Bottom-Right Corner
      ctx.beginPath()
      ctx.moveTo(width - padding - cornerSize, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.lineTo(width - padding, height - padding - cornerSize)
      ctx.stroke()

      animationFrameId = requestAnimationFrame(draw)
    }

    // Helper to convert hex to RGB for alpha channels
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "20, 184, 166"
    }

    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 180
      }
    }

    resize()
    window.addEventListener("resize", resize)

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [audioData, isRecording, isAnalyzing, emotion])

  return (
    <div className="w-full relative overflow-hidden bg-black/50 border border-white/5 rounded-2xl p-1 shadow-inner shadow-black/80">
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  )
}
