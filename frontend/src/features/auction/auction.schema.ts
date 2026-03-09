import { z } from 'zod'

export const createAuctionSchema = z
  .object({
    itemName: z.string().min(3, 'Item name must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    startingPrice: z.number().min(1000, 'Starting price must be at least Rp 1,000'),
    status: z.enum(['SCHEDULED', 'ACTIVE']),
    startTime: z.date({ message: 'Start time is required' }),
    endTime: z.date({ message: 'End time is required' }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export type CreateAuctionFormData = z.infer<typeof createAuctionSchema>
