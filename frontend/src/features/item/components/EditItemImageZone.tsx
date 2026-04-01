'use client'

import { XIcon } from 'lucide-react'
import type { Image } from '@/features/auction/auction.type'
import type { ImageEditValue } from '@/features/item/item.schemas'
import ImageDropzone from '@/components/common/ImageDropzone'

type EditItemImageZoneProps = {
  existingImages: Image[]
  value: ImageEditValue
  onChange: (next: ImageEditValue) => void
  onBlur?: () => void
  name?: string
  error?: string
}

export default function EditItemImageZone({
  existingImages,
  value,
  onChange,
  onBlur,
  name,
  error,
}: EditItemImageZoneProps) {
  const removedExisting = existingImages.filter(
    (img) => !value.keepImageIds.includes(img.id),
  )

  const toggleExisting = (imageId: string, isKept: boolean) => {
    if (isKept) {
      onChange({
        ...value,
        keepImageIds: value.keepImageIds.filter((id) => id !== imageId),
      })
    } else {
      onChange({
        ...value,
        keepImageIds: [...value.keepImageIds, imageId],
      })
    }
    onBlur?.()
  }

  return (
    <div className="space-y-4">
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Current images</p>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((img) => {
              const isKept = value.keepImageIds.includes(img.id)
              return (
                <div
                  key={img.id}
                  className={`relative aspect-square rounded-md overflow-hidden bg-muted group transition-opacity ${
                    isKept ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleExisting(img.id, isKept)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                  {!isKept && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-white font-medium bg-black/50 px-1.5 py-0.5 rounded">
                        Removed
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {removedExisting.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {removedExisting.length} image
              {removedExisting.length !== 1 ? 's' : ''} will be removed on save.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {existingImages.length > 0 ? 'Add new images' : 'Images'}
        </p>
        <ImageDropzone
          value={value.images}
          onChange={(images) => onChange({ ...value, images })}
          onBlur={onBlur}
          name={name ? `${name}-images` : 'imageEdit-images'}
          error={error}
        />
      </div>
    </div>
  )
}
