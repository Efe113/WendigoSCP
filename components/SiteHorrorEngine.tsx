'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, AlertTriangle, ShieldAlert } from 'lucide-react'

interface SiteHorrorEngineProps {
  itemNumber?: string
  objectClass?: string
}

const CREEPY_PROMPTS = [
  "DO YOU REMEMBER YOUR REAL NAME?",
  "THERE IS A SHADOW MOVED BEHIND YOU.",
  "DO NOT TURN AROUND.",
  "DON'T BLINK. NOT EVEN FOR A SECOND.",
  "AMNESTICS CANNOT SAVE YOU FROM WHAT IS IN THE CORNER.",
  "DID YOU HEAR THAT PULSING HEARTBEAT?",
  "IT IS LOOKING AT YOU THROUGH THE SCANLINES."
]

export default function SiteHorrorEngine({ itemNumber, objectClass }: SiteHorrorEngineProps) {
  const [audioActive, setAudioActive] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [screamerActive, setScreamerActive] = useState(false)
  const [creepyPrompt, setCreepyPrompt] = useState("")

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null)
  const humOscRef = useRef<OscillatorNode | null>(null)
  const humGainRef = useRef<GainNode | null>(null)
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize and toggle Web Audio
  const toggleAudio = async () => {
    if (audioActive) {
      // Mute/Stop audio
      if (humGainRef.current) {
        humGainRef.current.gain.value = 0
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current)
      }
      setAudioActive(false)
    } else {
      // Start audio
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
          audioCtxRef.current = new AudioContextClass()
        }

        const ctx = audioCtxRef.current
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }

        // 1. Synthesize low drone wind hum (55Hz)
        if (!humOscRef.current) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()

          osc.type = 'sine'
          osc.frequency.setValueAtTime(55, ctx.currentTime) // Low hum G1
          gain.gain.setValueAtTime(0.04, ctx.currentTime) // Muted volume

          // lowpass filter for sub-bass feel
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.setValueAtTime(80, ctx.currentTime)

          osc.connect(filter)
          filter.connect(gain)
          gain.connect(ctx.destination)

          osc.start()
          humOscRef.current = osc
          humGainRef.current = gain
        } else if (humGainRef.current) {
          humGainRef.current.gain.value = 0.04
        }

        // 2. Synthesize double-pulse heartbeat loop (65 bpm)
        const triggerHeartbeatPulse = () => {
          if (!audioCtxRef.current) return
          const c = audioCtxRef.current
          const now = c.currentTime

          // First beat
          const osc1 = c.createOscillator()
          const gain1 = c.createGain()
          osc1.type = 'triangle'
          osc1.frequency.setValueAtTime(60, now) // 60Hz thump
          gain1.gain.setValueAtTime(0, now)
          gain1.gain.linearRampToValueAtTime(0.35, now + 0.05)
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          osc1.connect(gain1)
          gain1.connect(c.destination)
          osc1.start()
          osc1.stop(now + 0.3)

          // Second beat (0.2s later)
          const osc2 = c.createOscillator()
          const gain2 = c.createGain()
          osc2.type = 'triangle'
          osc2.frequency.setValueAtTime(55, now + 0.2)
          gain2.gain.setValueAtTime(0, now + 0.2)
          gain2.gain.linearRampToValueAtTime(0.3, now + 0.25)
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
          osc2.connect(gain2)
          gain2.connect(c.destination)
          osc2.start(now + 0.2)
          osc2.stop(now + 0.5)
        }

        // Trigger loop
        triggerHeartbeatPulse()
        heartbeatTimerRef.current = setInterval(triggerHeartbeatPulse, 1200)

        setAudioActive(true)
      } catch (err) {
        console.error("Audio context failed", err)
      }
    }
  }

  // Synthesize screeching screamer sound for SCP-096
  const triggerScreechSound = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const now = ctx.currentTime

    // Synthesize high-frequency sliding oscillator
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(2500, now + 1.5)
    osc.frequency.exponentialRampToValueAtTime(300, now + 2.5)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1500, now)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(now + 2.5)
  }

  useEffect(() => {
    // 1. Cognitohazard periodic red flashes
    const flashInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setGlitchActive(true)
        setTimeout(() => {
          setGlitchActive(false)
        }, 180)
      }
    }, 28000)

    // 2. Creepypasta warnings fader
    const creepyInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const prompt = CREEPY_PROMPTS[Math.floor(Math.random() * CREEPY_PROMPTS.length)]
        setCreepyPrompt(prompt)
        setTimeout(() => {
          setCreepyPrompt("")
        }, 3500)
      }
    }, 18000)

    // 3. SCP-096 Screamer Timer
    let screamerTimer: NodeJS.Timeout
    if (itemNumber === 'SCP-096') {
      screamerTimer = setTimeout(() => {
        setScreamerActive(true)
        document.body.classList.add('screamer-shake-active')
        // Automatically play sound if context exists
        triggerScreechSound()

        // Turn off screamer after 3 seconds
        setTimeout(() => {
          setScreamerActive(false)
          document.body.classList.remove('screamer-shake-active')
        }, 3200)
      }, 7000)
    }

    return () => {
      clearInterval(flashInterval)
      clearInterval(creepyInterval)
      if (screamerTimer) clearTimeout(screamerTimer)
      document.body.classList.remove('screamer-shake-active')
      if (humOscRef.current) {
        try { humOscRef.current.stop() } catch (e) {}
      }
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current)
    }
  }, [itemNumber])

  return (
    <>
      {/* Floating Audio Controller */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold text-[10px] tracking-wider transition-all cursor-pointer ${
            audioActive
              ? 'bg-terminal-primary/20 text-terminal-primary border-terminal-primary animate-pulse'
              : 'bg-black text-terminal-primary/50 border-terminal-border hover:text-terminal-primary'
          }`}
        >
          {audioActive ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
          {audioActive ? 'AUDIO DIRECTIVE ACTIVE' : 'ENGAGE COGNITIVE AUDIO FEED'}
        </button>
      </div>

      {/* Full screen red static cognitohazard flash */}
      {glitchActive && (
        <div className="fixed inset-0 bg-red-950/20 red-noise-overlay z-40 pointer-events-none mix-blend-overlay"></div>
      )}

      {/* Creepypasta floating subtitle warning */}
      {creepyPrompt && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black border border-red-500/30 px-4 py-2 z-40 text-center font-bold text-red-500 tracking-widest text-[9px] animate-pulse">
          {creepyPrompt}
        </div>
      )}

      {/* SCP-096 Screamer overlay */}
      {screamerActive && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-red-500 red-noise-overlay pointer-events-none">
          <div className="text-center p-6 space-y-4 max-w-lg">
            <ShieldAlert className="w-24 h-24 text-red-500 animate-ping mx-auto" />
            <h1 className="text-3xl font-extrabold tracking-widest blink-text">[CRITICAL THREAT TRIGGERED]</h1>
            <p className="text-sm font-bold leading-relaxed">
              [WARNING: SCP-096 SENSORY PATTERN VIOLATED // FACIAL STRUCTURE DETECTED // SEVERE CONTAINMENT INSTABILITY IN METADATA PIPELINE // SUSPENDING ACTIVE FILEVIEWER]
            </p>
          </div>
        </div>
      )}
    </>
  )
}
