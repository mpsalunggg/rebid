import type { Image } from "../auction/auction.type"

export interface Item {
  id: string
  user_id: string
  name: string
  description: string
  images: Image[]
  created_at: string
  updated_at: string
}

export interface ItemUpdatePayload {
  name: string
  description: string
  keep_image_ids: string[]
  images: File[]
}