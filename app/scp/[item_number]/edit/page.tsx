import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import ScpEditConsole from '@/components/ScpEditConsole'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    item_number: string
  }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const itemNumber = resolvedParams.item_number.toUpperCase()

  const { currentLevel } = await getUserClearance()

  // Authorization check: Level 4 or 5 required
  if (currentLevel < 4) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <TerminalCard status="error" statusText="SECURITY_BREACH_ALERT" title="Access Denied">
          <div className="flex flex-col items-center text-center p-4 space-y-4">
            <ShieldAlert className="w-16 h-16 text-terminal-error animate-pulse" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              INSUFFICIENT SECURITY CLEARANCE RATING
            </h3>
            <p className="text-xs text-terminal-error/90 leading-relaxed">
              EDITING DATABASE RECORDS IS RESTRICTED TO LEVEL 4 (SENIOR DIRECTOR) AND LEVEL 5 (O5 COMMAND) PERSONNEL ONLY.
              YOUR LEVEL {currentLevel} CREDENTIALS HAVE BEEN LOGGED, AND THE NETWORK SECURITY DEPT HAS BEEN ALERATED.
            </p>
            <Link
              href={`/scp/${itemNumber.toLowerCase()}`}
              className="inline-block border border-terminal-border hover:border-terminal-primary px-4 py-2 text-xs transition-colors"
            >
              RETURN TO FILE
            </Link>
          </div>
        </TerminalCard>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch the item
  const { data: item, error: itemError } = await supabase
    .from('scp_items')
    .select('*')
    .eq('item_number', itemNumber)
    .maybeSingle()

  if (itemError || !item) {
    notFound()
  }

  // Fetch related addenda
  const { data: addenda } = await supabase
    .from('scp_addenda')
    .select('*')
    .eq('scp_item_id', item.id)
    .order('created_at', { ascending: true })

  // Fetch related resources
  const { data: resources } = await supabase
    .from('scp_resources')
    .select('*')
    .eq('scp_item_id', item.id)
    .order('created_at', { ascending: true })

  return (
    <ScpEditConsole
      item={item}
      addenda={addenda || []}
      resources={resources || []}
    />
  )
}
