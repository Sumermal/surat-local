"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Image from "next/image"
import { X, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface UploadedImage {
  id?: string
  url: string
  caption?: string
  caption_hi?: string
  is_primary?: boolean
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  listingId?: string
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, listingId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to upload images.",
          variant: "destructive",
        })
        return null
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from("listing-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error:", error)
        throw error
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      toast({
        title: "Maximum images reached",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      })
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    setIsUploading(true)

    const uploadedImages: UploadedImage[] = []

    for (const file of filesToUpload) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        })
        continue
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        })
        continue
      }

      const url = await uploadImage(file)
      if (url) {
        uploadedImages.push({
          url,
          is_primary: images.length === 0 && uploadedImages.length === 0,
        })
      }
    }

    if (uploadedImages.length > 0) {
      onImagesChange([...images, ...uploadedImages])
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedImages.length} image(s).`,
      })
    }

    setIsUploading(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [images, maxImages],
  )

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]

    // If the image has an ID, it's saved in the database
    if (imageToRemove.id && listingId) {
      try {
        const supabase = getSupabaseBrowserClient()
        await supabase.from("listing_images").delete().eq("id", imageToRemove.id)
      } catch (error) {
        console.error("Error removing image from database:", error)
      }
    }

    const newImages = images.filter((_, i) => i !== index)

    // If we removed the primary image, set the first remaining as primary
    if (imageToRemove.is_primary && newImages.length > 0) {
      newImages[0].is_primary = true
    }

    onImagesChange(newImages)
  }

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }))
    onImagesChange(newImages)
  }

  const updateCaption = (index: number, caption: string, isHindi = false) => {
    const newImages = [...images]
    if (isHindi) {
      newImages[index].caption_hi = caption
    } else {
      newImages[index].caption = caption
    }
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={isUploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-3">
                <ImagePlus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Drop images here or click to upload</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WebP or GIF (max 5MB each)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {images.length} / {maxImages} images uploaded
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Card key={image.url} className={image.is_primary ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.caption || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.is_primary && (
                    <div className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Primary
                    </div>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <Label className="text-xs">Caption (English)</Label>
                    <Input
                      value={image.caption || ""}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Add a caption..."
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Caption (Hindi)</Label>
                    <Input
                      value={image.caption_hi || ""}
                      onChange={(e) => updateCaption(index, e.target.value, true)}
                      placeholder="कैप्शन जोड़ें..."
                      className="h-8 text-sm"
                    />
                  </div>

                  {!image.is_primary && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setPrimaryImage(index)}
                    >
                      Set as Primary
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
