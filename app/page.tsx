import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import TerminalSystemMonitor from '@/components/TerminalSystemMonitor'
import TerminalLiveLogs from '@/components/TerminalLiveLogs'
import Link from 'next/link'
import { Database, Terminal, BookOpen, Shield, Radio, Server, Activity, Users, ShieldAlert, ArrowRight, ShieldCheck, HelpCircle, EyeOff, Scale, Play, AlertOctagon } from 'lucide-react'

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

  // 2. Fetch the featured SCP (SCP-173 or fallback)
  let { data: featured } = await supabase
    .from('scp_items')
    .select('*')
    .eq('item_number', 'SCP-173')
    .maybeSingle()

  if (!featured) {
    const { data: fallback } = await supabase
      .from('scp_items')
      .select('*')
      .limit(1)
      .maybeSingle()
    featured = fallback
  }

  // 3. Fetch system config keys
  const { data: configs } = await supabase
    .from('system_config')
    .select('key, value')

  const configMap: Record<string, string> = {
    threat_level: 'LEVEL_GREEN',
    red_alert: 'false',
    blackout_mode: 'false',
    alpha_warhead_active: 'false',
    decontamination_active: 'false',
    cross_testing_moratorium: 'false',
    sentient_testing_block: 'true',
    whistleblower_protection: 'true',
    security_drone_patrol: 'false',
    site_grid_backup: 'false',
    security_alarm: 'false',
    site_lockdown_sectors: 'None',
  }

  configs?.forEach((c) => {
    configMap[c.key] = c.value
  })

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

  const threatStyle = getThreatStyle(configMap.threat_level)

  // Find active overrides to display on homepage
  const activeOverrides = [
    configMap.red_alert === 'true' && { name: 'RED ALERT SIREN', value: 'ENFORCED', type: 'error' },
    configMap.blackout_mode === 'true' && { name: 'POWER BLACKOUT', value: 'ENGAGED', type: 'warn' },
    configMap.alpha_warhead_active === 'true' && { name: 'ALPHA WARHEAD SILO', value: 'ARMED', type: 'error' },
    configMap.decontamination_active === 'true' && { name: 'CELL STERILIZATION', value: 'ACTIVE', type: 'error' },
    configMap.cross_testing_moratorium === 'true' && { name: 'CROSS-TEST BLOCK', value: 'SUSPENDED', type: 'warn' },
    configMap.sentient_testing_block === 'false' && { name: 'SENTIENT TESTING', value: 'BYPASSING RULES', type: 'error' },
    configMap.whistleblower_protection === 'false' && { name: 'WHISTLEBLOWER ACT', value: 'SUSPENDED', type: 'error' },
    configMap.security_alarm === 'true' && { name: 'SECURITY ALARM', value: 'TRIGGERED', type: 'error' },
    configMap.security_drone_patrol === 'true' && { name: 'DRONE PATROLS', value: 'ACTIVE', type: 'info' },
    configMap.site_grid_backup === 'true' && { name: 'AUX POWER GRID', value: 'ONLINE', type: 'warn' },
    configMap.site_lockdown_sectors !== 'None' && { name: `LOCKDOWN: ${configMap.site_lockdown_sectors.toUpperCase()}`, value: 'LOCKDOWN', type: 'error' },
  ].filter(Boolean) as { name: string; value: string; type: string }[]

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed max-w-6xl mx-auto">
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
            <p className="text-terminal-primary/75 max-w-xl text-xs">
              SITE-19 SECURE DATABASE TERMINAL. DESIGNED FOR SECURING, CONTAINING, AND PROTECTING ANOMALOUS SPECIMENS. ALL TELEMETRY CHANNELS ARE ACTIVE.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side (Metrics & Live Telemetry) */}
        <div className="space-y-6 md:col-span-1">
          {/* Database stats */}
          <TerminalCard title="SYSTEM STATISTICS" status="info" statusText="LIVE_METRICS">
            <div className="space-y-3 font-semibold text-terminal-primary/95 text-[11px]">
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
                <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> CL_RATING:</span>
                <span className="text-terminal-primary font-bold">LEVEL {currentLevel}</span>
              </div>
            </div>
          </TerminalCard>

          {/* Real-time Telemetry logs stream */}
          <TerminalLiveLogs />

          {/* Active alerts bulletin board */}
          <div className="border border-red-500/20 bg-red-950/5 p-4 text-[10px] space-y-2 font-semibold">
            <span className="text-terminal-error font-bold flex items-center gap-1 uppercase">
              <ShieldAlert className="w-4 h-4 animate-pulse" /> SECURITY NOTICE BOARD
            </span>
            <p className="text-red-400/80">&bull; ALL LEVEL 1 PERSONNEL MUST COMPLY WITH STANDARD AMNESTICS ROUTINES UPON DEPARTURE.</p>
            <p className="text-red-400/80">&bull; SITE-19 SECTOR-4 IS LOCKED DOWN FOR MAINTENANCE. CROSS-TESTING IS PROHIBITED.</p>
          </div>
        </div>

        {/* Center / Right Side (Spotlight SCP, Overrides, Nav cards) */}
        <div className="md:col-span-2 space-y-6">
          {/* Spotlight featured SCP card */}
          {featured && (
            <TerminalCard title="SUBJECT FILE SPOTLIGHT" status="warn" statusText="FEATURED_RECORD">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-2xl font-bold tracking-widest text-white block glow-text-warn">{featured.item_number}</span>
                    <span className="text-[10px] text-terminal-primary/60 uppercase block">CODENAME: {featured.codename}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 border border-terminal-border/40 text-[9px] font-bold uppercase text-white bg-black">
                      CLASS: {featured.object_class}
                    </span>
                    <span className="px-2 py-0.5 border border-terminal-border/40 text-[9px] font-bold uppercase text-terminal-primary bg-black">
                      CLEARANCE REQ: LEVEL {featured.clearance_level_required}
                    </span>
                  </div>
                  <p className="text-terminal-primary/85 text-xs line-clamp-3 leading-relaxed">
                    {featured.description.replace(/\|\|/g, '')}
                  </p>
                  <Link
                    href={`/scp/${featured.item_number.toLowerCase()}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white border border-terminal-border/80 px-3 py-1 bg-terminal-primary/5 hover:bg-terminal-primary/10 transition-all cursor-pointer"
                  >
                    DECRYPT FILE <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="border border-terminal-border bg-neutral-950 p-2 text-center w-full sm:w-[130px] flex-shrink-0 flex flex-col justify-center items-center h-28">
                  <EyeOff className="w-8 h-8 text-terminal-primary/40 animate-pulse mb-1.5" />
                  <span className="text-[8px] text-terminal-primary/50 uppercase block">CONTAINMENT STATUS</span>
                  <span className="text-[10px] font-bold text-white uppercase block mt-0.5">SECURE</span>
                </div>
              </div>
            </TerminalCard>
          )}

          {/* Active Overrides Status grid */}
          <TerminalCard title="MAINFRAME ACTIVE OVERRIDES STATE MATRIX" status={activeOverrides.length > 0 ? 'warn' : 'default'} statusText="OVER5_STATE">
            {activeOverrides.length === 0 ? (
              <p className="text-center py-6 text-terminal-primary/45 italic">No O5 or Ethics overrides are currently active on the site grid.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeOverrides.map((over) => (
                  <div key={over.name} className={`border p-2 bg-black/40 text-center flex flex-col justify-center ${
                    over.type === 'error' ? 'border-red-500 text-red-400' : over.type === 'info' ? 'border-cyan-500 text-cyan-400' : 'border-yellow-500 text-yellow-400'
                  }`}>
                    <span className="text-[9px] uppercase font-bold block truncate" title={over.name}>{over.name}</span>
                    <span className="text-[9px] font-extrabold block mt-0.5 animate-pulse">[{over.value}]</span>
                  </div>
                ))}
              </div>
            )}
          </TerminalCard>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/directory" className="group">
              <TerminalCard title="SECURE DIRECTORY CATALOG" statusText="DIRECTORY" className="h-full group-hover:glow-border-green cursor-pointer">
                <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-2.5 text-xs">
                  Decrypt and browse all SCP files. Search by item number or codename and filter by classification.
                </p>
                <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                  ACCESS FILES <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </TerminalCard>
            </Link>

            <Link href="/console" className="group">
              <TerminalCard title="DATA INGESTION UPLINK" statusText="CONSOLE" className="h-full group-hover:glow-border-green cursor-pointer">
                <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-2.5 text-xs">
                  Securely write new anomalous entities, initial addenda, notes, and attachments directly into the live archives.
                </p>
                <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                  OPEN CONSOLE <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </TerminalCard>
            </Link>

            <Link href="/guide" className="group">
              <TerminalCard title="USER PROTOCOL MANUAL" statusText="GUIDE" className="h-full group-hover:glow-border-green cursor-pointer">
                <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-2.5 text-xs">
                  Read system instructions on how to use advanced Markdown tags, spoilers, warning alerts, and clearance protocols.
                </p>
                <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                  READ MANUAL <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </TerminalCard>
            </Link>

            <Link href="/ethics" className="group">
              <TerminalCard title="ETHICS WHISTLEBLOWER UPLINK" statusText="ETHICS_PORTAL" className="h-full group-hover:glow-border-green cursor-pointer">
                <p className="text-terminal-primary/75 group-hover:text-white transition-colors mb-2.5 text-xs">
                  File formal reports or whistleblowing complaints directly with the Ethics Committee Liaison.
                </p>
                <span className="text-terminal-primary font-bold group-hover:underline flex items-center gap-1">
                  FILE COMPLAINT <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </TerminalCard>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
