import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import ScpMarkdown from '@/components/ScpMarkdown'
import TerminalImageFrame from '@/components/TerminalImageFrame'
import TerminalAudioPlayer from '@/components/TerminalAudioPlayer'
import DeleteScpButton from '@/components/DeleteScpButton'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ShieldAlert, Edit, HelpCircle, HardDrive, Shield, Calendar, Database, AlertOctagon, Skull, Thermometer, Wind, Eye, Compass, UserCheck, ShieldClose } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 0 // Disable page caching for real-time metadata syncing

interface PageProps {
  params: Promise<{
    item_number: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const itemNumber = resolvedParams.item_number.toUpperCase()

  const supabase = await createClient()
  const { currentLevel } = await getUserClearance()

  // 1. Fetch main item
  const { data: item, error: itemError } = await supabase
    .from('scp_items')
    .select('*')
    .eq('item_number', itemNumber)
    .maybeSingle()

  if (itemError || !item) {
    notFound()
  }

  // 2. Fetch addenda
  const { data: addenda } = await supabase
    .from('scp_addenda')
    .select('*')
    .eq('scp_item_id', item.id)
    .order('created_at', { ascending: true })

  // 3. Fetch media resources
  const { data: resources } = await supabase
    .from('scp_resources')
    .select('*')
    .eq('scp_item_id', item.id)
    .order('created_at', { ascending: true })

  const hasMainClearance = currentLevel >= item.clearance_level_required
  const canEditOrDelete = currentLevel >= 4

  const getObjectClassStyle = (cls: string) => {
    switch (cls) {
      case 'Safe':
        return 'text-green-500 border-green-500/30 bg-green-500/5'
      case 'Euclid':
        return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5'
      case 'Keter':
        return 'text-red-500 border-red-500/30 bg-red-500/5'
      case 'Thaumiel':
        return 'text-purple-500 border-purple-500/30 bg-purple-500/5'
      default:
        return 'text-gray-500 border-gray-500/30 bg-gray-500/5'
    }
  }

  const meta = item.metadata || {}

  // Helper to draw threat level radar ring
  const getThreatColor = (t: string) => {
    switch (t) {
      case 'White': return 'border-white text-white'
      case 'Blue': return 'border-blue-400 text-blue-400'
      case 'Green': return 'border-green-500 text-green-500'
      case 'Yellow': return 'border-yellow-500 text-yellow-500'
      case 'Orange': return 'border-orange-500 text-orange-500'
      case 'Red': return 'border-red-500 text-red-500'
      case 'Black': return 'border-neutral-800 text-red-700 animate-pulse'
      default: return 'border-terminal-primary text-terminal-primary'
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-mono text-sm leading-relaxed">
      {/* Top action row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO DIRECTORY
        </Link>

        {canEditOrDelete && (
          <div className="flex gap-2">
            <Link
              href={`/scp/${item.item_number.toLowerCase()}/edit`}
              className="inline-flex items-center gap-1.5 text-xs border border-terminal-primary hover:bg-terminal-primary/10 px-3 py-1.5 text-terminal-primary transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" /> EDIT RECORD
            </Link>
            <DeleteScpButton id={item.id} itemNumber={item.item_number} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Document Body */}
        <div className="lg:col-span-2 border border-terminal-border p-6 bg-black/60 relative">
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

          {/* Title Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-terminal-border/40 pb-4 mb-6 gap-4">
            <div>
              <div className="text-3xl font-extrabold tracking-widest text-white glow-text-green">
                {item.item_number}
              </div>
              <div className="text-xs text-terminal-primary/60 mt-1 uppercase tracking-widest">
                CODENAME: {item.codename}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 border text-xs font-bold tracking-widest uppercase ${getObjectClassStyle(item.object_class)}`}>
                CLASS: {item.object_class}
              </span>
              <span className={`px-3 py-1 border text-xs font-bold tracking-widest uppercase ${hasMainClearance ? 'border-terminal-primary/30 text-terminal-primary bg-terminal-primary/5' : 'border-terminal-error/30 text-terminal-error bg-terminal-error/5'}`}>
                REQ_LEVEL: {item.clearance_level_required}
              </span>
            </div>
          </div>

          {/* Security Verification Banner */}
          {!hasMainClearance ? (
            <div className="border border-terminal-error bg-terminal-error/10 p-4 mb-6 flex items-start gap-3">
              <ShieldAlert className="w-8 h-8 text-terminal-error animate-pulse flex-shrink-0" />
              <div>
                <div className="font-bold text-terminal-error uppercase tracking-wider text-xs">
                  ACCESS RESTRICTED - INSUFFICIENT SECURITY CLEARANCE
                </div>
                <p className="text-xs text-terminal-error/80 mt-1 leading-normal">
                  THIS FILE ENFORCES A STRICT SECURITY PROTOCOL. YOUR SECURITY RATING LEVEL {currentLevel} IS
                  INSUFFICIENT TO DECRYPT COMPONENT DETAILS (REQUIRES LEVEL {item.clearance_level_required}).
                  DESCRIPTION AND CONTAINMENT PROCEDURES ARE BLURRED BY DEFAULT.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-terminal-primary/30 bg-terminal-primary/5 p-3 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-terminal-primary" />
              <span className="text-xs text-terminal-primary/80 uppercase tracking-widest">
                SECURITY CREDENTIALS VERIFIED - FULL DECRYPTION IN PROGRESS
              </span>
            </div>
          )}

          {/* 40+ Unique Themed Dashboard Panels */}
          {hasMainClearance && Object.keys(meta).length > 0 && (
            <div className="space-y-6 mb-6">
              {/* Panel 1: Tactical Threat Assessment (4 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1 flex items-center gap-1.5 tracking-wider">
                  <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" /> 1. DANGER CONDITION & RISK CLASSIFICATION
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Threat circle gauge */}
                  <div className="flex flex-col items-center justify-center p-2.5 bg-black/40 border border-terminal-border/30 text-center">
                    <span className="text-[9px] text-terminal-primary/50 block mb-1.5 uppercase font-semibold">Threat Level</span>
                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold tracking-widest text-[9px] uppercase ${getThreatColor(meta.threat_level)}`}>
                      {meta.threat_level || 'White'}
                    </div>
                  </div>

                  {/* Disruption Class Grid */}
                  <div className="p-2.5 bg-black/40 border border-terminal-border/30">
                    <span className="text-[9px] text-terminal-primary/50 block mb-1.5 uppercase font-semibold">Disruption Scale</span>
                    <span className="font-extrabold text-white text-[10px] uppercase border border-terminal-border px-1.5 py-0.5 bg-neutral-900 block text-center mb-1">{meta.disruption_class || 'Dark'}</span>
                    <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                      {['Dark', 'Vlam', 'Keneq', 'Ekhi', 'Amida'].map((d) => (
                        <div key={d} className={`h-2 border ${d === meta.disruption_class ? 'bg-terminal-primary border-terminal-primary' : 'border-terminal-border bg-black/30'}`} title={d}></div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Class Gauge */}
                  <div className="p-2.5 bg-black/40 border border-terminal-border/30">
                    <span className="text-[9px] text-terminal-primary/50 block mb-1.5 uppercase font-semibold">Risk Rating</span>
                    <span className="font-extrabold text-terminal-warn text-[10px] uppercase border border-terminal-border px-1.5 py-0.5 bg-neutral-900 block text-center mb-1">{meta.risk_class || 'Notice'}</span>
                    <div className="w-full bg-neutral-950 border border-terminal-border/40 h-2 mt-2 overflow-hidden">
                      <div className="bg-terminal-warn h-full transition-all" style={{ width: meta.risk_class === 'Critical' ? '100%' : meta.risk_class === 'Danger' ? '80%' : meta.risk_class === 'Warning' ? '55%' : '20%' }}></div>
                    </div>
                  </div>

                  {/* Secondary class */}
                  <div className="p-2.5 bg-black/40 border border-terminal-border/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Secondary Class</span>
                      <span className="font-extrabold text-white text-xs block truncate mt-1">{meta.secondary_class || 'None (Standard)'}</span>
                    </div>
                    <span className="text-[8px] text-terminal-primary/30 uppercase">System Code: {item.object_class}</span>
                  </div>
                </div>

                {/* Primary anomaly display */}
                <div className="border border-terminal-border/30 bg-black/80 p-3 font-mono text-xs">
                  <span className="text-terminal-primary/50 block text-[9px] uppercase font-semibold mb-1">[PRIMARY_ANOMALOUS_SIGNATURE]</span>
                  <div className="text-white font-bold blink-text">&gt; {meta.primary_anomaly || 'NO ANOMALOUS SPECIFICATION FILE INGESTED'}</div>
                </div>
              </div>

              {/* Panel 2: Biological & Consciousness (5 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1 flex items-center gap-1.5 tracking-wider">
                  <HardDrive className="w-4 h-4 text-cyan-400" /> 2. BIOLOGICAL PROPERTIES & CONSCIOUSNESS WAVE
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Sentience Monitor */}
                  <div className="border border-terminal-border/30 bg-black/50 p-3 space-y-2">
                    <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Consciousness Matrix</span>
                    <span className="font-bold text-white block uppercase">{meta.sentience_status || 'Non-Sentient'}</span>
                    {/* SVG Brainwave anim */}
                    <svg className="w-full h-8 bg-black border border-terminal-border/20 rounded" viewBox="0 0 100 20">
                      <path
                        d="M 0,10 L 20,10 L 30,2 L 40,18 L 50,8 L 60,12 L 70,10 L 100,10"
                        fill="none"
                        stroke="currentColor"
                        className={`text-terminal-primary ${meta.sentience_status !== 'Non-Sentient' ? 'brainwave-line' : 'opacity-30'}`}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  {/* Composition Chart */}
                  <div className="border border-terminal-border/30 bg-black/50 p-3 space-y-2">
                    <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Material Ingress</span>
                    <p className="text-[10px] text-white truncate font-semibold" title={meta.material_composition}>{meta.material_composition || 'Organic tissue'}</p>
                    <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 overflow-hidden">
                      <div className="bg-cyan-500 h-full" style={{ width: meta.material_composition ? '70%' : '15%' }}></div>
                    </div>
                  </div>

                  {/* Dimension Schematics */}
                  <div className="border border-terminal-border/30 bg-black/50 p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Volumetric Dimensions</span>
                      <span className="font-bold text-white block truncate">{meta.dimensions_volume || 'Undetermined'}</span>
                    </div>
                    <div className="flex justify-between border-t border-terminal-border/20 pt-1.5 text-[10px]">
                      <span className="text-terminal-primary/45">MASS:</span>
                      <span className="text-white font-bold">{meta.weight_mass || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Diet beaker */}
                <div className="border border-terminal-border/30 bg-black/50 p-3 text-xs flex justify-between items-center">
                  <span className="text-terminal-primary/50 text-[9px] uppercase font-semibold">Nutritional Intake Feed</span>
                  <span className="font-extrabold text-cyan-400 uppercase tracking-widest">{meta.nutrition_diet || 'None Required'}</span>
                </div>
              </div>

              {/* Panel 3: Hazard scan Grid (5 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1 flex items-center gap-1.5 tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-orange-500" /> 3. CRITICAL HAZARD SPECTRUM SCANNER
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {/* Bio */}
                  <div className={`p-2.5 border text-xs ${meta.biological_hazard === 'Yes' ? 'border-red-500 bg-red-500/5 text-red-500 animate-pulse font-extrabold' : 'border-terminal-border bg-black/20 text-terminal-primary/40'}`}>
                    <span className="block text-[8px] uppercase">BIO HAZARD</span>
                    <span className="text-xs block mt-1">{meta.biological_hazard === 'Yes' ? 'ACTIVE' : 'MUTED'}</span>
                  </div>
                  {/* Cognitive */}
                  <div className={`p-2.5 border text-xs ${meta.cognitive_threat === 'Yes' ? 'border-red-500 bg-red-500/5 text-red-500 animate-pulse font-extrabold' : 'border-terminal-border bg-black/20 text-terminal-primary/40'}`}>
                    <span className="block text-[8px] uppercase">COGNITOHAZARD</span>
                    <span className="text-xs block mt-1">{meta.cognitive_threat === 'Yes' ? 'ACTIVE' : 'MUTED'}</span>
                  </div>
                  {/* Temporal */}
                  <div className={`p-2.5 border text-xs ${meta.temporal_hazard === 'Yes' ? 'border-red-500 bg-red-500/5 text-red-500 animate-pulse font-extrabold' : 'border-terminal-border bg-black/20 text-terminal-primary/40'}`}>
                    <span className="block text-[8px] uppercase">TEMPORAL DISTORT</span>
                    <span className="text-xs block mt-1">{meta.temporal_hazard === 'Yes' ? 'ACTIVE' : 'MUTED'}</span>
                  </div>
                  {/* Memetic */}
                  <div className={`p-2.5 border text-xs ${meta.memetic_hazard === 'Yes' ? 'border-red-500 bg-red-500/5 text-red-500 animate-pulse font-extrabold' : 'border-terminal-border bg-black/20 text-terminal-primary/40'}`}>
                    <span className="block text-[8px] uppercase">MEMETIC RISK</span>
                    <span className="text-xs block mt-1">{meta.memetic_hazard === 'Yes' ? 'ACTIVE' : 'MUTED'}</span>
                  </div>
                  {/* Radioactive level */}
                  <div className="p-2.5 border border-terminal-border bg-black/20 text-xs">
                    <span className="block text-terminal-primary/50 text-[8px] uppercase">RAD EMISSION</span>
                    <span className="text-xs block font-bold text-white mt-1 uppercase">{meta.radioactive_level || 'Negligible'}</span>
                  </div>
                </div>
              </div>

              {/* Panel 4: Atmospheric limits (4 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1 flex items-center gap-1.5 tracking-wider">
                  <Wind className="w-4 h-4 text-yellow-500" /> 4. CELL ENVIRONMENT & SHIELDING CONSTANTS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  {/* Thermometer */}
                  <div className="border border-terminal-border/30 p-2.5 bg-black/50 space-y-1.5">
                    <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold flex items-center gap-1"><Thermometer className="w-3 h-3 text-red-400" /> Temp Limit</span>
                    <span className="font-bold text-white block">{meta.temperature_limit || 'Room Temp'}</span>
                    <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 rounded overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: meta.temperature_limit === 'Room Temp' ? '50%' : '80%' }}></div>
                    </div>
                  </div>

                  {/* Pressure dial */}
                  <div className="border border-terminal-border/30 p-2.5 bg-black/50 space-y-1.5">
                    <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Pressure Limit</span>
                    <span className="font-bold text-white block">{meta.pressure_limit || '1 atm'}</span>
                    <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 rounded overflow-hidden">
                      <div className="bg-cyan-400 h-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  {/* Moisture dial */}
                  <div className="border border-terminal-border/30 p-2.5 bg-black/50 space-y-1.5">
                    <span className="text-[9px] text-terminal-primary/50 block uppercase font-semibold">Humidity Limit</span>
                    <span className="font-bold text-white block">{meta.humidity_limit || 'Ambient'}</span>
                    <div className="w-full bg-neutral-900 border border-terminal-border/40 h-2 rounded overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  {/* EM shielding radar scan */}
                  <div className={`border p-2.5 flex flex-col justify-between ${meta.em_shielding === 'Yes' ? 'border-green-500 bg-green-500/5 text-green-400' : 'border-terminal-border bg-black/20 text-terminal-primary/50'}`}>
                    <span className="text-[9px] block uppercase font-semibold">EM Shielding</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-xs">{meta.em_shielding === 'Yes' ? 'ACTIVE' : 'INACTIVE'}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border border-current ${meta.em_shielding === 'Yes' ? 'bg-green-500 animate-ping' : ''}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 5: Acquisition timeline (5 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1.5 tracking-wider flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-cyan-400" /> 5. FILE COLLECTION DOSSIER
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {/* Recovery location */}
                  <div className="border border-terminal-border/20 p-2.5 bg-black/80 space-y-1">
                    <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold flex items-center gap-1"><Compass className="w-3 h-3 text-cyan-400" /> LOCATION</span>
                    <span className="font-bold text-white uppercase block truncate" title={meta.recovery_location}>{meta.recovery_location || 'Classified'}</span>
                  </div>
                  {/* Recovery date */}
                  <div className="border border-terminal-border/20 p-2.5 bg-black/80 space-y-1">
                    <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">RECOVERY DATE</span>
                    <span className="font-bold text-white block">{meta.recovery_date || 'N/A'}</span>
                  </div>
                  {/* Recovery lead */}
                  <div className="border border-terminal-border/20 p-2.5 bg-black/80 space-y-1">
                    <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold flex items-center gap-1"><UserCheck className="w-3 h-3 text-cyan-400" /> LEAD COMMAND</span>
                    <span className="font-bold text-white uppercase block truncate" title={meta.recovery_lead}>{meta.recovery_lead || 'O5 Agent'}</span>
                  </div>
                  {/* Auditor */}
                  <div className="border border-terminal-border/20 p-2.5 bg-black/80 space-y-1">
                    <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">SIG RESARCHER</span>
                    <span className="font-bold text-white block uppercase truncate" title={meta.researcher_signature}>{meta.researcher_signature || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Panel 6: Tactical protocols (9 variables) */}
              <div className="border border-terminal-border/50 bg-black/40 p-4 space-y-4">
                <div className="text-[10px] text-white font-extrabold uppercase border-b border-terminal-border/20 pb-1 flex items-center gap-1.5 tracking-wider">
                  <Shield className="w-4 h-4 text-red-500" /> 6. CONTAINMENT SECURITY CODES & TACTICAL PROTOCOLS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  {/* Left Column: Guards, Weapon Auth, Amnestics */}
                  <div className="space-y-4">
                    {/* Guards representation */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 space-y-1">
                      <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">Guards Deployment</span>
                      <span className="font-bold text-white block">{meta.tactical_guards || '2'} OFFICERS</span>
                      <div className="flex gap-1 text-terminal-primary text-[10px]">
                        {Array.from({ length: Math.min(10, parseInt(meta.tactical_guards) || 1) }).map((_, i) => (
                          <span key={i} className="animate-pulse">[🛡️]</span>
                        ))}
                      </div>
                    </div>

                    {/* Weapons Authorized crosshair */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 space-y-1">
                      <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">WEAPONS AUTHORIZED</span>
                      <span className="font-extrabold text-white uppercase block">{meta.authorized_weapons || 'None'}</span>
                      <span className="text-[8px] text-terminal-primary/30 uppercase">CROSSHAIR PROTOCOL</span>
                    </div>

                    {/* Amnestic protocol syringe */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 space-y-1">
                      <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">AMNESTICS PROTOCOL</span>
                      <span className="font-extrabold text-white block uppercase">&bull; {meta.amnestic_protocol || 'Class-A'} Required</span>
                    </div>
                  </div>

                  {/* Middle Column: Cross-Testing, Termination, Alternate dimension */}
                  <div className="space-y-4">
                    {/* Cross testing stamp */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 relative overflow-hidden flex flex-col justify-between h-[85px]">
                      <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">Cross-Testing Matrix</span>
                      <span className="font-extrabold text-white uppercase text-center block text-[13px] tracking-widest">{meta.cross_testing || 'Suspended'}</span>
                      <div className="absolute top-2 right-2 opacity-15 rotate-12">
                        {meta.cross_testing === 'Authorized' ? <ShieldCheck className="w-14 h-14" /> : <ShieldClose className="w-14 h-14" />}
                      </div>
                    </div>

                    {/* Termination Skull Alert */}
                    <div className={`border p-3 flex items-center gap-3 justify-center text-center ${meta.termination_protocol === 'Yes' ? 'border-red-500 bg-red-500/10 text-red-500 alarm-border-active' : 'border-terminal-border bg-black/20 text-terminal-primary/30'}`}>
                      <Skull className="w-7 h-7 flex-shrink-0" />
                      <div className="text-left">
                        <span className="block text-[8px] uppercase">TERMINATION PROTOCOL</span>
                        <span className="text-xs block font-bold">{meta.termination_protocol === 'Yes' ? 'ACTIVE (CRITICAL)' : 'INACTIVE'}</span>
                      </div>
                    </div>

                    {/* Alternate dimension portal */}
                    <div className={`border p-3 flex justify-between items-center ${meta.alternate_dimension === 'Yes' ? 'border-purple-500 bg-purple-500/5 text-purple-400' : 'border-terminal-border bg-black/20 text-terminal-primary/40'}`}>
                      <span className="text-[9px] uppercase font-semibold">Dimension Gateway</span>
                      <span className="font-bold text-[10px] uppercase">{meta.alternate_dimension === 'Yes' ? 'ALT_WORLD' : 'NATIVE'}</span>
                    </div>
                  </div>

                  {/* Right Column: Cost, Incident Log count, Audit details */}
                  <div className="space-y-4">
                    {/* Budget slider */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 space-y-1">
                      <span className="text-[9px] text-terminal-primary/45 block uppercase font-semibold">Annual Maintenance Cost</span>
                      <span className="font-extrabold text-white block text-sm">{meta.containment_cost || '$50,000'}</span>
                      <div className="w-full bg-neutral-950 h-1.5 rounded overflow-hidden">
                        <div className="bg-red-400 h-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>

                    {/* Incident log count flashing counter */}
                    <div className="border border-terminal-border/25 p-3 bg-black/50 flex justify-between items-center">
                      <span className="text-[9px] text-terminal-primary/45 uppercase font-semibold">Incident Log Tally</span>
                      <span className="bg-red-950 text-red-500 border border-red-500/50 px-2 py-0.5 font-bold tracking-widest text-xs animate-pulse">
                        [ {meta.incident_log_count || '0'} ]
                      </span>
                    </div>

                    {/* Ethics Committee Hologram Stamp */}
                    <div className="border border-terminal-border/25 p-2.5 bg-black/50 flex justify-between items-center text-[10px]">
                      <span className="text-terminal-primary/45 uppercase">Ethics Clearance:</span>
                      <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold ${meta.ethics_clearance === 'Yes' ? 'border-green-500 text-green-400 bg-green-500/5' : 'border-red-500 text-red-400 bg-red-500/5'}`}>
                        {meta.ethics_clearance === 'Yes' ? 'EC APPROVED' : 'EC AWAITING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Content */}
          <div className="space-y-6">
            {/* SPECIAL CONTAINMENT PROCEDURES */}
            <div>
              <h3 className="text-xs text-terminal-primary/50 font-bold uppercase tracking-wider border-b border-terminal-border/20 pb-1 mb-2">
                SPECIAL CONTAINMENT PROCEDURES
              </h3>
              {hasMainClearance ? (
                <div className="text-sm leading-relaxed">
                  <ScpMarkdown content={item.containment_procedures} />
                </div>
              ) : (
                <div className="relative">
                  <p className="text-sm select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
                    {item.containment_procedures}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-black border border-terminal-error px-4 py-2 text-center max-w-sm">
                      <span className="text-terminal-error font-bold tracking-wider text-xs block mb-1">
                        [DATA EXPUNGED]
                      </span>
                      <span className="text-[10px] text-terminal-primary/65 block">
                        INSUFFICIENT CLEARANCE RATING
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-xs text-terminal-primary/50 font-bold uppercase tracking-wider border-b border-terminal-border/20 pb-1 mb-2">
                DESCRIPTION
              </h3>
              {hasMainClearance ? (
                <div className="text-sm leading-relaxed">
                  <ScpMarkdown content={item.description} />
                </div>
              ) : (
                <div className="relative">
                  <p className="text-sm select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-black border border-terminal-error px-4 py-2 text-center max-w-sm">
                      <span className="text-terminal-error font-bold tracking-wider text-xs block mb-1">
                        [DATA EXPUNGED - INSUFFICIENT CLEARANCE]
                      </span>
                      <span className="text-[10px] text-terminal-primary/65 block">
                        DECRYPTION FAULT - LEVEL {item.clearance_level_required} REQUIRED
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ADDENDA SECTION */}
            {hasMainClearance && addenda && addenda.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-terminal-border/20">
                <h3 className="text-xs text-terminal-primary/65 font-bold uppercase tracking-widest mb-4">
                  ADDENDA, LOGS, AND RESEARCH NOTES
                </h3>
                {addenda.map((addendum) => {
                  const hasAddendumClearance = currentLevel >= addendum.clearance_level_required
                  
                  return (
                    <div key={addendum.id} className="border border-terminal-border/30 bg-black/30 p-4 space-y-3 relative">
                      {/* Addendum Header */}
                      <div className="flex justify-between items-center border-b border-terminal-border/20 pb-1.5 text-xs">
                        <span className="font-bold text-white uppercase">{addendum.title}</span>
                        <span className={`px-2 py-0.5 border text-[10px] uppercase ${hasAddendumClearance ? 'border-terminal-primary/30 text-terminal-primary/70' : 'border-terminal-error/30 text-terminal-error'}`}>
                          {addendum.type.replace('_', ' ')} // REQ: L{addendum.clearance_level_required}
                        </span>
                      </div>

                      {/* Addendum Body */}
                      {hasAddendumClearance ? (
                        <div className="text-sm leading-relaxed">
                          <ScpMarkdown content={addendum.content} />
                        </div>
                      ) : (
                        <div className="relative py-2">
                          <p className="text-sm select-none blur-sm pointer-events-none opacity-25 leading-relaxed">
                            {addendum.content}
                          </p>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="bg-black border border-terminal-error px-3 py-1 text-center">
                              <span className="text-terminal-error font-bold tracking-wider text-[10px] block">
                                [ACCESS DENIED: LEVEL {addendum.clearance_level_required} REQUIRED]
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Media Attachments & Technical Specs Sidebar */}
        <div className="space-y-4">
          {/* Technical Specifications Grid */}
          {item.metadata && Object.keys(item.metadata).length > 0 && (
            <div className="border border-terminal-border p-4 bg-black/45 space-y-3 font-mono text-xs">
              <h3 className="text-xs font-bold border-b border-terminal-border/40 pb-2 tracking-wider uppercase text-white">
                TECHNICAL SPECIFICATION CODE
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-1">
                {Object.entries(item.metadata).map(([key, val]) => {
                  if (!val) return null
                  return (
                    <div key={key} className="flex justify-between border-b border-terminal-border/10 pb-1 flex-wrap gap-1">
                      <span className="text-terminal-primary/45 uppercase text-[10px]">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-white uppercase truncate max-w-[150px] text-[10px]" title={val as string}>{val as string}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="border border-terminal-border p-4 bg-black/40">
            <h3 className="text-xs font-bold border-b border-terminal-border/40 pb-2 mb-3 tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> VISUAL & AUDITORY FILES
            </h3>
            
            {resources && resources.length > 0 ? (
              <div className="space-y-4 flex flex-col items-center">
                {resources.map((res) => {
                  if (res.type === 'image') {
                    return (
                      <TerminalImageFrame
                        key={res.id}
                        url={res.url}
                        caption={res.caption || ''}
                        classification={item.object_class}
                      />
                    )
                  }
                  if (res.type === 'audio') {
                    return (
                      <TerminalAudioPlayer
                        key={res.id}
                        url={res.url}
                        caption={res.caption || ''}
                      />
                    )
                  }
                  return null
                })}
              </div>
            ) : (
              <p className="text-xs text-terminal-primary/40 text-center py-8">
                NO MEDIA ATTACHMENTS DETECTED FOR THIS SUBJECT.
              </p>
            )}
          </div>

          {/* Quick Help Box */}
          <div className="border border-terminal-border/20 bg-terminal-primary/[0.01] p-4 text-[10px] text-terminal-primary/60 space-y-2 leading-relaxed">
            <span className="font-bold text-terminal-primary block uppercase">AUDIT LOG</span>
            <p>ACCESS TIMESTAMP: {new Date().toISOString()}</p>
            <p>PERSONNEL CLEARANCE: LEVEL {currentLevel}</p>
            <p>LOCATION: SITE-19 DECRYPTING TERMINAL</p>
          </div>
        </div>
      </div>
    </div>
  )
}
