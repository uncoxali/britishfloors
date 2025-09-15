'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/types/shopify';
import { shopifyApi } from '@/lib/shopify/api';

interface VisualSimilarProductsProps {
  currentProduct: ShopifyProduct;
}

const VisualSimilarProducts: React.FC<VisualSimilarProductsProps> = ({ currentProduct }) => {
  const [similarProducts, setSimilarProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await shopifyApi.getSimilarProducts(currentProduct, 5);
        setSimilarProducts(products);
      } catch (error) {
        console.error('Error fetching similar products:', error);
        setError('Failed to load similar products');
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct.id]); // Use only the product ID as dependency instead of the entire object

  // Don't show the component if there's an error or no similar products
  if (error || similarProducts.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className='bg-white border-2 border-gray-300 rounded-2xl p-3 mt-6'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-sm text-gray-700'>View visual similar products</span>
            <button className='flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm py-2 px-3 rounded-full transition-colors w-fit'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 616 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
              Loading...
            </button>
          </div>
          <div className='flex items-center gap-2'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className='w-12 h-12 rounded-lg bg-gray-200 animate-pulse'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white border-2 border-gray-300 rounded-2xl p-3 mt-6'>
      <div className='flex items-center justify-between gap-4'>
        {/* Left side - Text and button (vertical) */}
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-gray-700'>View visual similar products</span>
          <Link
            href='/products'
            className='flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm py-2 px-3 rounded-full transition-colors w-fit'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 616 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            Explore now
          </Link>
        </div>

        {/* Right side - Similar product thumbnails */}
        <div className='flex items-center gap-2'>
          {similarProducts.length > 0 ? (
            similarProducts.map((product) => {
              const image = product.images.edges[0]?.node;
              return (
                <Link key={product.id} href={`/products/${product.handle}`} className='group'>
                  <div className='w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-colors'>
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        width={48}
                        height={48}
                        className='h-full w-full object-cover group-hover:scale-105 transition-transform'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                        <span className='text-gray-400 text-xs'>No img</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            // Fallback when no similar products found
            <div className='text-sm text-gray-500'>No similar products found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSimilarProducts;
