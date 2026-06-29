'use client'

import React, { useActionState, useEffect, useRef, useState } from 'react'
import { createScpItem } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert, CheckCircle, Database, Plus, Trash2, HelpCircle, FileText, Image, Volume2 } from 'lucide-react'

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

  // Local state for interactive builders
  const [addenda, setAddenda] = useState<LocalAddendum[]>([])
  const [resources, setResources] = useState<LocalResource[]>([])

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
    }
  }, [state])

  const handleAddAddendum = () => {
    if (!newAddendum.title || !newAddendum.content) {
      alert('Addendum title and content are required.')
      return
    }
    setAddenda([...addenda, newAddendum])
    setNewAddendum({
      title: '',
      type: 'addendum',
      content: '',
      clearance_level_required: 1,
    })
  }

  const handleRemoveAddendum = (idx: number) => {
    setAddenda(addenda.filter((_, i) => i !== idx))
  }

  const handleAddResource = () => {
    if (!newResource.url) {
      alert('Media URL is required.')
      return
    }
    setResources([...resources, newResource])
    setNewResource({
      url: '',
      type: 'image',
      caption: '',
    })
  }

  const handleRemoveResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-xs leading-relaxed">
      <div className="border border-terminal-border bg-black/50 p-4">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <Database className="w-4 h-4" /> SECURE BATCH DATA INGESTION UPLINK
        </div>
        <p className="text-terminal-primary/75">
          THIS INTERFACE PERMITS AUTHORITIES TO CONSTRUCT COMPREHENSIVE RECORDS CONTAINING MULTIPLE REPORTS,
          ADDENDA, AND AUDIO/IMAGE LOGS ATTACHED AT INITIAL MUTATION. DATA INTEGRITY IS ASSURED VIA MANUAL TRANSACTION ROLLBACK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core details column */}
        <div className="lg:col-span-2">
          <TerminalCard title="SUBJECT PROFILE DATA" status={state?.error ? 'error' : state?.success ? 'success' : 'default'}>
            <form ref={formRef} action={formAction} className="space-y-4 text-xs">
              {/* Serialized JSON states */}
              <input type="hidden" name="addenda_json" value={JSON.stringify(addenda)} />
              <input type="hidden" name="resources_json" value={JSON.stringify(resources)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="item_number" className="block text-terminal-primary/65 mb-1.5">
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
                  <label htmlFor="codename" className="block text-terminal-primary/65 mb-1.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="object_class" className="block text-terminal-primary/65 mb-1.5">
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
                  <label htmlFor="clearance_level_required" className="block text-terminal-primary/65 mb-1.5">
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

              <div>
                <label htmlFor="containment_procedures" className="block text-terminal-primary/65 mb-1.5">
                  SPECIAL CONTAINMENT PROCEDURES
                </label>
                <textarea
                  id="containment_procedures"
                  name="containment_procedures"
                  rows={4}
                  placeholder="e.g. SCP-173 is to be kept in a locked container at all times..."
                  required
                  className="w-full px-3 py-2 text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="description" className="block text-terminal-primary/65 mb-1.5">
                  DESCRIPTION
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="e.g. Moved to Site-19 1993. Construct is concrete and ||rebar||..."
                  required
                  className="w-full px-3 py-2 text-sm"
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
                  <span>ALL PROFILE, REPORT, AND MEDIA BLOCKS SUCCESSFULLY COMPILED & INGESTED.</span>
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
        </div>

        {/* Builders column */}
        <div className="space-y-6">
          {/* Addenda Builder */}
          <TerminalCard title="ADDENDA BUNDLE BUILDER">
            <div className="space-y-4">
              {/* Added Addenda list */}
              {addenda.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  <span className="text-[9px] text-terminal-primary/50 font-bold block">QUEUE STAGE:</span>
                  {addenda.map((ad, idx) => (
                    <div key={idx} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[10px]">
                      <span className="truncate max-w-[130px] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-terminal-primary/75" />
                        {ad.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddendum(idx)}
                        className="text-terminal-error hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Addenda Form elements */}
              <div className="border-t border-terminal-border/20 pt-3 space-y-2.5">
                <div>
                  <input
                    type="text"
                    placeholder="Addendum Title (e.g. Addendum 173-A)"
                    value={newAddendum.title}
                    onChange={(e) => setNewAddendum({ ...newAddendum, title: e.target.value })}
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newAddendum.type}
                    onChange={(e) => setNewAddendum({ ...newAddendum, type: e.target.value })}
                    className="w-full px-2 py-1 text-xs cursor-pointer"
                  >
                    <option value="addendum">Addendum</option>
                    <option value="report">Report</option>
                    <option value="incident_log">Incident Log</option>
                    <option value="interview">Interview</option>
                    <option value="note">Note</option>
                  </select>
                  <select
                    value={newAddendum.clearance_level_required}
                    onChange={(e) =>
                      setNewAddendum({ ...newAddendum, clearance_level_required: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-2 py-1 text-xs cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>
                        Req L{l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <textarea
                    placeholder="Addendum Content... supports Markdown and ||redactions||"
                    value={newAddendum.content}
                    onChange={(e) => setNewAddendum({ ...newAddendum, content: e.target.value })}
                    rows={3}
                    className="w-full px-2 py-1 text-xs"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleAddAddendum}
                  className="w-full py-1 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-colors cursor-pointer text-center text-[10px] font-bold"
                >
                  QUEUE ADDENDUM
                </button>
              </div>
            </div>
          </TerminalCard>

          {/* Media Builder */}
          <TerminalCard title="MEDIA BUNDLE BUILDER">
            <div className="space-y-4">
              {/* Added media list */}
              {resources.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  <span className="text-[9px] text-terminal-primary/50 font-bold block">QUEUE STAGE:</span>
                  {resources.map((res, idx) => (
                    <div key={idx} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[10px]">
                      <span className="truncate max-w-[130px] flex items-center gap-1">
                        {res.type === 'image' ? <Image className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        {res.caption || 'Attached File'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(idx)}
                        className="text-terminal-error hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resource Form elements */}
              <div className="border-t border-terminal-border/20 pt-3 space-y-2.5">
                <div>
                  <input
                    type="text"
                    placeholder="Media Resource URL"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="w-full px-2 py-1 text-xs cursor-pointer"
                  >
                    <option value="image">Image (png/jpg)</option>
                    <option value="audio">Audio (mp3/ogg)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Caption (e.g. Fig 1)"
                    value={newResource.caption}
                    onChange={(e) => setNewResource({ ...newResource, caption: e.target.value })}
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddResource}
                  className="w-full py-1 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-colors cursor-pointer text-center text-[10px] font-bold"
                >
                  QUEUE MEDIA
                </button>
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  )
}
