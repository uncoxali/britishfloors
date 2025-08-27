'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchResultsFiltersProps {
  categories?: string[];
  brands?: string[];
  totalResults?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  onFiltersChange?: (filters: {
    search?: string;
    category?: string;
    priceRange?: string;
    brands?: string[];
    sortBy?: string;
    limit?: number;
  }) => void;
}

const SearchResultsFilters: React.FC<SearchResultsFiltersProps> = ({
  categories = ['Laminate', 'Vinyl (LVT)', 'Engineered Wood', 'Parquet', 'Carpet', 'Tile'],
  brands = ['Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett'],
  totalResults = 0,
  currentPage = 1,
  hasNextPage = false,
  onFiltersChange,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands')?.split(',').filter(Boolean) || [],
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [isExpanded, setIsExpanded] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(parseInt(searchParams.get('limit') || '20'));

  const priceRanges = [
    { min: 0, max: 25, label: 'Under £25' },
    { min: 25, max: 50, label: '£25 - £50' },
    { min: 50, max: 100, label: '£50 - £100' },
    { min: 100, max: 200, label: '£100 - £200' },
    { min: 200, max: 500, label: '£200 - £500' },
    { min: 500, max: 1000, label: 'Over £500' },
  ];

  const sortOptions = [
    { value: 'featured', label: '✨ Featured', icon: '✨' },
    { value: 'price-low', label: '💰 Price: Low to High', icon: '↗️' },
    { value: 'price-high', label: '💰 Price: High to Low', icon: '↘️' },
    { value: 'name-asc', label: '📝 Name: A to Z', icon: '🔤' },
    { value: 'name-desc', label: '📝 Name: Z to A', icon: '🔤' },
    { value: 'discount', label: '🏷️ Best Deals', icon: '🏷️' },
    { value: 'newest', label: '🆕 Newest First', icon: '🆕' },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedPriceRange) params.set('price', selectedPriceRange);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (resultsPerPage !== 20) params.set('limit', resultsPerPage.toString());

    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl);

    // Call callback if provided
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        priceRange: selectedPriceRange,
        brands: selectedBrands,
        sortBy,
        limit: resultsPerPage,
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedBrands([]);
    setSortBy('featured');
    setResultsPerPage(20);

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

  const hasActiveFilters =
    selectedCategory || selectedPriceRange || selectedBrands.length > 0 || sortBy !== 'featured';

  const activeFiltersCount = [
    selectedCategory,
    selectedPriceRange,
    selectedBrands.length > 0,
    sortBy !== 'featured',
  ].filter(Boolean).length;

  // Auto-expand if there are active filters or search query
  useEffect(() => {
    if (hasActiveFilters || searchQuery) {
      setIsExpanded(true);
    }
  }, [hasActiveFilters, searchQuery]);

  return (
    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-lg'>
      {/* Header */}
      <div className='p-6 border-b border-blue-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
              <svg
                className='w-6 h-6 text-white'
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
              <h3 className='text-xl font-bold text-gray-900'>Search & Filter</h3>
              <p className='text-sm text-gray-600'>
                {totalResults} results found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            {hasActiveFilters && (
              <div className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                {activeFiltersCount} Active
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='p-2 text-gray-600 hover:text-blue-600 transition-colors'
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
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
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className='p-6 space-y-6'>
          {/* Quick Actions for Search */}
          {searchQuery && (
            <div className='bg-blue-100 border border-blue-300 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='w-5 h-5 text-blue-600'
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
                  <span className='text-sm font-medium text-blue-900'>
                    Searching for: &ldquo;{searchQuery}&rdquo;
                  </span>
                </div>
                <button
                  onClick={clearSearch}
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  Clear search ✕
                </button>
              </div>
            </div>
          )}

          {/* Main Filter Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Sort Options */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 flex items-center'>
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
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 flex items-center'>
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
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                </svg>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
              >
                <option value=''>🏠 All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 flex items-center'>
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
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
              >
                <option value=''>💎 All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Per Page */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700 flex items-center'>
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
                    d='M4 6h16M4 10h16M4 14h16M4 18h16'
                  />
                </svg>
                Show Per Page
              </label>
              <select
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(parseInt(e.target.value))}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
              >
                <option value={12}>12 items</option>
                <option value={20}>20 items</option>
                <option value={40}>40 items</option>
                <option value={60}>60 items</option>
              </select>
            </div>
          </div>

          {/* Brand Filter */}
          <div className='space-y-3'>
            <label className='text-sm font-semibold text-gray-700 flex items-center'>
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
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
              Brands
            </label>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-32 overflow-y-auto p-3 bg-gray-50 rounded-lg'>
              {brands.map((brand) => (
                <label
                  key={brand}
                  className='flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors'
                >
                  <input
                    type='checkbox'
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 font-medium'>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-200'>
            <button
              onClick={applyFilters}
              className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              <svg
                className='w-5 h-5 mr-2 inline'
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
              Apply Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold'
              >
                <svg
                  className='w-5 h-5 mr-2 inline'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsFilters;
