import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import Link from 'next/link'
import { Database, Terminal, BookOpen, Shield, Radio, Server, Activity, Users } from 'lucide-react'

export const revalidate = 0 // Keep homepage metrics completely live

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

  // Determine overall threat status based on Keter count
  const threatLevel = keterCount && keterCount > 0 ? 'LEVEL_ORANGE' : 'LEVEL_GREEN'
  const threatStatus = keterCount && keterCount > 0 ? 'EUCLID/KETER ALERT ACTIVE' : 'SECURED'

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed max-w-4xl mx-auto">
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
              FOUNDATION COMMAND TERMINAL INTRANET. SECURE ACCESS GATEWAY TO ACTIVE CONTAINMENT ARCHIVES AND DIRECT DATA
              INGESTION MODULES. READ ALL USER PROTOCOLS BEFORE ATTEMPTING RECORD MANIPULATION.
            </p>
          </div>
          
          <div className="border border-terminal-border bg-black p-3 text-center min-w-[150px]">
            <span className="text-[10px] text-terminal-primary/50 block font-bold">SYSTEM THREAT LEVEL</span>
            <span className="text-lg font-bold text-terminal-warn animate-pulse block glow-text-warn mt-1">
              {threatLevel}
            </span>
            <span className="text-[9px] text-terminal-primary/65 block">{threatStatus}</span>
          </div>
        </div>
      </div>

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
                ACCESS FILES &rarr;
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
                OPEN CONSOLE &rarr;
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
                READ MANUAL &rarr;
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
                ACCESS ARCHIVES &rarr;
              </span>
            </TerminalCard>
          </Link>
        </div>
      </div>

      {/* Terminal log logs */}
      <TerminalCard title="ACTIVE UPLINK CONNECTION LOG" status="default" statusText="LOGS">
        <div className="space-y-1.5 text-[10px] text-terminal-primary/60 tabular-nums">
          <p>[09:12:44] CONNECTING TO NODE ap-south-1.supabase.co...</p>
          <p>[09:12:46] LINK ESTABLISHED. TLS_AES_256_GCM_SHA384 ENCRYPTION DETECTED.</p>
          <p>[09:12:47] SYNCING DATABASE RECORDS: {totalScps ?? 0} ITEMS ACTIVE.</p>
          {user ? (
            <p>[09:13:02] AGENT IDENTIFIED: {user.email?.toUpperCase()} // CLEARANCE LEVEL {currentLevel} ACCEPTED.</p>
          ) : (
            <p>[09:13:02] NO AGENT SIGNATURE DETECTED. GUEST CLEARANCE ASSIGNED.</p>
          )}
          <p>[09:13:05] OVERSEER MONITORING IS ACTIVE. SECURE DATA INGESTION READY.</p>
        </div>
      </TerminalCard>
    </div>
  )
}
