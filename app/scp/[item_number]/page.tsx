import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import ScpMarkdown from '@/components/ScpMarkdown'
import TerminalImageFrame from '@/components/TerminalImageFrame'
import TerminalAudioPlayer from '@/components/TerminalAudioPlayer'
import DeleteScpButton from '@/components/DeleteScpButton'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ShieldAlert, Edit, HelpCircle } from 'lucide-react'
import { notFound } from 'next/navigation'

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      {/* Top action row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Link
          href="/"
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
                <div className="font-bold text-terminal-error uppercase tracking-wider text-sm">
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

          {/* Document Content */}
          <div className="space-y-6">
            {/* SPECIAL CONTAINMENT PROCEDURES */}
            <div>
              <h3 className="text-xs text-terminal-primary/50 font-bold uppercase tracking-wider border-b border-terminal-border/20 pb-1 mb-2">
                SPECIAL CONTAINMENT PROCEDURES
              </h3>
              {hasMainClearance ? (
                <div className="text-xs leading-relaxed">
                  <ScpMarkdown content={item.containment_procedures} />
                </div>
              ) : (
                <div className="relative">
                  <p className="text-xs select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
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
                <div className="text-xs leading-relaxed">
                  <ScpMarkdown content={item.description} />
                </div>
              ) : (
                <div className="relative">
                  <p className="text-xs select-none blur-sm pointer-events-none opacity-40 leading-relaxed whitespace-pre-wrap">
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
                        <div className="text-xs leading-relaxed">
                          <ScpMarkdown content={addendum.content} />
                        </div>
                      ) : (
                        <div className="relative py-2">
                          <p className="text-xs select-none blur-sm pointer-events-none opacity-25 leading-relaxed">
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
            <div className="border border-terminal-border p-4 bg-black/45 space-y-3 font-mono text-[10px]">
              <h3 className="text-xs font-bold border-b border-terminal-border/40 pb-2 tracking-wider uppercase text-white">
                TECHNICAL SPECIFICATION CODE
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-1">
                {Object.entries(item.metadata).map(([key, val]) => {
                  if (!val) return null
                  return (
                    <div key={key} className="flex justify-between border-b border-terminal-border/10 pb-1 flex-wrap gap-1">
                      <span className="text-terminal-primary/45 uppercase">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-white uppercase truncate max-w-[150px]" title={val as string}>{val as string}</span>
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
