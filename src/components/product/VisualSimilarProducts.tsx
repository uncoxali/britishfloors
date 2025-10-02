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
    // Create an abort controller to cancel requests if needed
    const abortController = new AbortController();
    
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set a more reasonable timeout
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000) // Reduced from 8s to 5s
        );

        // Use the abort controller signal with the API call
        const productsPromise = shopifyApi.getSimilarProducts(currentProduct, 5);

        const products = await Promise.race([productsPromise, timeoutPromise]);
        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          setSimilarProducts(products || []);
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
        // Don't show error to user, but log it
        if (!abortController.signal.aborted) {
          setSimilarProducts([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Add a small delay before fetching to avoid immediate API calls
    const timeoutId = setTimeout(() => {
      if (!abortController.signal.aborted) {
        fetchSimilarProducts();
      }
    }, 300); // Reduced from 1000ms to 300ms

    // Cleanup function to abort requests when component unmounts
    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [currentProduct.id]);

  // Don't show the component if no similar products, but show error state
  if (similarProducts.length === 0 && !loading) {
    return null; // Hide component completely if no products and not loading
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