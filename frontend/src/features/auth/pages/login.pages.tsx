'use client'

import { useState } from 'react'
import {
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  LockIcon,
  UserIcon,
} from 'lucide-react'

import { InputGroup } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import ParticleLayout from '@/components/layout/ParticleLayout'
import { useLoginMutation } from '../auth.api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const [login, { isLoading, error }] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password }).unwrap()
      router.push('/')
    } catch {
      // Error sudah dari `error` di bawah
    }
  }

  return (
    <ParticleLayout>
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
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <LogInIcon className="size-4" />}
            Sign in
          </Button>
        </form>
      </div>
    </ParticleLayout>
  )
}
