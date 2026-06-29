'use client'

import React, { useActionState, useTransition, useState } from 'react'
import { updateScpItem, addAddendum, deleteAddendum, addResource, deleteResource } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import ScpMarkdown from '@/components/ScpMarkdown'
import { calculateEscalatedClearance } from '@/utils/clearanceCalculator'
import { ShieldAlert, CheckCircle, Trash2, Plus, ArrowLeft, Database, FileText, Image, Volume2, Eye, Settings } from 'lucide-react'
import Link from 'next/link'

interface ScpItem {
  id: string
  item_number: string
  codename: string
  object_class: string
  clearance_level_required: number
  containment_procedures: string
  description: string
  metadata?: any
}

interface Addendum {
  id: string
  title: string
  content: string
  type: string
  clearance_level_required: number
}

interface Resource {
  id: string
  caption: string
  url: string
  type: string
}

interface ScpEditConsoleProps {
  item: ScpItem
  addenda: Addendum[]
  resources: Resource[]
}

const initialEditState = { success: false, error: '' }
const initialAddendumState = { success: false, error: '' }
const initialResourceState = { success: false, error: '' }

export default function ScpEditConsole({ item, addenda, resources }: ScpEditConsoleProps) {
  const [editState, editAction, isEditPending] = useActionState(updateScpItem, initialEditState as any)
  const [addendumState, addendumAction, isAddendumPending] = useActionState(addAddendum, initialAddendumState as any)
  const [resourceState, resourceAction, isResourcePending] = useActionState(addResource, initialResourceState as any)
  const [isPending, startTransition] = useTransition()

  // Live Preview textareas state
  const [procedures, setProcedures] = useState(item.containment_procedures || '')
  const [description, setDescription] = useState(item.description || '')

  // Collapsible metadata sections
  const [metaTab, setMetaTab] = useState<'class' | 'phys' | 'contain' | 'admin'>('class')
  const [rightTab, setRightTab] = useState<'preview' | 'specs'>('preview')

  // The 40+ metadata fields state prefilled with existing metadata
  const [metadata, setMetadata] = useState<any>(() => {
    const defaultMeta = {
      threat_level: 'White',
      disruption_class: 'Dark',
      risk_class: 'Notice',
      secondary_class: '',
      active_site: 'Site-19',
      area_director: '',
      recovery_date: '',
      recovery_location: '',
      recovery_lead: '',
      primary_anomaly: '',
      material_composition: '',
      cognitive_threat: 'No',
      biological_hazard: 'No',
      temporal_hazard: 'No',
      memetic_hazard: 'No',
      radioactive_level: 'Negligible',
      sentience_status: 'Non-Sentient',
      nutrition_diet: 'None',
      dimensions_volume: '',
      weight_mass: '',
      temperature_limit: 'Room Temp',
      pressure_limit: '1 atm',
      humidity_limit: 'Ambient',
      em_shielding: 'No',
      tactical_guards: '2',
      psych_eval: 'No',
      cross_testing: 'Suspended',
      termination_protocol: 'No',
      alternate_dimension: 'No',
      communication_method: 'None',
      containment_cost: '',
      incident_log_count: '0',
      security_notes: '',
      ethics_clearance: 'No',
      last_audit_date: '',
      system_sync_status: 'Yes',
      researcher_signature: '',
      authorized_weapons: 'None',
      amnestic_protocol: 'Class-A',
      tactical_clearance: 'Standard',
    }
    return { ...defaultMeta, ...(item.metadata || {}) }
  })

  const [baseClearance, setBaseClearance] = useState(item.clearance_level_required || 3)
  const escalatedClearance = calculateEscalatedClearance(baseClearance, metadata)

  const updateMetaField = (key: string, value: string) => {
    setMetadata((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleDeleteAddendum = (id: string) => {
    if (confirm('Are you sure you want to delete this addendum?')) {
      startTransition(async () => {
        await deleteAddendum(id, item.item_number)
      })
    }
  }

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this media resource?')) {
      startTransition(async () => {
        await deleteResource(id, item.item_number)
      })
    }
  }

  return (
    <div className="space-y-6 font-mono text-xs leading-relaxed">
      <div className="flex justify-between items-center">
        <Link
          href={`/scp/${item.item_number.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO FILE
        </Link>
        <span className="text-[10px] text-terminal-error animate-pulse font-bold border border-terminal-error px-2 py-0.5">
          ADMINISTRATOR ACCESS - SECURE EDIT MODE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column: Main edit form + builders */}
        <div className="space-y-6">
          <TerminalCard title="EDIT CORE ARCHIVE RECORD" status={editState?.error ? 'error' : editState?.success ? 'success' : 'default'}>
            <form action={editAction} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="metadata_json" value={JSON.stringify(metadata)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-terminal-primary/65 mb-1">ITEM_NUMBER</label>
                  <input type="text" name="item_number" defaultValue={item.item_number} required className="w-full px-2.5 py-1.5 text-xs uppercase" />
                </div>
                <div>
                  <label className="block text-terminal-primary/65 mb-1">CODENAME</label>
                  <input type="text" name="codename" defaultValue={item.codename} required className="w-full px-2.5 py-1.5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-terminal-primary/65 mb-1">OBJECT_CLASS</label>
                  <select name="object_class" defaultValue={item.object_class} required className="w-full px-2.5 py-1.5 text-xs bg-black text-terminal-primary border border-terminal-border">
                    <option value="Safe">Safe</option>
                    <option value="Euclid">Euclid</option>
                    <option value="Keter">Keter</option>
                    <option value="Thaumiel">Thaumiel</option>
                    <option value="Apollyon">Apollyon</option>
                    <option value="Neutralized">Neutralized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-terminal-primary/65 mb-1">BASE CLEARANCE LEVEL</label>
                  <select
                    name="clearance_level_required"
                    value={baseClearance}
                    onChange={(e) => setBaseClearance(Number(e.target.value))}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-black text-terminal-primary border border-terminal-border cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>Level {l}</option>
                    ))}
                  </select>
                  {escalatedClearance !== baseClearance && (
                    <div className="mt-1 text-[10px] text-terminal-warn animate-pulse font-bold">
                      &#9888; ESCALATED LEVEL: LEVEL {escalatedClearance} (RISK DETECTED)
                    </div>
                  )}
                </div>
              </div>

              {/* 40+ sub-metric variables */}
              <div className="border border-terminal-border bg-black/40 p-3.5 space-y-4">
                <div className="text-[10px] text-white font-bold border-b border-terminal-border/20 pb-1.5 uppercase flex justify-between items-center">
                  <span>Technical Sub-Metrics (40+ Variables)</span>
                  <div className="flex gap-2">
                    {['class', 'phys', 'contain', 'admin'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMetaTab(t as any)}
                        className={`px-2 py-0.5 border text-[9px] cursor-pointer ${
                          metaTab === t ? 'border-terminal-primary bg-terminal-primary/10 text-white' : 'border-transparent text-terminal-primary/60'
                        }`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Metric Panels */}
                {metaTab === 'class' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">THREAT_LEVEL</label>
                      <select value={metadata.threat_level} onChange={(e) => updateMetaField('threat_level', e.target.value)} className="w-full px-2 py-1 bg-black text-terminal-primary border border-terminal-border/50 text-[10px]">
                        {['White', 'Blue', 'Green', 'Yellow', 'Orange', 'Red', 'Black'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">DISRUPTION_CLASS</label>
                      <select value={metadata.disruption_class} onChange={(e) => updateMetaField('disruption_class', e.target.value)} className="w-full px-2 py-1 bg-black text-terminal-primary border border-terminal-border/50 text-[10px]">
                        {['Dark', 'Vlam', 'Keneq', 'Ekhi', 'Amida'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RISK_CLASS</label>
                      <select value={metadata.risk_class} onChange={(e) => updateMetaField('risk_class', e.target.value)} className="w-full px-2 py-1 bg-black text-terminal-primary border border-terminal-border/50 text-[10px]">
                        {['Notice', 'Caution', 'Warning', 'Danger', 'Critical'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">SECONDARY_CLASS</label>
                      <input type="text" value={metadata.secondary_class} onChange={(e) => updateMetaField('secondary_class', e.target.value)} placeholder="e.g. None" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">ACTIVE_SITE</label>
                      <input type="text" value={metadata.active_site} onChange={(e) => updateMetaField('active_site', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">SITE_DIRECTOR</label>
                      <input type="text" value={metadata.area_director} onChange={(e) => updateMetaField('area_director', e.target.value)} placeholder="Dr. Gerald" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RECOVERY_DATE</label>
                      <input type="text" value={metadata.recovery_date} onChange={(e) => updateMetaField('recovery_date', e.target.value)} placeholder="e.g. 1993-05-12" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RECOVERY_LOCATION</label>
                      <input type="text" value={metadata.recovery_location} onChange={(e) => updateMetaField('recovery_location', e.target.value)} placeholder="e.g. Munich, Germany" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RECOVERY_LEAD</label>
                      <input type="text" value={metadata.recovery_lead} onChange={(e) => updateMetaField('recovery_lead', e.target.value)} placeholder="e.g. Agent Vance" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">PRIMARY_ANOMALY</label>
                      <input type="text" value={metadata.primary_anomaly} onChange={(e) => updateMetaField('primary_anomaly', e.target.value)} placeholder="e.g. Kinetic duplication" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                  </div>
                )}

                {metaTab === 'phys' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">MATERIAL_COMPOSITION</label>
                      <input type="text" value={metadata.material_composition} onChange={(e) => updateMetaField('material_composition', e.target.value)} placeholder="e.g. Concrete, Rebar" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">COGNITIVE_THREAT</label>
                      <select value={metadata.cognitive_threat} onChange={(e) => updateMetaField('cognitive_threat', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">BIOLOGICAL_HAZARD</label>
                      <select value={metadata.biological_hazard} onChange={(e) => updateMetaField('biological_hazard', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">TEMPORAL_HAZARD</label>
                      <select value={metadata.temporal_hazard} onChange={(e) => updateMetaField('temporal_hazard', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">MEMETIC_HAZARD</label>
                      <select value={metadata.memetic_hazard} onChange={(e) => updateMetaField('memetic_hazard', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RADIOACTIVE_LEVEL</label>
                      <input type="text" value={metadata.radioactive_level} onChange={(e) => updateMetaField('radioactive_level', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">SENTIENCE_STATUS</label>
                      <select value={metadata.sentience_status} onChange={(e) => updateMetaField('sentience_status', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Sentient">Sentient</option>
                        <option value="Sapient">Sapient</option>
                        <option value="Non-Sentient">Non-Sentient</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">DIET_NUTRITION</label>
                      <input type="text" value={metadata.nutrition_diet} onChange={(e) => updateMetaField('nutrition_diet', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">DIMENSIONS_VOLUME</label>
                      <input type="text" value={metadata.dimensions_volume} onChange={(e) => updateMetaField('dimensions_volume', e.target.value)} placeholder="e.g. 2.4m x 1.2m" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">WEIGHT_MASS</label>
                      <input type="text" value={metadata.weight_mass} onChange={(e) => updateMetaField('weight_mass', e.target.value)} placeholder="e.g. 150 kg" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                  </div>
                )}

                {metaTab === 'contain' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">TEMPERATURE_RESTRICTION</label>
                      <input type="text" value={metadata.temperature_limit} onChange={(e) => updateMetaField('temperature_limit', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">PRESSURE_RESTRICTION</label>
                      <input type="text" value={metadata.pressure_limit} onChange={(e) => updateMetaField('pressure_limit', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">HUMIDITY_RESTRICTION</label>
                      <input type="text" value={metadata.humidity_limit} onChange={(e) => updateMetaField('humidity_limit', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">EM_SHIELDING</label>
                      <select value={metadata.em_shielding} onChange={(e) => updateMetaField('em_shielding', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">TACTICAL_GUARDS_COUNT</label>
                      <input type="text" value={metadata.tactical_guards} onChange={(e) => updateMetaField('tactical_guards', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">WEEKLY_PSYCH_EVAL</label>
                      <select value={metadata.psych_eval} onChange={(e) => updateMetaField('psych_eval', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">CROSS_TESTING</label>
                      <select value={metadata.cross_testing} onChange={(e) => updateMetaField('cross_testing', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Authorized">Authorized</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Prohibited">Prohibited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">TERMINATION_PROTOCOL</label>
                      <select value={metadata.termination_protocol} onChange={(e) => updateMetaField('termination_protocol', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">ALTERNATE_DIMENSION_ORIGIN</label>
                      <select value={metadata.alternate_dimension} onChange={(e) => updateMetaField('alternate_dimension', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">COMMUNICATION_METHOD</label>
                      <input type="text" value={metadata.communication_method} onChange={(e) => updateMetaField('communication_method', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                  </div>
                )}

                {metaTab === 'admin' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">ANNUAL_COST_USD</label>
                      <input type="text" value={metadata.containment_cost} onChange={(e) => updateMetaField('containment_cost', e.target.value)} placeholder="$50,000" className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">INCIDENT_LOGS_COUNT</label>
                      <input type="text" value={metadata.incident_log_count} onChange={(e) => updateMetaField('incident_log_count', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">SECURITY_OFFICER_NOTES</label>
                      <input type="text" value={metadata.security_notes} onChange={(e) => updateMetaField('security_notes', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">ETHICS_CLEARANCE_CHECK</label>
                      <select value={metadata.ethics_clearance} onChange={(e) => updateMetaField('ethics_clearance', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">LAST_AUDIT_DATE</label>
                      <input type="text" value={metadata.last_audit_date} onChange={(e) => updateMetaField('last_audit_date', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">SYSTEM_SYNC_STATUS</label>
                      <select value={metadata.system_sync_status} onChange={(e) => updateMetaField('system_sync_status', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">RESEARCHER_SIGNATURE</label>
                      <input type="text" value={metadata.researcher_signature} onChange={(e) => updateMetaField('researcher_signature', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">AUTHORIZED_WEAPONS</label>
                      <input type="text" value={metadata.authorized_weapons} onChange={(e) => updateMetaField('authorized_weapons', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">AMNESTIC_PROTOCOL_REQ</label>
                      <input type="text" value={metadata.amnestic_protocol} onChange={(e) => updateMetaField('amnestic_protocol', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                    <div>
                      <label className="block text-terminal-primary/50 text-[10px] mb-0.5">TACTICAL_CLEARANCE</label>
                      <input type="text" value={metadata.tactical_clearance} onChange={(e) => updateMetaField('tactical_clearance', e.target.value)} className="w-full px-2 py-1 bg-black border border-terminal-border/50 text-[10px]" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-terminal-primary/65 mb-1">SPECIAL CONTAINMENT PROCEDURES</label>
                <textarea
                  name="containment_procedures"
                  rows={4}
                  required
                  value={procedures}
                  onChange={(e) => setProcedures(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-terminal-primary/65 mb-1">DESCRIPTION</label>
                <textarea
                  name="description"
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs"
                ></textarea>
              </div>

              {editState?.error && (
                <div className="border border-terminal-error bg-terminal-error/10 p-3 text-terminal-error flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  <span>{editState.error}</span>
                </div>
              )}

              {editState?.success && (
                <div className="border border-terminal-primary bg-terminal-primary/10 p-3 text-terminal-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>RECORD MUTATED SUCCESSFULLY IN DATABASE. ARCHIVE REINDEXED.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isEditPending}
                className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
              >
                {isEditPending ? 'COMMITING CHANGES...' : 'SAVE RECORD CHANGES'}
              </button>
            </form>
          </TerminalCard>

          {/* Addenda & Media Bundlers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TerminalCard title="ADDENDA CONTROL PANEL" status={addendumState?.error ? 'error' : addendumState?.success ? 'success' : 'default'}>
              <div className="space-y-4">
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  <span className="text-[10px] text-terminal-primary/50 block font-bold">CURRENT ADDENDA</span>
                  {addenda.map((ad) => (
                    <div key={ad.id} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[11px]">
                      <span className="truncate max-w-[150px]">{ad.title}</span>
                      <button type="button" onClick={() => handleDeleteAddendum(ad.id)} className="text-terminal-error hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <form action={addendumAction} className="border-t border-terminal-border/20 pt-3 space-y-2 text-[10px]">
                  <input type="hidden" name="scp_item_id" value={item.id} />
                  <input type="hidden" name="item_number" value={item.item_number} />
                  <input type="text" name="title" required placeholder="Title" className="w-full px-2 py-1 text-xs" />
                  <textarea name="content" required placeholder="Content" rows={2} className="w-full px-2 py-1 text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                    <select name="type" required className="w-full px-2 py-1 bg-black border border-terminal-border/40 text-xs">
                      <option value="addendum">Addendum</option>
                      <option value="report">Report</option>
                      <option value="incident_log">Incident Log</option>
                      <option value="interview">Interview</option>
                    </select>
                    <select name="clearance_level_required" required className="w-full px-2 py-1 bg-black border border-terminal-border/40 text-xs">
                      {[1,2,3,4,5].map(l => <option key={l} value={l}>L{l}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={isAddendumPending} className="w-full py-1 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-all text-[10px] font-bold">ATTACH ADDENDUM</button>
                </form>
              </div>
            </TerminalCard>

            <TerminalCard title="MEDIA ATTACHMENTS" status={resourceState?.error ? 'error' : resourceState?.success ? 'success' : 'default'}>
              <div className="space-y-4">
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  <span className="text-[10px] text-terminal-primary/50 block font-bold">CURRENT ATTACHMENTS</span>
                  {resources.map((res) => (
                    <div key={res.id} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[11px]">
                      <span className="truncate max-w-[130px]">{res.caption || 'Media File'}</span>
                      <button type="button" onClick={() => handleDeleteResource(res.id)} className="text-terminal-error hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <form action={resourceAction} className="border-t border-terminal-border/20 pt-3 space-y-2 text-[10px]">
                  <input type="hidden" name="scp_item_id" value={item.id} />
                  <input type="hidden" name="item_number" value={item.item_number} />
                  <input type="text" name="url" required placeholder="Media URL" className="w-full px-2 py-1 text-xs" />
                  <input type="text" name="caption" placeholder="Caption" className="w-full px-2 py-1 text-xs" />
                  <select name="type" required className="w-full px-2 py-1 bg-black border border-terminal-border/40 text-xs">
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                  </select>
                  <button type="submit" disabled={isResourcePending} className="w-full py-1 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-all text-[10px] font-bold">ATTACH MEDIA</button>
                </form>
              </div>
            </TerminalCard>
          </div>
        </div>

        {/* Right column: Live Preview & Specifications Tab */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <div className="flex border-b border-terminal-border">
            <button
              onClick={() => setRightTab('preview')}
              className={`flex items-center gap-1.5 px-4 py-2 border-t border-x hover:bg-terminal-primary/5 transition-colors cursor-pointer ${
                rightTab === 'preview' ? 'bg-black text-terminal-primary border-terminal-border border-b-black -mb-[1px]' : 'text-terminal-primary/60 border-transparent'
              }`}
            >
              <Eye className="w-4 h-4" /> LIVE PREVIEW FEED
            </button>
            <button
              onClick={() => setRightTab('specs')}
              className={`flex items-center gap-1.5 px-4 py-2 border-t border-x hover:bg-terminal-primary/5 transition-colors cursor-pointer ${
                rightTab === 'specs' ? 'bg-black text-terminal-primary border-terminal-border border-b-black -mb-[1px]' : 'text-terminal-primary/60 border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" /> METRICS SUMMARY
            </button>
          </div>

          <div className="min-h-[400px]">
            {rightTab === 'preview' ? (
              <div className="border border-terminal-border bg-black/60 p-4 min-h-[450px] max-h-[800px] overflow-y-auto space-y-4 shadow-[0_0_15px_rgba(0,255,102,0.05)] relative">
                <div className="absolute top-2 right-2 text-[9px] text-terminal-primary/40 animate-pulse flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 bg-terminal-primary rounded-full animate-ping"></span>
                  LIVE FEED RENDER ACTIVE
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white border-b border-terminal-border/20 pb-1 uppercase tracking-wider">SPECIAL CONTAINMENT PROCEDURES</h3>
                    <div className="mt-2 min-h-[50px] leading-relaxed">
                      {procedures ? <ScpMarkdown content={procedures} /> : <span className="text-terminal-primary/30 italic">Ingress protocols text...</span>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white border-b border-terminal-border/20 pb-1 uppercase tracking-wider">DESCRIPTION</h3>
                    <div className="mt-2 min-h-[50px] leading-relaxed">
                      {description ? <ScpMarkdown content={description} /> : <span className="text-terminal-primary/30 italic">Ingress description text...</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <TerminalCard title="SPECIFICATIONS DECRPYTION FILE" statusText="SPEC_SHEET">
                <div className="grid grid-cols-2 gap-4 text-[10px] py-2 border-b border-terminal-border/20 mb-4">
                  {Object.entries(metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-terminal-border/10 pb-1">
                      <span className="text-terminal-primary/50 uppercase">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-white uppercase truncate max-w-[140px]" title={String(val || 'None')}>{String(val || 'None')}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-terminal-primary/50 text-center">SPEC SHEET RENDERING COMPLETE // ENCRYPTION OK</p>
              </TerminalCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
