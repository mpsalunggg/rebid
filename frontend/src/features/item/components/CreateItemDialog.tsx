'use client'

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
import {
  type CreateItemFormData,
  createItemSchema,
} from '../item.schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  Form,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import ImageDropzone from '@/components/common/ImageDropzone'

interface CreateItemDialogProps {
  onSubmit: (data: {
    name: string
    description: string
    images: File[]
  }) => void
}

export default function CreateItemDialog({ onSubmit }: CreateItemDialogProps) {
  const dispatch = useDispatch()
  const form = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: '',
      description: '',
      images: [],
    },
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add an item to your collection. You can list it for auction later.
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
                    id="item-name"
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
                    id="item-description"
                    placeholder="Describe your item in detail..."
                    {...field}
                    rows={4}
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageDropzone
                    value={field.value ?? []}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
            Add Item
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
