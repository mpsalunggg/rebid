import { Card, CardContent } from '@/components/ui/card'
import { File } from 'lucide-react'

export default function EmptyAuctionState() {
  return (
    <Card>
      <CardContent className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <File />
        </div>
        <h3 className="text-lg font-medium mb-1">No auctions available</h3>
        <p className="text-sm text-muted-foreground">
          Check back later for new auctions
        </p>
      </CardContent>
    </Card>
  )
}
