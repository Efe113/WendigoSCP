'use client'

import React, { useActionState, useTransition } from 'react'
import { updateScpItem, addAddendum, deleteAddendum, addResource, deleteResource } from '@/app/actions/scp'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert, CheckCircle, Trash2, Plus, ArrowLeft, Database, FileText, Image, Volume2 } from 'lucide-react'
import Link from 'next/link'

interface ScpItem {
  id: string
  item_number: string
  codename: string
  object_class: string
  clearance_level_required: number
  containment_procedures: string
  description: string
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
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Main Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <TerminalCard title="EDIT CORE ARCHIVE RECORD" status={editState?.error ? 'error' : editState?.success ? 'success' : 'default'}>
            <form action={editAction} className="space-y-4 text-xs font-mono">
              <input type="hidden" name="id" value={item.id} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="item_number" className="block text-terminal-primary/65 mb-1">
                    ITEM_NUMBER (Format: SCP-XXXX)
                  </label>
                  <input
                    id="item_number"
                    name="item_number"
                    type="text"
                    defaultValue={item.item_number}
                    required
                    className="w-full px-3 py-2 text-sm uppercase"
                  />
                </div>
                <div>
                  <label htmlFor="codename" className="block text-terminal-primary/65 mb-1">
                    CODENAME
                  </label>
                  <input
                    id="codename"
                    name="codename"
                    type="text"
                    defaultValue={item.codename}
                    required
                    className="w-full px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="object_class" className="block text-terminal-primary/65 mb-1">
                    OBJECT_CLASS
                  </label>
                  <select
                    id="object_class"
                    name="object_class"
                    defaultValue={item.object_class}
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
                  <label htmlFor="clearance_level_required" className="block text-terminal-primary/65 mb-1">
                    CLEARANCE_LEVEL_REQUIRED (1-5)
                  </label>
                  <select
                    id="clearance_level_required"
                    name="clearance_level_required"
                    defaultValue={item.clearance_level_required}
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
                <label htmlFor="containment_procedures" className="block text-terminal-primary/65 mb-1">
                  SPECIAL CONTAINMENT PROCEDURES
                </label>
                <textarea
                  id="containment_procedures"
                  name="containment_procedures"
                  rows={4}
                  defaultValue={item.containment_procedures}
                  required
                  className="w-full px-3 py-2 text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="description" className="block text-terminal-primary/65 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  defaultValue={item.description}
                  required
                  className="w-full px-3 py-2 text-sm"
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
        </div>

        {/* Right Side: Addenda & Media console */}
        <div className="space-y-6">
          {/* Addenda List & Form */}
          <TerminalCard title="ADDENDA CONTROL PANEL" status={addendumState?.error ? 'error' : addendumState?.success ? 'success' : 'default'}>
            <div className="space-y-4">
              {/* Existing Addenda */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <span className="text-[10px] text-terminal-primary/50 block font-bold">CURRENT ADDENDA</span>
                {addenda && addenda.length > 0 ? (
                  addenda.map((ad) => (
                    <div key={ad.id} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[11px]">
                      <span className="truncate max-w-[150px]">{ad.title}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddendum(ad.id)}
                        className="text-terminal-error hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Addendum"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-terminal-primary/30 italic">No addenda attached.</p>
                )}
              </div>

              {/* Add Addendum Form */}
              <form action={addendumAction} className="border-t border-terminal-border/20 pt-3 space-y-3 text-[11px]">
                <span className="text-[10px] text-white font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> ADD NEW ADDENDUM / REPORT
                </span>
                
                <input type="hidden" name="scp_item_id" value={item.id} />
                <input type="hidden" name="item_number" value={item.item_number} />

                <div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Addendum Title (e.g. Addendum 173-1)"
                    required
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select name="type" required className="w-full px-2 py-1 text-xs cursor-pointer">
                    <option value="addendum">Addendum</option>
                    <option value="report">Report</option>
                    <option value="incident_log">Incident Log</option>
                    <option value="interview">Interview</option>
                    <option value="note">Note</option>
                  </select>
                  <select name="clearance_level_required" required className="w-full px-2 py-1 text-xs cursor-pointer">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>
                        Req Level {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <textarea
                    name="content"
                    placeholder="Addendum details... supports Markdown and ||redactions||"
                    rows={3}
                    required
                    className="w-full px-2 py-1 text-xs"
                  ></textarea>
                </div>

                {addendumState?.error && (
                  <div className="text-terminal-error text-[10px]">{addendumState.error}</div>
                )}

                <button
                  type="submit"
                  disabled={isAddendumPending}
                  className="w-full py-1.5 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-colors cursor-pointer text-center text-[10px] font-bold"
                >
                  {isAddendumPending ? 'ADDING...' : 'ATTACH ADDENDUM'}
                </button>
              </form>
            </div>
          </TerminalCard>

          {/* Media Attachments */}
          <TerminalCard title="MEDIA ATTACHMENTS" status={resourceState?.error ? 'error' : resourceState?.success ? 'success' : 'default'}>
            <div className="space-y-4">
              {/* Existing Resources */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <span className="text-[10px] text-terminal-primary/50 block font-bold">CURRENT ATTACHMENTS</span>
                {resources && resources.length > 0 ? (
                  resources.map((res) => (
                    <div key={res.id} className="flex justify-between items-center border border-terminal-border/40 p-2 bg-black text-[11px]">
                      <span className="truncate max-w-[130px] flex items-center gap-1.5">
                        {res.type === 'image' ? <Image className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        {res.caption || 'Attached File'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteResource(res.id)}
                        className="text-terminal-error hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-terminal-primary/30 italic">No files attached.</p>
                )}
              </div>

              {/* Add Resource Form */}
              <form action={resourceAction} className="border-t border-terminal-border/20 pt-3 space-y-3 text-[11px]">
                <span className="text-[10px] text-white font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> ATTACH IMAGE / AUDIO FILE
                </span>

                <input type="hidden" name="scp_item_id" value={item.id} />
                <input type="hidden" name="item_number" value={item.item_number} />

                <div>
                  <input
                    type="text"
                    name="url"
                    placeholder="URL (e.g. https://images.com/scp.png)"
                    required
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select name="type" required className="w-full px-2 py-1 text-xs cursor-pointer">
                    <option value="image">Image (png/jpg)</option>
                    <option value="audio">Audio (mp3/ogg)</option>
                  </select>
                  <input
                    type="text"
                    name="caption"
                    placeholder="File Caption (e.g. Fig 1)"
                    className="w-full px-2 py-1 text-xs"
                  />
                </div>

                {resourceState?.error && (
                  <div className="text-terminal-error text-[10px]">{resourceState.error}</div>
                )}

                <button
                  type="submit"
                  disabled={isResourcePending}
                  className="w-full py-1.5 bg-terminal-primary/10 hover:bg-terminal-primary hover:text-black border border-terminal-primary/45 transition-colors cursor-pointer text-center text-[10px] font-bold"
                >
                  {isResourcePending ? 'ATTACHING...' : 'ATTACH MEDIA'}
                </button>
              </form>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  )
}
