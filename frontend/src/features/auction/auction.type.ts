import { Item } from '../item/item.type'

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

export interface Bid {
  id: string
  auction_id: string
  user_id: string
  amount: number
  created_at: string
  user: UserDetail
}

export interface AuctionWsMessage {
  event: string
  change: string
  auction: Auction
  current_price: number
  current_bidder_id: string
  bids: Bid[]
}

export interface AuctionDetail {
  auction: Auction
  bids: Bid[]
}
