import React from 'react'
import TerminalCard from '@/components/TerminalCard'
import Link from 'next/link'
import { ArrowLeft, BookOpen, AlertCircle, FileText, Lock } from 'lucide-react'

export default function GuidePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO DIRECTORY
      </Link>

      <div className="border border-terminal-border bg-black/50 p-4 leading-relaxed text-xs">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> SCP DATABASE USER GUIDE & PROTOCOLS
        </div>
        <p className="text-terminal-primary/75">
          THIS IS THE CENTRAL SYSTEM USER MANUAL FOR INPUTTING AND VIEWING CLASSIFIED SCP ARCHIVES.
          FOLLOW ALL SYNTAX AND SECURITY GUIDELINES UNDER PENALTY OF AMNESTICS EXPULSION.
        </p>
      </div>

      {/* Guide details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formatting section */}
        <TerminalCard title="1. Archive Formatting Syntax" status="success" statusText="SYNTAX">
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-white block mb-0.5">TEXT REDACTION (SPOILERS):</span>
              Wrap words in double pipes <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">||word||</code>.
              They render as solid black blocks and decrypt in real-time only when a reader hovers their cursor over them.
              <p className="text-[10px] text-terminal-primary/60 mt-0.5">Example: D-Class personnel entered the ||highly hazardous|| chamber.</p>
            </div>

            <div>
              <span className="font-bold text-white block mb-0.5">WARNING CALLOUTS:</span>
              Wrap warnings in <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[warn]...[/warn]</code> tags.
              It compiles into a flashing red status alert box.
            </div>

            <div>
              <span className="font-bold text-white block mb-0.5">RESTRICTED LOG CALLOUTS:</span>
              Wrap denial notifications in <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[denied]...[/denied]</code> tags.
              It compiles into a border-glowing red access failure container.
            </div>

            <div>
              <span className="font-bold text-white block mb-0.5">INTERVIEW TRANSCRIPTIONS:</span>
              Wrap interview logs in <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[interview]...[/interview]</code> tags.
              It compiles into a clean, side-bordered cyan dialog layout.
            </div>
          </div>
        </TerminalCard>

        {/* Security protocol section */}
        <TerminalCard title="2. Clearance Protocols" status="warn" statusText="CLEARANCE">
          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-white block">LEVEL 1 [GUEST / UNRESTRICTED]</span>
              Granted to raw civilian records and basic items (e.g. SCP-999).
            </div>
            <div>
              <span className="font-bold text-white block">LEVEL 2 [RESTRICTED PERSONNEL]</span>
              Standard field agents. Granted access to SCP-173 and basic logs.
            </div>
            <div>
              <span className="font-bold text-white block">LEVEL 3 [SITE ADMINISTRATORS]</span>
              Granted access to standard humanoid threats and containment logs (e.g. SCP-096).
            </div>
            <div>
              <span className="font-bold text-white block">LEVEL 4 [SENIOR DIRECTORS]</span>
              Senior site operators. Can add, edit, and delete database records.
            </div>
            <div>
              <span className="font-bold text-white block">LEVEL 5 [O5 COMMAND ONLY]</span>
              Highest security level. Full decryption capability.
            </div>
          </div>
        </TerminalCard>
      </div>

      <TerminalCard title="3. Object Classifications" status="default" statusText="CLASSIFICATIONS">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs leading-relaxed">
          <div className="border border-green-500/30 bg-green-500/[0.02] p-2">
            <span className="font-bold text-green-500 block mb-1">SAFE</span>
            The item is easily and safely contained. Containment is simple and reliable.
          </div>
          <div className="border border-yellow-500/30 bg-yellow-500/[0.02] p-2">
            <span className="font-bold text-yellow-500 block mb-1">EUCLID</span>
            The item requires constant monitoring or is unpredictable. Standard humanoid threats.
          </div>
          <div className="border border-red-500/30 bg-red-500/[0.02] p-2">
            <span className="font-bold text-red-500 block mb-1">KETER</span>
            The item is highly hostile, difficult, or impossible to contain. Devastating anomalies.
          </div>
          <div className="border border-purple-500/30 bg-purple-500/[0.02] p-2">
            <span className="font-bold text-purple-500 block mb-1">THAUMIEL</span>
            The item is used by the Foundation to contain other anomalies. Extreme clearance.
          </div>
        </div>
      </TerminalCard>

      <div className="text-center py-4 text-terminal-primary/50 text-[10px] tracking-wider border-t border-terminal-border/20">
        FOUNDATION INTRANET NODE GUIDE // VERSION 4.16 // O5 REGISTERED
      </div>
    </div>
  )
}
