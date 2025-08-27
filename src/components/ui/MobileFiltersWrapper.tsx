'use client';

import React, { useState } from 'react';
import MobileFiltersModal from './MobileFiltersModal';

interface MobileFiltersWrapperProps {
  categories?: string[];
  brands?: string[];
  totalResults?: number;
}

const MobileFiltersWrapper: React.FC<MobileFiltersWrapperProps> = ({
  categories,
  brands,
  totalResults,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center'
      >
        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
          />
        </svg>
        Show Filters
      </button>

      <MobileFiltersModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        brands={brands}
        totalResults={totalResults}
      />
    </>
  );
};

export default MobileFiltersWrapper;
