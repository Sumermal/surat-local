"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

interface GalleryImage {
  id: string
  image_url: string
  caption?: string | null
  caption_hi?: string | null
  is_primary?: boolean
}

interface ImageGalleryProps {
  images: GalleryImage[]
  primaryImage?: string | null
}

export function ImageGallery({ images, primaryImage }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { language } = useLanguage()

  // Combine primary image with gallery images
  const allImages: GalleryImage[] = []

  if (primaryImage && !images.some((img) => img.image_url === primaryImage)) {
    allImages.push({ id: "primary", image_url: primaryImage, is_primary: true })
  }

  allImages.push(...images)

  if (allImages.length === 0) {
    return null
  }

  const getCaption = (image: GalleryImage) => {
    if (language === "hi" && image.caption_hi) {
      return image.caption_hi
    }
    return image.caption
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? allImages.length - 1 : selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === allImages.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid gap-2 grid-cols-4 sm:grid-cols-5 lg:grid-cols-6">
        {allImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={image.image_url || "/placeholder.svg"}
              alt={getCaption(image) || `Image ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/30">
              <ZoomIn className="h-6 w-6 text-background opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {image.is_primary && (
              <div className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Main
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl p-0 bg-background/95 backdrop-blur-sm border-0">
          <div className="relative">
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 z-10 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Image */}
            {selectedIndex !== null && (
              <div className="relative aspect-video w-full">
                <Image
                  src={allImages[selectedIndex].image_url || "/placeholder.svg"}
                  alt={getCaption(allImages[selectedIndex]) || `Image ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Caption & Counter */}
            {selectedIndex !== null && (
              <div className="p-4">
                {getCaption(allImages[selectedIndex]) && (
                  <p className="text-foreground text-center mb-2">{getCaption(allImages[selectedIndex])}</p>
                )}
                <p className="text-center text-sm text-muted-foreground">
                  {selectedIndex + 1} / {allImages.length}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
