'use client'

import { useRef, useState } from 'react'
import { coursesApi } from '@lib/api/courses.api'
import { Button } from '@shared/components/ui/Button'

interface ThumbnailUploadProps {
  courseId: number
  thumbnailUrl?: string | null
}

export const ThumbnailUpload = ({ courseId, thumbnailUrl: initialUrl }: ThumbnailUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { thumbnailUrl } = await coursesApi.uploadThumbnail(courseId, file)
      setPreviewUrl(thumbnailUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Course thumbnail" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Click to upload thumbnail
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">
            Uploading...
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {previewUrl ? 'Change thumbnail' : 'Upload thumbnail'}
      </Button>
    </div>
  )
}
