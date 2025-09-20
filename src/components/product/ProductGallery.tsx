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
    <div>
      <div className='relative rounded-lg overflow-hidden bg-gray-50'>
        <div className='aspect-square w-full'>
          {images[activeIndex] ? (
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].altText || productTitle}
              width={1200}
              height={1600}
              className='h-full w-full object-cover'
              priority
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center text-gray-400'>
              No image
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className='mt-4 flex items-center gap-2 overflow-x-auto pb-2'>
          <button
            onClick={goToPrevious}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Previous image'
          >
            <svg
              className='w-5 h-5 text-gray-600'
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
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onImageSelect(idx)}
              className={`relative h-16 w-20 rounded-lg overflow-hidden border-2 ${
                activeIndex === idx ? 'border-blue-600' : 'border-gray-200'
              } flex-shrink-0 hover:border-blue-400 transition-colors`}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText || productTitle}
                fill
                className='object-cover'
              />
            </button>
          ))}
          <button
            onClick={goToNext}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Next image'
          >
            <svg
              className='w-5 h-5 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
