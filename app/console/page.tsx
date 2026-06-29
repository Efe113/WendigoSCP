'use client'

import React, { useActionState, useEffect, useRef, useState } from 'react'
import { createScpItem } from '@/app/actions/scp'
import { calculateEscalatedClearance } from '@/utils/clearanceCalculator'
import TerminalCard from '@/components/TerminalCard'
import ScpMarkdown from '@/components/ScpMarkdown'
import { ShieldAlert, CheckCircle, Database, Eye, Settings, Heart, Lock, AlertTriangle } from 'lucide-react'

const initialState = {
  success: false,
  error: '',
}

interface LocalAddendum {
  title: string
  type: string
  content: string
  clearance_level_required: number
}

interface LocalResource {
  url: string
  type: string
  caption: string
}

export default function ConsolePage() {
  const [state, formAction, isPending] = useActionState(createScpItem, initialState as any)
  const formRef = useRef<HTMLFormElement>(null)

  // Core input states (for Live Preview)
  const [procedures, setProcedures] = useState('')
  const [description, setDescription] = useState('')

  // Local state for interactive builders
  const [addenda, setAddenda] = useState<LocalAddendum[]>([])
  const [resources, setResources] = useState<LocalResource[]>([])

  // Collapsible metadata sections
  const [metaTab, setMetaTab] = useState<'class' | 'phys' | 'contain' | 'admin'>('class')
  const [rightTab, setRightTab] = useState<'preview' | 'specs'>('preview')

  // The 40+ metadata fields state
  const [metadata, setMetadata] = useState({
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
  })

  const [baseClearance, setBaseClearance] = useState(3)
  const escalatedClearance = calculateEscalatedClearance(baseClearance, metadata)

  // Temporary inputs for builders
  const [newAddendum, setNewAddendum] = useState<LocalAddendum>({
    title: '',
    type: 'addendum',
    content: '',
    clearance_level_required: 1,
  })
  const [newResource, setNewResource] = useState<LocalResource>({
    url: '',
    type: 'image',
    caption: '',
  })

  // Clear form and builders on success
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      setAddenda([])
      setResources([])
      setProcedures('')
      setDescription('')
    }
  }, [state])

  const handleAddAddendum = () => {
    if (!newAddendum.title || !newAddendum.content) return
    setAddenda([...addenda, newAddendum])
    setNewAddendum({
      title: '',
      type: 'addendum',
      content: '',
      clearance_level_required: 1,
    })
  }

  const handleAddResource = () => {
    if (!newResource.url) return
    setResources([...resources, newResource])
    setNewResource({
      url: '',
      type: 'image',
      caption: '',
    })
  }

  const updateMetaField = (key: string, value: string) => {
    setMetadata((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="font-mono text-xs leading-relaxed space-y-6">
      <div className="border border-terminal-border bg-black/50 p-4">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <Database className="w-4 h-4" /> BATCH DATA INGESTION UPLINK // OVERSEER SPECS
        </div>
        <p className="text-terminal-primary/75">
          THIS CONSOLE INTERCEPT SUPPORTS LIVE SIDE-BY-SIDE MARKUP RENDERING AND FULL SPECIFICATION INGRESS FOR OVER 40 TECHNICAL SUB-METRIC VARIABLES.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form & 40 Fields */}
        <div className="space-y-6">
          <TerminalCard title="SUBJECT DATA BUILDER" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
            <form ref={formRef} action={formAction} className="space-y-4">
              {/* Hidden Serialized Fields */}
              <input type="hidden" name="addenda_json" value={JSON.stringify(addenda)} />
              <input type="hidden" name="resources_json" value={JSON.stringify(resources)} />
              <input type="hidden" name="metadata_json" value={JSON.stringify(metadata)} />

              {/* Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-terminal-primary/65 mb-1">ITEM_NUMBER</label>
                  <input type="text" name="item_number" required placeholder="e.g. SCP-173" className="w-full px-2.5 py-1.5 text-xs uppercase" />
                </div>
                <div>
                  <label className="block text-terminal-primary/65 mb-1">CODENAME</label>
                  <input type="text" name="codename" required placeholder="e.g. The Sculpture" className="w-full px-2.5 py-1.5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-terminal-primary/65 mb-1">OBJECT_CLASS</label>
                  <select name="object_class" required className="w-full px-2.5 py-1.5 text-xs bg-black text-terminal-primary border border-terminal-border">
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

              {/* Collapsible Sections for 40 Metadata Fields */}
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

              {/* Textareas with hooks for live preview */}
              <div>
                <label className="block text-terminal-primary/65 mb-1.5">SPECIAL CONTAINMENT PROCEDURES</label>
                <textarea
                  name="containment_procedures"
                  rows={4}
                  required
                  value={procedures}
                  onChange={(e) => setProcedures(e.target.value)}
                  placeholder="Supports custom markup (e.g. [warn], [redacted], [ecg], [stamp-approved] etc.)"
                  className="w-full px-2.5 py-2 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-terminal-primary/65 mb-1.5">DESCRIPTION</label>
                <textarea
                  name="description"
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Supports custom markup (e.g. [glitch], ||spoilers||, [dept-research] etc.)"
                  className="w-full px-2.5 py-2 text-xs"
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
                  <span>ALL PROFILE, REPORT, AND MEDIA BLOCKS INGESTED WITH TECHNICAL SPECS.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-terminal-primary text-black font-bold uppercase tracking-widest text-xs border border-terminal-primary hover:bg-black hover:text-terminal-primary transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'PROCESSING TRANSACTION INGESTION...' : 'INITIATE COMPREHENSIVE DB INGESTION'}
              </button>
            </form>
          </TerminalCard>

          {/* Collapsible Addenda & Media Bundlers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Addenda list builder */}
            <TerminalCard title="ADDENDA BUNDLER">
              <div className="space-y-3">
                {addenda.map((ad, idx) => (
                  <div key={idx} className="flex justify-between border border-terminal-border/20 p-1.5 bg-black/40">
                    <span className="truncate max-w-[130px] font-bold text-white uppercase">{ad.title}</span>
                    <button type="button" onClick={() => setAddenda(addenda.filter((_, i) => i !== idx))} className="text-terminal-error hover:text-red-400">REMOVE</button>
                  </div>
                ))}
                <div className="border-t border-terminal-border/20 pt-2 space-y-2 text-[10px]">
                  <input type="text" placeholder="Title" value={newAddendum.title} onChange={(e) => setNewAddendum({ ...newAddendum, title: e.target.value })} className="w-full px-2 py-1 text-xs" />
                  <textarea placeholder="Content" value={newAddendum.content} onChange={(e) => setNewAddendum({ ...newAddendum, content: e.target.value })} rows={2} className="w-full px-2 py-1 text-xs" />
                  <button type="button" onClick={handleAddAddendum} className="w-full py-1 border border-terminal-primary hover:bg-terminal-primary hover:text-black transition-colors font-bold uppercase">ADD ADDENDUM</button>
                </div>
              </div>
            </TerminalCard>

            {/* Media list builder */}
            <TerminalCard title="MEDIA BUNDLER">
              <div className="space-y-3">
                {resources.map((res, idx) => (
                  <div key={idx} className="flex justify-between border border-terminal-border/20 p-1.5 bg-black/40">
                    <span className="truncate max-w-[130px] font-bold text-white">{res.caption || 'Media File'}</span>
                    <button type="button" onClick={() => setResources(resources.filter((_, i) => i !== idx))} className="text-terminal-error hover:text-red-400">REMOVE</button>
                  </div>
                ))}
                <div className="border-t border-terminal-border/20 pt-2 space-y-2 text-[10px]">
                  <input type="text" placeholder="Media URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} className="w-full px-2 py-1 text-xs" />
                  <input type="text" placeholder="Caption" value={newResource.caption} onChange={(e) => setNewResource({ ...newResource, caption: e.target.value })} className="w-full px-2 py-1 text-xs" />
                  <select value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })} className="w-full px-2 py-1 bg-black text-terminal-primary border border-terminal-border/40 text-xs">
                    <option value="image">Image (png/jpg)</option>
                    <option value="audio">Audio (mp3/ogg)</option>
                  </select>
                  <button type="button" onClick={handleAddResource} className="w-full py-1 border border-terminal-primary hover:bg-terminal-primary hover:text-black transition-colors font-bold uppercase">ADD MEDIA</button>
                </div>
              </div>
            </TerminalCard>
          </div>
        </div>

        {/* Right Column: Live Preview & Specifications Tab */}
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
                      {procedures ? <ScpMarkdown content={procedures} /> : <span className="text-terminal-primary/30 italic">Ingress protocols text to trigger live preview compile...</span>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white border-b border-terminal-border/20 pb-1 uppercase tracking-wider">DESCRIPTION</h3>
                    <div className="mt-2 min-h-[50px] leading-relaxed">
                      {description ? <ScpMarkdown content={description} /> : <span className="text-terminal-primary/30 italic">Ingress description text to trigger live preview compile...</span>}
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
                      <span className="font-bold text-white uppercase truncate max-w-[140px]" title={val || 'None'}>{val || 'None'}</span>
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
