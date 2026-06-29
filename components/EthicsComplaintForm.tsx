'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { submitComplaint } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, ShieldAlert, CheckCircle, Scale, Terminal } from 'lucide-react'
import Link from 'next/link'

interface ProfileSummary {
  id: string
  username: string
  profession: string
}

interface EthicsComplaintFormProps {
  profiles: ProfileSummary[]
  isEthicsModerator: boolean
}

const initialState = { success: false, error: '' }

export default function EthicsComplaintForm({ profiles, isEthicsModerator }: EthicsComplaintFormProps) {
  const [state, formAction, isPending] = useActionState(submitComplaint, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state])

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-mono text-xs leading-relaxed">
      {/* Liaison quick-link banner */}
      {isEthicsModerator && (
        <div className="border border-terminal-info bg-terminal-info/10 p-3.5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-terminal-info">
            <Scale className="w-5 h-5 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">ETHICS LIAISON CREDENTIALS VERIFIED</span>
          </div>
          <Link
            href="/ethics/dashboard"
            className="px-3 py-1.5 border border-terminal-info text-terminal-info hover:bg-terminal-info hover:text-black font-bold uppercase transition-colors text-[10px]"
          >
            OPEN LIAISON DASHBOARD
          </Link>
        </div>
      )}

      <div className="border border-terminal-border bg-black/50 p-4">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-terminal-primary" /> ETHICS COMMITTEE COMPLAINT FILE INTAKE
        </div>
        <p className="text-terminal-primary/75">
          THE ETHICS COMMITTEE HAS COMPLETE AUTONOMY TO INVESTIGATE AND PROSECUTE DEVIATIONS FROM CONTAINMENT
          AND RESEARCH PROTOCOLS. FILE YOUR COMPLAINT SECURELY BELOW. DISCIPLINARY ACTIONS MAY RESULT IN ACCOUNT SUSPENSION.
        </p>
      </div>

      <TerminalCard title="FILE DISCIPLINARY COMPLAINT" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
        <form ref={formRef} action={formAction} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sender_name" className="block text-terminal-primary/65 mb-1.5">
                YOUR_AGENT_SIGNATURE (Optional - Leave blank for Anonymous)
              </label>
              <input
                id="sender_name"
                name="sender_name"
                type="text"
                placeholder="ANONYMOUS"
                className="w-full px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="target_user_id" className="block text-terminal-primary/65 mb-1.5">
                TARGET_AGENT (Person committing violation)
              </label>
              <select
                id="target_user_id"
                name="target_user_id"
                className="w-full px-3 py-2 text-sm cursor-pointer"
              >
                <option value="">-- SYSTEM-WIDE INQUEST (NO TARGET) --</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username.toUpperCase()} ({p.profession.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-terminal-primary/65 mb-1.5">
              COMPLAINT_SUBJECT
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="e.g. Clearance level breach in SCP-682 containment cell"
              required
              className="w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="complaint_body" className="block text-terminal-primary/65 mb-1.5">
              COMPLAINT_BODY / INVESTIGATION DETAIL
            </label>
            <textarea
              id="complaint_body"
              name="complaint_body"
              rows={5}
              placeholder="Provide a detailed log of dates, times, and protocol violations..."
              required
              className="w-full px-3 py-2 text-sm"
            ></textarea>
          </div>

          {state?.error && (
            <div className="border border-terminal-error bg-terminal-error/10 p-3 text-terminal-error flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-terminal-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>COMPLAINT BUNDLED AND TRANSMITTED SECURELY TO THE ETHICS COMMITTEE ENCLAVE.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'TRANSMITTING FILE...' : 'TRANSMIT COMPLAINT FILE'}
          </button>
        </form>
      </TerminalCard>
    </div>
  )
}
