'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'

interface InputCalendarProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export default function InputCalendar({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
}: InputCalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={`w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground ${className}`}
        >
          {value ? format(value, 'PPP p') : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  )
}
