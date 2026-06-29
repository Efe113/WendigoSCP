import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import EthicsDashboardConsole from '@/components/EthicsDashboardConsole'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Keeping dashboard completely real-time

export default async function EthicsDashboardPage() {
  const { profile } = await getUserClearance()

  // Guard access: Ethics Liaison or O5-1 only
  const isEthicsLiaison = profile?.profession === 'Ethics Committee Liaison'
  const isO5 = profile?.is_o5_1

  if (!profile || (!isEthicsLiaison && !isO5)) {
    return (
      <div className="max-w-xl mx-auto py-12 font-mono">
        <TerminalCard status="error" statusText="LIAISON_ACCESS_DENIED" title="Access Denied">
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <ShieldAlert className="w-16 h-16 text-terminal-error animate-pulse" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              ETHICS COMMISSION SECURITY BARRIER
            </h3>
            <p className="text-xs text-terminal-error/90 leading-relaxed">
              THIS DECRYPTED DASHBOARD IS RESERVED FOR ETHICS COMMITTEE REPRESENTATIVES AND OVERSEERS ONLY.
              YOUR AGENT PERMISSIONS DO NOT AUTHENTICATE FOR COMPLAINT TRIAGE AND DISCIPLINARY HEARINGS.
            </p>
            <Link
              href="/"
              className="inline-block border border-terminal-border hover:border-terminal-primary px-4 py-2 text-xs transition-colors"
            >
              RETURN TO SAFETY PORTAL
            </Link>
          </div>
        </TerminalCard>
      </div>
    )
  }

  const supabase = await createClient()

  // 1. Fetch complaints joined with target profile metadata
  const { data: complaints, error } = await supabase
    .from('ethics_complaints')
    .select(`
      *,
      target_profile:user_profiles!target_user_id (
        username,
        profession,
        status
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <TerminalCard status="error" statusText="QUERY_FAILURE" title="Exception">
          <p className="text-xs text-terminal-error">{error.message}</p>
        </TerminalCard>
      </div>
    )
  }

  // 2. Fetch all profiles for disciplinary actions
  const { data: allProfiles } = await supabase
    .from('user_profiles')
    .select('*')
    .order('username', { ascending: true })

  // 3. Fetch system config configs
  const { data: systemConfigData } = await supabase
    .from('system_config')
    .select('*')

  const configMap: Record<string, string> = {
    ethics_compliance_score: '88',
    dclass_protocol: 'humane',
    whistleblower_protection: 'true',
    sentient_testing_block: 'true',
    termination_moratorium: 'false',
    auto_suspension_complaints: 'true',
    amnestic_ec_override: 'false',
    ethics_violation_condition: 'LEVEL_GREEN',
    ethics_censures: '[]',
  }

  systemConfigData?.forEach((cfg) => {
    configMap[cfg.key] = cfg.value
  })

  return (
    <EthicsDashboardConsole
      complaints={complaints as any || []}
      allProfiles={allProfiles || []}
      config={configMap}
    />
  )
}
