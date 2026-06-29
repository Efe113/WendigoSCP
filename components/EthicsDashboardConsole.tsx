'use client'

import React, { useActionState, useState, useTransition } from 'react'
import { resolveComplaint, updateSystemConfig, demoteToDClass, sendECCensure } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, ShieldAlert, CheckCircle, Scale, ShieldCheck, Mail, Users, Settings, AlertTriangle, Key, HeartPulse, UserMinus } from 'lucide-react'

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

interface Profile {
  id: string
  username: string
  clearance_level: number
  profession: string
  rank: string
  status: string
  is_o5_1: boolean
}

interface EthicsDashboardConsoleProps {
  complaints: Complaint[]
  allProfiles: Profile[]
  config: Record<string, string>
}

const initialResolveState = { success: false, error: '' }

export default function EthicsDashboardConsole({ complaints, allProfiles, config }: EthicsDashboardConsoleProps) {
  const [activeTab, setActiveTab] = useState<'complaints' | 'mainframe' | 'reprimands'>('complaints')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [state, formAction, isPending] = useActionState(resolveComplaint, initialResolveState as any)
  const [isTransitionPending, startTransition] = useTransition()

  // Censure input message state
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [censureMessage, setCensureMessage] = useState<string>('')

  // Parse censures list
  const censuresList = (() => {
    try {
      return JSON.parse(config.ethics_censures || '[]')
    } catch (e) {
      return []
    }
  })()

  const handleConfigChange = (key: string, value: string) => {
    startTransition(async () => {
      const res = await updateSystemConfig(key, value)
      if (res?.error) {
        alert(res.error)
      }
    })
  }

  const handleDemote = (profileId: string) => {
    if (confirm('CRITICAL PROTOCOL: Demote this agent to Class-D Test Subject? This will permanently strip all clearance ratings and override their site role.')) {
      startTransition(async () => {
        const res = await demoteToDClass(profileId)
        if (res?.error) {
          alert(res.error)
        } else {
          alert('Agent demoted to Class-D successfully. Records synchronized.')
        }
      })
    }
  }

  const handleCensureSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProfileId || !censureMessage) return
    startTransition(async () => {
      const res = await sendECCensure(selectedProfileId, censureMessage)
      if (res?.error) {
        alert(res.error)
      } else {
        alert('Ethics censure successfully logged and broadcasted.')
        setCensureMessage('')
      }
    })
  }

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

      {/* Tabs Row */}
      <div className="flex border-b border-terminal-border flex-wrap">
        {[
          { id: 'complaints', label: 'COMPLAINTS LOG QUEUE', icon: Mail, badge: complaints.filter(c => c.status === 'pending_review').length },
          { id: 'mainframe', label: 'EC MAINFRAME OVERRIDES', icon: Settings },
          { id: 'reprimands', label: 'CENSURES & REPRIMANDS', icon: Users },
        ].map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-t border-x hover:bg-terminal-primary/5 transition-colors cursor-pointer border-transparent ${
                isActive
                  ? 'bg-black text-terminal-primary border-terminal-border border-b-black -mb-[1px]'
                  : 'text-terminal-primary/60 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="bg-terminal-error text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">
        {/* Tab 1: Complaints Queue */}
        {activeTab === 'complaints' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Complaints Listing (Left side) */}
            <div className="lg:col-span-1 space-y-4">
              <TerminalCard title="INQUEST QUEUE" statusText="INQUESTS">
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

            {/* Complaint Details (Right side) */}
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
                            <span className="text-[9px] text-terminal-error/60 block uppercase">CURRENT STATUS:</span>
                            <span className={`font-bold uppercase ${selectedComplaint.target_profile.status === 'suspended' ? 'text-terminal-error animate-pulse' : 'text-terminal-primary'}`}>
                              {selectedComplaint.target_profile.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TerminalCard>

                  {/* Resolve form */}
                  <TerminalCard title="COMMIT INVESTIGATION DECISION" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
                    <form action={formAction} className="space-y-4">
                      <input type="hidden" name="complaint_id" value={selectedComplaint.id} />
                      <input type="hidden" name="target_user_id" value={selectedComplaint.target_user_id || ''} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-terminal-primary/60 mb-1.5">INVESTIGATION_STATUS</label>
                          <select name="status" defaultValue={selectedComplaint.status} required className="w-full px-3 py-2 text-sm bg-black border border-terminal-border">
                            <option value="under_investigation">Under Investigation</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-terminal-primary/60 mb-1.5">DISCIPLINARY_ACTION</label>
                          <select name="action_taken" defaultValue={selectedComplaint.action_taken || ''} className="w-full px-3 py-2 text-sm bg-black border border-terminal-border">
                            <option value="">-- NO ACTION REQUIRED --</option>
                            <option value="Formal Warning Sent">Send Formal Warning</option>
                            <option value="Suspend Target Account">Suspend Target Account</option>
                            <option value="Close Target Account">Close Target Account</option>
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

                      {state?.error && <div className="text-terminal-error p-2 border border-terminal-error/20 bg-terminal-error/5">{state.error}</div>}
                      {state?.success && <div className="text-terminal-primary p-2 border border-terminal-primary/20 bg-terminal-primary/5">RESOLUTION LOGGED OK.</div>}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2 bg-terminal-primary text-black font-bold uppercase text-xs hover:bg-black hover:text-terminal-primary transition-all cursor-pointer"
                      >
                        COMMIT DISCIPLINARY ACTION
                      </button>
                    </form>
                  </TerminalCard>
                </div>
              ) : (
                <div className="border border-terminal-border/40 bg-black/35 p-12 text-center text-terminal-primary/45 rounded">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  SELECT A COMPLAINT FROM THE LOG QUEUE TO DECRYPT CASE FILE & INITIATE ETHICS INQUEST.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: EC Overrides Mainframe (20 customizable Ethics settings) */}
        {activeTab === 'mainframe' && (
          <div className="space-y-6">
            {/* Compliance indicator & Warning Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TerminalCard title="Ethics Compliance Level" status="info" statusText="COMPLIANCE_SCORE">
                <div className="space-y-3 py-1">
                  <p className="text-terminal-primary/70 text-[10px]">
                    Site-19 aggregate ethical metrics. Directly set via auditor override slides.
                  </p>
                  <div className="flex justify-between items-center bg-black/60 p-2 border border-terminal-border/30">
                    <span className="font-bold text-[10px]">SCORE: {config.ethics_compliance_score || '88'}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.ethics_compliance_score || '88'}
                      onChange={(e) => handleConfigChange('ethics_compliance_score', e.target.value)}
                      disabled={isTransitionPending}
                      className="w-24 h-1 cursor-pointer bg-neutral-800"
                    />
                  </div>
                </div>
              </TerminalCard>

              <TerminalCard title="Ethics Violation Warning" status={config.ethics_violation_condition !== 'LEVEL_GREEN' ? 'error' : 'default'} statusText="SYS_WARN">
                <div className="space-y-3 py-1">
                  <p className="text-terminal-primary/70 text-[10px]">
                    Warns database operators of ongoing ethical investigations.
                  </p>
                  <select
                    value={config.ethics_violation_condition || 'LEVEL_GREEN'}
                    onChange={(e) => handleConfigChange('ethics_violation_condition', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-xs px-2.5 py-1"
                  >
                    <option value="LEVEL_GREEN">LEVEL_GREEN (ETHICS INTENT)</option>
                    <option value="LEVEL_AMBER">LEVEL_AMBER (COMPLIANCE AUDIT)</option>
                    <option value="LEVEL_RED">LEVEL_RED (VIOLATION CRITICAL)</option>
                  </select>
                </div>
              </TerminalCard>

              <TerminalCard title="Class-D Treatment Policy" status="default" statusText="D-CLASS_PROT">
                <div className="space-y-3 py-1">
                  <p className="text-terminal-primary/70 text-[10px]">
                    Sets standard feeding and interaction policies for Class-D Subjects.
                  </p>
                  <select
                    value={config.dclass_protocol || 'humane'}
                    onChange={(e) => handleConfigChange('dclass_protocol', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-xs px-2.5 py-1"
                  >
                    <option value="humane">Humane standard (Basic Comfort)</option>
                    <option value="minimal">Minimal rations (Strict Diet)</option>
                    <option value="enhanced">Enhanced testing (High Hazard)</option>
                    <option value="extreme">Extreme risk exposure (O5 Override)</option>
                  </select>
                </div>
              </TerminalCard>
            </div>

            {/* Overrides Mainframe Grid */}
            <TerminalCard title="ETHICS DECISION REGISTER (20 CHANNELS)" statusText="ETHICS_CHANNELS">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2">
                {/* 1. D-Class Termination Moratorium */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">1. TERMINATION MORATORIUM</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>MORATORIUM: {config.termination_moratorium === 'true' ? 'ACTIVE' : 'DEACTIVATED'}</span>
                    <button
                      onClick={() => handleConfigChange('termination_moratorium', config.termination_moratorium === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 2. Sentient Testing Blocks */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">2. SENTIENT TESTING BLOCKS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.sentient_testing_block === 'true' ? 'ENFORCED' : 'BYPASSED'}</span>
                    <button
                      onClick={() => handleConfigChange('sentient_testing_block', config.sentient_testing_block === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 3. Whistleblower Protection */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">3. WHISTLEBLOWER ACT</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>PROTECTIONS: {config.whistleblower_protection === 'true' ? 'SECURE' : 'SUSPENDED'}</span>
                    <button
                      onClick={() => handleConfigChange('whistleblower_protection', config.whistleblower_protection === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 4. Auto-suspension of agents */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">4. COMPLAINT AUTO-DISCIPLINE</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>AUTO-SUSPEND: {config.auto_suspension_complaints === 'true' ? 'ON (3 COMP.)' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('auto_suspension_complaints', config.auto_suspension_complaints === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 5. Amnestic Key Override */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><Key className="w-3.5 h-3.5 text-cyan-400" /> 5. AMNESTICS OVERRIDE</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.amnestic_ec_override === 'true' ? 'LOCKED' : 'STANDARD'}</span>
                    <button
                      onClick={() => handleConfigChange('amnestic_ec_override', config.amnestic_ec_override === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 6. Mandatory Psych Eval Toggles */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><HeartPulse className="w-3.5 h-3.5 text-red-400" /> 6. MANDATORY PSYCH</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.mandatory_psych === 'true' ? 'ENFORCED' : 'OPTIONAL'}</span>
                    <button
                      onClick={() => handleConfigChange('mandatory_psych', config.mandatory_psych === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 7. Bystander Compensation */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">7. CIVILIAN COMP.</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.bystander_compensation === 'true' ? 'AUTHORIZED' : 'DENIED'}</span>
                    <button
                      onClick={() => handleConfigChange('bystander_compensation', config.bystander_compensation === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 8. Research Grant Audit */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">8. GRANT ETHICS AUDITING</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.grant_auditing === 'true' ? 'ACTIVE' : 'BYPASS'}</span>
                    <button
                      onClick={() => handleConfigChange('grant_auditing', config.grant_auditing === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 9. Human Testing Audits */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">9. HUMAN TEST AUDIT</span>
                  <select
                    value={config.human_test_audit_level || 'standard'}
                    onChange={(e) => handleConfigChange('human_test_audit_level', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="standard">Standard Audit (Level-3)</option>
                    <option value="double">Double Liaison (Level-4)</option>
                    <option value="full_council">Full Council (Level-5)</option>
                  </select>
                </div>

                {/* 10. Specimen Transfer Audits */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">10. TRANSFER AUDITS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.transfer_audits === 'true' ? 'REQUIRED' : 'NO AUDIT'}</span>
                    <button
                      onClick={() => handleConfigChange('transfer_audits', config.transfer_audits === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 11. Class-D Rations */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">11. CLASS-D RATIONS LIMIT</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={config.classd_rations || '100'}
                      onChange={(e) => handleConfigChange('classd_rations', e.target.value)}
                      disabled={isTransitionPending}
                      className="w-full mr-2 cursor-pointer h-1 bg-neutral-800"
                    />
                    <span className="text-[10px] font-bold">{config.classd_rations || '100'}%</span>
                  </div>
                </div>

                {/* 12. Memory Wipe Approvals */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">12. MEM WIPE APPROVAL</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>REQUIRED: {config.mem_wipe_approval === 'true' ? 'YES' : 'NO'}</span>
                    <button
                      onClick={() => handleConfigChange('mem_wipe_approval', config.mem_wipe_approval === 'true' ? 'false' : 'true')}
                      disabled={isTransitionPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 13. Whistleblower anonymity */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">13. WHISTLEBLOWER ANON</span>
                  <select
                    value={config.whistleblower_anonymity || 'secured'}
                    onChange={(e) => handleConfigChange('whistleblower_anonymity', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="secured">Fully Encrypted (Encrypted)</option>
                    <option value="overseer_only">Overseer Decryptable</option>
                    <option value="disclosed">Disclosed (Open Log)</option>
                  </select>
                </div>

                {/* 14. Liaison count */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">14. LIAISON COUNTER</span>
                  <input
                    type="number"
                    value={config.liaison_count || '12'}
                    onChange={(e) => handleConfigChange('liaison_count', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 15. Sector Liaison assignment */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">15. ASSIGNED SECTORS</span>
                  <input
                    type="text"
                    value={config.liaison_sectors || 'Sector-4, Sector-9'}
                    onChange={(e) => handleConfigChange('liaison_sectors', e.target.value)}
                    disabled={isTransitionPending}
                    placeholder="Sectors..."
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 16. Cognitohazard screening */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">16. COG SCREEN STRENGTH</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={config.cog_screen_strength || '80'}
                      onChange={(e) => handleConfigChange('cog_screen_strength', e.target.value)}
                      disabled={isTransitionPending}
                      className="w-full mr-2 cursor-pointer h-1 bg-neutral-800"
                    />
                    <span className="text-[10px] font-bold">{config.cog_screen_strength || '80'}%</span>
                  </div>
                </div>

                {/* 17. Ethics training freq */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">17. TRAINING INTERVAL</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={config.ethics_training_days || '90'}
                      onChange={(e) => handleConfigChange('ethics_training_days', e.target.value)}
                      disabled={isTransitionPending}
                      className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                    />
                    <span className="text-[9px] text-terminal-primary/50 self-center font-semibold">DAYS</span>
                  </div>
                </div>

                {/* 18. Demote to D-Class Audit */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">18. DEMOTION STATUS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: ACTIVE (LAW-5)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                </div>

                {/* 19. Ethics Hearing intervals */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">19. HEARING SCHEDULE</span>
                  <input
                    type="text"
                    value={config.ethics_hearing_schedule || 'FRIDAYS 13:00'}
                    onChange={(e) => handleConfigChange('ethics_hearing_schedule', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 20. Mainframe compliance check */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">20. MAIN CHECK INTERVAL</span>
                  <input
                    type="text"
                    value={config.compliance_check_interval || '24 hrs'}
                    onChange={(e) => handleConfigChange('compliance_check_interval', e.target.value)}
                    disabled={isTransitionPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>
              </div>
            </TerminalCard>
          </div>
        )}

        {/* Tab 3: Censures & Reprimands panel */}
        {activeTab === 'reprimands' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reprimand Form (Left side - 1 col) */}
            <div className="md:col-span-1 space-y-4">
              <TerminalCard title="ISSUE ETHICS CENSURE" status="warn">
                <form onSubmit={handleCensureSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-terminal-primary/65 mb-1.5">SELECT SITE AGENT</label>
                    <select
                      value={selectedProfileId}
                      onChange={(e) => setSelectedProfileId(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm bg-black border border-terminal-border cursor-pointer"
                    >
                      <option value="">-- SELECT AGENT --</option>
                      {allProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.username.toUpperCase()} ({p.profession} - L{p.clearance_level})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-terminal-primary/65 mb-1.5">CENSURE REASON / PENALTY REPORT</label>
                    <textarea
                      value={censureMessage}
                      onChange={(e) => setCensureMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Specify the security clearance violation or containment breach details..."
                      className="w-full px-3 py-2 text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isTransitionPending || !selectedProfileId}
                    className="w-full py-2 bg-terminal-warn text-black font-bold uppercase text-xs hover:bg-black hover:text-terminal-warn border border-terminal-warn/45 transition-colors cursor-pointer"
                  >
                    LOG FORMAL CENSURE
                  </button>
                </form>
              </TerminalCard>
            </div>

            {/* Censured list and Demote to Class-D Action (Right side - 2 cols) */}
            <div className="md:col-span-2 space-y-4">
              {/* Censures logs */}
              <TerminalCard title="FORMAL CENSURE LOG ENTRIES" statusText="CENSURES">
                {censuresList.length === 0 ? (
                  <p className="text-center py-8 text-terminal-primary/30 italic">No formal censures logged in database system.</p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 text-[11px]">
                    {censuresList.map((cen: any) => (
                      <div key={cen.id} className="border border-terminal-border/30 bg-black/40 p-2.5 space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-terminal-primary/45 border-b border-terminal-border/10 pb-0.5">
                          <span className="font-bold text-terminal-warn">TARGET: {cen.username?.toUpperCase()}</span>
                          <span>TIMESTAMP: {new Date(cen.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-white mt-1 font-semibold">{cen.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TerminalCard>

              {/* Profiles listing for demoting to D-Class */}
              <TerminalCard title="AGENTS MANAGEMENT & D-CLASS DEMOTION MAIN" statusText="DISCIPLINE">
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {allProfiles.map((p) => {
                    const isDClass = p.profession.includes('D-Class')
                    return (
                      <div key={p.id} className="flex justify-between items-center border border-terminal-border/30 bg-black/40 p-2 text-xs">
                        <div>
                          <span className="font-bold text-white uppercase">{p.username}</span>
                          <span className="text-[10px] text-terminal-primary/60 block">
                            ROLE: {p.profession} // RANK: {p.rank} // CLEARANCE: L{p.clearance_level}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDemote(p.id)}
                            disabled={isTransitionPending || isDClass || p.is_o5_1}
                            className={`px-3 py-1 border text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                              isDClass
                                ? 'border-neutral-800 text-neutral-600 bg-neutral-950/20'
                                : 'border-terminal-error hover:bg-terminal-error hover:text-black text-terminal-error'
                            }`}
                          >
                            <UserMinus className="w-3.5 h-3.5" /> DEMOTE TO D-CLASS
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TerminalCard>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
