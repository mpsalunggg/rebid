export const ITEM_API_MESSAGES = {
  itemsRetrieved: 'Items retrieved successfully',
  itemCreated: 'Item created successfully',
  itemUpdated: 'Item updated successfully',
  itemDeleted: 'Item deleted successfully',
} as const

export const sampleMyItemRow = {
  id: 'f3dd606c-4743-470e-bee5-312d1695eb06',
  name: 'test10',
}

export const sampleItemResponse = {
  id: 'mock-item-id',
  user_id: 'mock-user-id',
  name: 'Mock item',
  description: 'Created via MSW mock',
  images: [] as {
    id: string
    item_id: string
    url: string
    filename: string
    mime_type: string
    size: number
    created_at: string
  }[],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
