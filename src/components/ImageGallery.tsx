"use client";

import { useState } from "react";
import { ProductImage } from "@/types/product";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || productName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`View ${image.alt || `image ${index + 1}`}`}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-24 overflow-hidden flex-shrink-0 transition-opacity ${
                selectedIndex === index
                  ? "ring-2 ring-black ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
