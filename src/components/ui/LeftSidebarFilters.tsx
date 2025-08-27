'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LeftSidebarFiltersProps {
  categories?: string[];
  brands?: string[];
  totalResults?: number;
}

const LeftSidebarFilters: React.FC<LeftSidebarFiltersProps> = ({
  categories = ['Laminate', 'Vinyl (LVT)', 'Engineered Wood', 'Parquet', 'Carpet', 'Tile'],
  brands = ['Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett', 'Quick-Step', 'Pergo'],
  totalResults = 0,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands')?.split(',').filter(Boolean) || [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('colors')?.split(',').filter(Boolean) || [],
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  // Accordion states
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['categories', 'price', 'sort']),
  );

  const priceRanges = [
    { min: 0, max: 25, label: 'Under £25' },
    { min: 25, max: 50, label: '£25 - £50' },
    { min: 50, max: 100, label: '£50 - £100' },
    { min: 100, max: 200, label: '£100 - £200' },
    { min: 200, max: 500, label: '£200 - £500' },
    { min: 500, max: 1000, label: 'Over £500' },
  ];

  // Note: sort options are handled via 'sortBy' state and applyFilters

  const colors = [
    { name: 'Natural', value: 'natural', hex: '#D4A574' },
    { name: 'Oak', value: 'oak', hex: '#8B4513' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Grey', value: 'grey', hex: '#808080' },
    { name: 'Black', value: 'black', hex: '#2C2C2C' },
    { name: 'Walnut', value: 'walnut', hex: '#5D4037' },
    { name: 'Beige', value: 'beige', hex: '#F5F5DC' },
    { name: 'Brown', value: 'brown', hex: '#964B00' },
  ];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedPriceRange) params.set('price', selectedPriceRange);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (sortBy !== 'featured') params.set('sort', sortBy);

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedBrands([]);
    setSelectedColors([]);
    setSortBy('featured');

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);

    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.push('/products');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedPriceRange ||
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    sortBy !== 'featured';

  // Apply filters manually instead of auto-apply
  const handleApplyFilters = () => {
    applyFilters();
  };

  return (
    <div className='w-full bg-white border border-gray-200 rounded-lg shadow-sm h-fit sticky top-4'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>Filters</h3>
            <p className='text-sm text-gray-600'>{totalResults} products</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Search</label>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search products...'
              className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
              {searchQuery ? (
                <button onClick={clearSearch} className='text-gray-400 hover:text-gray-600'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              ) : (
                <svg
                  className='w-4 h-4 text-gray-400'
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
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-blue-900'>Active Filters</span>
              <button
                onClick={clearAllFilters}
                className='text-xs text-blue-600 hover:text-blue-800 font-medium'
              >
                Clear All
              </button>
            </div>
            <div className='flex flex-wrap gap-1'>
              {selectedCategory && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-800'>
                  {selectedCategory}
                </span>
              )}
              {selectedPriceRange && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-200 text-green-800'>
                  {priceRanges.find((r) => `${r.min}-${r.max}` === selectedPriceRange)?.label}
                </span>
              )}
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-200 text-orange-800'
                >
                  {brand}
                </span>
              ))}
              {selectedColors.map((color) => (
                <span
                  key={color}
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-200 text-purple-800'
                >
                  {colors.find((c) => c.value === color)?.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion Sections */}
      <div className='divide-y divide-gray-200'>
        {/* Categories Section */}
        <div className='p-4'>
          <button
            onClick={() => toggleSection('categories')}
            className='flex items-center justify-between w-full text-left'
          >
            <span className='text-sm font-semibold text-gray-900'>Categories</span>
            <svg
              className={`w-4 h-4 text-gray-500 transform transition-transform ${
                openSections.has('categories') ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {openSections.has('categories') && (
            <div className='mt-3 space-y-2'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  name='category'
                  value=''
                  checked={selectedCategory === ''}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span className='ml-3 text-sm text-gray-700'>All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    name='category'
                    value={category.toLowerCase()}
                    checked={selectedCategory === category.toLowerCase()}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                  />
                  <span className='ml-3 text-sm text-gray-700'>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className='p-4'>
          <button
            onClick={() => toggleSection('price')}
            className='flex items-center justify-between w-full text-left'
          >
            <span className='text-sm font-semibold text-gray-900'>Price Range</span>
            <svg
              className={`w-4 h-4 text-gray-500 transform transition-transform ${
                openSections.has('price') ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {openSections.has('price') && (
            <div className='mt-3 space-y-2'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  name='price'
                  value=''
                  checked={selectedPriceRange === ''}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span className='ml-3 text-sm text-gray-700'>All Prices</span>
              </label>
              {priceRanges.map((range) => (
                <label key={range.label} className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    name='price'
                    value={`${range.min}-${range.max}`}
                    checked={selectedPriceRange === `${range.min}-${range.max}`}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                  />
                  <span className='ml-3 text-sm text-gray-700'>{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands Section */}
        <div className='p-4'>
          <button
            onClick={() => toggleSection('brands')}
            className='flex items-center justify-between w-full text-left'
          >
            <span className='text-sm font-semibold text-gray-900'>Brands</span>
            <svg
              className={`w-4 h-4 text-gray-500 transform transition-transform ${
                openSections.has('brands') ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {openSections.has('brands') && (
            <div className='mt-3 space-y-2 max-h-48 overflow-y-auto'>
              {brands.map((brand) => (
                <label key={brand} className='flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='ml-3 text-sm text-gray-700'>{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors Section */}
        <div className='p-4'>
          <button
            onClick={() => toggleSection('colors')}
            className='flex items-center justify-between w-full text-left'
          >
            <span className='text-sm font-semibold text-gray-900'>Colors</span>
            <svg
              className={`w-4 h-4 text-gray-500 transform transition-transform ${
                openSections.has('colors') ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {openSections.has('colors') && (
            <div className='mt-3 space-y-3'>
              <div className='grid grid-cols-4 gap-3'>
                {colors.map((color) => (
                  <label
                    key={color.value}
                    className='flex flex-col items-center cursor-pointer group'
                  >
                    <div className='relative'>
                      <div
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColors.includes(color.value)
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-300 group-hover:border-gray-400'
                        } ${color.value === 'white' ? 'border-gray-400' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColors.includes(color.value) && (
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <svg
                              className={`w-4 h-4 ${
                                color.value === 'white' || color.value === 'beige'
                                  ? 'text-gray-600'
                                  : 'text-white'
                              }`}
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <input
                        type='checkbox'
                        checked={selectedColors.includes(color.value)}
                        onChange={() => toggleColor(color.value)}
                        className='sr-only'
                      />
                    </div>
                    <span className='text-xs text-gray-600 mt-1 text-center leading-tight'>
                      {color.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <div className='p-4 border-t border-gray-200'>
        <button
          onClick={handleApplyFilters}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium'
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default LeftSidebarFilters;
