'use client'

import React from 'react'
import TerminalCard from './TerminalCard'
import RedactedText from './RedactedText'

interface ScpMarkdownProps {
  content: string
}

export default function ScpMarkdown({ content }: ScpMarkdownProps) {
  if (!content) return null

  // Tokenize the content by block tags: [warn], [denied], [interview], [note], [level5]
  const blockRegex = /(\[warn\][\s\S]*?\[\/warn\]|\[denied\][\s\S]*?\[\/denied\]|\[interview\][\s\S]*?\[\/interview\]|\[note\][\s\S]*?\[\/note\]|\[level5\][\s\S]*?\[\/level5\])/g
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
            <div key={index} className="border-l-2 border-terminal-info pl-4 py-1.5 my-3 text-terminal-info/90 bg-terminal-info/[0.01] font-mono">
              <div className="text-[10px] uppercase font-bold tracking-wider mb-2 text-terminal-info/60">
                TRANSCRIPT LOG
              </div>
              <div className="space-y-2">{renderParagraphs(innerText)}</div>
            </div>
          )
        }
        if (chunk.startsWith('[note]')) {
          const innerText = chunk.replace(/\[note\]/g, '').replace(/\[\/note\]/g, '').trim()
          return (
            <div key={index} className="border border-dashed border-terminal-warn/40 bg-terminal-warn/[0.01] p-3 my-3 text-terminal-warn/90">
              <div className="text-[9px] uppercase font-bold tracking-widest mb-1.5 text-terminal-warn/50">
                ADMINISTRATIVE NOTE // RESTRICTED ACCESS
              </div>
              <div className="text-xs">{renderParagraphs(innerText)}</div>
            </div>
          )
        }
        if (chunk.startsWith('[level5]')) {
          const innerText = chunk.replace(/\[level5\]/g, '').replace(/\[\/level5\]/g, '').trim()
          return (
            <div key={index} className="border border-terminal-error bg-terminal-error/5 p-4 my-4 relative overflow-hidden">
              <div className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 border-t border-l border-terminal-error animate-pulse"></div>
              <div className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 border-t border-r border-terminal-error animate-pulse"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-3.5 h-3.5 border-b border-l border-terminal-error animate-pulse"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-3.5 h-3.5 border-b border-r border-terminal-error animate-pulse"></div>
              <div className="text-[10px] text-terminal-error font-extrabold tracking-widest mb-2 flex items-center gap-1.5 uppercase">
                <span className="inline-block w-2 h-2 bg-terminal-error rounded-full animate-ping"></span>
                LEVEL 5 SECURITY ACCESS ONLY // O5 COMMAND RESTRICTIONS
              </div>
              <div className="text-xs text-terminal-error/90">{renderParagraphs(innerText)}</div>
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

    // Dividers: ---
    if (trimmedLine === '---') {
      return <hr key={i} className="border-t border-dashed border-terminal-border/40 my-3" />
    }

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

// Inline code compilation: `code`
function renderInline(text: string) {
  const codeRegex = /(`[^`\n]+`)/g
  const parts = text.split(codeRegex)

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeText = part.slice(1, -1)
          return (
            <code key={idx} className="bg-black border border-terminal-border/40 px-1 text-terminal-primary font-mono text-[11px] font-semibold text-shadow-none mx-0.5">
              {codeText}
            </code>
          )
        }
        return <span key={idx}>{renderBold(part)}</span>
      })}
    </>
  )
}

function renderBold(text: string) {
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

function renderRedacted(text: string) {
  return <RedactedText text={text} />
}
