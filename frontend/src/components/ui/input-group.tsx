'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface InputGroupProps extends Omit<
  React.ComponentProps<typeof Input>,
  'size'
> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  onTrailingClick?: () => void
  loading?: boolean
  trailingAriaLabel?: string
  trailingDisabled?: boolean
  trailingSize?: 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg'
}

function InputGroup({
  leadingIcon,
  trailingIcon,
  onTrailingClick,
  loading = false,
  trailingAriaLabel,
  trailingDisabled = false,
  trailingSize = 'icon-sm',
  className,
  ...inputProps
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'flex h-9 w-full items-center gap-1 rounded-md border border-input bg-transparent px-2 shadow-xs transition-[color,box-shadow] dark:bg-input/30',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'has-[[data-slot=trailing-button][disabled]]:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
    >
      {leadingIcon && (
        <span
          data-slot="leading-icon"
          className="text-muted-foreground flex shrink-0 items-center [&>svg]:size-4"
        >
          {leadingIcon}
        </span>
      )}
      <Input
        data-slot="input"
        className={cn(
          'min-h-0 flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
        )}
        {...inputProps}
      />
      {onTrailingClick && (trailingIcon || loading) && (
        <Button
          data-slot="trailing-button"
          type="button"
          variant="ghost"
          size={trailingSize}
          className="shrink-0"
          onClick={onTrailingClick}
          disabled={trailingDisabled || loading}
          aria-label={trailingAriaLabel}
        >
          {loading ? <Spinner className="size-4" /> : trailingIcon}
        </Button>
      )}
    </div>
  )
}

export { InputGroup }
