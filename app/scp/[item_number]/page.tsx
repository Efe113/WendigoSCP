import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import RedactedText from '@/components/RedactedText'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    item_number: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  // Standardize the format: e.g. scp-173 -> SCP-173
  const itemNumber = resolvedParams.item_number.toUpperCase()

  const supabase = await createClient()
  const { currentLevel } = await getUserClearance()

  // Fetch the item
  const { data: item, error } = await supabase
    .from('scp_items')
    .select('*')
    .eq('item_number', itemNumber)
    .maybeSingle()

  if (error || !item) {
    notFound()
  }

  const hasClearance = currentLevel >= item.clearance_level_required

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs border border-terminal-border px-3 py-1.5 hover:bg-terminal-primary/10 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO DIRECTORY
      </Link>

      <div className="border border-terminal-border p-6 bg-black/60 relative font-mono">
        {/* Corner styling */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-terminal-primary"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-terminal-primary"></div>

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-terminal-border/40 pb-4 mb-6 gap-4">
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
            <span className={`px-3 py-1 border text-xs font-bold tracking-widest uppercase ${hasClearance ? 'border-terminal-primary/30 text-terminal-primary bg-terminal-primary/5' : 'border-terminal-error/30 text-terminal-error bg-terminal-error/5'}`}>
              REQ_LEVEL: {item.clearance_level_required}
            </span>
          </div>
        </div>

        {/* Clearance Alert banner */}
        {!hasClearance ? (
          <div className="border border-terminal-error bg-terminal-error/10 p-4 mb-6 flex items-start gap-3">
            <ShieldAlert className="w-8 h-8 text-terminal-error animate-pulse flex-shrink-0" />
            <div>
              <div className="font-bold text-terminal-error uppercase tracking-wider text-sm">
                ACCESS RESTRICTED - INSUFFICIENT SECURITY CLEARANCE
              </div>
              <p className="text-xs text-terminal-error/80 mt-1 leading-normal">
                THIS FILE ENFORCES A STRICT SECURITY PROTOCOL. YOUR SECURITY RATING LEVEL {currentLevel} IS
                INSUFFICIENT TO DECRYPT COMPONENT DETAILS (REQUIRES LEVEL {item.clearance_level_required}).
                CERTAIN SECTIONS OF DESCRIPTION AND CONFINEMENT PROCEDURES ARE ENCRYPTED AND BLURRED BY DEFAULT.
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

        {/* Main Details Section */}
        <div className="space-y-6">
          {/* SPECIAL CONTAINMENT PROCEDURES */}
          <div>
            <h3 className="text-xs text-terminal-primary/50 font-bold uppercase tracking-wider border-b border-terminal-border/20 pb-1 mb-2">
              SPECIAL CONTAINMENT PROCEDURES
            </h3>
            {hasClearance ? (
              <div className="text-sm text-terminal-primary/90 leading-relaxed whitespace-pre-wrap">
                <RedactedText text={item.containment_procedures} />
              </div>
            ) : (
              <div className="relative">
                {/* Blurred Content */}
                <p className="text-sm select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
                  {item.containment_procedures}
                </p>
                {/* Overlay message */}
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
            {hasClearance ? (
              <div className="text-sm text-terminal-primary/90 leading-relaxed whitespace-pre-wrap">
                <RedactedText text={item.description} />
              </div>
            ) : (
              <div className="relative">
                {/* Blurred Content */}
                <p className="text-sm select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
                {/* Overlay message */}
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
        </div>

        {/* Footer info */}
        <div className="border-t border-terminal-border/40 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-terminal-primary/40 gap-2">
          <span>DECRYPTED_ON: {new Date().toISOString()}</span>
          <span>RECORD ID: {item.id}</span>
        </div>
      </div>
    </div>
  )
}
