'use client'

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { closeDialog } from '@/store/dialog.slice'
import type { Item } from '@/features/item/item.type'
import { Spinner } from '@/components/ui/spinner'

interface DeleteItemDialogProps {
  item: Item
  onConfirm: () => void
  isLoading: boolean
}

export default function DeleteItemDialog({
  item,
  onConfirm,
  isLoading,
}: DeleteItemDialogProps) {
  const dispatch = useDispatch()
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-lg">Delete Item?</DialogTitle>
        </div>
        <DialogDescription className="text-sm leading-relaxed">
          This action cannot be undone. The item{' '}
          <span className="font-semibold text-foreground">"{item.name}"</span>{' '}
          and all its associated images will be permanently removed.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-700 dark:text-red-300">
          Are you absolutely sure you want to delete this item?
        </p>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(closeDialog())}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          Delete Item
        </Button>
      </DialogFooter>
    </>
  )
}
