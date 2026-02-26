'use client'

import { useState, useEffect } from 'react'
import type { CredentialResponse, accounts } from 'google-one-tap'
import {
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  LockIcon,
  UserIcon,
} from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

import { InputGroup } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import ParticleLayout from '@/components/layout/ParticleLayout'
import { useLoginMutation, useGoogleOneTapLoginMutation } from '../auth.api'
import { Separator } from '@/components/ui/separator'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_GSI_CLIENT,
  GOOGLE_LOGIN_URL,
} from '@/constants/google'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const [googleOneTapLogin, { isLoading: isOneTapLoading }] =
    useGoogleOneTapLoginMutation()
  const [gsiReady, setGsiReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !gsiReady || typeof window === 'undefined') return
    const id = (window as Window & { google?: { accounts: accounts } }).google
      ?.accounts?.id
    if (!id) return
    id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: CredentialResponse) => {
        if (!response?.credential) return
        googleOneTapLogin({ credential: response.credential })
          .unwrap()
          .then(() => {
            toast.success('Login success')
            router.push('/')
          })
          .catch((err) => {
            toast.error(err?.message ?? 'Google login failed')
          })
      },
    })
    id.prompt()
  }, [GOOGLE_CLIENT_ID, gsiReady, googleOneTapLogin, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login({ email, password })
      .unwrap()
      .then((response) => {
        toast.success(response.message || 'Login success')
        router.push('/')
      })
      .catch((error) => {
        toast.error(error.message || 'Login failed')
      })
  }

  return (
    <ParticleLayout>
      <Script
        src={GOOGLE_GSI_CLIENT}
        strategy="afterInteractive"
        onLoad={() => setGsiReady(true)}
      />
      <div className="absolute w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Image src="rebid.svg" alt="Rebid" width={40} height={40} />

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Rebid App
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Sign in to your account
            </p>
          </div>

          <FieldGroup className="w-full gap-5">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leadingIcon={<UserIcon />}
                autoComplete="email"
                required
                disabled={isLoading}
                className="dark:bg-input"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leadingIcon={<LockIcon />}
                trailingIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                onTrailingClick={() => setShowPassword((prev) => !prev)}
                trailingAriaLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
                autoComplete="current-password"
                required
                disabled={isLoading}
                className="dark:bg-input"
              />
            </Field>
          </FieldGroup>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-emerald-500 hover:text-primary"
            >
              Register
            </Link>
          </p>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <LogInIcon className="size-4" />}
            Sign in
          </Button>

          <div className="w-full">
            <div className="relative flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="shrink-0 px-2 text-xs text-muted-foreground uppercase">
                OR
              </span>
              <Separator className="flex-1" />
            </div>
          </div>

          <Link
            href={GOOGLE_LOGIN_URL}
            className={cn(
              'flex items-center bg-card justify-center text-sm gap-2 w-full border border-input rounded-md px-4 py-2 hover:bg-primary/10',
              (isOneTapLoading || isLoading) &&
                'pointer-events-none opacity-50 cursor-not-allowed',
            )}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <span>Sign in with Google</span>
          </Link>
        </form>
      </div>
    </ParticleLayout>
  )
}
