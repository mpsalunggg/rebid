'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import ParticleLayout from '@/components/layout/ParticleLayout'
import { useGoogleLoginMutation } from '@/features/auth/auth.api'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLogin] = useGoogleLoginMutation()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return

    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Google authentication was cancelled or failed')
      router.push('/login')
      return
    }

    if (!code) {
      toast.error('No authorization code received from Google')
      router.push('/login')
      return
    }

    hasProcessed.current = true

    googleLogin({ code })
      .unwrap()
      .then(() => {
        toast.success('Login successful!')
        router.push('/')
      })
      .catch((err) => {
        toast.error(err?.message ?? 'Login failed. Please try again.')
        router.push('/login')
      })
  }, [searchParams, googleLogin, router])

  return (
    <ParticleLayout>
      <div className="absolute flex flex-col items-center justify-center gap-4">
        <Spinner className="size-12 text-primary" />
        <p className="text-muted-foreground text-sm">
          Authenticating with Google...
        </p>
      </div>
    </ParticleLayout>
  )
}
