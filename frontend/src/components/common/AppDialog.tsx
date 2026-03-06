'use client'

import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import type { RootState } from '@/store'
import { closeDialog, resetDialog } from '@/store/dialog.slice'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function AppDialog() {
  const dispatch = useDispatch()
  const { isOpen, component, maxWidth } = useSelector(
    (state: RootState) => state.dialog
  )
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(closeDialog())
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        dispatch(resetDialog())
      }, 200)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={maxWidth}>
        {component}
      </DialogContent>
    </Dialog>
  )
}
