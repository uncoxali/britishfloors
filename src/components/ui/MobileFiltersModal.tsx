'use client';

import React from 'react';
import LeftSidebarFilters from './LeftSidebarFilters';

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
  brands?: string[];
  totalResults?: number;
}

const MobileFiltersModal: React.FC<MobileFiltersModalProps> = ({
  isOpen,
  onClose,
  categories,
  brands,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 lg:hidden'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Modal */}
      <div className='fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
            <button
              onClick={onClose}
              className='p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto'>
            <LeftSidebarFilters
              categories={categories}
              brands={brands}
              totalResults={totalResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFiltersModal;
