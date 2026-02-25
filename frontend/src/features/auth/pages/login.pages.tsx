'use client'

import { useState } from 'react'
import {
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  LockIcon,
  UserIcon,
} from 'lucide-react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { InputGroup } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import ParticleLayout from '@/components/layout/ParticleLayout'
import { useLoginMutation } from '../auth.api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

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
        </form>
      </div>
    </ParticleLayout>
  )
}
