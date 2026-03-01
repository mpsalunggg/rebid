export interface Auction {
  id: string
  created_by: string
  item_id: string
  item: Item
  user: UserDetail
  starting_price: number
  current_price: number
  start_time: string
  end_time: string
  current_bidder_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  user_id: string
  name: string
  description: string
  images: Image[]
  created_at: string
  updated_at: string
}

export interface Image {
  id: string
  item_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  created_at: string
}

export interface UserDetail {
  name: string
  email: string
}