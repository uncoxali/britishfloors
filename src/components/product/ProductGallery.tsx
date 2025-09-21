import React, { useEffect } from 'react';
import Image from 'next/image';
import { GalleryProps } from '@/types/product';

const ProductGallery: React.FC<GalleryProps> = ({
  images,
  activeIndex,
  onImageSelect,
  productTitle,
}) => {
  const goToPrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    onImageSelect(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    onImageSelect(newIndex);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, images.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className='w-full'>
      {/* Main Image */}
      <div className='relative rounded-xl overflow-hidden bg-gray-50 shadow-lg'>
        <div className='aspect-square w-full'>
          {images[activeIndex] ? (
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].altText || productTitle}
              width={1000}
              height={1000}
              className='h-full w-full object-cover'
              priority
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center text-gray-400'>
              <svg className='w-16 h-16' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation arrows on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className='absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110'
              aria-label='Previous image'
            >
              <svg
                className='w-4 h-4 text-gray-700'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110'
              aria-label='Next image'
            >
              <svg
                className='w-4 h-4 text-gray-700'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className='absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full'>
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className='mt-3 flex justify-center gap-2 overflow-x-auto pb-2'>
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onImageSelect(idx)}
              className={`relative h-12 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                activeIndex === idx
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:scale-105'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText || productTitle}
                fill
                className='object-cover'
              />
            </button>
          ))}
          {images.length > 5 && (
            <div className='flex items-center justify-center h-12 w-16 bg-gray-100 rounded-lg border-2 border-gray-200 text-xs text-gray-500'>
              +{images.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
