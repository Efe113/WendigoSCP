'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'

interface AlphaWarheadCountdownProps {
  initialSeconds: number
}

export default function AlphaWarheadCountdown({ initialSeconds }: AlphaWarheadCountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds || 90)

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds])

  if (seconds <= 0) {
    return (
      <div className="bg-red-950/90 text-red-500 border-b border-red-500 py-2.5 px-4 text-center font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 animate-bounce z-50 relative">
        <ShieldAlert className="w-5 h-5 animate-ping" />
        <span>[CRITICAL ERROR: ALPHA WARHEAD DETONATION COMPLETE // SITE-19 COMPROMISED]</span>
      </div>
    )
  }

  return (
    <div className="bg-red-950 text-red-500 border-b border-red-500 py-2 px-4 text-center font-mono font-bold tracking-widest text-xs flex items-center justify-center gap-3 animate-pulse z-50 relative">
      <AlertTriangle className="w-5 h-5 animate-bounce" />
      <span>[CRITICAL WARNING: ALPHA WARHEAD SELF-DESTRUCT IN PROGRESS // DETONATION IN {seconds}s]</span>
      <div className="hidden sm:inline-block w-48 bg-neutral-900 border border-red-500 h-2 overflow-hidden">
        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${(seconds / initialSeconds) * 100}%` }}></div>
      </div>
    </div>
  )
}
