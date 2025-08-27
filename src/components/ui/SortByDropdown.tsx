'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SortByDropdownProps {
  currentSort: string;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ currentSort }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSortBy !== 'featured') {
      params.set('sort', newSortBy);
    } else {
      params.delete('sort');
    }

    router.push(`/products?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'discount', label: 'Best Deals' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className='flex items-center gap-3'>
      <label className='text-sm font-medium text-gray-700 flex items-center'>
        <svg
          className='w-4 h-4 mr-2 text-blue-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'
          />
        </svg>
        Sort By:
      </label>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[180px]'
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortByDropdown;
