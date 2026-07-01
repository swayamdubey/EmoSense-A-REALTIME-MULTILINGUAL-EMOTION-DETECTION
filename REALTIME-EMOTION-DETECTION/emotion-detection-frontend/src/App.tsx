"use client"

import { useState } from "react"
import Recorder from "./components/Recorder.tsx"
import AudioVisualizer from "./components/AudioVisualizer.tsx"
import EmotionDisplay from "./components/EmotionDisplay.tsx"
import ParticleBackground from "./components/ParticleBackground.tsx"
import handleAudioUpload from "./components/AudioAnalyzer.js"

type Emotion = {
  label: string
  score: number
}

type EmotionData = {
  emotions: Emotion[]
  [key: string]: any
}

export default function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioData, setAudioData] = useState(new Float32Array(0))
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRecordingComplete = (blob: any) => {
    console.log("✅ Recording completed. Blob received:", blob)
    setIsRecording(false)
    setAudioBlob(blob)
  }

  const handleAnalyzeEmotion = () => {
    if (audioBlob) {
      console.log("🧐 Sending audio for analysis...")
      setLoading(true)
      setIsAnalyzing(true)
      handleAudioUpload(
        audioBlob,
        setEmotionData,
        () => {},
        setEmotionData,
        (loadingState) => {
          setLoading(loadingState)
          if (!loadingState) setIsAnalyzing(false)
        },
      )
    }
  }

  const resetSession = () => {
    setAudioBlob(null)
    setEmotionData(null)
    setIsAnalyzing(false)
    setLoading(false)
  }

  // Get primary emotion for background color
  const primaryEmotion = emotionData?.emotions?.[0]?.label || "neutral"

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${getEmotionBackground(primaryEmotion)} font-sans`}
    >
      <ParticleBackground emotion={primaryEmotion} isActive={isRecording || isAnalyzing} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl px-4">
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-transparent md:text-7xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text font-display">
            EmoSense
          </h1>
          <p className="text-base font-light text-zinc-400 md:text-lg max-w-xl mx-auto leading-relaxed">
            Multilingual Real-time Emotion Detection through voice signal analysis
          </p>
        </div>

        {/* Main Interface - Glassmorphic Card */}
        <div className="w-full max-w-4xl mx-auto bg-zinc-950/70 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-10 rounded-3xl relative overflow-hidden">
          {/* Subtle Ambient Glows inside the card to elevate design */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-white/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/5 to-transparent blur-3xl pointer-events-none" />

          {/* Audio Visualizer Frame - Laboratory monitor look */}
          <div className="mb-8 bg-black/40 border border-white/5 p-4 rounded-2xl shadow-inner relative z-10">
            <AudioVisualizer
              audioData={audioData}
              isRecording={isRecording}
              isAnalyzing={isAnalyzing}
              emotion={primaryEmotion}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-6 relative z-10">
            <Recorder
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setAudioData={setAudioData}
            />

            {audioBlob && !isRecording && (
              <div className="flex space-x-4">
                <button
                  onClick={handleAnalyzeEmotion}
                  disabled={loading}
                  className="px-8 py-4 font-semibold text-white tracking-wide transition-all duration-300 transform bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(59,130,246,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Analyze Emotion</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetSession}
                  className="px-6 py-4 font-semibold text-white tracking-wide transition-all duration-300 transform border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-full hover:scale-105 active:scale-95"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Emotion Results */}
          {emotionData && (
            <div className="relative z-10">
              <EmotionDisplay emotionData={emotionData} isAnalyzing={isAnalyzing} />
            </div>
          )}
        </div>
      </div>
      <footer className="w-full py-6 mt-12 text-center text-zinc-500 bg-black/40 border-t border-white/5 backdrop-blur-md relative z-10">
        <p className="text-xs font-mono tracking-wider">© 2026 EMOSENSE LABS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}

function getEmotionBackground(emotion: string) {
  const backgrounds: Record<string, string> = {
    joy: "bg-gradient-to-br from-amber-950/40 via-zinc-950 to-black",
    happiness: "bg-gradient-to-br from-yellow-950/40 via-zinc-950 to-black",
    sadness: "bg-gradient-to-br from-blue-950/40 via-zinc-950 to-black",
    anger: "bg-gradient-to-br from-red-950/40 via-zinc-950 to-black",
    fear: "bg-gradient-to-br from-purple-950/40 via-zinc-950 to-black",
    surprise: "bg-gradient-to-br from-cyan-950/40 via-zinc-950 to-black",
    disgust: "bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-black",
    neutral: "bg-gradient-to-br from-zinc-950 via-neutral-950 to-black",
    love: "bg-gradient-to-br from-pink-950/40 via-zinc-950 to-black",
    excitement: "bg-gradient-to-br from-orange-950/40 via-zinc-950 to-black",
    desire: "bg-gradient-to-br from-rose-950/40 via-zinc-950 to-black",
    optimism: "bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-black",
    approval: "bg-gradient-to-br from-teal-950/40 via-zinc-950 to-black",
    realization: "bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-black",
    annoyance: "bg-gradient-to-br from-rose-950/30 via-zinc-950 to-black",
  }

  return backgrounds[emotion] || backgrounds.neutral
}
