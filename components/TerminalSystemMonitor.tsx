'use client'

import React, { useState, useEffect } from 'react'
import { Activity, ShieldAlert, Cpu, HardDrive, Wifi, Shield } from 'lucide-react'

export default function TerminalSystemMonitor() {
  const [cpu, setCpu] = useState(18)
  const [ram, setRam] = useState(42)
  const [temp, setTemp] = useState(38)
  const [bandwidth, setBandwidth] = useState(148)
  const [logs, setLogs] = useState<string[]>([
    'SYS_MONITOR initialized.',
    'Node BRANCH_19 link active.',
    'Syncing database cache...',
    'Supabase node linked (ping: 24ms).',
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuate values
      setCpu((prev) => Math.min(100, Math.max(5, prev + Math.floor(Math.random() * 11) - 5)))
      setRam((prev) => Math.min(100, Math.max(30, prev + Math.floor(Math.random() * 5) - 2)))
      setTemp((prev) => Math.min(85, Math.max(30, prev + Math.floor(Math.random() * 3) - 1)))
      setBandwidth((prev) => Math.min(1000, Math.max(50, prev + Math.floor(Math.random() * 41) - 20)))

      // Random logs
      const randomLogs = [
        'Cognitohazard scanning group idle.',
        'Database transaction verified.',
        'Ping node ap-south-1.supabase.co successful.',
        'Cleared memory buffers.',
        'O5 security sweep complete.',
        'Site-19 grid power: stable.',
        'Amnestic vaults stock checked.',
        'Memetic filter updated.',
      ]
      if (Math.random() > 0.7) {
        const entry = `[${new Date().toLocaleTimeString()}] ${randomLogs[Math.floor(Math.random() * randomLogs.length)]}`
        setLogs((prev) => [entry, ...prev.slice(0, 5)])
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] leading-normal text-terminal-primary">
      {/* Visual bars */}
      <div className="border border-terminal-border bg-black/40 p-3 space-y-2.5">
        <div className="text-[9px] text-white font-bold border-b border-terminal-border/20 pb-1 flex items-center gap-1 uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5 animate-pulse text-terminal-primary" /> SYSTEM DIAGNOSTICS MONITOR
        </div>

        {/* CPU Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-semibold">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU CORE INGRESS:</span>
            <span>{cpu}% LOAD</span>
          </div>
          <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 overflow-hidden">
            <div className="bg-terminal-primary h-full transition-all duration-300" style={{ width: `${cpu}%` }}></div>
          </div>
        </div>

        {/* RAM Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-semibold">
            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> RAM ALLOCATION:</span>
            <span>{ram}% USED</span>
          </div>
          <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 overflow-hidden">
            <div className="bg-terminal-primary h-full transition-all duration-300" style={{ width: `${ram}%` }}></div>
          </div>
        </div>

        {/* Info Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-[9px] border-t border-terminal-border/10">
          <div className="border border-terminal-border/20 p-1.5 bg-black/50">
            <span className="text-terminal-primary/50 block uppercase">NODE TEMP</span>
            <span className="font-bold text-white block mt-0.5">{temp}°C</span>
          </div>
          <div className="border border-terminal-border/20 p-1.5 bg-black/50">
            <span className="text-terminal-primary/50 block">NET RATE</span>
            <span className="font-bold text-white block mt-0.5">{bandwidth} Mb/s</span>
          </div>
          <div className="border border-terminal-border/20 p-1.5 bg-black/50">
            <span className="text-terminal-primary/50 block uppercase">SYNC RATE</span>
            <span className="font-bold text-terminal-primary block mt-0.5 animate-pulse">100% OK</span>
          </div>
        </div>
      </div>

      {/* Scrolling Console log ticker */}
      <div className="border border-terminal-border bg-black/40 p-3 flex flex-col justify-between h-full">
        <div className="text-[9px] text-white font-bold border-b border-terminal-border/20 pb-1 flex items-center gap-1 uppercase tracking-widest mb-1.5">
          <Wifi className="w-3.5 h-3.5 text-terminal-primary animate-pulse" /> NETWORK ANNOUNCEMENT LINK
        </div>
        
        <div className="flex-grow space-y-1 font-mono text-[9px] text-terminal-primary/60 max-h-[85px] overflow-hidden select-none">
          {logs.map((log, idx) => (
            <p key={idx} className="truncate">{log}</p>
          ))}
        </div>

        <div className="border-t border-terminal-border/20 pt-1.5 mt-1.5 flex justify-between items-center text-[8px] text-terminal-primary/45 uppercase tracking-wider font-semibold">
          <span>PORTAL SECURE FEED</span>
          <span className="flex items-center gap-0.5"><Shield className="w-2.5 h-2.5" /> SECURE GRID ACTIVE</span>
        </div>
      </div>
    </div>
  )
}
