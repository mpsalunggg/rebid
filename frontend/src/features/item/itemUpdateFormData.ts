/**
 * Builds multipart FormData for PUT/PATCH /api/v1/items/:id (see Go handler: name, description, keep_image_ids[], images).
 */
export type UpdateItemPayload = {
  name: string
  description: string
  keepImageIds: string[]
  newImages: File[]
}

export function buildUpdateItemFormData(data: UpdateItemPayload): FormData {
  const fd = new FormData()
  fd.append('name', data.name)
  fd.append('description', data.description)
  data.keepImageIds.forEach((id) => {
    fd.append('keep_image_ids', id)
  })
  data.newImages.forEach((file) => {
    fd.append('images', file)
  })
  return fd
}
