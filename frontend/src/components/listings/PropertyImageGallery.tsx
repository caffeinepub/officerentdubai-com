import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { ExternalBlob } from '../../backend';

interface PropertyImageGalleryProps {
  images: ExternalBlob[];
  title: string;
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
        <img
          src={images[selectedIndex].getDirectURL()}
          alt={`${title} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4 md:basis-1/5 lg:basis-1/6">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedIndex === index
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <img
                    src={image.getDirectURL()}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}
