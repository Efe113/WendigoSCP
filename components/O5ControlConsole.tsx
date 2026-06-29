'use client'

import React, { useState, useActionState, useTransition } from 'react'
import { updateUserStatus, updateSystemConfig, createCustomRole } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { Shield, ShieldAlert, CheckCircle, Radio, Settings, Users, FilePlus, BarChart2, Volume2, ShieldCheck, Zap, AlertTriangle, Eye, RefreshCw, RefreshCw as RotateCcw, ShieldAlert as DroneIcon, Cpu } from 'lucide-react'

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
  config: Record<string, string>
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
          { id: 'system', label: 'MAINFRAME CONFIG (40 OVERRIDES)', icon: Settings },
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
                <p className="text-center py-12 text-terminal-primary/50 text-xs">NO REGISTRATION REQUESTS DETECTED IN THE QUEUE.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
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

        {/* Tab 2: System Settings (40 Mainframe Commands Grid) */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <TerminalCard title="O5 SECURE MAINFRAME OVERRIDES HUB (40 CHANNELS)" status="error" statusText="O5_MAINFRAME">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2">
                {/* 1. Maintenance Mode */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">1. MAINTENANCE MODE</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.maintenance_mode === 'true' ? 'ACTIVE' : 'INACTIVE'}</span>
                    <button
                      onClick={() => handleConfigChange('maintenance_mode', config.maintenance_mode === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 2. Threat conditions */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">2. THREAT CONDITIONS</span>
                  <select
                    value={config.threat_level || 'LEVEL_GREEN'}
                    onChange={(e) => handleConfigChange('threat_level', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="LEVEL_GREEN">LEVEL_GREEN (SAFE)</option>
                    <option value="LEVEL_YELLOW">LEVEL_YELLOW (EUCLID)</option>
                    <option value="LEVEL_RED">LEVEL_RED (KETER)</option>
                    <option value="LEVEL_BLACK">LEVEL_BLACK (APOLLYON)</option>
                  </select>
                </div>

                {/* 3. Red Alert */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-red-500" /> 3. RED ALERT CLAXON</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.red_alert === 'true' ? 'ACTIVE' : 'MUTED'}</span>
                    <button
                      onClick={() => handleConfigChange('red_alert', config.red_alert === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 4. Power Blackout */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-500" /> 4. POWER BLACKOUT</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.blackout_mode === 'true' ? 'BLACKOUT' : 'ONLINE'}</span>
                    <button
                      onClick={() => handleConfigChange('blackout_mode', config.blackout_mode === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 5. Alpha Warhead protocol */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /> 5. ALPHA WARHEAD PROTOCOL</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.alpha_warhead_active === 'true' ? 'ARMED' : 'SAFE'}</span>
                    <button
                      onClick={() => handleConfigChange('alpha_warhead_active', config.alpha_warhead_active === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 6. Alpha warhead timer */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">6. WARHEAD COUNTDOWN</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={config.alpha_warhead_time || '90'}
                      onChange={(e) => handleConfigChange('alpha_warhead_time', e.target.value)}
                      disabled={isPending}
                      className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                    />
                    <span className="text-[9px] text-terminal-primary/50 self-center">SEC</span>
                  </div>
                </div>

                {/* 7. MTF Dispatch */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">7. MTF DISPATCH</span>
                  <select
                    value={config.mtf_dispatched || 'None'}
                    onChange={(e) => handleConfigChange('mtf_dispatched', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="None">None</option>
                    <option value="Alpha-1">MTF Alpha-1 (Red Right Hand)</option>
                    <option value="Epsilon-11">MTF Epsilon-11 (Nine-Tailed Fox)</option>
                    <option value="Omega-7">MTF Omega-7 (Pandora's Box)</option>
                    <option value="Tau-5">MTF Tau-5 (Samsara)</option>
                  </select>
                </div>

                {/* 8. Ethics Audits */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">8. ETHICS AUDITS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.ethics_audits === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('ethics_audits', config.ethics_audits === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 9. Security Alarm */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">9. SECURITY ALARM</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.security_alarm === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('security_alarm', config.security_alarm === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 10. Acoustic Warnings */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">10. ACOUSTIC BROADCAST</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.sound_warnings === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('sound_warnings', config.sound_warnings === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 11. Exposure warning */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">11. EXPOSURE WARN</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.exposure_warning === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('exposure_warning', config.exposure_warning === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 12. Amnestics A */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">12. AMNESTICS CLASS-A</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.amnestic_stock_a || '100'}
                      onChange={(e) => handleConfigChange('amnestic_stock_a', e.target.value)}
                      disabled={isPending}
                      className="w-full mr-2 cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-bold">{config.amnestic_stock_a || '100'}%</span>
                  </div>
                </div>

                {/* 13. Amnestics B */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">13. AMNESTICS CLASS-B</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.amnestic_stock_b || '100'}
                      onChange={(e) => handleConfigChange('amnestic_stock_b', e.target.value)}
                      disabled={isPending}
                      className="w-full mr-2 cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-bold">{config.amnestic_stock_b || '100'}%</span>
                  </div>
                </div>

                {/* 14. Amnestics C */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">14. AMNESTICS CLASS-C</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.amnestic_stock_c || '100'}
                      onChange={(e) => handleConfigChange('amnestic_stock_c', e.target.value)}
                      disabled={isPending}
                      className="w-full mr-2 cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-bold">{config.amnestic_stock_c || '100'}%</span>
                  </div>
                </div>

                {/* 15. Radiation Threshold */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">15. RAD THRESHOLD</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.radiation_threshold || '0.05'}
                      onChange={(e) => handleConfigChange('radiation_threshold', e.target.value)}
                      disabled={isPending}
                      className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                    />
                    <span className="text-[9px] text-terminal-primary/50 self-center">mSv</span>
                  </div>
                </div>

                {/* 16. Intruder attempts */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">16. INTRUSION LIMIT</span>
                  <input
                    type="number"
                    value={config.intrusion_attempts || '0'}
                    onChange={(e) => handleConfigChange('intrusion_attempts', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 17. Cognitohazard filter */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-1.5">
                  <span className="text-white font-bold block text-[10px] uppercase">17. COG FILTER STRENGTH</span>
                  <div className="flex justify-between items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.cog_filter_strength || '100'}
                      onChange={(e) => handleConfigChange('cog_filter_strength', e.target.value)}
                      disabled={isPending}
                      className="w-full mr-2 cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-bold">{config.cog_filter_strength || '100'}%</span>
                  </div>
                </div>

                {/* 18. Eval interval */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">18. EVAL INTERVAL</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={config.eval_interval_days || '30'}
                      onChange={(e) => handleConfigChange('eval_interval_days', e.target.value)}
                      disabled={isPending}
                      className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                    />
                    <span className="text-[9px] text-terminal-primary/50 self-center">DAYS</span>
                  </div>
                </div>

                {/* 19. Redaction Mode */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-cyan-400" /> 19. REDACTION MODE</span>
                  <select
                    value={config.redaction_level || 'hover'}
                    onChange={(e) => handleConfigChange('redaction_level', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="hover">Hover to decrypt</option>
                    <option value="absolute">Permanent blacked-out</option>
                  </select>
                </div>

                {/* 20. Scanline Type */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">20. SCANLINE TYPE</span>
                  <select
                    value={config.scanline_density || 'medium'}
                    onChange={(e) => handleConfigChange('scanline_density', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="low">Low density</option>
                    <option value="medium">Medium density</option>
                    <option value="high">High density</option>
                  </select>
                </div>

                {/* 21. Decontamination Active */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">21. DECON PROTOCOL</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.decontamination_active === 'true' ? 'ACTIVE' : 'MUTED'}</span>
                    <button
                      onClick={() => handleConfigChange('decontamination_active', config.decontamination_active === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 22. Neural Link established */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> 22. NEURAL BRAIN LINK</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.neural_link_established === 'true' ? 'LINKED' : 'UNLINKED'}</span>
                    <button
                      onClick={() => handleConfigChange('neural_link_established', config.neural_link_established === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 23. Containment Breach active */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /> 23. CORE BREACH STATUS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.containment_breach_active === 'true' ? 'BREACH' : 'SECURED'}</span>
                    <button
                      onClick={() => handleConfigChange('containment_breach_active', config.containment_breach_active === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 24. Breached SCP count */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">24. BREACHED SCP COUNT</span>
                  <input
                    type="number"
                    value={config.breached_scp_count || '0'}
                    onChange={(e) => handleConfigChange('breached_scp_count', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 25. Gate A status */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">25. GATE A DEFENSE</span>
                  <select
                    value={config.gate_a_status || 'LOCKED'}
                    onChange={(e) => handleConfigChange('gate_a_status', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="LOCKED">LOCKED (Standard)</option>
                    <option value="OPEN">OPEN (Evacuation)</option>
                    <option value="OVERRIDDEN">OVERRIDDEN (O5 Command)</option>
                  </select>
                </div>

                {/* 26. Gate B status */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">26. GATE B DEFENSE</span>
                  <select
                    value={config.gate_b_status || 'LOCKED'}
                    onChange={(e) => handleConfigChange('gate_b_status', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="LOCKED">LOCKED (Standard)</option>
                    <option value="OPEN">OPEN (Evacuation)</option>
                    <option value="OVERRIDDEN">OVERRIDDEN (O5 Command)</option>
                  </select>
                </div>

                {/* 27. Classified Watermark */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">27. WATERMARK</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.classified_watermark === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('classified_watermark', config.classified_watermark === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 28. Site-19 Power Source */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">28. GRID POWER SOURCE</span>
                  <select
                    value={config.site19_power_source || 'Nuclear Grid'}
                    onChange={(e) => handleConfigChange('site19_power_source', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="Nuclear Grid">Nuclear Reactor Node</option>
                    <option value="Geothermal">Geothermal Well</option>
                    <option value="Backup Generator">Hydro-Diesel Backup</option>
                  </select>
                </div>

                {/* 29. Hologram Projectors */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">29. HOLO PROJECTORS</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STAMPS: {config.hologram_projectors === 'true' ? 'ON' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('hologram_projectors', config.hologram_projectors === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 30. Amnestic dispenser valve */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">30. AMNESTICS VALVE</span>
                  <select
                    value={config.amnestic_dispenser_valve || 'CLOSED'}
                    onChange={(e) => handleConfigChange('amnestic_dispenser_valve', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="CLOSED">CLOSED (Secured)</option>
                    <option value="OPEN">OPEN (Gaseous Dispensation)</option>
                  </select>
                </div>

                {/* 31. Nuclear Silo status */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">31. SILO STATUS</span>
                  <select
                    value={config.nuclear_silo_status || 'SECURED'}
                    onChange={(e) => handleConfigChange('nuclear_silo_status', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="SECURED">SECURED (Silo Blocked)</option>
                    <option value="ARMED">ARMED (Silo Open)</option>
                  </select>
                </div>

                {/* 32. Cognitive shield frequency */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">32. COG SHIELD FREQ</span>
                  <input
                    type="text"
                    value={config.cognitive_shield_frequency || '14.8Hz'}
                    onChange={(e) => handleConfigChange('cognitive_shield_frequency', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 33. Bio decon level */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">33. BIO DECON LEVEL</span>
                  <select
                    value={config.biological_decon_level || 'Level 2'}
                    onChange={(e) => handleConfigChange('biological_decon_level', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    <option value="Level 1">Level 1 (Standard)</option>
                    <option value="Level 2">Level 2 (Quarantine)</option>
                    <option value="Level 3">Level 3 (Sterile)</option>
                    <option value="Level 4">Level 4 (Vacuum Seal)</option>
                    <option value="Level 5">Level 5 (Incinerate)</option>
                  </select>
                </div>

                {/* 34. Security drone patrol */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase flex items-center gap-1"><DroneIcon className="w-3.5 h-3.5 text-cyan-400" /> 34. DRONE PATROL</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.security_drone_patrol === 'true' ? 'ACTIVE' : 'MUTED'}</span>
                    <button
                      onClick={() => handleConfigChange('security_drone_patrol', config.security_drone_patrol === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 35. Backup grid power */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">35. BACKUP POWER</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.site_grid_backup === 'true' ? 'ONLINE' : 'OFFLINE'}</span>
                    <button
                      onClick={() => handleConfigChange('site_grid_backup', config.site_grid_backup === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 36. Global research clearance limits */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">36. GLOBAL LEVEL LIMIT</span>
                  <select
                    value={config.research_level_limit || '5'}
                    onChange={(e) => handleConfigChange('research_level_limit', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  >
                    {[1,2,3,4,5].map(l => <option key={l} value={String(l)}>Limit Level {l}</option>)}
                  </select>
                </div>

                {/* 37. Cross testing moratorium */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">37. CROSS MORATORIUM</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.cross_testing_moratorium === 'true' ? 'ACTIVE' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('cross_testing_moratorium', config.cross_testing_moratorium === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 38. Anomaly scanner pulse */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">38. SCANNER RATE</span>
                  <input
                    type="text"
                    value={config.anomaly_scanner_pulse || '2.5s'}
                    onChange={(e) => handleConfigChange('anomaly_scanner_pulse', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>

                {/* 39. Staff evaluation moratorium */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">39. EVAL MORATORIUM</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span>STATUS: {config.staff_evaluation_moratorium === 'true' ? 'ACTIVE' : 'OFF'}</span>
                    <button
                      onClick={() => handleConfigChange('staff_evaluation_moratorium', config.staff_evaluation_moratorium === 'true' ? 'false' : 'true')}
                      disabled={isPending}
                      className="px-2 py-0.5 border border-terminal-primary text-[9px] font-bold"
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* 40. Amnestic injection dosage */}
                <div className="border border-terminal-border/40 p-2.5 bg-black/40 space-y-2">
                  <span className="text-white font-bold block text-[10px] uppercase">40. AMNESTICS DOSAGE</span>
                  <input
                    type="text"
                    value={config.amnestic_injection_dosage || '15ml'}
                    onChange={(e) => handleConfigChange('amnestic_injection_dosage', e.target.value)}
                    disabled={isPending}
                    className="w-full bg-black text-terminal-primary border border-terminal-border/40 text-[10px] px-2 py-0.5"
                  />
                </div>
              </div>
            </TerminalCard>

            {/* Simulated Class-A Amnestics wipe */}
            <div className="border border-terminal-border bg-black/45 p-4 flex justify-between items-center text-xs">
              <span className="text-terminal-primary/75">SYSTEM COMMAND CHANNEL // WIPE CURRENT AUTHORIZATION SESSION</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Initiate Class-A memory wipe? This will clear local authorization cookies and log you out.')) {
                    document.cookie.split(";").forEach(function(c) { 
                      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                    });
                    window.location.href = '/login';
                  }
                }}
                className="px-4 py-2 bg-red-950/20 hover:bg-terminal-error hover:text-black border border-terminal-error/45 text-xs font-bold uppercase transition-colors"
              >
                DISPENSE AMNESTICS (WIPE COOKIES)
              </button>
            </div>
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
              <div className="space-y-3 py-1 text-xs">
                {Object.entries(professionCounts).map(([prof, count]) => {
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
                  return (
                    <div key={prof} className="space-y-1">
                      <div className="flex justify-between font-bold text-white uppercase text-[10px]">
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
              <div className="space-y-3 py-1 text-xs">
                {Object.entries(rankCounts).map(([rank, count]) => {
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0
                  return (
                    <div key={rank} className="space-y-1">
                      <div className="flex justify-between font-bold text-white uppercase text-[10px]">
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
