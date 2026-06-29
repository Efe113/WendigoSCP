'use client'

import React, { useActionState, useState } from 'react'
import { resolveComplaint } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, ShieldAlert, CheckCircle, Scale, ShieldCheck, Mail } from 'lucide-react'

interface Complaint {
  id: string
  sender_name: string
  subject: string
  complaint_body: string
  target_user_id: string | null
  status: string
  action_taken: string | null
  reviewer_notes: string | null
  created_at: string
  target_profile?: {
    username: string
    profession: string
    status: string
  }
}

interface EthicsDashboardConsoleProps {
  complaints: Complaint[]
}

const initialResolveState = { success: false, error: '' }

export default function EthicsDashboardConsole({ complaints }: EthicsDashboardConsoleProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [state, formAction, isPending] = useActionState(resolveComplaint, initialResolveState as any)

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed max-w-5xl mx-auto">
      {/* Title block */}
      <div className="border border-terminal-border bg-black/60 p-4 relative overflow-hidden">
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-terminal-primary animate-pulse flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white glow-text-green">
              ETHICS COMMITTEE DECISION PANEL
            </h1>
            <p className="text-terminal-primary/75">
              SECURE CONSOLE RESERVED FOR ETHICS COMMITTEE LIAISONS AND OVERSEERS. INQUESTS INITIATED HERE SUPERSEDE ALL SITE CLEARANCES.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Listing (Left side) */}
        <div className="lg:col-span-1 space-y-4">
          <TerminalCard title="COMPLAINT LOG QUEUE" statusText="INQUESTS">
            {complaints.length === 0 ? (
              <p className="text-center py-12 text-terminal-primary/50">NO COMPLAINTS LOGGED IN DATABASE.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {complaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`w-full text-left p-3 border transition-colors cursor-pointer block space-y-1 bg-black ${
                        isSelected
                          ? 'border-terminal-primary bg-terminal-primary/5'
                          : 'border-terminal-border/40 hover:border-terminal-border'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-terminal-primary/50 uppercase truncate max-w-[100px]">By: {c.sender_name}</span>
                        <span
                          className={`px-1.5 py-0.5 font-bold rounded uppercase ${
                            c.status === 'pending_review'
                              ? 'bg-terminal-error/15 text-terminal-error border border-terminal-error/30'
                              : c.status === 'under_investigation'
                              ? 'bg-terminal-warn/15 text-terminal-warn border border-terminal-warn/30'
                              : 'bg-terminal-primary/15 text-terminal-primary border border-terminal-primary/30'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="font-bold text-white uppercase text-[10px] truncate">{c.subject}</div>
                      {c.target_profile && (
                        <div className="text-[9px] text-terminal-primary/75">
                          Target: <span className="text-terminal-error uppercase">{c.target_profile.username}</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </TerminalCard>
        </div>

        {/* Complaint Details and Moderation (Right side) */}
        <div className="lg:col-span-2">
          {selectedComplaint ? (
            <div className="space-y-4">
              <TerminalCard title="COMPLAINT LOG DETAILS" status="info" statusText="INQUEST_DATA">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 border-b border-terminal-border/20 pb-3">
                    <div>
                      <span className="text-[9px] text-terminal-primary/50 block">FILED_BY:</span>
                      <span className="font-bold text-white uppercase">{selectedComplaint.sender_name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-terminal-primary/50 block">LOGGED_ON:</span>
                      <span className="font-bold text-white">{new Date(selectedComplaint.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-terminal-primary/50 block">COMPLAINT_SUBJECT:</span>
                    <span className="font-bold text-white uppercase text-[11px] block">{selectedComplaint.subject}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-terminal-primary/50 block">INVESTIGATION_BODY:</span>
                    <div className="bg-black/60 border border-terminal-border/40 p-3 rounded text-[11px] text-terminal-primary/90 whitespace-pre-wrap">
                      {selectedComplaint.complaint_body}
                    </div>
                  </div>

                  {selectedComplaint.target_profile && (
                    <div className="border border-terminal-error/20 bg-terminal-error/[0.02] p-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-terminal-error/60 block uppercase">VIOLATING AGENT:</span>
                        <span className="font-bold text-white uppercase">{selectedComplaint.target_profile.username} ({selectedComplaint.target_profile.profession})</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-terminal-error/60 block uppercase">CURRENT PROFILE STATUS:</span>
                        <span
                          className={`font-bold uppercase ${
                            selectedComplaint.target_profile.status === 'suspended' ? 'text-terminal-error animate-pulse' : 'text-terminal-primary'
                          }`}
                        >
                          {selectedComplaint.target_profile.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TerminalCard>

              {/* Action Resolution form */}
              <TerminalCard title="COMMIT INVESTIGATION DECISION" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="complaint_id" value={selectedComplaint.id} />
                  <input type="hidden" name="target_user_id" value={selectedComplaint.target_user_id || ''} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-terminal-primary/60 mb-1.5">INVESTIGATION_STATUS</label>
                      <select name="status" defaultValue={selectedComplaint.status} required className="w-full px-3 py-2 text-sm bg-black border border-terminal-border">
                        <option value="under_investigation">Under Investigation (Inquest Active)</option>
                        <option value="resolved">Resolved (Inquest Complete)</option>
                        <option value="dismissed">Dismissed (No Violation)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/60 mb-1.5">DISCIPLINARY_ACTION</label>
                      <select name="action_taken" defaultValue={selectedComplaint.action_taken || ''} className="w-full px-3 py-2 text-sm bg-black border border-terminal-border">
                        <option value="">-- NO ACTION REQUIRED --</option>
                        <option value="Formal Warning Sent">Send Formal Warning</option>
                        <option value="Suspend Target Account">Suspend Target Account (Disconnect)</option>
                        <option value="Close Target Account">Close Target Account (Permanent amnestic termination)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-terminal-primary/60 mb-1.5">COMMITTEE REVIEWER NOTES</label>
                    <textarea
                      name="reviewer_notes"
                      defaultValue={selectedComplaint.reviewer_notes || ''}
                      rows={3}
                      required
                      placeholder="Enter legal findings and committee decisions..."
                      className="w-full px-3 py-2 text-sm"
                    ></textarea>
                  </div>

                  {state?.error && (
                    <div className="border border-terminal-error bg-terminal-error/10 p-3 text-terminal-error">
                      <span>{state.error}</span>
                    </div>
                  )}

                  {state?.success && (
                    <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-terminal-primary">
                      <span>COMPLAINT DISCIPLINARY RESOLUTION COMMITTED SECURELY.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-terminal-primary text-black font-bold uppercase text-xs hover:bg-black hover:text-terminal-primary transition-all cursor-pointer"
                  >
                    {isPending ? 'COMMITTING RESOLUTION...' : 'COMMIT DISCIPLINARY ACTION'}
                  </button>
                </form>
              </TerminalCard>
            </div>
          ) : (
            <div className="border border-terminal-border/40 bg-black/35 p-12 text-center text-terminal-primary/45 rounded font-mono">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              SELECT A COMPLAINT FROM THE LOG QUEUE TO DECRYPT CASE FILE & INITIATE ETHICS INQUEST.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
