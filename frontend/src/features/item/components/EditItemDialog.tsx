'use client'

import { useEffect } from 'react'
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import { closeDialog } from '@/store/dialog.slice'
import type { Item } from '@/features/item/item.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UpdateItemFormData, updateItemSchema } from '../item.schemas'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import EditItemImageZone from '@/features/item/components/EditItemImageZone'

interface EditItemDialogProps {
  item: Item
  onSubmit: (data: {
    name: string
    description: string
    keepImageIds: string[]
    newImages: File[]
  }) => void
}

export default function EditItemDialog({
  item,
  onSubmit,
}: EditItemDialogProps) {
  const dispatch = useDispatch()
  const existingImages = item.images ?? []
  const form = useForm<UpdateItemFormData>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      imageEdit: {
        keepImageIds: existingImages.map((img) => img.id),
        images: [],
      },
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const imgs = item.images ?? []
    form.reset({
      name: item.name,
      description: item.description,
      imageEdit: {
        keepImageIds: imgs.map((img) => img.id),
        images: [],
      },
    })
  }, [item.id, form, item.name, item.description, item.images])

  const handleFormSubmit = (values: UpdateItemFormData) => {
    const allowed = new Set((item.images ?? []).map((i) => i.id))
    const keepImageIds = values.imageEdit.keepImageIds.filter((id) =>
      allowed.has(id),
    )
    onSubmit({
      name: values.name,
      description: values.description,
      keepImageIds,
      newImages: values.imageEdit.images,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details for{' '}
            <span className="font-medium text-foreground">"{item.name}"</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input
                    id="edit-item-name"
                    placeholder="e.g. Vintage Camera"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="edit-item-description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-right text-muted-foreground">
                  {field.value?.length ?? 0} chars
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageEdit"
            render={({ field, fieldState }) => {
              const err = fieldState.error as
                | { message?: string; images?: { message?: string } }
                | undefined
              const inlineError = err?.message ?? err?.images?.message
              return (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <EditItemImageZone
                      existingImages={existingImages}
                      value={
                        field.value ?? {
                          keepImageIds: existingImages.map((img) => img.id),
                          images: [],
                        }
                      }
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      error={inlineError}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
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
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
