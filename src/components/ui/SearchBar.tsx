'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='relative'>
      <div className='relative'>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search for anything you want'
          className='w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400'
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
