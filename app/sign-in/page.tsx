import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import SismoButton from '@/components/sismo-button'
import { redirect } from 'next/navigation'

export default function SignInPage() {
  const { data: session, error } = auth();

  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      {/* Your original LoginButton */}
      <LoginButton />
      {/* Your SismoConnectButton */}
      <SismoButton />
    </div>
  )
}