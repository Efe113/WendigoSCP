import React from 'react'
import TerminalCard from '@/components/TerminalCard'
import Link from 'next/link'
import { ArrowLeft, Shield, Landmark, MapPin, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs leading-relaxed">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO PORTAL
      </Link>

      <div className="border border-terminal-border bg-black/50 p-4">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> FOUNDATION META-ARCHIVE // ADMINISTRATIVE OVERVIEW
        </div>
        <p className="text-terminal-primary/75">
          THE SCP FOUNDATION IS A SECRET ORGANIZATION ENTRUSTED BY GLOBAL GOVERNMENTS TO CONTAIN ANOMALOUS INDIVIDUALS,
          ENTITIES, LOCATIONS, AND PHENOMENA THAT DEFY NATURAL LAW. SECURE. CONTAIN. PROTECT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TerminalCard title="1. Our Mission Statement" status="success" statusText="SECURE_CONTAIN_PROTECT">
          <div className="space-y-3">
            <div>
              <span className="font-bold text-white block uppercase">SECURE</span>
              The Foundation secures anomalies with the goal of preventing them from falling into the hands of civilian or hostile agencies, through physical surveillance, interception, and containment operations.
            </div>
            <div>
              <span className="font-bold text-white block uppercase">CONTAIN</span>
              The Foundation contains anomalies with the goal of preventing their influence or effects from spreading, by relocating, concealing, or dismantling anomalies, and preventing public knowledge dissemination.
            </div>
            <div>
              <span className="font-bold text-white block uppercase">PROTECT</span>
              The Foundation protects humanity from the effects of anomalous phenomena as well as protecting the anomalies themselves until such time as they are fully understood or new scientific laws can explain them.
            </div>
          </div>
        </TerminalCard>

        <TerminalCard title="2. Command Structure" status="default" statusText="ORGANIZATION">
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <Landmark className="w-5 h-5 text-terminal-primary/80 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">O5 COUNCIL</span>
                The O5 Council, also known as the Council of O5 Eyed or Overseer Council, is the supreme governing body of the SCP Foundation, comprising 13 highly classified directors.
              </div>
            </div>
            <div className="flex gap-2.5">
              <Users className="w-5 h-5 text-terminal-primary/80 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">ETHICS COMMITTEE</span>
                A small, secret committee charged with reviewing containment procedures, ensuring research conducts are within acceptable moral boundaries, and avoiding unnecessary casualties.
              </div>
            </div>
            <div className="flex gap-2.5">
              <MapPin className="w-5 h-5 text-terminal-primary/80 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">SITE OPERATIONS (SITE-19)</span>
                Site-19 is the largest facility currently operated by the Foundation, housing hundreds of Euclid and Keter-class anomalies. Branch 19 hosts our secure digital archives.
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>

      <TerminalCard title="O5 COMMAND RECORD: OPERATING CODEX" status="warn" statusText="RESTRICTED">
        <p className="mb-3">
          Mankind must not go back to hiding in fear. No one else will protect us, and we must stand up for ourselves.
          While the rest of mankind dwells in the light, we must stand in the darkness to fight it, contain it, and shield it from the eyes of the public, so that others may live in a sane and normal world.
        </p>
        <span className="font-bold text-terminal-warn block text-right">— The Administrator</span>
      </TerminalCard>

      <div className="text-center py-4 text-terminal-primary/50 text-[10px] tracking-wider border-t border-terminal-border/20">
        SCP FOUNDATION ADMINISTRATIVE OVERVIEW // NODE 19-ABOUT // SECURE LINK
      </div>
    </div>
  )
}
