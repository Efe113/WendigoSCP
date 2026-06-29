'use client'

import React, { useState } from 'react'

interface RedactedTextProps {
  text: string
}

export default function RedactedText({ text }: RedactedTextProps) {
  if (!text) return null

  // Split by double pipe: e.g. "This is ||redacted text|| here."
  // Even indexes are normal text, odd indexes are redacted text.
  const parts = text.split(/\|\|/g)

  if (parts.length === 1) {
    return <span>{text}</span>
  }

  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <RedactedWord key={index} word={part} />
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}

function RedactedWord({ word }: { word: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline px-1 mx-0.5 font-mono cursor-crosshair transition-all duration-150 select-none ${
        hovered
          ? 'bg-transparent text-terminal-primary border border-dashed border-terminal-primary/50'
          : 'bg-black text-black border border-black'
      }`}
      title={hovered ? "DECRYPTED DATA" : "SECURITY CLEARANCE DETECTED: HOVER TO DECRYPT"}
      style={{
        color: hovered ? 'var(--primary)' : 'transparent',
        backgroundColor: hovered ? 'transparent' : '#000000',
        textShadow: hovered ? '0 0 2px rgba(0, 255, 102, 0.5)' : 'none'
      }}
    >
      {word}
    </span>
  )
}
