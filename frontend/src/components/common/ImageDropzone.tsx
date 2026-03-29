import { useEffect, useMemo, useRef, useState } from 'react'
import { UploadCloudIcon, XIcon } from 'lucide-react'
import { MAX_IMAGE_BYTES } from '@/constants/images'

interface ImageDropzoneProps {
  value: File[]
  onChange: (files: File[]) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
  error?: string
}

export default function ImageDropzone({
  value,
  onChange,
  onBlur,
  name,
  disabled,
  error,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = name ? `${name}-file` : 'image-dropzone-file'

  const previewUrls = useMemo(
    () => value.map((file) => URL.createObjectURL(file)),
    [value],
  )

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const appendFiles = (files: FileList | null) => {
    if (disabled || !files?.length) return

    const next = Array.from(files).filter(
      (f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_BYTES,
    )
    if (next.length === 0) return

    onChange([...value, ...next])
    onBlur?.()

    const input = fileInputRef.current
    if (input) input.value = ''
  }

  const removeImage = (idx: number) => {
    if (disabled) return
    onChange(value.filter((_, i) => i !== idx))
    onBlur?.()
  }

  return (
    <div className="space-y-2">
      <input
        id={inputId}
        ref={fileInputRef}
        name={name}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={(e) => appendFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return
          fileInputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          if (disabled) return
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          if (disabled) return
          e.preventDefault()
          setIsDragging(false)
          appendFiles(e.dataTransfer.files)
        }}
        className={`rounded-lg border border-dashed p-6 flex flex-col items-center gap-2 transition-colors ${
          disabled
            ? 'cursor-not-allowed opacity-50 border-muted-foreground/25'
            : `cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-muted-foreground/25 hover:border-emerald-400 hover:bg-muted/30'
              }`
        }`}
      >
        <UploadCloudIcon className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          <span className="font-medium text-emerald-600">Click to upload</span>{' '}
          or drag & drop
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP up to {MAX_IMAGE_BYTES / 1024 / 1024}MB each
        </p>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {value.map((file, idx) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${idx}`}
              className="relative aspect-square rounded-md overflow-hidden bg-muted group"
            >
              <img
                src={previewUrls[idx]}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(idx)
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
