'use client'

import React from 'react'
import TerminalCard from './TerminalCard'
import RedactedText from './RedactedText'

interface ScpMarkdownProps {
  content: string
}

export default function ScpMarkdown({ content }: ScpMarkdownProps) {
  if (!content) return null

  // Tokenize the content by block tags: [warn], [denied], [interview]
  const blockRegex = /(\[warn\][\s\S]*?\[\/warn\]|\[denied\][\s\S]*?\[\/denied\]|\[interview\][\s\S]*?\[\/interview\])/g
  const chunks = content.split(blockRegex)

  return (
    <div className="space-y-4">
      {chunks.map((chunk, index) => {
        if (chunk.startsWith('[warn]')) {
          const innerText = chunk.replace(/\[warn\]/g, '').replace(/\[\/warn\]/g, '').trim()
          return (
            <TerminalCard key={index} status="warn" statusText="SECURE_WARNING" title="PROTOCOL WARNING">
              <div className="text-xs">{renderParagraphs(innerText)}</div>
            </TerminalCard>
          )
        }
        if (chunk.startsWith('[denied]')) {
          const innerText = chunk.replace(/\[denied\]/g, '').replace(/\[\/denied\]/g, '').trim()
          return (
            <TerminalCard key={index} status="error" statusText="ACCESS_RESTRICTED" title="ACCESS LOG: BLOCK">
              <div className="text-xs">{renderParagraphs(innerText)}</div>
            </TerminalCard>
          )
        }
        if (chunk.startsWith('[interview]')) {
          const innerText = chunk.replace(/\[interview\]/g, '').replace(/\[\/interview\]/g, '').trim()
          return (
            <div key={index} className="border-l-2 border-terminal-info pl-4 py-1.5 my-3 text-terminal-info/90 bg-terminal-info/[0.01]">
              <div className="text-[10px] uppercase font-bold tracking-wider mb-2 text-terminal-info/60">
                TRANSCRIPT LOG
              </div>
              <div className="space-y-2">{renderParagraphs(innerText)}</div>
            </div>
          )
        }
        return <div key={index}>{renderParagraphs(chunk)}</div>
      })}
    </div>
  )
}

function renderParagraphs(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return <div key={i} className="h-2"></div>

    // Headers: ### Header
    if (trimmedLine.startsWith('### ')) {
      return (
        <h4 key={i} className="text-xs font-bold text-white mt-4 mb-2 tracking-wider uppercase border-b border-terminal-border/20 pb-0.5">
          {renderInline(trimmedLine.substring(4))}
        </h4>
      )
    }

    // Blockquotes: > quote
    if (trimmedLine.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-2 border-terminal-primary/45 pl-3 my-2 text-xs text-terminal-primary/75 italic">
          {renderInline(trimmedLine.substring(2))}
        </blockquote>
      )
    }

    // Bullet points: - item
    if (trimmedLine.startsWith('- ')) {
      return (
        <ul key={i} className="list-disc list-inside ml-2 my-1 text-xs text-terminal-primary/90">
          <li className="list-item">{renderInline(trimmedLine.substring(2))}</li>
        </ul>
      )
    }

    // Standard paragraph
    return (
      <p key={i} className="text-xs leading-relaxed text-terminal-primary/95 my-1.5">
        {renderInline(trimmedLine)}
      </p>
    )
  })
}

// Simple bold and italic compilation inline
function renderInline(text: string) {
  // Regex split to extract bold parts: e.g. "Normal **bold** normal"
  const boldRegex = /(\*\*.*?\*\*)/g
  const parts = text.split(boldRegex)

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2)
          return <strong key={idx} className="text-white font-bold">{renderItalic(boldText)}</strong>
        }
        return <span key={idx}>{renderItalic(part)}</span>
      })}
    </>
  )
}

function renderItalic(text: string) {
  const italicRegex = /(\*.*?\*)/g
  const parts = text.split(italicRegex)

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          const italicText = part.slice(1, -1)
          return <em key={idx} className="italic text-terminal-primary/90">{renderRedacted(italicText)}</em>
        }
        return <span key={idx}>{renderRedacted(part)}</span>
      })}
    </>
  )
}

// Pass text to RedactedText component to handle ||redacted||
function renderRedacted(text: string) {
  return <RedactedText text={text} />
}
