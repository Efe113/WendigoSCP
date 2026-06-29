'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import TerminalCard from './TerminalCard'
import { Search, Eye, AlertTriangle } from 'lucide-react'

interface ScpItem {
  id: string
  item_number: string
  codename: string
  object_class: string
  clearance_level_required: number
  created_at: string
}

interface ScpDirectoryProps {
  items: ScpItem[]
  currentClearance: number
}

export default function ScpDirectory({ items, currentClearance }: ScpDirectoryProps) {
  const [search, setSearch] = useState('')
  const [objectClassFilter, setObjectClassFilter] = useState('ALL')

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item_number.toLowerCase().includes(search.toLowerCase()) ||
      item.codename.toLowerCase().includes(search.toLowerCase())
    
    const matchesFilter =
      objectClassFilter === 'ALL' || item.object_class === objectClassFilter

    return matchesSearch && matchesFilter
  })

  const getObjectClassColor = (cls: string) => {
    switch (cls) {
      case 'Safe':
        return 'text-green-500 border-green-500/30'
      case 'Euclid':
        return 'text-yellow-500 border-yellow-500/30'
      case 'Keter':
        return 'text-red-500 border-red-500/30'
      case 'Thaumiel':
        return 'text-purple-500 border-purple-500/30'
      default:
        return 'text-gray-500 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-terminal-border bg-black/40">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-terminal-primary/50" />
          <input
            type="text"
            placeholder="SEARCH DATABASE (ITEM NO, CODENAME)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-terminal-border text-sm"
          />
        </div>
        <div className="sm:w-64 flex items-center gap-2">
          <span className="text-xs text-terminal-primary/50 whitespace-nowrap">CLASS:</span>
          <select
            value={objectClassFilter}
            onChange={(e) => setObjectClassFilter(e.target.value)}
            className="w-full px-3 py-2 border border-terminal-border text-sm cursor-pointer"
          >
            <option value="ALL">ALL CLASSES</option>
            <option value="Safe">SAFE</option>
            <option value="Euclid">EUCLID</option>
            <option value="Keter">KETER</option>
            <option value="Thaumiel">THAUMIEL</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredItems.length === 0 ? (
        <TerminalCard status="warn" statusText="QUERY_EMPTY">
          <p className="text-center py-8">NO RECORD FOUND MATCHING SPECIFIED CRITERIA.</p>
        </TerminalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const hasClearance = currentClearance >= item.clearance_level_required
            
            return (
              <TerminalCard
                key={item.id}
                title={item.item_number}
                status={hasClearance ? 'default' : 'error'}
                statusText={item.object_class}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-terminal-primary/40 block">CODENAME</span>
                      <span className="text-base font-bold text-white">{item.codename.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-terminal-primary/40 block">REQUIRED CLEARANCE</span>
                      <span className={`text-xs font-bold ${hasClearance ? 'text-terminal-primary' : 'text-terminal-error animate-pulse'}`}>
                        LEVEL {item.clearance_level_required}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full min-h-[70px]">
                    <span className={`px-2 py-0.5 border text-[10px] uppercase ${getObjectClassColor(item.object_class)}`}>
                      {item.object_class}
                    </span>
                    
                    <Link
                      href={`/scp/${item.item_number.toLowerCase()}`}
                      className={`px-3 py-1 text-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                        hasClearance
                          ? 'border-terminal-primary hover:bg-terminal-primary/10 text-terminal-primary'
                          : 'border-terminal-error hover:bg-terminal-error/10 text-terminal-error'
                      }`}
                    >
                      {hasClearance ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> ACCESS FILE
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> RESTRICTED
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </TerminalCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
