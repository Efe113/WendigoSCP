import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import O5ControlConsole from '@/components/O5ControlConsole'
import TerminalCard from '@/components/TerminalCard'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Admin console must be fully real-time

export default async function AdminPage() {
  const { profile } = await getUserClearance()

  // Guard access: only O5-1 has permissions
  if (!profile || !profile.is_o5_1) {
    return (
      <div className="max-w-xl mx-auto py-12 font-mono">
        <TerminalCard status="error" statusText="COMMAND_ACCESS_DENIED" title="Access Denied">
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <ShieldAlert className="w-16 h-16 text-terminal-error animate-pulse" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              O5-1 CRITICAL ACCESS FAILURE
            </h3>
            <p className="text-xs text-terminal-error/90 leading-relaxed">
              THIS TERMINAL PORTAL IS STRICTLY FOR O5-1 OVERSEER COMMAND ONLY. 
              YOUR ACCESS LEVEL IS INSUFFICIENT, AND AN INTRUDER LOG HAS BEEN SENT TO THE COGNITOHAZARD MONITORING GROUP.
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

  // 1. Fetch pending registrations
  const { data: pending } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('status', 'pending')
    .order('username', { ascending: true })

  // 2. Fetch all profiles (for metrics)
  const { data: all } = await supabase
    .from('user_profiles')
    .select('*')

  // 3. Fetch system config
  const { data: systemConfigData } = await supabase
    .from('system_config')
    .select('*')

  const configMap = {
    maintenance_mode: 'false',
    threat_level: 'LEVEL_GREEN',
  }

  systemConfigData?.forEach((cfg) => {
    if (cfg.key === 'maintenance_mode') {
      configMap.maintenance_mode = cfg.value
    } else if (cfg.key === 'threat_level') {
      configMap.threat_level = cfg.value
    }
  })

  return (
    <O5ControlConsole
      pendingProfiles={pending || []}
      allProfiles={all || []}
      config={configMap}
    />
  )
}
