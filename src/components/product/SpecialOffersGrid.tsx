'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShopifyProduct } from '@/lib/types/shopify';

interface SpecialOffersGridProps {
  products: ShopifyProduct[];
}

const SpecialOffersGrid: React.FC<SpecialOffersGridProps> = ({ products }) => {
  const router = useRouter();

  const handleOrderSample = (product: ShopifyProduct) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);

    // Determine price range filter
    let priceFilter = '';
    if (price < 50) {
      priceFilter = '0-50';
    } else if (price < 100) {
      priceFilter = '50-100';
    } else if (price < 200) {
      priceFilter = '100-200';
    } else if (price < 500) {
      priceFilter = '200-500';
    } else {
      priceFilter = '500-1000';
    }

    // Determine category based on product title (you can adjust this logic)
    let categoryFilter = '';
    const title = product.title.toLowerCase();
    if (title.includes('hardwood') || title.includes('wood')) {
      categoryFilter = 'hardwood';
    } else if (title.includes('laminate')) {
      categoryFilter = 'laminate';
    } else if (title.includes('vinyl')) {
      categoryFilter = 'vinyl';
    } else if (title.includes('carpet')) {
      categoryFilter = 'carpet';
    } else if (title.includes('tile')) {
      categoryFilter = 'tile';
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (priceFilter) params.set('price', priceFilter);

    // Navigate to products page with filters
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className='lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {products.length > 0
        ? products.slice(0, 4).map((product) => {
            const image = product.images.edges[0]?.node;
            const price = parseFloat(product.priceRange.minVariantPrice.amount);
            const originalPrice = Math.round(price * 1.3); // Simulate original price
            const hasDiscount = price < 50; // Consistent discount logic based on price

            return (
              <div key={product.id} className='bg-white rounded-2xl overflow-hidden shadow-lg'>
                <div className='relative'>
                  <div className='aspect-[4/3] bg-gray-100 overflow-hidden'>
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.title}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          console.log('Image failed to load:', image.url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                        <div className='text-gray-500 text-center'>
                          <svg
                            className='w-12 h-12 mx-auto mb-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <span className='text-xs'>No Image</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className='absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold'>
                      -23%
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h4 className='font-semibold text-blue-900 mb-2 leading-tight text-sm'>
                    {product.title.length > 40
                      ? `${product.title.substring(0, 40)}...`
                      : product.title}
                  </h4>

                  {/* Product dimensions would come from API data when available */}

                  <div className='flex items-center gap-2 mb-3'>
                    {hasDiscount && (
                      <span className='text-sm text-gray-500 line-through'>£{originalPrice}</span>
                    )}
                    <span className='text-lg font-bold text-blue-900'>£{price.toFixed(2)} m2</span>
                  </div>

                  <button
                    onClick={() => handleOrderSample(product)}
                    className='w-full bg-blue-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors'
                  >
                    Order Sample
                  </button>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default SpecialOffersGrid;
