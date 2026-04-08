/**
 * HeroImage Component
 * Displays the hero image for the calendar
 * Responsive and maintains aspect ratio
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroImageProps {
  imageUrl: string | null;
  monthYear: string;
  onImageChange?: (url: string) => void;
}

export function HeroImage({ imageUrl, monthYear, onImageChange }: HeroImageProps) {
  const [imageError, setImageError] = useState(false);

  // Default placeholder image (mountain/outdoor theme)
  const defaultImageUrl =
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop';

  const displayUrl = imageUrl && !imageError ? imageUrl : defaultImageUrl;

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-lg bg-gray-200">
        <Image
          src={displayUrl}
          alt={`Calendar for ${monthYear}`}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />

        {/* Month/Year Overlay Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm font-bold text-gray-900">{monthYear}</p>
        </div>
      </div>

      {/* Image Upload / Change Section */}
      {onImageChange && (
        <div className="text-center">
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const url = event.target?.result as string;
                    onImageChange(url);
                    setImageError(false);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
              📸 Change Image
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
