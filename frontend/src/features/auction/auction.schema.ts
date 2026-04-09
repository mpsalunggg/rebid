import { z } from 'zod'

export const createAuctionSchema = z
  .object({
    item_id: z.string().min(1, 'Item is required'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    starting_price: z.number().min(1000, 'Starting price must be at least Rp 1,000'),
    status: z.enum(['SCHEDULED', 'ACTIVE']),
    start_time: z.date({ message: 'Start time is required' }),
    end_time: z.date({ message: 'End time is required' }),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: 'End time must be after start time',
    path: ['end_time'],
  })

export type CreateAuctionFormData = z.infer<typeof createAuctionSchema>
