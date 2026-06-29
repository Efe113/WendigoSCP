'use client'

import React, { useTransition } from 'react'
import { setSimulatedClearance } from '@/app/actions/scp'

interface ClearanceSwitcherProps {
  currentLevel: number
  simulatedLevel: number | null
  realLevel: number
  isLoggedIn: boolean
}

export default function ClearanceSwitcher({
  currentLevel,
  simulatedLevel,
  realLevel,
  isLoggedIn,
}: ClearanceSwitcherProps) {
  const [isPending, startTransition] = useTransition()

  const handleClearanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10)
    startTransition(async () => {
      await setSimulatedClearance(val)
    })
  }

  return (
    <div className="flex items-center gap-2 border border-terminal-border px-3 py-1.5 bg-black text-xs font-mono">
      <span className="text-terminal-primary/60">AUTH_LEVEL:</span>
      <select
        value={simulatedLevel !== null ? simulatedLevel : 0}
        onChange={handleClearanceChange}
        disabled={isPending}
        className="bg-black text-terminal-primary border-none cursor-pointer focus:ring-0 text-xs py-0 pl-1 pr-6"
      >
        <option value={0}>
          {isLoggedIn ? `LEVEL ${realLevel} [SECURE]` : 'LEVEL 1 [GUEST]'}
        </option>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <option key={lvl} value={lvl}>
            LEVEL {lvl} [OVERRIDE]
          </option>
        ))}
      </select>
      {isPending && (
        <span className="w-1.5 h-1.5 rounded-full bg-terminal-primary animate-ping"></span>
      )}
    </div>
  )
}
