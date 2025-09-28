'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSearch, SearchProduct } from '@/hooks/useSearch';
import SampleOrderModal from './SampleOrderModal';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';
import { shopifyApi } from '@/lib/shopify/api';

const SearchBar: React.FC = () => {
  const { query, setQuery, results, isLoading, error } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(null); // Unused variable
  const [, setSelectedProduct] = useState<SearchProduct | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isAddingSample, setIsAddingSample] = useState<string | null>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { addItem, isProductInCart } = useCartStore();
  const { open: openCart } = useCartDrawerStore();

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (product: SearchProduct) => {
    setIsSearchOpen(false);
    router.push(`/products/${product.handle}`);
  };

  const handleViewAllResults = () => {
    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleOrderSample = async (e: React.MouseEvent, product: SearchProduct) => {
    e.stopPropagation();

    // Check if sample is already in cart
    if (isProductInCart(product.id, true)) {
      openCart();
      return;
    }

    setIsAddingSample(product.id);
    try {
      // Get full product data from Shopify API
      const response = await shopifyApi.getProductByHandle(product.handle);
      const fullProduct = response.product;

      // Check if fullProduct exists before accessing its properties
      if (fullProduct) {
        // Add sample to cart (using first variant)
        const firstVariant = fullProduct.variants?.edges[0]?.node;
        if (firstVariant) {
          addItem(fullProduct, firstVariant, 1, true); // Pass true for isSample
          // Open cart drawer after adding sample
          openCart();
        }
      }
    } catch (error) {
      console.error('Error adding sample to cart:', error);
      // Fallback to modal if API call fails
      setSelectedProduct(product);
      setIsSampleModalOpen(true);
    } finally {
      setIsAddingSample(null);
    }
    setIsSearchOpen(false);
  };

  const closeSampleModal = () => {
    setIsSampleModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className='relative' ref={searchRef}>
        <form onSubmit={handleSubmit} className='relative'>
          <div className='relative'>
            <input
              type='text'
              value={query}
              onChange={handleSearchChange}
              onFocus={() => query.trim().length >= 2 && setIsSearchOpen(true)}
              placeholder='Search for flooring products...'
              className='w-full pl-12 pr-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-gray-900'
            />
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
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

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <div className='absolute top-full left-0 right-0 mt-1 z-[9999]'>
            <div className='bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-4xl'>
              {isLoading ? (
                <div className='p-6 text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                  <p className='mt-2 text-gray-600'>Searching...</p>
                </div>
              ) : error ? (
                <div className='p-6 text-center text-red-500'>
                  <p>Error: {error}</p>
                  <p className='text-sm mt-1'>Please try again</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className='max-h-[500px] overflow-y-auto'>
                    {results.map((product, index) => (
                      <div
                        key={product.id}
                        className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          index !== results.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className='flex items-center gap-4'>
                          {/* Product Image with Sale Badge */}
                          <div className='relative flex-shrink-0'>
                            <div className='w-[120px] h-[90px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
                              <Image
                                src={product.image}
                                alt={product.title}
                                width={120}
                                height={90}
                                className='w-full h-full object-cover'
                                priority={false}
                                loading='lazy'
                              />
                            </div>
                            {/* Sale Badge */}
                            {product.discount && (
                              <div className='absolute top-1 left-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded text-[11px]'>
                                Sale
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className='flex-1 min-w-0'>
                            {/* Product Title */}
                            <h4 className='text-lg font-semibold text-blue-800 mb-2 hover:underline cursor-pointer leading-tight line-clamp-2'>
                              {product.title}
                            </h4>

                            {/* Specifications Row */}
                            <div className='flex items-center gap-3 text-sm text-gray-600 mb-3'>
                              {product.width && (
                                <span className='font-medium'>W:{product.width}</span>
                              )}
                              {product.thickness && (
                                <span className='font-medium'>T:{product.thickness}</span>
                              )}
                              {product.length && (
                                <span className='font-medium'>L:{product.length}</span>
                              )}
                              {!product.width && !product.thickness && !product.length && (
                                <span className='text-xs text-gray-500'>
                                  Contact for specifications
                                </span>
                              )}
                            </div>

                            {/* Price Row */}
                            <div className='flex items-center gap-2'>
                              {product.originalPrice && (
                                <span className='text-sm text-gray-500 line-through'>
                                  £{product.originalPrice.toFixed(2)} m²
                                </span>
                              )}
                              {product.discount && (
                                <span className='text-sm bg-red-600 text-white px-2 py-1 rounded font-bold'>
                                  -{product.discount}%
                                </span>
                              )}
                              <div className='text-xl font-bold text-gray-900'>
                                £{product.price.toFixed(2)}{' '}
                                <span className='text-base font-normal text-gray-600'>m²</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Sample Button */}
                          <div className='flex-shrink-0'>
                            <button
                              onClick={(e) => handleOrderSample(e, product)}
                              disabled={isAddingSample === product.id}
                              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border min-w-[140px] ${
                                isAddingSample === product.id
                                  ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                                  : isProductInCart(product.id, true)
                                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                              }`}
                            >
                              {isAddingSample === product.id ? (
                                <span className='flex items-center justify-center gap-2'>
                                  <svg
                                    className='w-4 h-4 animate-spin'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                  >
                                    <circle
                                      className='opacity-25'
                                      cx='12'
                                      cy='12'
                                      r='10'
                                      stroke='currentColor'
                                      strokeWidth='4'
                                    />
                                    <path
                                      className='opacity-75'
                                      fill='currentColor'
                                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    />
                                  </svg>
                                  Adding...
                                </span>
                              ) : isProductInCart(product.id, true) ? (
                                <span className='flex items-center justify-center gap-2'>
                                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                  Sample in Basket
                                </span>
                              ) : (
                                'Order Sample'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View Full Results Button */}
                  <div className='p-4 bg-gray-50 border-t border-gray-100 flex justify-center'>
                    <button
                      onClick={handleViewAllResults}
                      className='bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm'
                    >
                      View Full Results
                    </button>
                  </div>
                </>
              ) : query.trim().length >= 2 ? (
                <div className='p-6 text-center text-gray-500'>
                  <p>No products found for &quot;{query}&quot;</p>
                  <p className='text-sm mt-1'>Try different keywords or browse our categories</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Sample Order Modal */}
      <SampleOrderModal isOpen={isSampleModalOpen} onClose={closeSampleModal} />
    </>
  );
};

export default SearchBar;
