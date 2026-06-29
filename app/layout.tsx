import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { getUserClearance, signOut } from '@/app/actions/scp'
import ClearanceSwitcher from '@/components/ClearanceSwitcher'
import { Terminal, Shield, User, Database, Radio, Key } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SCP Foundation Secure Database',
  description: 'RESTRICTED ACCESS - LEVEL 4 CLEARANCE RECOMMENDED',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, realLevel, simulatedLevel, currentLevel } = await getUserClearance()

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <html lang="en" className="h-full bg-black">
      <body className="min-h-screen flex flex-col font-mono text-terminal-primary relative antialiased selection:bg-terminal-primary selection:text-black">
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

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Database className="w-4 h-4" /> DIRECTORY
              </Link>
              <Link href="/console" className="hover:text-white transition-colors flex items-center gap-1.5 py-1 border-b border-transparent hover:border-terminal-primary">
                <Terminal className="w-4 h-4" /> CONSOLE
              </Link>
              {user ? (
                <div className="flex items-center gap-4 border-l border-terminal-border pl-4">
                  <span className="text-xs text-terminal-primary/70 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {user.email?.split('@')[0]}
                  </span>
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
              <span className="hidden sm:inline text-[10px]">HOST: db.ptkxaavbjhjmseytrgnh.supabase.co</span>
            </div>
            
            <ClearanceSwitcher
              currentLevel={currentLevel}
              simulatedLevel={simulatedLevel}
              realLevel={realLevel}
              isLoggedIn={!!user}
            />
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
      </body>
    </html>
  )
}
