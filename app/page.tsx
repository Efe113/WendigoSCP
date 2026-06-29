import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import TerminalSystemMonitor from '@/components/TerminalSystemMonitor'
import Link from 'next/link'
import { Database, Terminal, BookOpen, Shield, Radio, Server, Activity, Users, ShieldAlert, ArrowRight } from 'lucide-react'

export const revalidate = 0 // Keep metrics real-time

export default async function Page() {
  const supabase = await createClient()
  const { user, currentLevel } = await getUserClearance()

  // 1. Fetch live metrics from database
  const { count: totalScps } = await supabase
    .from('scp_items')
    .select('*', { count: 'exact', head: true })

  const { count: keterCount } = await supabase
    .from('scp_items')
    .select('*', { count: 'exact', head: true })
    .eq('object_class', 'Keter')

  const { count: thaumielCount } = await supabase
    .from('scp_items')
    .select('*', { count: 'exact', head: true })
    .eq('object_class', 'Thaumiel')

  const { count: totalProfiles } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch the current system config status (threat level)
  const { data: threatConfig } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'threat_level')
    .maybeSingle()

  const activeThreatLevel = threatConfig?.value || 'LEVEL_GREEN'
  
  const getThreatStyle = (lvl: string) => {
    switch (lvl) {
      case 'LEVEL_YELLOW':
        return { text: 'LEVEL_YELLOW', label: 'EUCLID THREAT ACTIVE', colorClass: 'text-yellow-500 glow-text-warn' }
      case 'LEVEL_RED':
        return { text: 'LEVEL_RED', label: 'KETER BREACH DANGER', colorClass: 'text-red-500 glow-text-red' }
      case 'LEVEL_BLACK':
        return { text: 'LEVEL_BLACK', label: 'APOLLYON END-WORLD', colorClass: 'text-red-700 glow-text-red animate-bounce' }
      default:
        return { text: 'LEVEL_GREEN', label: 'SECURED / INTACT', colorClass: 'text-terminal-primary glow-text-green' }
    }
  }

  const threatStyle = getThreatStyle(activeThreatLevel)

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="border border-terminal-border p-6 bg-black/60 relative overflow-hidden">
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-widest text-white glow-text-green flex items-center gap-2">
              <Shield className="w-7 h-7 text-terminal-primary animate-pulse" />
              SCP MAIN PORTAL
            </h1>
            <p className="text-terminal-primary/75 max-w-xl">
              FOUNDATION SITE-19 INTRANET HUB. MULTI-SECTOR SECURITY ACCESS TO CONTAINMENT INVENTORY AND DECISION NETWORKS.
            </p>
          </div>
          
          <div className="border border-terminal-border bg-black p-3 text-center min-w-[170px] relative">
            <span className="text-[10px] text-terminal-primary/50 block font-bold">SYSTEM THREAT STATE</span>
            <span className={`text-lg font-bold block mt-1 ${threatStyle.colorClass}`}>
              {threatStyle.text}
            </span>
            <span className="text-[9px] text-terminal-primary/65 block font-semibold">{threatStyle.label}</span>
          </div>
        </div>
      </div>

      {/* Real-time System Metrics Row */}
      <TerminalSystemMonitor />

      {/* Main Grid: Metrics & Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Card: Database metrics */}
        <div className="md:col-span-1">
          <TerminalCard title="SYSTEM STATISTICS" status="info" statusText="LIVE_INFO">
            <div className="space-y-3 font-semibold text-terminal-primary/95">
              <div className="flex justify-between border-b border-terminal-border/20 pb-1">
                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> SECURE_ITEMS:</span>
                <span className="text-white">{totalScps ?? 0} FILES</span>
              </div>
              <div className="flex justify-between border-b border-terminal-border/20 pb-1">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> AGENTS_ON_NET:</span>
                <span className="text-white">{totalProfiles ?? 0} PROFILES</span>
              </div>
              <div className="flex justify-between border-b border-terminal-border/20 pb-1">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> KETER_ITEMS:</span>
                <span className="text-terminal-error font-bold">{keterCount ?? 0} UNITS</span>
              </div>
              <div className="flex justify-between border-b border-terminal-border/20 pb-1">
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> THAUMIEL_ITEMS:</span>
                <span className="text-purple-400 font-bold">{thaumielCount ?? 0} UNITS</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> CL_LEVEL:</span>
                <span className="text-terminal-primary font-bold">LEVEL {currentLevel}</span>
              </div>
            </div>
          </TerminalCard>

          {/* Alert bulletin ticker */}
          <div className="mt-4 border border-red-500/20 bg-red-950/5 p-4 text-[10px] space-y-2 font-semibold">
            <span className="text-terminal-error font-bold flex items-center gap-1 uppercase">
              <ShieldAlert className="w-4 h-4 animate-pulse" /> SECURITY NOTICE BOARD
            </span>
            <p className="text-red-400/80">&bull; ALL LEVEL 1 PERSONNEL MUST COMPLY WITH STANDARD AMNESTICS ROUTINES UPON DEPARTURE.</p>
            <p className="text-red-400/80">&bull; SITE-19 SECTOR-4 IS LOCKED DOWN FOR MAINTENANCE. CROSS-TESTING IS PROHIBITED.</p>
          </div>
        </div>

        {/* Right Area: Navigation Panels (2 cols) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Directory */}
          <Link href="/directory" className="group">
            <TerminalCard title="SECURE DATABASE CATALOG" status="default" statusText="DIRECTORY" className="h-full group-hover:glow-border-green cursor-pointer">
              <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-3">
                Decrypt and view all SCP containment files. Search by item number or codename and filter by classification.
              </p>
              <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                ACCESS FILES <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </TerminalCard>
          </Link>

          {/* Card 2: Console */}
          <Link href="/console" className="group">
            <TerminalCard title="DATA INGESTION UPLINK" status="default" statusText="CONSOLE" className="h-full group-hover:glow-border-green cursor-pointer">
              <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-3">
                Securely write new anomalous entities, initial addenda, notes, and attachments directly into the live archives.
              </p>
              <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                OPEN CONSOLE <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </TerminalCard>
          </Link>

          {/* Card 3: Guide */}
          <Link href="/guide" className="group">
            <TerminalCard title="USER PROTOCOL MANUAL" status="default" statusText="GUIDE" className="h-full group-hover:glow-border-green cursor-pointer">
              <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-3">
                Read system instructions on how to use advanced Markdown tags, spoilers, warning alerts, and clearance protocols.
              </p>
              <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                READ MANUAL <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </TerminalCard>
          </Link>

          {/* Card 4: About */}
          <Link href="/about" className="group">
            <TerminalCard title="FOUNDATION ARCHIVES" status="default" statusText="ABOUT" className="h-full group-hover:glow-border-green cursor-pointer">
              <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-3">
                Discover the administrative structures, historical summaries, and primary mission directives of the Foundation.
              </p>
              <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                ACCESS ARCHIVES <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </TerminalCard>
          </Link>
        </div>
      </div>
    </div>
  )
}
