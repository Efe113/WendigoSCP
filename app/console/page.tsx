'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { createScpItem } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert, CheckCircle, Database, HelpCircle } from 'lucide-react'

const initialState = {
  success: false,
  error: '',
}

export default function ConsolePage() {
  const [state, formAction, isPending] = useActionState(createScpItem, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  // Clear form inputs on success
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border border-terminal-border bg-black/50 p-4 font-mono text-xs leading-relaxed">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <Database className="w-4 h-4" /> SECURE TERMINAL DATA ENTRY INGESTION
        </div>
        <p className="text-terminal-primary/75">
          THIS IS A DIRECT DATA TRANSMISSION UPLINK TO THE LIVE DATABASE. SUBMITTING THIS FORM WILL INSTANTLY MUTATE
          THE DB TABLE AND INITIATE A TARGETED ROUTE REVALIDATION. ALL DATA SUBMITTED HERE IS AUDITED.
        </p>
      </div>

      <TerminalCard title="RECORD ENTRY CONSOLE" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
        <form ref={formRef} action={formAction} className="space-y-4 font-mono text-sm">
          {/* Item Number & Codename Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item_number" className="block text-xs text-terminal-primary/65 mb-1.5">
                ITEM_NUMBER (Format: SCP-XXXX)
              </label>
              <input
                id="item_number"
                name="item_number"
                type="text"
                placeholder="e.g. SCP-173"
                required
                className="w-full px-3 py-2 text-sm uppercase"
              />
            </div>
            <div>
              <label htmlFor="codename" className="block text-xs text-terminal-primary/65 mb-1.5">
                CODENAME
              </label>
              <input
                id="codename"
                name="codename"
                type="text"
                placeholder="e.g. The Sculpture"
                required
                className="w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Object Class & Clearance Level Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="object_class" className="block text-xs text-terminal-primary/65 mb-1.5">
                OBJECT_CLASS
              </label>
              <select
                id="object_class"
                name="object_class"
                required
                className="w-full px-3 py-2 text-sm cursor-pointer"
              >
                <option value="Safe">Safe</option>
                <option value="Euclid">Euclid</option>
                <option value="Keter">Keter</option>
                <option value="Thaumiel">Thaumiel</option>
              </select>
            </div>
            <div>
              <label htmlFor="clearance_level_required" className="block text-xs text-terminal-primary/65 mb-1.5">
                CLEARANCE_LEVEL_REQUIRED (1-5)
              </label>
              <select
                id="clearance_level_required"
                name="clearance_level_required"
                required
                className="w-full px-3 py-2 text-sm cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formatting Tip */}
          <div className="border border-terminal-border/20 bg-terminal-primary/[0.01] p-3 text-[11px] text-terminal-primary/70 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-terminal-primary/60 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-terminal-primary block mb-0.5">FORMATTING SYNTAX TIP:</span>
              Use double pipes <code className="bg-black px-1 border border-terminal-border/40 text-terminal-primary">||your text||</code> in containment procedures or description to encrypt sensitive details. The text will render as redacted black boxes and decrypt only on hover.
            </div>
          </div>

          {/* Containment Procedures */}
          <div>
            <label htmlFor="containment_procedures" className="block text-xs text-terminal-primary/65 mb-1.5">
              SPECIAL CONTAINMENT PROCEDURES
            </label>
            <textarea
              id="containment_procedures"
              name="containment_procedures"
              rows={3}
              placeholder="e.g. SCP-173 is to be kept in a locked container at all times..."
              required
              className="w-full px-3 py-2 text-sm"
            ></textarea>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs text-terminal-primary/65 mb-1.5">
              DESCRIPTION
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="e.g. Moved to Site-19 1993. Construct is concrete and ||rebar||..."
              required
              className="w-full px-3 py-2 text-sm"
            ></textarea>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="border border-terminal-error bg-terminal-error/10 p-3 text-xs text-terminal-error flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Success Message */}
          {state?.success && (
            <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-xs text-terminal-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>RECORD COMMITTED SECURELY TO THE ARCHIVES. SYNC COMPLETED.</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'PROCESSING DATA INGESTION...' : 'COMMIT RECORD TO ARCHIVE'}
          </button>
        </form>
      </TerminalCard>
    </div>
  )
}
