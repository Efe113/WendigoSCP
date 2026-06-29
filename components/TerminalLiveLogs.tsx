'use client'

import React, { useState, useEffect } from 'react'

const LOG_TEMPLATES = [
  "SCP-173 containment cell temperature within bounds.",
  "Cognitohazard shielding frequency deviation of 0.2Hz detected.",
  "Syncing secure directory nodes with Site-81.",
  "Amnestic Class-A reserves at 94% volume.",
  "Database replication response verified in 4ms.",
  "Staff evaluation audit schedule synchronized.",
  "D-Class nutritional intake protocol executed successfully.",
  "Electromagnetic shielding sweep complete.",
  "Site-19 primary power grid operating at 100% capacity.",
  "Psychological screening queue updated.",
  "Biometric access check succeeded for Sector-3 labs.",
  "Decontamination valve checks: OK.",
  "Ethics liaison audit ping received and answered.",
  "Intrusion prevention logs rotated.",
  "Secondary backup battery grids charging.",
  "Civilian witness exposure report checked."
]

export default function TerminalLiveLogs() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Populate initial logs
    const initial: string[] = []
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const timeStr = new Date(now.getTime() - (6 - i) * 60000).toLocaleTimeString()
      const randTemplate = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
      initial.push(`[${timeStr}] [INFO] ${randTemplate}`)
    }
    setLogs(initial)

    // Interval to append new logs
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString()
      const randTemplate = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
      const isWarn = Math.random() > 0.8
      const tag = isWarn ? 'WARN' : 'INFO'
      const newLog = `[${timeStr}] [${tag}] ${randTemplate}`

      setLogs((prev) => {
        const next = [...prev, newLog]
        if (next.length > 8) {
          next.shift()
        }
        return next
      })
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black border border-terminal-border p-4 font-mono text-[10px] text-terminal-primary/80 space-y-1 select-none overflow-hidden h-[160px] relative">
      <div className="text-white font-extrabold border-b border-terminal-border/25 pb-1 mb-2 tracking-wider flex justify-between">
        <span>&gt; SITE-19 TELEMETRY STREAM</span>
        <span className="text-terminal-primary animate-pulse text-[9px]">LIVE TELEMETRY ON</span>
      </div>

      <div className="space-y-1 h-[110px] overflow-hidden">
        {logs.map((log, idx) => {
          const isWarn = log.includes('[WARN]')
          return (
            <div
              key={idx}
              className={`log-line-item truncate ${
                isWarn ? 'text-terminal-warn font-semibold' : ''
              }`}
            >
              {log}
            </div>
          )
        })}
        <div className="text-terminal-primary flex items-center gap-1">
          <span>&gt; SYSTEM MONITOR ACTIVE</span>
          <span className="w-1.5 h-3.5 bg-terminal-primary animate-ping"></span>
        </div>
      </div>
    </div>
  )
}
