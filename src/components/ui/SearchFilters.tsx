'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFiltersProps {
  categories?: string[];
  priceRanges?: { min: number; max: number; label: string }[];
  brands?: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories = ['Hardwood', 'Laminate', 'Vinyl', 'Carpet', 'Tile'],
  priceRanges = [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 500, label: '$200 - $500' },
    { min: 500, max: 1000, label: 'Over $500' },
  ],
  brands = ['Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett'],
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

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedPriceRange) params.set('price', selectedPriceRange);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (sortBy !== 'featured') params.set('sort', sortBy);

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedBrands([]);
    setSortBy('featured');
    router.push('/products');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    selectedPriceRange ||
    selectedBrands.length > 0 ||
    sortBy !== 'featured';

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Search & Filters</h3>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
            <h4 className='text-sm font-medium text-blue-900 mb-2'>Active Filters:</h4>
            <div className='space-y-1'>
              {searchQuery && (
                <div className='text-sm text-blue-800'>
                  <strong>Search:</strong> &quot;{searchQuery}&quot;
                </div>
              )}
              {selectedCategory && (
                <div className='text-sm text-blue-800'>
                  <strong>Category:</strong> {selectedCategory}
                </div>
              )}
              {selectedPriceRange && (
                <div className='text-sm text-blue-800'>
                  <strong>Price:</strong>{' '}
                  {priceRanges.find((r) => `${r.min}-${r.max}` === selectedPriceRange)?.label}
                </div>
              )}
              {selectedBrands.length > 0 && (
                <div className='text-sm text-blue-800'>
                  <strong>Brands:</strong> {selectedBrands.join(', ')}
                </div>
              )}
              {sortBy !== 'featured' && (
                <div className='text-sm text-blue-800'>
                  <strong>Sort:</strong>{' '}
                  {sortBy.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className='mb-4'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search products...'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Sort Options */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='featured'>Featured</option>
            <option value='price-low'>Price: Low to High</option>
            <option value='price-high'>Price: High to Low</option>
            <option value='name-asc'>Name: A to Z</option>
            <option value='name-desc'>Name: Z to A</option>
            <option value='newest'>Newest First</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Price Range</label>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>All Prices</option>
            {priceRanges.map((range) => (
              <option key={range.label} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Brands</label>
          <div className='space-y-2 max-h-32 overflow-y-auto'>
            {brands.map((brand) => (
              <label key={brand} className='flex items-center'>
                <input
                  type='checkbox'
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='ml-2 text-sm text-gray-700'>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2'>
          <button
            onClick={applyFilters}
            className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
