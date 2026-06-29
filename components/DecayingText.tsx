'use client'

import React, { useState, useEffect } from 'react'

interface DecayingTextProps {
  text: string
  children?: (glitchedText: string) => React.ReactNode
}

const GLITCH_CHARS = "█ø†☠§■□▲▼○●✕✓☒☢☣☠⚡"

export default function DecayingText({ text, children }: DecayingTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    setDisplayText(text)

    const interval = setInterval(() => {
      // 30% chance to trigger text decay spike
      if (Math.random() > 0.6) {
        let textArr = text.split("")
        const length = textArr.length
        const decayCount = Math.floor(length * 0.04) // Glitch 4% of chars

        const glitchedIndices: number[] = []

        for (let i = 0; i < decayCount; i++) {
          const randIdx = Math.floor(Math.random() * length)
          // Skip whitespace and newlines
          if (textArr[randIdx] !== " " && textArr[randIdx] !== "\n") {
            textArr[randIdx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            glitchedIndices.push(randIdx)
          }
        }

        setDisplayText(textArr.join(""))

        // Heal back slowly after 1.2 seconds
        setTimeout(() => {
          setDisplayText(text)
        }, 1200)
      }
    }, 4500)

    return () => clearInterval(interval)
  }, [text])

  if (children) {
    return <>{children(displayText)}</>
  }

  return <span className="transition-all duration-300">{displayText}</span>
}
