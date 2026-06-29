'use client'

import React, { useState, useActionState, useTransition } from 'react'
import { updateUserStatus, updateSystemConfig, createCustomRole } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, ShieldAlert, CheckCircle, Radio, Settings, Users, FilePlus, BarChart2 } from 'lucide-react'

interface Profile {
  id: string
  username: string
  clearance_level: number
  profession: string
  rank: string
  status: string
  is_o5_1: boolean
}

interface O5ControlConsoleProps {
  pendingProfiles: Profile[]
  allProfiles: Profile[]
  config: { maintenance_mode: string; threat_level: string }
}

const initialRoleState = { success: false, error: '' }

export default function O5ControlConsole({ pendingProfiles, allProfiles, config }: O5ControlConsoleProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'system' | 'roles' | 'stats'>('approvals')
  const [roleState, roleAction, isRolePending] = useActionState(createCustomRole, initialRoleState as any)
  const [isPending, startTransition] = useTransition()

  // Dynamic calculations for Stats
  const totalCount = allProfiles.length
  const statusCounts = {
    pending: allProfiles.filter((p) => p.status === 'pending').length,
    approved: allProfiles.filter((p) => p.status === 'approved').length,
    suspended: allProfiles.filter((p) => p.status === 'suspended').length,
  }

  const professionCounts: Record<string, number> = {}
  const rankCounts: Record<string, number> = {}

  allProfiles.forEach((p) => {
    professionCounts[p.profession] = (professionCounts[p.profession] || 0) + 1
    rankCounts[p.rank] = (rankCounts[p.rank] || 0) + 1
  })

  const handleStatusChange = (userId: string, newStatus: 'approved' | 'rejected' | 'suspended') => {
    startTransition(async () => {
      const res = await updateUserStatus(userId, newStatus)
      if (res?.error) {
        alert(res.error)
      }
    })
  }

  const handleConfigChange = (key: string, value: string) => {
    startTransition(async () => {
      const res = await updateSystemConfig(key, value)
      if (res?.error) {
        alert(res.error)
      }
    })
  }

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed max-w-5xl mx-auto">
      {/* Console Title Bar */}
      <div className="border border-terminal-border bg-black/60 p-4 relative overflow-hidden">
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-terminal-error animate-pulse flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white glow-text-red">
              O5-1 CONTROL CONSOLE
            </h1>
            <p className="text-terminal-primary/75">
              RESTRICTED OVERSEER INTERFACE. AUTHORIZED FOR SITE STATUS MANIPULATION, ROLE INGESTION, AND AGENT REGISTRATION OVERRIDE.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-terminal-border flex-wrap">
        {[
          { id: 'approvals', label: 'REGISTRATION QUEUE', icon: Users, badge: pendingProfiles.length },
          { id: 'system', label: 'SYSTEM CONFIG', icon: Settings },
          { id: 'roles', label: 'CUSTOM ROLES BUILDER', icon: FilePlus },
          { id: 'stats', label: 'DATABASE METRICS', icon: BarChart2 },
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

      {/* Tabs Content */}
      <div className="min-h-[300px]">
        {/* Tab 1: Registration Approvals Queue */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <TerminalCard title="PENDING AGENT REGISTRATIONS" statusText="QUEUE">
              {pendingProfiles.length === 0 ? (
                <p className="text-center py-12 text-terminal-primary/50">NO REGISTRATION REQUESTS DETECTED IN THE QUEUE.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-terminal-border/40 pb-2 text-terminal-primary/60">
                        <th className="py-2">CODENAME</th>
                        <th className="py-2">REQUESTED PROFESSION</th>
                        <th className="py-2">REQUESTED RANK</th>
                        <th className="py-2 text-right">INGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-terminal-border/20">
                      {pendingProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-terminal-primary/[0.02]">
                          <td className="py-3 font-bold text-white uppercase">{p.username}</td>
                          <td className="py-3 text-terminal-primary/80 uppercase">{p.profession}</td>
                          <td className="py-3 text-terminal-primary/80 uppercase">{p.rank}</td>
                          <td className="py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleStatusChange(p.id, 'approved')}
                                disabled={isPending}
                                className="px-2.5 py-1 border border-terminal-primary hover:bg-terminal-primary hover:text-black font-bold uppercase transition-colors text-[10px] cursor-pointer"
                              >
                                APPROVE
                              </button>
                              <button
                                onClick={() => handleStatusChange(p.id, 'rejected')}
                                disabled={isPending}
                                className="px-2.5 py-1 border border-terminal-error hover:bg-terminal-error hover:text-black font-bold uppercase transition-colors text-[10px] cursor-pointer"
                              >
                                REJECT
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TerminalCard>
          </div>
        )}

        {/* Tab 2: System Settings */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TerminalCard title="Bakım Modu (Maintenance Toggle)" status={config.maintenance_mode === 'true' ? 'warn' : 'default'} statusText="MAINTENANCE">
              <div className="space-y-4 py-2">
                <p className="text-terminal-primary/75">
                  ACTIVATING MAINTENANCE MODE BLOCKS ALL NON-O5 AGENTS AND GUESTS FROM SITE ACCESS, SHOWING A SYSTEM LOCKDOWN SCREEN.
                </p>
                <div className="flex justify-between items-center border border-terminal-border/40 p-3 bg-black">
                  <span className="font-bold text-white">STATUS: {config.maintenance_mode === 'true' ? 'ACTIVE (SITE OFFLINE)' : 'INACTIVE (SITE ONLINE)'}</span>
                  <button
                    onClick={() => handleConfigChange('maintenance_mode', config.maintenance_mode === 'true' ? 'false' : 'true')}
                    disabled={isPending}
                    className={`px-4 py-2 border font-bold uppercase transition-colors cursor-pointer ${
                      config.maintenance_mode === 'true'
                        ? 'border-terminal-primary hover:bg-terminal-primary hover:text-black'
                        : 'border-terminal-error hover:bg-terminal-error hover:text-black text-terminal-error'
                    }`}
                  >
                    {config.maintenance_mode === 'true' ? 'DISABLE LOCKDOWN' : 'INITIATE LOCKDOWN'}
                  </button>
                </div>
              </div>
            </TerminalCard>

            <TerminalCard title="Tehdit Durumu (Threat Level)" status="default" statusText="THREAT">
              <div className="space-y-4 py-2">
                <p className="text-terminal-primary/75">
                  UPDATE THE GLOBAL RISK CODEX OF SITE-19. THIS SETTING IS VISIBLE ON THE PORTAL DASHBOARD FOR ALL AGENTS.
                </p>
                <div className="flex gap-4 items-center justify-between border border-terminal-border/40 p-3 bg-black">
                  <span className="font-bold text-white uppercase">ACTIVE RISK: {config.threat_level}</span>
                  <select
                    value={config.threat_level}
                    disabled={isPending}
                    onChange={(e) => handleConfigChange('threat_level', e.target.value)}
                    className="px-3 py-1.5 border border-terminal-border bg-black text-terminal-primary text-xs cursor-pointer focus:outline-none"
                  >
                    <option value="LEVEL_GREEN">LEVEL_GREEN (SAFE)</option>
                    <option value="LEVEL_YELLOW">LEVEL_YELLOW (EUCLID)</option>
                    <option value="LEVEL_RED">LEVEL_RED (KETER)</option>
                    <option value="LEVEL_BLACK">LEVEL_BLACK (APOLLYON)</option>
                  </select>
                </div>
              </div>
            </TerminalCard>
          </div>
        )}

        {/* Tab 3: Custom Roles Builder */}
        {activeTab === 'roles' && (
          <TerminalCard title="INGEST CUSTOM RANK / PROFESSION (20+ VARIABLES)" status={roleState?.error ? 'error' : roleState?.success ? 'success' : 'default'}>
            <form action={roleAction} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-terminal-primary/60 mb-1">ROLE_TYPE</label>
                  <select name="role_type" required className="w-full px-2.5 py-1.5 text-xs bg-black text-terminal-primary border border-terminal-border">
                    <option value="profession">Profession (Meslek)</option>
                    <option value="rank">Rank (Rütbe)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-terminal-primary/60 mb-1">TITLE (UNSURPASSED)</label>
                  <input type="text" name="title" required placeholder="e.g. Containment Director" className="w-full px-2.5 py-1.5 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/60 mb-1">CLEARANCE_LEVEL</label>
                  <select name="clearance_level" required className="w-full px-2.5 py-1.5 text-xs bg-black text-terminal-primary border border-terminal-border">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>Level {l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 20+ variable inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">1. DEPARTMENT</label>
                  <input type="text" name="department" required placeholder="e.g. Research" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">2. REPORTING_TO</label>
                  <input type="text" name="reporting_to" required placeholder="e.g. O5 Command" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">3. HAZARD_ALLOWANCE</label>
                  <input type="text" name="hazard_allowance" required placeholder="e.g. Tier-4" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">4. PSYCH_EVAL_FREQ</label>
                  <input type="text" name="psych_eval_freq" required placeholder="e.g. Bi-Weekly" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">5. WEAPONS_AUTH</label>
                  <input type="text" name="weapons_auth" required placeholder="e.g. Tactical Level" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">6. ANOMALY_LIMIT</label>
                  <input type="text" name="anomaly_limit" required placeholder="e.g. Euclid Max" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">7. MEDICAL_FREQ</label>
                  <input type="text" name="medical_freq" required placeholder="e.g. Monthly" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">8. SITE_ACCESS</label>
                  <input type="text" name="site_access" required placeholder="e.g. Site-19" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">9. OVERRIDE_CODE</label>
                  <input type="text" name="override_code" required placeholder="e.g. CL-4-SEC" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">10. TERMINATION_PROTOCOL</label>
                  <input type="text" name="termination_protocol" required placeholder="e.g. standard" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">11. AMNESTIC_LIMIT</label>
                  <input type="text" name="amnestic_susceptibility" required placeholder="e.g. Class-A max" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">12. ACTIVE_STATUS</label>
                  <input type="text" name="active_status" required placeholder="e.g. ACTIVE" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">13. EQUIPMENT_AUTH</label>
                  <input type="text" name="equipment_auth" required placeholder="e.g. Level-4 Ingress" className="w-full px-2 py-1 text-xs" />
                </div>
                <div>
                  <label className="block text-terminal-primary/50 mb-0.5">14. RESPONSIBILITIES</label>
                  <input type="text" name="responsibilities" required placeholder="e.g. Containment Oversight" className="w-full px-2 py-1 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-terminal-primary/60 mb-1">15. PURPOSE</label>
                  <textarea name="purpose" required rows={2} placeholder="Explain purpose of this custom role..." className="w-full px-2.5 py-1.5 text-xs"></textarea>
                </div>
                <div>
                  <label className="block text-terminal-primary/60 mb-1">16. DESCRIPTION</label>
                  <textarea name="description" required rows={2} placeholder="Description details..." className="w-full px-2.5 py-1.5 text-xs"></textarea>
                </div>
              </div>

              <div>
                <label className="block text-terminal-primary/60 mb-1">17. EXTRA NOTES</label>
                <input type="text" name="notes" placeholder="Any extra information..." className="w-full px-2.5 py-1.5 text-xs" />
              </div>

              {roleState?.error && (
                <div className="border border-terminal-error bg-terminal-error/10 p-3 text-terminal-error">
                  <span>{roleState.error}</span>
                </div>
              )}

              {roleState?.success && (
                <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-terminal-primary">
                  <span>ROLE COMPILED WITH 20+ CRITERIA AND SECURELY INGESTED.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isRolePending}
                className="w-full py-2 bg-terminal-primary text-black font-bold uppercase text-xs hover:bg-black hover:text-terminal-primary transition-all cursor-pointer"
              >
                {isRolePending ? 'COMPILING ROLE METRICS...' : 'INGEST CUSTOM ROLE'}
              </button>
            </form>
          </TerminalCard>
        )}

        {/* Tab 4: System Statistics */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Professions list */}
            <TerminalCard title="COUNT PER FIXED PROFESSION" statusText="PROFESSIONS">
              <div className="space-y-3 py-1">
                {Object.entries(professionCounts).map(([prof, count]) => {
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
                  return (
                    <div key={prof} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-white uppercase">
                        <span>{prof}</span>
                        <span>{count} PERSONNEL ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-terminal-border h-2.5 overflow-hidden">
                        <div className="bg-terminal-primary h-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TerminalCard>

            {/* Ranks list */}
            <TerminalCard title="COUNT PER FIXED RANK" statusText="RANKS">
              <div className="space-y-3 py-1">
                {Object.entries(rankCounts).map(([rank, count]) => {
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
                  return (
                    <div key={rank} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-white uppercase">
                        <span>{rank}</span>
                        <span>{count} PERSONNEL ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-terminal-border h-2.5 overflow-hidden">
                        <div className="bg-terminal-primary h-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TerminalCard>
          </div>
        )}
      </div>
    </div>
  )
}
