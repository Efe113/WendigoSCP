'use client'

import React, { useActionState, useState, useEffect } from 'react'
import { login, signup, updateUserProfile } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, AlertTriangle, UserPlus, LogIn, User, Award, ShieldAlert, CheckCircle } from 'lucide-react'

interface AuthFormProps {
  user: any
  profile: any
}

const initialAuthState = { success: false, error: '' }
const initialProfileState = { success: false, error: '' }

const PROFESSIONS = [
  'Security Guard',
  'Field Agent',
  'Containment Specialist',
  'Researcher',
  'Medical Officer',
  'Mobile Task Force Operative',
  'Site Director',
  'Ethics Committee Liaison',
  'Administrative Staff',
  'Overseer',
]

const RANKS = [
  'Level 1 Personnel (Junior)',
  'Level 2 Personnel (Standard)',
  'Level 3 Personnel (Senior)',
  'Level 4 Personnel (Lead / Director)',
  'Level 5 Personnel (O5 Overseer)',
]

export default function AuthForm({ user, profile }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  
  const currentAction = mode === 'login' ? login : signup
  const [authState, authFormAction, isAuthPending] = useActionState(currentAction, initialAuthState as any)
  const [profileState, profileFormAction, isProfilePending] = useActionState(updateUserProfile, initialProfileState as any)

  useEffect(() => {
    if (authState?.success) {
      window.location.href = '/' // Redirect to portal homepage on login success
    }
  }, [authState])

  // Profile management view if already logged in
  if (user) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Shield className="w-12 h-12 text-terminal-primary mx-auto animate-pulse" />
          <h2 className="text-xl font-bold tracking-widest uppercase">AGENT PROFILE TERMINAL</h2>
          <p className="text-xs text-terminal-primary/60">
            SECURE LINK // ACTIVE CREDENTIALS DATA CARD
          </p>
        </div>

        {/* Profile overview card */}
        <TerminalCard title="SECURE DATA CARD" status="success" statusText={`CLEARANCE L${profile?.clearance_level}`}>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 border-b border-terminal-border/30 pb-4">
            <div>
              <span className="text-[10px] text-terminal-primary/50 block">CODENAME:</span>
              <span className="text-sm font-bold text-white uppercase">{profile?.username || user.email?.split('@')[0]}</span>
            </div>
            <div>
              <span className="text-[10px] text-terminal-primary/50 block">SECURE EMAIL:</span>
              <span className="text-sm font-bold text-white">{user.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-terminal-primary/50 block">PROFESSION:</span>
              <span className="text-sm font-bold text-white uppercase">{profile?.profession || 'Researcher'}</span>
            </div>
            <div>
              <span className="text-[10px] text-terminal-primary/50 block">RANK:</span>
              <span className="text-sm font-bold text-white uppercase">{profile?.rank || 'Level 1 Personnel (Junior)'}</span>
            </div>
          </div>

          <div className="text-[10px] text-terminal-primary/60 leading-normal">
            NOTE: CHANGES TO PROFILE RANK WILL INSTANTLY SYNCHRONIZE YOUR SECURITY CLEARANCE LEVEL ACROSS THE NETWORK VIA DATABASE TRIGGER.
          </div>
        </TerminalCard>

        {/* Profile edit card */}
        <TerminalCard title="MUTATE PROFILE CREDENTIALS" status={profileState?.error ? 'error' : profileState?.success ? 'success' : 'default'}>
          <form action={profileFormAction} className="space-y-4 font-mono text-xs">
            <div>
              <label htmlFor="username" className="block text-terminal-primary/65 mb-1.5">
                AGENT_CODENAME
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={profile?.username || user.email?.split('@')[0]}
                required
                className="w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profession" className="block text-terminal-primary/65 mb-1.5">
                  FOUNDATION_PROFESSION
                </label>
                <select
                  id="profession"
                  name="profession"
                  defaultValue={profile?.profession || 'Researcher'}
                  required
                  className="w-full px-3 py-2 text-sm cursor-pointer"
                >
                  {PROFESSIONS.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rank" className="block text-terminal-primary/65 mb-1.5">
                  FOUNDATION_RANK
                </label>
                <select
                  id="rank"
                  name="rank"
                  defaultValue={profile?.rank || 'Level 1 Personnel (Junior)'}
                  required
                  className="w-full px-3 py-2 text-sm cursor-pointer"
                >
                  {RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {profileState?.error && (
              <div className="border border-terminal-error bg-terminal-error/10 p-3 text-terminal-error flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
                <span>{profileState.error}</span>
              </div>
            )}

            {profileState?.success && (
              <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-terminal-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>PROFILE AND CLEARANCE SYNCHRONIZED SECURELY.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isProfilePending}
              className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
            >
              {isProfilePending ? 'COMMITTING PROFILE CHANGES...' : 'UPDATE AGENT PROFILE'}
            </button>
          </form>
        </TerminalCard>
      </div>
    )
  }

  // Login & Signup views
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-terminal-primary mx-auto animate-pulse" />
        <h2 className="text-xl font-bold tracking-widest uppercase">FOUNDATION AUTHORIZATION</h2>
        <p className="text-xs text-terminal-primary/60">
          SECURE UPLINK PORTAL // ENCRYPTED NODE CONNECTION
        </p>
      </div>

      <TerminalCard title={mode === 'login' ? 'AUTHORIZATION_LOGIN' : 'AUTHORIZATION_SIGNUP'} status={authState?.error ? 'error' : 'default'}>
        <form action={authFormAction} className="space-y-4 font-mono text-sm">
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="username" className="block text-xs text-terminal-primary/65 mb-1.5">
                  AGENT_CODENAME
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. Agent_Vance"
                  required
                  className="w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="profession" className="block text-terminal-primary/65 mb-1">
                    PROFESSION
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    required
                    className="w-full px-2 py-1 text-xs cursor-pointer bg-black text-terminal-primary"
                  >
                    {PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="rank" className="block text-terminal-primary/65 mb-1">
                    RANK
                  </label>
                  <select
                    id="rank"
                    name="rank"
                    required
                    className="w-full px-2 py-1 text-xs cursor-pointer bg-black text-terminal-primary"
                  >
                    {RANKS.map((r) => (
                      <option key={r} value={r}>
                        {r.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-terminal-primary/65 mb-1.5">
              EMAIL_ADDRESS
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. agent@site19.scp"
              required
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-terminal-primary/65 mb-1.5">
              ACCESS_KEY (PASSWORD)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          {authState?.error && (
            <div className="border border-terminal-error bg-terminal-error/10 p-3 text-xs text-terminal-error flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{authState.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthPending}
            className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
          >
            {isPendingSubmit(isAuthPending)}
          </button>
        </form>

        <div className="border-t border-terminal-border/40 mt-4 pt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-terminal-primary/60 hover:text-terminal-primary underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            {mode === 'login' ? (
              <>
                <UserPlus className="w-3.5 h-3.5" /> NEED NEW CREDENTIALS? REQUEST ACCESS
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" /> ALREADY REGISTERED? LOG IN HERE
              </>
            )}
          </button>
        </div>
      </TerminalCard>
    </div>
  )
}

function isPendingSubmit(isPending: boolean) {
  if (isPending) return 'TRANSMITTING CREDENTIALS...'
  return 'REQUEST LINK ESTABLISHMENT'
}
