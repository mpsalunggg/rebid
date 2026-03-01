import { BASE_URL } from '@/constants/url'
import type { Auction } from '../auction.type'
import { Image } from 'lucide-react'

export default function BentoGridImages({
  images,
}: {
  images: Auction['item']['images']
}) {
  const imageCount = images.length

  if (imageCount === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-400">
          <Image />
          <span className="text-xs">No image</span>
        </div>
      </div>
    )
  }

  if (imageCount === 1) {
    return (
      <div className="w-full h-72 overflow-hidden rounded-lg flex justify-center bg-gray-100 dark:bg-gray-800">
        <img
          src={`${BASE_URL}/${images[0].url}`}
          alt="Auction item"
          className="w-full h-full object-cover object-center"
        />
      </div>
    )
  }

  if (imageCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full h-72">
        <div className="overflow-hidden rounded-lg h-full">
          <img
            src={`${BASE_URL}/${images[0].url}`}
            alt="Auction item"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-lg h-full">
          <img
            src={`${BASE_URL}/${images[1].url}`}
            alt="Auction item"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-72">
      <div className="row-span-2 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={`${BASE_URL}/${images[0].url}`}
          alt="Auction item"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="overflow-hidden rounded-lg h-full">
        <img
          src={`${BASE_URL}/${images[1].url}`}
          alt="Auction item"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative overflow-hidden rounded-lg h-full">
        <img
          src={`${BASE_URL}/${images[2].url}`}
          alt="Auction item"
          className="w-full h-full object-cover"
        />
        {imageCount > 3 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg">
              +{imageCount - 3}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
