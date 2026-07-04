import * as React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ImageSlider({ images, hotelName = "Hotel" }: ImageSliderProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-4xl aspect-[16/9] flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-400">Sem imagens disponíveis</span>
      </div>
    );
  }

  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.id}>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={image.url}
                alt={`${hotelName} - Imagem ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
