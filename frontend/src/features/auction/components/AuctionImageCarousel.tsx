'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { Image } from '@/features/auction/auction.type'
import { ImageIcon } from 'lucide-react'

export default function AuctionImageCarousel({ images }: { images: Image[] | null }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 rounded-xl border bg-muted/30 flex flex-col items-center justify-center gap-2">
        <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">No images</p>
      </div>
    )
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative w-full h-72 rounded-xl overflow-hidden border bg-muted/30">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-3" />
          <CarouselNext className="right-3" />
        </>
      )}
    </Carousel>
  )
}
