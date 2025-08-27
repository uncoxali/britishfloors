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
  const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(null);
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

    // Check if product is already in cart
    if (isProductInCart(product.id)) {
      openCart();
      return;
    }

    setIsAddingSample(product.id);
    try {
      // Get full product data from Shopify API
      const response = await shopifyApi.getProductByHandle(product.handle);
      const fullProduct = response.product;

      // Add sample to cart (using first variant)
      const firstVariant = fullProduct.variants?.edges[0]?.node;
      if (firstVariant) {
        addItem(fullProduct, firstVariant, 1);
        // Open cart drawer after adding sample
        openCart();
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
              placeholder='Laminate'
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
          <div className='absolute top-full left-0 right-0 mt-2 z-[9999]'>
            <div className='bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'>
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
                  <div className='max-h-[400px] overflow-y-auto'>
                    {results.map((product, index) => (
                      <div
                        key={product.id}
                        className={`px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                          index !== results.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className='flex items-center justify-between'>
                          {/* Left Section: Image + Product Info */}
                          <div className='flex items-center gap-4 flex-1'>
                            {/* Product Image */}
                            <div className='relative flex-shrink-0 group'>
                              <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  width={80}
                                  height={80}
                                  className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0'
                                />
                                {product.images && product.images.length > 1 && (
                                  <Image
                                    src={product.images[1]}
                                    alt={`${product.title} - Image 2`}
                                    width={80}
                                    height={80}
                                    className='absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                                  />
                                )}
                              </div>
                              {/* Sale Badge */}
                              {product.discount && (
                                <div className='absolute -top-1 -left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded'>
                                  Sale
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className='flex-1 min-w-0'>
                              {/* Product Title */}
                              <h4 className='text-lg font-medium text-blue-700 mb-1 hover:underline cursor-pointer line-clamp-1'>
                                {product.title}
                              </h4>

                              {/* Specifications Row */}
                              <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                                <span className='font-medium'>W:100mm</span>
                                <span className='font-medium'>T:12mm</span>
                                <span className='font-medium'>L:600mm</span>
                              </div>

                              {/* Price Row */}
                              <div className='flex items-center gap-3'>
                                {product.originalPrice && (
                                  <span className='text-sm text-gray-500 line-through'>
                                    £{product.originalPrice} m²
                                  </span>
                                )}
                                {product.discount && (
                                  <span className='text-xs bg-red-600 text-white px-2 py-1 rounded font-bold'>
                                    -{product.discount}%
                                  </span>
                                )}
                                <div className='text-xl font-bold text-gray-900'>
                                  £{product.price}{' '}
                                  <span className='text-sm font-normal text-gray-600'>m²</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Section: Order Sample Button */}
                          <div className='flex-shrink-0 ml-6'>
                            <button
                              onClick={(e) => handleOrderSample(e, product)}
                              disabled={isAddingSample === product.id}
                              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                                isAddingSample === product.id
                                  ? 'bg-gray-400 text-white cursor-not-allowed border-gray-400'
                                  : isProductInCart(product.id)
                                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {isAddingSample === product.id ? (
                                <span className='flex items-center gap-2'>
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
                              ) : isProductInCart(product.id) ? (
                                <span className='flex items-center gap-2'>
                                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                  In Basket
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
