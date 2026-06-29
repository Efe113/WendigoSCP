'use client'

import React, { useState } from 'react'
import ScpMarkdown from './ScpMarkdown'
import { HelpCircle, X, Code } from 'lucide-react'

export default function MarkdownHelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black border border-terminal-primary hover:bg-terminal-primary hover:text-black px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.2)] transition-all cursor-pointer"
      >
        <HelpCircle className="w-4 h-4" /> MARKDOWN GUIDE
      </button>
    )
  }

  const examples = [
    {
      title: 'Text Redaction (Spoiler)',
      code: 'Personnel encountered ||highly hazardous details|| in the room.',
    },
    {
      title: 'Object Class Badges',
      code: 'Entity belongs to Class: [safe] / [euclid] / [keter] / [apollyon]',
    },
    {
      title: 'Threat Indicator Lights',
      code: 'Visual status signals: [threat-green] SAFE, [threat-yellow] WARNING, [threat-red] BREACH WARNING',
    },
    {
      title: 'Risk & Disruption Scales',
      code: 'Disruption Class: [disrupt-keneq] / [disrupt-amida] \nRisk level: [risk-caution] / [risk-critical]',
    },
    {
      title: 'Mobile Task Force Badges',
      code: 'Containment deployed MTF support: [mtf-alpha1] or [mtf-epsilon11]',
    },
    {
      title: 'Glitch, Rainbow & Matrix Text',
      code: 'Alert: [glitch]CONTAINMENT EXPIRED[/glitch]\nCognito state: [rainbow]EUPHORIA INITIATE[/rainbow]\nTerminal sync: [matrix]db_connection = true[/matrix]',
    },
    {
      title: 'CRT Typewriter & Blur Decrypt',
      code: 'Loading files: [typewriter]COMMENCING DECRYPTION...[/typewriter]\nClassified notes: [blur]This paragraph remains hidden until hovered.[/blur]',
    },
    {
      title: 'ECG, Radar & CCTV Scan Widgets',
      code: 'Sensors: [ecg] | [radar] | [spectrogram] | [cctv]',
    },
    {
      title: 'Slanted Administrative Stamps',
      code: 'Case outcome: [stamp-approved] | [stamp-denied] | [stamp-terminated]',
    },
    {
      title: 'Protocol Warning Box',
      code: '[warn] WARNING: ALL SAMPLES MUST BE INCINERATED IMMEDIATELY. [/warn]',
    },
    {
      title: 'Access Restricted Block',
      code: '[denied] COGNITOHAZARD DETECTED - DATA LOCKDOWN ACTIVE. [/denied]',
    },
    {
      title: 'O5 Command Note & Level 5 block',
      code: '[note] O5-9: Standard containment is suspended. [/note] \n[level5] O5 Eyes Only. [/level5]',
    },
    {
      title: 'Interview Transcription log',
      code: '[interview]\nDr. Vance: Begin transcript.\nSubject: SCP-173 remains stationary.\nDr. Vance: Maintain eye contact.\n[/interview]',
    },
    {
      title: 'Satır İçi Kod & Ayraç (Code & Divider)',
      code: 'System parameters: `db_sync_active = true` \n---\nAdditional notes follow.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-xs">
      <div className="border border-terminal-primary bg-black max-w-4xl w-full max-h-[85vh] flex flex-col relative shadow-[0_0_20px_rgba(0,255,102,0.25)]">
        {/* Corner brackets */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-terminal-border p-4">
          <span className="text-sm font-extrabold tracking-widest text-white glow-text-green flex items-center gap-2">
            <Code className="w-5 h-5" /> SCP FOUNDATION WIKI MARKUP CHEAT-SHEET
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-terminal-primary hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          <div className="border border-terminal-border/40 bg-terminal-primary/[0.01] p-3 leading-relaxed text-[11px] text-terminal-primary/85 mb-4">
            <span className="font-bold text-white block mb-1">MARKUP USAGE GUIDE</span>
            Use the following custom and standard tags when writing SCP containment procedures, descriptions,
            reports, and addenda. Click on the redactable blocks below to verify how they hover-reveal!
          </div>

          <div className="space-y-4">
            {examples.map((ex, idx) => (
              <div key={idx} className="border border-terminal-border/20 bg-neutral-950 p-4 space-y-3">
                <div className="text-[10px] text-white font-bold tracking-wider uppercase border-b border-terminal-border/20 pb-1">
                  {ex.title}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Code editor look */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-terminal-primary/40 block uppercase">Markup Ingress</span>
                    <pre className="bg-black border border-terminal-border/40 p-2.5 rounded text-terminal-primary text-[10px] overflow-x-auto whitespace-pre-wrap select-all">
                      {ex.code}
                    </pre>
                  </div>

                  {/* Rendered preview */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-terminal-primary/40 block uppercase">Visual Egress (Rendered)</span>
                    <div className="bg-black/50 border border-terminal-border/30 p-2.5 rounded min-h-[50px]">
                      <ScpMarkdown content={ex.code} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-terminal-border p-3 text-center text-[10px] text-terminal-primary/40">
          CLOSE GUIDE TO RETURN TO PORTAL ENVIRONMENT // SYSTEM OK
        </div>
      </div>
    </div>
  )
}
