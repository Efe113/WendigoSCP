import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { getUserClearance, signOut } from '@/app/actions/scp'
import { createClient } from '@/utils/supabase/server'
import MarkdownHelpModal from '@/components/MarkdownHelpModal'
import AlphaWarheadCountdown from '@/components/AlphaWarheadCountdown'
import { Terminal, Shield, User, Database, Radio, Key, BookOpen, Info, Home, Lock, Scale, AlertOctagon, HelpCircle, Siren, Volume2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SCP Foundation Secure Database',
  description: 'RESTRICTED ACCESS - LEVEL 4 CLEARANCE RECOMMENDED',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, realLevel, currentLevel } = await getUserClearance()

  // Fetch configs for layouts
  const supabase = await createClient()
  const { data: configs } = await supabase
    .from('system_config')
    .select('key, value')
    .in('key', [
      'red_alert',
      'blackout_mode',
      'alpha_warhead_active',
      'alpha_warhead_time',
      'mtf_dispatched',
      'containment_breach_active',
      'security_alarm',
      'site_lockdown_sectors',
      'sound_warnings',
      'security_drone_patrol',
      'site_grid_backup',
      'ethics_violation_condition'
    ])

  const configMap: Record<string, string> = {
    red_alert: 'false',
    blackout_mode: 'false',
    alpha_warhead_active: 'false',
    alpha_warhead_time: '90',
    mtf_dispatched: 'None',
    containment_breach_active: 'false',
    security_alarm: 'false',
    site_lockdown_sectors: 'None',
    sound_warnings: 'false',
    security_drone_patrol: 'false',
    site_grid_backup: 'false',
    ethics_violation_condition: 'LEVEL_GREEN'
  }

  configs?.forEach((c) => {
    configMap[c.key] = c.value
  })

  const isRedAlert = configMap.red_alert === 'true'
  const isBlackout = configMap.blackout_mode === 'true'
  const isWarheadActive = configMap.alpha_warhead_active === 'true'
  const warheadTime = parseInt(configMap.alpha_warhead_time, 10) || 90
  const mtfUnit = configMap.mtf_dispatched
  const isBreachActive = configMap.containment_breach_active === 'true'
  const isAlarmActive = configMap.security_alarm === 'true'
  const lockdownSectors = configMap.site_lockdown_sectors
  const isSoundWarning = configMap.sound_warnings === 'true'
  const isDronePatrol = configMap.security_drone_patrol === 'true'
  const isGridBackup = configMap.site_grid_backup === 'true'
  const ethicsWarning = configMap.ethics_violation_condition

  // Build body className list
  const bodyClasses = [
    'min-h-screen',
    'flex',
    'flex-col',
    'font-mono',
    'text-terminal-primary',
    'relative',
    'antialiased',
    'selection:bg-terminal-primary',
    'selection:text-black',
    isRedAlert ? 'alert-active' : '',
    isBlackout ? 'blackout-active' : '',
  ].filter(Boolean).join(' ')

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <html lang="en" className="h-full bg-black">
      <body className={bodyClasses}>
        {/* Alpha Warhead Countdown alert */}
        {isWarheadActive && <AlphaWarheadCountdown initialSeconds={warheadTime} />}

        {/* Global Warning Banners */}
        {isBreachActive && (
          <div className="bg-red-900/90 text-white border-b border-red-500 py-1.5 px-4 text-center font-bold tracking-widest text-xs animate-pulse flex items-center justify-center gap-2 z-40 relative">
            <AlertOctagon className="w-4.5 h-4.5 animate-bounce" />
            <span>[CRITICAL MAINFRAME WARNING: ACTIVE SITE-19 CONTAINMENT BREACH DETECTED]</span>
          </div>
        )}

        {mtfUnit !== 'None' && (
          <div className="bg-yellow-950 text-yellow-500 border-b border-yellow-500/50 py-1 px-4 text-center font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 z-40 relative">
            <Shield className="w-4 h-4 animate-pulse" />
            <span>[SECURITY TASKING: MOBILE TASK FORCE {mtfUnit.toUpperCase()} ACTIVE ON-SITE]</span>
          </div>
        )}

        {lockdownSectors !== 'None' && (
          <div className="bg-red-950/80 text-red-400 border-b border-red-500/30 py-1 px-4 text-center font-bold tracking-widest text-[10px] flex items-center justify-center gap-2 z-40 relative">
            <AlertOctagon className="w-4 h-4 animate-ping" />
            <span>[SECTOR BLOCK: SECURE DIRECTORIES IN {lockdownSectors.toUpperCase()} LOCKED DOWN]</span>
          </div>
        )}

        {/* Decorative Grid Line Lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#112211_1px,transparent_1px),linear-gradient(to_bottom,#112211_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

        <header className="border-b border-terminal-border bg-black/80 backdrop-blur-sm z-10 relative">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-terminal-primary animate-pulse" />
              <div>
                <Link href="/" className="text-xl font-bold tracking-widest glow-text-green flex items-center gap-2 hover:opacity-85">
                  SCP DATABASE
                </Link>
                <div className="text-[10px] text-terminal-primary/50 tracking-wider">
                  SECURE NET // BRANCH 19 // DATA LOCKDOWN
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-4 text-sm flex-wrap">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Home className="w-4 h-4" /> PORTAL
              </Link>
              <Link href="/directory" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Database className="w-4 h-4" /> DIRECTORY
              </Link>
              <Link href="/console" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Terminal className="w-4 h-4" /> CONSOLE
              </Link>
              <Link href="/guide" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <BookOpen className="w-4 h-4" /> GUIDE
              </Link>
              <Link href="/ethics" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Scale className="w-4 h-4" /> ETHICS
              </Link>
              {profile?.is_o5_1 && (
                <Link href="/admin" className="hover:text-white text-terminal-error transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-error">
                  <Lock className="w-4 h-4" /> O5 PANEL
                </Link>
              )}
              {profile && (profile.is_o5_1 || profile.profession === 'Ethics Committee Liaison') && (
                <Link href="/ethics/dashboard" className="hover:text-white text-terminal-info transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-info">
                  <Scale className="w-4 h-4" /> EC PANEL
                </Link>
              )}
              <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Info className="w-4 h-4" /> ABOUT
              </Link>
              {user ? (
                <div className="flex items-center gap-4 border-l border-terminal-border pl-4">
                  <Link href="/login" className="text-xs text-terminal-primary hover:text-white flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {profile?.username || user.email?.split('@')[0]}
                  </Link>
                  <form action={handleSignOut}>
                    <button type="submit" className="text-xs hover:text-terminal-error text-terminal-primary/60 border border-terminal-border hover:border-terminal-error px-2 py-1 cursor-pointer transition-all">
                      DISCONNECT
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5 border border-terminal-border px-3 py-1 hover:bg-terminal-primary/10">
                  <Key className="w-4 h-4" /> AUTHORIZE
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Global Security Status Bar */}
        <div className="border-b border-terminal-border bg-black/60 text-xs py-1.5 px-4 z-10 relative">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2 text-terminal-primary/65">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-[10px]">
                <Radio className="w-3 h-3 text-terminal-primary animate-ping" />
                SECURE LINK ESTABLISHED
              </span>
              <span className="hidden sm:inline border-r border-terminal-border h-3"></span>
              {isAlarmActive && (
                <span className="flex items-center gap-1 text-[10px] text-terminal-error font-extrabold animate-pulse">
                  <Siren className="w-3 h-3 text-terminal-error" />
                  ALARM SIGNAL ON
                </span>
              )}
              {isSoundWarning && (
                <span className="flex items-center gap-1 text-[10px] text-terminal-warn">
                  <Volume2 className="w-3 h-3" />
                  AUDIO FEED ON
                </span>
              )}
              {isDronePatrol && (
                <span className="hidden md:inline text-[10px] text-cyan-400">
                  [DRONE PATROL IN PROGRESS]
                </span>
              )}
              {isGridBackup && (
                <span className="hidden md:inline text-[10px] text-yellow-500">
                  [AUX POWER ENGAGED]
                </span>
              )}
              {ethicsWarning !== 'LEVEL_GREEN' && (
                <span className={`px-1.5 py-0.5 border text-[9px] font-bold ${ethicsWarning === 'LEVEL_RED' ? 'border-red-500 text-red-500 animate-pulse bg-red-500/5' : 'border-yellow-500 text-yellow-500 bg-yellow-500/5'}`}>
                  ETHICS: {ethicsWarning}
                </span>
              )}
            </div>
            
            <div className="text-[10px] uppercase font-bold text-white border border-terminal-border/60 px-2.5 py-0.5 bg-black/40">
              CLEARANCE LEVEL: LEVEL {currentLevel}
            </div>
          </div>
        </div>

        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 z-10 relative">
          {children}
        </main>

        <footer className="border-t border-terminal-border py-6 text-center text-xs text-terminal-primary/40 bg-black/80 z-10 relative">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              &copy; {new Date().getFullYear()} SCP FOUNDATION. ALL RIGHTS RESERVED.
            </div>
            <div className="text-[10px] tracking-wider border border-terminal-border/40 px-2 py-1 bg-black/40">
              WARNING: UNAUTHORIZED ACCESS IS SUBJECT TO IMMEDIATE TERMINATION AND CLASS-A AMNESTIC ADMINISTRATION.
            </div>
          </div>
        </footer>

        {/* Global Markdown Help Modal Button */}
        <MarkdownHelpModal />
      </body>
    </html>
  )
}
