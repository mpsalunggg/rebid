'use client'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { closeDialog } from '@/store/dialog.slice'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createAuctionSchema,
  type CreateAuctionFormData,
} from '../auction.schema'
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import InputCalendar from '@/components/common/InputCalendar'
import { useGetItemsQuery } from '@/features/item/item.api'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import type { Item } from '@/features/item/item.type'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Form } from '@/components/ui/form'
import { useCreateAuctionMutation } from '../auction.api'
import { toast } from 'sonner'

export default function CreateAuctionDialog() {
  const dispatch = useDispatch()
  const { data: items } = useGetItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [createAuction, { isLoading }] = useCreateAuctionMutation()
  const form = useForm<CreateAuctionFormData>({
    resolver: zodResolver(createAuctionSchema),
    mode: 'onChange',
  })

  const onSubmit = (data: CreateAuctionFormData) => {
    createAuction(data)
      .unwrap()
      .then((response) => {
        toast.success(response.message)
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to create auction')
      })
      .finally(() => {
        dispatch(closeDialog())
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Create New Auction</DialogTitle>
          <DialogDescription>
            List your item for auction. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="item_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="item-id">Item ID</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items &&
                        items.data.map((item: Item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Describe your item..."
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="starting_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={Number.isFinite(field.value) ? field.value : ''}
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === '' ? 0 : Number(v))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <InputCalendar {...field} showTime minuteStep={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <InputCalendar {...field} showTime minuteStep={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Auction'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
