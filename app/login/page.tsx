'use client'

import React, { useActionState, useState, useEffect } from 'react'
import { login, signup } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, AlertTriangle, UserPlus, LogIn } from 'lucide-react'

const initialState = {
  success: false,
  error: '',
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  
  // Choose action based on mode
  const currentAction = mode === 'login' ? login : signup
  const [state, formAction, isPending] = useActionState(currentAction, initialState as any)

  useEffect(() => {
    if (state?.success) {
      window.location.href = '/' // Redirect to directory on success
    }
  }, [state])

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-terminal-primary mx-auto animate-pulse" />
        <h2 className="text-xl font-bold tracking-widest uppercase">FOUNDATION AUTHORIZATION</h2>
        <p className="text-xs text-terminal-primary/60">
          SECURE UPLINK PORTAL // ENCRYPTED NODE CONNECTION
        </p>
      </div>

      <TerminalCard title={mode === 'login' ? 'AUTHORIZATION_LOGIN' : 'AUTHORIZATION_SIGNUP'} status={state?.error ? 'error' : 'default'}>
        <form action={formAction} className="space-y-4 font-mono text-sm">
          {mode === 'signup' && (
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

          {state?.error && (
            <div className="border border-terminal-error bg-terminal-error/10 p-3 text-xs text-terminal-error flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{state.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending
              ? 'TRANSMITTING CREDENTIALS...'
              : mode === 'login'
              ? 'REQUEST LINK ESTABLISHMENT'
              : 'REGISTER NEW AGENT'}
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
