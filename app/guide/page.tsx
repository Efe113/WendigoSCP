import React from 'react'
import TerminalCard from '@/components/TerminalCard'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Scale, Terminal, Shield, Key } from 'lucide-react'

export default function GuidePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono text-xs leading-relaxed">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO PORTAL
      </Link>

      {/* Guide Header */}
      <div className="border border-terminal-border bg-black/50 p-4">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> SCP SYSTEM OPERATIONS MANUAL
        </div>
        <p className="text-terminal-primary/75">
          CENTRAL OPERATIONS GUIDE FOR ADMINISTRATORS, FIELD AGENTS, AND ETHICS COMMITTEE LIAISONS.
          THIS PROTOCOL DOCUMENT OUTLINES THE BATCH METADATA FIELDS, MARKUP SYNTAC REGISTERS, AND AUTHORIZATION PROCEDURES.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: System Workflows (1 col) */}
        <div className="md:col-span-1 space-y-4">
          <TerminalCard title="1. REGISTRATION & ON-NET APPROVAL" status="warn" statusText="APPROVALS">
            <div className="space-y-3 text-[11px]">
              <p>
                To maintain database integrity, all new user accounts start in a <span className="text-terminal-warn font-bold">PENDING APPROVAL</span> status.
              </p>
              <div className="border border-terminal-border/20 p-2.5 bg-black/40">
                <span className="font-bold text-white block uppercase mb-1">O5-1 OVERSEA CONTROL</span>
                Only the designated Overseer (<span className="text-terminal-error">O5-1</span>) has authority to review these registration forms in the O5 Panel and toggle approval or suspension.
              </div>
              <p>
                Suspended accounts are instantly locked out from the mainframe by the global proxy interceptor.
              </p>
            </div>
          </TerminalCard>

          <TerminalCard title="2. ETHICS COMMITTEE INQUESTS" status="info" statusText="ETHICS">
            <div className="space-y-3 text-[11px]">
              <div className="flex gap-2 text-terminal-info">
                <Scale className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <span className="font-bold uppercase tracking-wider">ETHICS COMPLAINT FILE</span>
              </div>
              <p>
                Any user or anonymous guest can file reports against agents violating containment procedures at <Link href="/ethics" className="text-terminal-info underline">/ethics</Link>.
              </p>
              <p>
                Ethics Committee Liaisons examine case files on the EC Panel and possess the mandate to suspend target profiles immediately.
              </p>
            </div>
          </TerminalCard>
        </div>

        {/* Right Side: Technical Specs & Markup Guide (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <TerminalCard title="3. TECHNICAL SPECIFICATIONS SHEETS (40+ VARIABLES)" status="success" statusText="SPECS">
            <div className="space-y-3 text-[11px]">
              <p>
                When creating or editing SCP files, operators can specify 40 distinct parameters. These are grouped into 4 primary registries:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                <div className="border border-terminal-border/40 p-2.5 bg-neutral-950">
                  <span className="text-white font-bold block mb-1">A. CLASSIFICATION META</span>
                  Threat levels, disruption classes, risk classes, recovery leads, recovery dates, site locations, and primary anomalies.
                </div>
                <div className="border border-terminal-border/40 p-2.5 bg-neutral-950">
                  <span className="text-white font-bold block mb-1">B. PHYSICAL METRICS</span>
                  Material composition, dimensions, mass, sentience status, diets, radioactive emission levels, and cognitive threat logs.
                </div>
                <div className="border border-terminal-border/40 p-2.5 bg-neutral-950">
                  <span className="text-white font-bold block mb-1">C. CELL PARAMETERS</span>
                  Containment temperatures, pressures, humidity limits, EM shielding, tactical guard counts, and psych eval schedules.
                </div>
                <div className="border border-terminal-border/40 p-2.5 bg-neutral-950">
                  <span className="text-white font-bold block mb-1">D. ADMINISTRATIVE AUDIT</span>
                  Annual containment cost, incident count, security notes, ethics clearance checks, sync status, and weapons auth.
                </div>
              </div>
              <p className="text-[10px] text-terminal-primary/50">
                These properties render automatically on the file page in a secure technical spec sidebar and main-body data card.
              </p>
            </div>
          </TerminalCard>

          <TerminalCard title="4. COMPREHENSIVE MARKUP cheat-sheet (57 CUSTOM TAGS)" status="default" statusText="MARKUP">
            <div className="space-y-3.5 text-[11px]">
              <p>
                The compiler parses exactly 57 terminal-native tags. A detailed description of the custom tags is below:
              </p>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                <div>
                  <span className="font-bold text-white block uppercase">Text Spoiling & Redaction:</span>
                  Wrap text in double pipes <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">||text||</code>. Renders a black solid box that decrypts on hover.
                </div>
                <div>
                  <span className="font-bold text-white block uppercase">Object Classification Badges:</span>
                  Use tags like <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[safe]</code>, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[euclid]</code>, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[keter]</code>, or <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[apollyon]</code> to render colored classification tags.
                </div>
                <div>
                  <span className="font-bold text-white block uppercase">Interactive Widgets:</span>
                  Use <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[ecg]</code> for a pulsing heartbeat graphic, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[radar]</code> for a spinning radar sweep, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[spectrogram]</code> for audio spectrogram visual bars, or <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[cctv]</code> for a recording feed pill.
                </div>
                <div>
                  <span className="font-bold text-white block uppercase">Administrative Stamps:</span>
                  Slant overlay stamps using <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[stamp-approved]</code> (EC_APPROVED), <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[stamp-denied]</code> (O5_DENIED), or <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[stamp-terminated]</code>.
                </div>
                <div>
                  <span className="font-bold text-white block uppercase">Text Styling:</span>
                  Surround text with <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[glitch]text[/glitch]</code> for pulsing glitches, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[rainbow]text[/rainbow]</code> for spectrum shifts, <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[glow]text[/glow]</code> for neon green glow, or <code className="bg-black border border-terminal-border/40 px-1 text-terminal-primary">[blur]text[/blur]</code> for hover-decrypted blurs.
                </div>
              </div>

              <div className="border border-terminal-border/20 p-2.5 bg-neutral-950/40 text-[10px] text-center text-terminal-primary/70">
                TIP: YOU CAN OPEN THE FLOATING <span className="text-white font-bold">"MARKDOWN GUIDE"</span> BUTTON AT THE BOTTOM RIGHT OF ANY PAGE FOR A LIVE SIDE-BY-SIDE INTERACTIVE CHEAT-SHEET WITH PREVIEWS!
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>

      <div className="text-center py-4 text-terminal-primary/50 text-[10px] tracking-wider border-t border-terminal-border/20">
        FOUNDATION INTRANET NODE GUIDE // VERSION 6.20 // SECURE NODE AP-SOUTH-1
      </div>
    </div>
  )
}
