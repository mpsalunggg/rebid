import { MAX_IMAGE_BYTES } from '@/constants/images'
import * as z from 'zod'

export const itemFormSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(3, 'name must be between 3 and 255 characters')
    .max(255, 'name must be between 3 and 255 characters'),
  description: z
    .string({ error: 'Description is required' })
    .trim()
    .min(10, 'description must be at least 10 characters'),
})

export type ItemFormData = z.infer<typeof itemFormSchema>

export const createItemSchema = itemFormSchema.extend({
  images: z
    .array(z.instanceof(File, { error: 'Images are required' }))
    .min(1, 'images is required')
    .refine((files) => files.every((f) => f.type.startsWith('image/')), {
      message: 'all files must be images',
    })
    .refine((files) => files.every((f) => f.size <= MAX_IMAGE_BYTES), {
      message: 'each image must be at most 10MB',
    }),
})

export type CreateItemFormData = z.infer<typeof createItemSchema>

const updateNewFilesSchema = z
  .array(z.instanceof(File, { error: 'Invalid file' }))
  .refine((files) => files.every((f) => f.type.startsWith('image/')), {
    message: 'all files must be images',
  })
  .refine((files) => files.every((f) => f.size <= MAX_IMAGE_BYTES), {
    message: 'each image must be at most 10MB',
  })

export const imageEditSchema = z.object({
  keepImageIds: z.array(z.string()),
  images: updateNewFilesSchema,
})

export type ImageEditValue = z.infer<typeof imageEditSchema>

export const updateItemSchema = itemFormSchema
  .extend({
    imageEdit: imageEditSchema,
  })
  .refine(
    (data) =>
      data.imageEdit.keepImageIds.length > 0 ||
      data.imageEdit.images.length > 0,
    {
      message:
        'Add at least one new image when no existing images are kept',
      path: ['imageEdit', 'images'],
    },
  )

export type UpdateItemFormData = z.infer<typeof updateItemSchema>
