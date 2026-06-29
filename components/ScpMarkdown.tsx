'use client'

import React from 'react'
import TerminalCard from './TerminalCard'
import RedactedText from './RedactedText'

interface ScpMarkdownProps {
  content: string
}

export function replaceCustomTags(text: string): string {
  if (!text) return ''
  let res = text

  // 1-6. Object classes
  res = res.replace(/\[safe\]/gi, '<span class="px-1.5 py-0.5 border border-green-500 bg-green-500/10 text-green-400 font-bold rounded text-[9px] uppercase tracking-wider">SAFE</span>')
  res = res.replace(/\[euclid\]/gi, '<span class="px-1.5 py-0.5 border border-yellow-500 bg-yellow-500/10 text-yellow-400 font-bold rounded text-[9px] uppercase tracking-wider">EUCLID</span>')
  res = res.replace(/\[keter\]/gi, '<span class="px-1.5 py-0.5 border border-red-500 bg-red-500/10 text-red-400 font-bold rounded text-[9px] uppercase tracking-wider animate-pulse">KETER</span>')
  res = res.replace(/\[thaumiel\]/gi, '<span class="px-1.5 py-0.5 border border-purple-500 bg-purple-500/10 text-purple-400 font-bold rounded text-[9px] uppercase tracking-wider">THAUMIEL</span>')
  res = res.replace(/\[apollyon\]/gi, '<span class="px-1.5 py-0.5 border border-red-900 bg-black text-white font-bold rounded text-[9px] uppercase tracking-wider animate-bounce">APOLLYON</span>')
  res = res.replace(/\[neutralized\]/gi, '<span class="px-1.5 py-0.5 border border-gray-500 bg-gray-500/10 text-gray-400 font-bold rounded text-[9px] uppercase tracking-wider">NEUTRALIZED</span>')

  // 7-13. Threat levels
  res = res.replace(/\[threat-white\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-white rounded-full border border-gray-400 mr-1" title="White"></span>')
  res = res.replace(/\[threat-blue\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-blue-500 rounded-full border border-blue-400 mr-1 animate-pulse" title="Blue"></span>')
  res = res.replace(/\[threat-green\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-green-500 rounded-full border border-green-400 mr-1" title="Green"></span>')
  res = res.replace(/\[threat-yellow\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-yellow-500 rounded-full border border-yellow-400 mr-1" title="Yellow"></span>')
  res = res.replace(/\[threat-orange\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-orange-500 rounded-full border border-orange-400 mr-1" title="Orange"></span>')
  res = res.replace(/\[threat-red\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-red-600 rounded-full border border-red-400 mr-1 animate-ping" style="animation-duration:1.5s;" title="Red"></span>')
  res = res.replace(/\[threat-black\]/gi, '<span class="w-2.5 h-2.5 inline-block bg-black rounded-full border border-red-600 mr-1" title="Black"></span>')

  // 14-18. Disruption Classes
  res = res.replace(/\[disrupt-dark\]/gi, '<span class="text-green-500 font-semibold">[DISRUPT: DARK]</span>')
  res = res.replace(/\[disrupt-vlam\]/gi, '<span class="text-blue-400 font-semibold">[DISRUPT: VLAM]</span>')
  res = res.replace(/\[disrupt-keneq\]/gi, '<span class="text-yellow-500 font-semibold">[DISRUPT: KENEQ]</span>')
  res = res.replace(/\[disrupt-ekhi\]/gi, '<span class="text-orange-500 font-semibold animate-pulse">[DISRUPT: EKHI]</span>')
  res = res.replace(/\[disrupt-amida\]/gi, '<span class="text-red-500 font-bold glow-text-red animate-pulse">[DISRUPT: AMIDA]</span>')

  // 19-23. Risk Classes
  res = res.replace(/\[risk-notice\]/gi, '<span class="border border-green-500/30 px-1 py-0.2 text-[9px] text-green-400">RISK: NOTICE</span>')
  res = res.replace(/\[risk-caution\]/gi, '<span class="border border-blue-500/30 px-1 py-0.2 text-[9px] text-blue-400">RISK: CAUTION</span>')
  res = res.replace(/\[risk-warning\]/gi, '<span class="border border-yellow-500/30 px-1 py-0.2 text-[9px] text-yellow-400">RISK: WARNING</span>')
  res = res.replace(/\[risk-danger\]/gi, '<span class="border border-orange-500/30 px-1 py-0.2 text-[9px] text-orange-400">RISK: DANGER</span>')
  res = res.replace(/\[risk-critical\]/gi, '<span class="border border-red-500/50 bg-red-950/20 px-1 py-0.2 text-[9px] text-red-500 font-bold animate-pulse">RISK: CRITICAL</span>')

  // 24-29. Department headers
  res = res.replace(/\[dept-research\]/gi, '<span class="text-cyan-400 font-extrabold tracking-wider">[RESEARCH DIVISION]</span>')
  res = res.replace(/\[dept-security\]/gi, '<span class="text-blue-500 font-extrabold tracking-wider">[SECURITY COMMAND]</span>')
  res = res.replace(/\[dept-medical\]/gi, '<span class="text-green-400 font-extrabold tracking-wider">[MEDICAL SERVICES]</span>')
  res = res.replace(/\[dept-engineering\]/gi, '<span class="text-yellow-600 font-extrabold tracking-wider">[ENGINEERING & CONSTRUCT]</span>')
  res = res.replace(/\[dept-tactical\]/gi, '<span class="text-red-500 font-extrabold tracking-wider">[TACTICAL RESPONSE FORCE]</span>')
  res = res.replace(/\[dept-admin\]/gi, '<span class="text-purple-400 font-extrabold tracking-wider">[ADMINISTRATIVE OFFICE]</span>')

  // 30-34. MTF units
  res = res.replace(/\[mtf-alpha1\]/gi, '<span class="px-1.5 py-0.5 bg-red-950 border border-red-500 text-red-400 font-bold uppercase rounded text-[9px]">MTF Alpha-1 ("Red Right Hand")</span>')
  res = res.replace(/\[mtf-epsilon11\]/gi, '<span class="px-1.5 py-0.5 bg-blue-950 border border-blue-500 text-blue-400 font-bold uppercase rounded text-[9px]">MTF Epsilon-11 ("Nine-Tailed Fox")</span>')
  res = res.replace(/\[mtf-beta7\]/gi, '<span class="px-1.5 py-0.5 bg-green-950 border border-green-600 text-green-400 font-bold uppercase rounded text-[9px]">MTF Beta-7 ("Maz Hatters")</span>')
  res = res.replace(/\[mtf-nu7\]/gi, '<span class="px-1.5 py-0.5 bg-yellow-950 border border-yellow-600 text-yellow-400 font-bold uppercase rounded text-[9px]">MTF Nu-7 ("Hammer Down")</span>')
  res = res.replace(/\[mtf-tau5\]/gi, '<span class="px-1.5 py-0.5 bg-purple-950 border border-purple-500 text-purple-400 font-bold uppercase rounded text-[9px]">MTF Tau-5 ("Samsara")</span>')

  // 35-38. Status pills
  res = res.replace(/\[status-active\]/gi, '<span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span><span class="text-[9px] font-bold text-green-400 uppercase">ACTIVE</span></span>')
  res = res.replace(/\[status-breached\]/gi, '<span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span><span class="text-[9px] font-bold text-red-500 uppercase animate-pulse">BREACHED</span></span>')
  res = res.replace(/\[status-missing\]/gi, '<span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span><span class="text-[9px] font-bold text-yellow-400 uppercase">MISSING</span></span>')
  res = res.replace(/\[status-terminated\]/gi, '<span class="inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-gray-500"></span><span class="text-[9px] font-bold text-gray-500 uppercase">TERMINATED</span></span>')

  // 39-45. Enclosing Text Styles
  res = res.replace(/\[glitch\]([\s\S]*?)\[\/glitch\]/gi, '<span class="animate-pulse text-red-500 font-extrabold tracking-widest" style="text-shadow: 1px 1px #00ff66;">$1</span>')
  res = res.replace(/\[rainbow\]([\s\S]*?)\[\/rainbow\]/gi, '<span class="font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">$1</span>')
  res = res.replace(/\[typewriter\]([\s\S]*?)\[\/typewriter\]/gi, '<span class="border-r border-terminal-primary pr-0.5 animate-pulse font-mono text-white">$1</span>')
  res = res.replace(/\[glow\]([\s\S]*?)\[\/glow\]/gi, '<span class="glow-text-green text-white font-bold">$1</span>')
  res = res.replace(/\[matrix\]([\s\S]*?)\[\/matrix\]/gi, '<span class="text-green-500 font-mono tracking-widest" style="text-shadow: 0 0 3px rgba(0,255,102,0.6)">$1</span>')
  res = res.replace(/\[blur\]([\s\S]*?)\[\/blur\]/gi, '<span class="blur-[2.5px] hover:blur-none transition-all duration-300 text-white cursor-help" title="Hover to decrypt">$1</span>')
  res = res.replace(/\[corrupt\]([\s\S]*?)\[\/corrupt\]/gi, '<span class="line-through decoration-red-600 text-red-400 select-none opacity-60 font-serif">$1</span>')

  // 46-49. Redaction Styles
  res = res.replace(/\[expunged\]/gi, '<span class="px-1 bg-red-600 text-black font-bold uppercase select-none text-[10px]">[DATA EXPUNGED]</span>')
  res = res.replace(/\[redacted\]/gi, '<span class="px-1 bg-black text-black select-none text-[10px] border border-terminal-border/20">[REDACTED]</span>')
  res = res.replace(/\[classified\]/gi, '<span class="px-1 bg-yellow-600 text-black font-bold uppercase select-none text-[10px]">[CLASSIFIED INFORMATION]</span>')
  res = res.replace(/\[restricted\]/gi, '<span class="px-1 bg-red-950 text-red-500 font-bold border border-red-700 text-[10px] uppercase">[RESTRICTED COMMAND ACCESS]</span>')

  // 50-53. System Widgets
  res = res.replace(/\[spectrogram\]/gi, '<span class="flex items-end gap-0.5 h-6 w-16 border-b border-terminal-border/40 pb-0.5 px-1"><span class="bg-terminal-primary w-1 h-3 animate-pulse"></span><span class="bg-terminal-primary w-1 h-5 animate-pulse" style="animation-delay:0.1s;"></span><span class="bg-terminal-primary w-1 h-2 animate-pulse" style="animation-delay:0.2s;"></span><span class="bg-terminal-primary w-1 h-4 animate-pulse" style="animation-delay:0.3s;"></span></span>')
  res = res.replace(/\[ecg\]/gi, '<span class="inline-block w-24 h-6 align-middle"><svg class="w-full h-full text-terminal-primary" viewBox="0 0 100 30" fill="none"><path d="M 0 15 L 25 15 L 30 5 L 35 25 L 40 15 L 100 15" stroke="currentColor" stroke-width="1.5" class="animate-pulse"/></svg></span>')
  res = res.replace(/\[radar\]/gi, '<span class="relative w-8 h-8 rounded-full border border-terminal-primary/45 inline-block align-middle overflow-hidden bg-black"><span class="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(0,255,102,0.35)_0deg,transparent_120deg)] animate-spin" style="animation-duration:3s;"></span><span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-terminal-primary animate-ping"></span></span>')
  res = res.replace(/\[cctv\]/gi, '<span class="border border-terminal-primary/40 p-1 bg-black/40 text-[9px] text-terminal-primary/75 inline-flex items-center gap-1.5 uppercase font-bold"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>REC FEED-B // BRANCH_19</span>')

  // 54-57. Slanted Stamps (stamps overlay)
  res = res.replace(/\[stamp-approved\]/gi, '<span class="inline-block border-2 border-dashed border-green-500 text-green-400 font-bold uppercase text-[9px] px-2 py-0.5 rounded rotate-[-6deg] tracking-widest opacity-80 select-none">EC_APPROVED</span>')
  res = res.replace(/\[stamp-denied\]/gi, '<span class="inline-block border-2 border-dashed border-red-500 text-red-500 font-bold uppercase text-[9px] px-2 py-0.5 rounded rotate-[-6deg] tracking-widest opacity-80 select-none">O5_DENIED</span>')
  res = res.replace(/\[stamp-classified\]/gi, '<span class="inline-block border-2 border-dashed border-yellow-500 text-yellow-500 font-bold uppercase text-[9px] px-2 py-0.5 rounded rotate-[-6deg] tracking-widest opacity-80 select-none">LEVEL_4_CLASS</span>')
  res = res.replace(/\[stamp-terminated\]/gi, '<span class="inline-block border-2 border-dashed border-red-600 text-red-600 font-bold uppercase text-[9px] px-2 py-0.5 rounded rotate-[-6deg] tracking-widest opacity-80 select-none animate-pulse">TERMINATED</span>')

  return res
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
