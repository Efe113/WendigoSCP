import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import ScpDirectory from '@/components/ScpDirectory'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert } from 'lucide-react'

export const revalidate = 0 // Disable caching for directory to ensure live data is always loaded

export default async function Page() {
  const supabase = await createClient()
  const { currentLevel } = await getUserClearance()

  // Fetch all items from live database
  const { data: scpItems, error } = await supabase
    .from('scp_items')
    .select('*')
    .order('item_number', { ascending: true })

  if (error) {
    return (
      <TerminalCard status="error" statusText="DATABASE_ERROR" title="Critical Exception">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-terminal-error animate-pulse flex-shrink-0" />
          <div>
            <p className="font-bold">CRITICAL EXCEPTION OCCURRED WHEN RETRIEVING ARCHIVES.</p>
            <p className="text-xs text-terminal-error/80 mt-1">Error Details: {error.message}</p>
          </div>
        </div>
      </TerminalCard>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border border-terminal-border bg-black/50 p-4 font-mono text-xs leading-relaxed">
        <div className="text-terminal-primary font-bold uppercase tracking-wider mb-2 border-b border-terminal-border/40 pb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-terminal-primary rounded-full animate-ping"></span>
          FOUNDATION RECORDS ACCESS PROTOCOL
        </div>
        <p className="text-terminal-primary/75">
          WELCOME TO THE SECURE SCP ARCHIVE DIRECTORY. THE DATA DISPLAYED BELOW IS SYNCHRONIZED REAL-TIME FROM
          SUPABASE HIGH-ENCRYPTION NODE. CHOOSE A RECORD FILE TO DECRYPT ITS CONTAINMENT PROTOCOLS AND DESCRIPTION.
          IF YOU ENCOUNTER AN ERROR, CONTACT SITE-19 NETWORK OPERATIONS.
        </p>
      </div>

      <ScpDirectory items={scpItems || []} currentClearance={currentLevel} />
    </div>
  )
}
