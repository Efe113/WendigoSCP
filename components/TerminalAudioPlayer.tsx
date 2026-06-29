'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Square } from 'lucide-react'

interface TerminalAudioPlayerProps {
  url: string
  caption?: string
}

export default function TerminalAudioPlayer({ url, caption }: TerminalAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      audioRef.current.muted = val === 0
    }
    setIsMuted(val === 0)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const muteState = !isMuted
    setIsMuted(muteState)
    audioRef.current.muted = muteState
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
  }

  return (
    <div className="border border-terminal-border bg-black p-4 relative font-mono mb-4 max-w-md">
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Retro Signal Visualizer (pulsing bars when playing) */}
      <div className="flex justify-between items-center border-b border-terminal-border/40 pb-2 mb-3 text-xs tracking-wider">
        <span className="text-[10px] text-terminal-primary flex items-center gap-1.5 font-bold">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-terminal-primary animate-ping' : 'bg-terminal-primary/30'}`}></span>
          AUDIO LOG DECRYPTED // UPLINK_ONLINE
        </span>
        <div className="flex items-end gap-0.5 h-3">
          {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-terminal-primary transition-all duration-150"
              style={{
                height: isPlaying ? `${Math.floor(Math.random() * 100)}%` : '20%',
                opacity: isPlaying ? 0.9 : 0.3
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Control row */}
      <div className="flex items-center gap-4">
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center border border-terminal-border hover:bg-terminal-primary/10 text-terminal-primary transition-all cursor-pointer"
            title={isPlaying ? "PAUSE" : "PLAY"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={stopAudio}
            className="w-8 h-8 flex items-center justify-center border border-terminal-border hover:bg-terminal-primary/10 text-terminal-primary transition-all cursor-pointer"
            title="STOP"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Time Progress Bar */}
        <div className="flex-grow flex items-center gap-2">
          <span className="text-[10px] tabular-nums text-terminal-primary/80">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-grow h-1 bg-terminal-border rounded-lg appearance-none cursor-pointer accent-terminal-primary focus:outline-none"
            style={{
              background: `linear-gradient(to right, var(--primary) ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, var(--border) ${duration > 0 ? (currentTime / duration) * 100 : 0}%)`
            }}
          />
          <span className="text-[10px] tabular-nums text-terminal-primary/80">{formatTime(duration)}</span>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-1.5 border-l border-terminal-border/40 pl-3">
          <button
            onClick={toggleMute}
            className="text-terminal-primary/75 hover:text-terminal-primary transition-colors cursor-pointer"
            title={isMuted ? "UNMUTE" : "MUTE"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-12 h-1 bg-terminal-border rounded-lg appearance-none cursor-pointer accent-terminal-primary"
          />
        </div>
      </div>

      {caption && (
        <div className="text-[10px] text-terminal-primary/50 mt-2 text-center border-t border-terminal-border/20 pt-1">
          CAPTION: {caption.toUpperCase()}
        </div>
      )}
    </div>
  )
}
