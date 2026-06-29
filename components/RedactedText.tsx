'use client'

import React, { useState, useEffect } from 'react'
import { replaceCustomTags } from './ScpMarkdown'

interface RedactedTextProps {
  text: string
}

export default function RedactedText({ text }: RedactedTextProps) {
  if (!text) return null

  // Split by double pipe: e.g. "This is ||redacted text|| here."
  // Even indexes are normal text, odd indexes are redacted text.
  const parts = text.split(/\|\|/g)

  if (parts.length === 1) {
    return <span dangerouslySetInnerHTML={{ __html: replaceCustomTags(text) }} />
  }

  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <RedactedWord key={index} word={part} />
        }
        return <span key={index} dangerouslySetInnerHTML={{ __html: replaceCustomTags(part) }} />
      })}
    </span>
  )
}

function RedactedWord({ word }: { word: string }) {
  const [hovered, setHovered] = useState(false)
  const [isAbsolute, setIsAbsolute] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/scp_redaction_level=([^;]+)/)
      setIsAbsolute(match ? match[1] === 'absolute' : false)
    }
  }, [])

  const handleMouseEnter = () => {
    if (!isAbsolute) {
      setHovered(true)
    }
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className={`inline px-1 mx-0.5 font-mono transition-all duration-150 select-none ${
        hovered && !isAbsolute
          ? 'bg-transparent text-terminal-primary border border-dashed border-terminal-primary/50 cursor-crosshair'
          : 'bg-black text-black border border-black cursor-not-allowed'
      }`}
      title={isAbsolute ? "PERMANENTLY EXPUNGED BY O5 ORDER" : (hovered ? "DECRYPTED DATA" : "SECURITY CLEARANCE DETECTED: HOVER TO DECRYPT")}
      style={{
        color: hovered && !isAbsolute ? 'var(--primary)' : 'transparent',
        backgroundColor: hovered && !isAbsolute ? 'transparent' : '#000000',
        textShadow: hovered && !isAbsolute ? '0 0 2px rgba(0, 255, 102, 0.5)' : 'none'
      }}
      dangerouslySetInnerHTML={{ __html: (hovered && !isAbsolute) ? replaceCustomTags(word) : word }}
    />
  )
}
