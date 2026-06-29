import { getUserClearance } from '@/app/actions/scp'
import AuthForm from '@/components/AuthForm'

export const revalidate = 0 // Keep profile settings live

export default async function LoginPage() {
  const { user, profile } = await getUserClearance()

  return (
    <AuthForm
      user={user}
      profile={profile}
    />
  )
}
