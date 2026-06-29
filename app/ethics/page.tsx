import { createClient } from '@/utils/supabase/server'
import { getUserClearance } from '@/app/actions/scp'
import EthicsComplaintForm from '@/components/EthicsComplaintForm'

export const revalidate = 0 // Keeping forms and selection lists real-time

export default async function EthicsPage() {
  const { profile } = await getUserClearance()
  
  const supabase = await createClient()

  // Fetch profiles (excluding O5-1 to protect O5 anonymity)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, username, profession')
    .eq('is_o5_1', false)
    .order('username', { ascending: true })

  const isEthicsModerator = !!profile && (profile.is_o5_1 || profile.profession === 'Ethics Committee Liaison')

  return (
    <EthicsComplaintForm
      profiles={profiles || []}
      isEthicsModerator={isEthicsModerator}
    />
  )
}
