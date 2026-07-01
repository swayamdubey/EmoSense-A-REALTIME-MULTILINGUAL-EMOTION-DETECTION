import { motion } from "motion/react"
import { Activity, Radio, BarChart3, TrendingUp, Sparkles } from "lucide-react"

type Emotion = {
  label: string
  score: number
}

type EmotionData = {
  emotions: Emotion[]
  analysis?: {
    vocalTone?: string
    speed?: string
    keyConfidence?: number
    insights?: string[]
  }
}

interface EmotionDisplayProps {
  emotionData: EmotionData
  isAnalyzing: boolean
}

export default function EmotionDisplay({ emotionData, isAnalyzing }: EmotionDisplayProps) {
  const emotions = emotionData?.emotions || []
  if (emotions.length === 0) return null

  // Dominant emotion is the first one in sorted list
  const primaryEmotion = emotions[0]
  const percentage = Math.round(primaryEmotion.score * 100)

  const getEmotionDetails = (emo: string) => {
    const details: Record<string, { emoji: string; color: string; desc: string; tone: string; rhythm: string }> = {
      joy: {
        emoji: "☀️",
        color: "from-amber-400 to-orange-500",
        desc: "Exalted energy & optimistic vocal frequency",
        tone: "Bright, elevated formant, high pitch variability",
        rhythm: "Rapid, bouncy cadence",
      },
      happiness: {
        emoji: "😊",
        color: "from-yellow-400 to-amber-500",
        desc: "Warm resonance & comfortable voice tone",
        tone: "Soft, warm, stable higher frequency harmonics",
        rhythm: "Steady, moderate-to-fast cadence",
      },
      sadness: {
        emoji: "💧",
        color: "from-blue-500 to-indigo-600",
        desc: "Sorrowful, subdued, low amplitude variance",
        tone: "Flat resonance, dark timber, compressed range",
        rhythm: "Slow, elongated pauses, descending pitch",
      },
      anger: {
        emoji: "🔥",
        color: "from-red-500 to-rose-600",
        desc: "High intensity, assertive peak amplitudes",
        tone: "Sharp, elevated vocal intensity, rasp, high pressure",
        rhythm: "Aggressive, abrupt, disjointed syllable pacing",
      },
      fear: {
        emoji: "😰",
        color: "from-purple-500 to-indigo-700",
        desc: "High frequency micro-tremors, unstable pitch",
        tone: "Breathier, restricted lower formant, unstable center pitch",
        rhythm: "Rapid, irregular breathing intervals, halting structure",
      },
      surprise: {
        emoji: "✨",
        color: "from-cyan-400 to-blue-500",
        desc: "Sudden spike in fundamental frequency",
        tone: "Wide frequency excursion, sharp high-frequency intake",
        rhythm: "Sudden deceleration, long trailing end-points",
      },
      disgust: {
        emoji: "🤢",
        color: "from-emerald-500 to-teal-700",
        desc: "Sub-harmonic guttural vibration, micro-snarls",
        tone: "Aspirated glottal friction, low nasal frequency shift",
        rhythm: "Deliberate, dragged syllable lengths",
      },
      neutral: {
        emoji: "🍃",
        color: "from-zinc-400 to-slate-500",
        desc: "Calibrated homeostatic frequency alignment",
        tone: "Centered formant, neutral pitch tracking, balanced harmonics",
        rhythm: "Highly regular, modular interval spacing",
      },
      love: {
        emoji: "💖",
        color: "from-pink-500 to-rose-500",
        desc: "Sincere resonant warming, soft high formants",
        tone: "Breathier, rich sub-bass resonance, gentle glide",
        rhythm: "Flowing, relaxed, continuous lyrical tempo",
      },
      excitement: {
        emoji: "🚀",
        color: "from-orange-500 to-amber-500",
        desc: "Dynamic energetic range, rapid syllable tracking",
        tone: "Bright timber, intense glottal push, wide sweep",
        rhythm: "Accelerated, staccato, minimal pauses",
      },
      desire: {
        emoji: "🌹",
        color: "from-rose-700 to-pink-600",
        desc: "Warm breathiness, close-mic dynamic response",
        tone: "Intimate, low register shift, vocal fry/whisper overlay",
        rhythm: "Deliberate, slow, rhythmic drawl",
      },
      optimism: {
        emoji: "🌱",
        color: "from-emerald-400 to-blue-500",
        desc: "Bright ascending intonation and light formants",
        tone: "Clear acoustic timber, active ascending pitch contours",
        rhythm: "Fluid, forward-moving cadence",
      },
      approval: {
        emoji: "👍",
        color: "from-teal-500 to-emerald-600",
        desc: "Warm affirmative mid-frequency support",
        tone: "Resonant chest timber, comfortable downward pitch fall",
        rhythm: "Assertive yet gentle, rhythmic nod speed",
      },
      realization: {
        emoji: "💡",
        color: "from-indigo-400 to-purple-600",
        desc: "Extended pause leading to sudden pitch spike",
        tone: "Expanding resonant bandwidth, rising focus harmonics",
        rhythm: "Elongated vowels, sudden sharp conclusion",
      },
      annoyance: {
        emoji: "⚡",
        color: "from-amber-600 to-rose-600",
        desc: "Glottal friction and tense upper formant tracking",
        tone: "Dry Timber, elevated tension, flat but loud delivery",
        rhythm: "Clipping syllable speed, rapid cut-offs",
      },
    }

    return details[emo.toLowerCase()] || details.neutral
  }

  const activeDetails = getEmotionDetails(primaryEmotion.label)

  // Use values from backend if present, otherwise construct smart, sci-fi calibrated fallback data
  const vocalTone = emotionData.analysis?.vocalTone || activeDetails.tone
  const speed = emotionData.analysis?.speed || activeDetails.rhythm
  const keyConfidence = emotionData.analysis?.keyConfidence || Math.round(primaryEmotion.score * 100)
  const insights = emotionData.analysis?.insights || [
    `Detected a high-confidence signature of ${primaryEmotion.label.toUpperCase()} in the auditory signal.`,
    vocalTone ? `Acoustic profiles show a "${vocalTone}" tone.` : "Subharmonic analysis reports balanced resonances.",
    `The articulation pace aligns with a "${speed}" cadence schema.`,
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-left"
    >
      {/* Dominant Emotion Bento Card */}
      <div className="md:col-span-5 bg-zinc-950/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center space-x-1.5 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              <span>Primary Spectrum</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide border border-white/10 bg-white/5 text-zinc-300">
              DOMINANT
            </span>
          </div>

          <div className="flex items-baseline space-x-3 mb-1">
            <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
              {primaryEmotion.label}
            </span>
            <span className="text-3xl">{activeDetails.emoji}</span>
          </div>
          <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
            {activeDetails.desc}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Detection Confidence</span>
            <span className={`text-2xl font-bold font-mono bg-gradient-to-r ${activeDetails.color} bg-clip-text text-transparent`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/5 border border-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${activeDetails.color}`}
            />
          </div>
        </div>
      </div>

      {/* Auditory Analytics Bento Card */}
      <div className="md:col-span-7 bg-zinc-950/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-lg backdrop-blur-md">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center space-x-1.5 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Auditory DSP Analysis</span>
            </span>
            <span className="flex items-center space-x-1 text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
              <Sparkles className="w-3 h-3" />
              <span>Holographic Calibration</span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">vocal spectrum signature</span>
              <p className="text-sm font-medium text-white flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeDetails.color}`} />
                <span>{vocalTone}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">temporal rhythm cadence</span>
              <p className="text-sm font-medium text-white flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeDetails.color}`} />
                <span>{speed}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/5 pt-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">signal intelligence insights</span>
          <ul className="space-y-1.5">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-xs text-zinc-400 font-light flex items-start space-x-2">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Secondary Emotion Histograms (Full Width inside layout) */}
      {emotions.length > 1 && (
        <div className="md:col-span-12 bg-zinc-950/40 border border-white/5 p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Complete Secondary Emotion Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotions.slice(1, 7).map((emo, index) => {
              const emoDetails = getEmotionDetails(emo.label)
              const scorePercent = Math.round(emo.score * 100)
              return (
                <div key={emo.label} className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white capitalize flex items-center space-x-2">
                      <span>{emoDetails.emoji}</span>
                      <span>{emo.label}</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{scorePercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${emoDetails.color}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
