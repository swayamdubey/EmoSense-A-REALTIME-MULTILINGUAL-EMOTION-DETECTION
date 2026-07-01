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

  const handleRecordingComplete = (blob) => {
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
      className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${getEmotionBackground(
        primaryEmotion
      )}`}
    >
      <ParticleBackground emotion={primaryEmotion} isActive={isRecording || isAnalyzing} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 font-sans antialiased text-white">
        {/* Glass Header */}
        <header className="mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-xs tracking-widest uppercase rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            Neural Voice Analysis
          </div>
          <h1 className="mb-4 text-5xl font-extralight tracking-tight text-transparent md:text-7xl bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text drop-shadow-sm">
            EmoSense
          </h1>
          <p className="max-w-2xl text-lg font-light tracking-wide text-white/50 md:text-xl">
            Multilingual real-time emotion detection through advanced voice signal analysis.
          </p>
        </header>

        {/* Main Interface */}
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Glassmorphic Main Card */}
          <div className="w-full p-8 sm:p-12 transition-all duration-500 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/5">
            
            {/* Audio Visualizer Section */}
            <div className="w-full mb-10 h-32 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
              <AudioVisualizer
                audioData={audioData}
                isRecording={isRecording}
                isAnalyzing={isAnalyzing}
                emotion={primaryEmotion}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-8">
              <div className="relative group">
                <div className={`absolute -inset-1 rounded-full blur-md opacity-20 transition-all duration-500 group-hover:opacity-40 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}></div>
                <div className="relative z-10">
                  <Recorder
                    onRecordingComplete={handleRecordingComplete}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    setAudioData={setAudioData}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-out overflow-hidden ${audioBlob && !isRecording ? 'max-h-32 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                {audioBlob && !isRecording && (
                  <>
                    <button
                      onClick={handleAnalyzeEmotion}
                      disabled={loading}
                      className="relative px-8 py-3.5 text-sm font-medium tracking-wide text-white uppercase transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 border-2 border-white/80 rounded-full border-t-transparent animate-spin"></div>
                          <span className="tracking-widest">Analyzing...</span>
                        </div>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <span>Analyze Emotion</span>
                        </span>
                      )}
                    </button>

                    <button
                      onClick={resetSession}
                      className="px-8 py-3.5 text-sm font-medium tracking-wide text-white/70 uppercase transition-all duration-300 rounded-full bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-md"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Emotion Results (Glass Panel) */}
          {emotionData && (
            <div className="w-full mt-8 p-1 transition-all duration-500 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
              <div className="p-8 rounded-[1.4rem] bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                <EmotionDisplay emotionData={emotionData} isAnalyzing={isAnalyzing} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full p-6 text-center z-10 pointer-events-none">
        <p className="text-xs font-light tracking-widest text-white/30 uppercase">
          © 2026 EmoSense • Neural Analysis
        </p>
      </footer>
    </div>
  )
}

function getEmotionBackground(emotion) {
  const backgrounds = {
    joy: "bg-gradient-to-br from-amber-900/40 via-orange-950/40 to-black",
    happiness: "bg-gradient-to-br from-amber-900/40 via-orange-950/40 to-black",
    sadness: "bg-gradient-to-br from-blue-950/50 via-indigo-950/40 to-black",
    anger: "bg-gradient-to-br from-red-950/50 via-rose-950/40 to-black",
    fear: "bg-gradient-to-br from-violet-950/50 via-purple-950/30 to-black",
    surprise: "bg-gradient-to-br from-cyan-950/40 via-blue-950/40 to-black",
    disgust: "bg-gradient-to-br from-emerald-950/40 via-green-950/30 to-black",
    neutral: "bg-gradient-to-br from-zinc-900/60 via-stone-950/80 to-black",
    love: "bg-gradient-to-br from-rose-950/50 via-pink-950/40 to-black",
    excitement: "bg-gradient-to-br from-orange-900/40 via-red-950/40 to-black",
    desire: "bg-gradient-to-br from-fuchsia-950/40 via-purple-950/30 to-black",
    optimism: "bg-gradient-to-br from-teal-950/40 via-emerald-950/30 to-black",
    approval: "bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-black",
    realization: "bg-gradient-to-br from-indigo-950/40 via-violet-950/30 to-black",
    annoyance: "bg-gradient-to-br from-orange-950/50 via-red-950/40 to-black",
  }

  return backgrounds[emotion] || backgrounds.neutral
}
