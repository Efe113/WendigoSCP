import React from 'react'
import { Download } from 'lucide-react'

interface TerminalImageFrameProps {
  url: string
  caption?: string
  classification?: string
}

export default function TerminalImageFrame({ url, caption, classification = 'RESTRICTED' }: TerminalImageFrameProps) {
  return (
    <div className="border border-terminal-border bg-black/90 p-3 relative font-mono max-w-sm mb-4">
      {/* Corner brackets */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-terminal-primary"></div>
      <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-terminal-primary"></div>
      <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-terminal-primary"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-terminal-primary"></div>

      {/* Classification bar */}
      <div className="flex justify-between items-center border-b border-terminal-border/40 pb-1.5 mb-2.5 text-[10px] tracking-wider text-terminal-primary/70">
        <span className="font-bold flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-terminal-primary rounded-full animate-ping"></span>
          VISUAL_FEED: {classification.toUpperCase()}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1"
          title="DOWNLOAD HIGH-RES FEED"
        >
          <Download className="w-3 h-3" /> DL_DATA
        </a>
      </div>

      {/* Image container with scanline overlay */}
      <div className="relative border border-terminal-border/50 overflow-hidden bg-neutral-950 flex justify-center items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={caption || 'Visual Ingestion'}
          className="max-w-full h-auto object-contain max-h-60 filter grayscale opacity-85 contrast-125 brightness-95 hover:filter-none transition-all duration-300"
        />
        {/* Glowing green tint scanline overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-terminal-primary/[0.03] to-transparent pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="text-[10px] leading-relaxed text-terminal-primary/60 mt-2 text-center border-t border-terminal-border/20 pt-1.5 uppercase tracking-wide">
          FIG_1: {caption}
        </div>
      )}
    </div>
  )
}
