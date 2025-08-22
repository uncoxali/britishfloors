'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/types/shopify';
import { formatPriceRange, truncateText } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import WishlistButton from '@/components/ui/WishlistButton';
import ClientOnly from '@/components/ui/ClientOnly';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const firstImage = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant?.availableForSale;

  const handleAddToCart = async () => {
    if (!firstVariant || !isAvailable) return;

    setIsAdding(true);
    try {
      addItem(product, firstVariant, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2'>
      {/* Wishlist Button */}
      <div className='absolute top-4 right-4 z-10'>
        <ClientOnly>
          <WishlistButton product={product} size='sm' />
        </ClientOnly>
      </div>

      {/* Badge - New/Featured */}
      <div className='absolute top-4 left-4 z-10'>
        <div className='bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg'>
          New
        </div>
      </div>

      <Link href={`/products/${product.handle}`} className='block'>
        <div className='aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative'>
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              width={400}
              height={400}
              className='h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    />
                  </svg>
                </div>
                <span className='text-gray-400 text-sm'>No image</span>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
      </Link>

      <div className='p-6'>
        <div className='mb-4'>
          <Link href={`/products/${product.handle}`}>
            <h3 className='text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mb-2'>
              {truncateText(product.title, 50)}
            </h3>
          </Link>

          <p className='text-sm text-gray-600 leading-relaxed'>
            {truncateText(product.description, 80)}
          </p>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <div className='text-xl font-bold text-gray-900'>
            {formatPriceRange(
              product.priceRange.minVariantPrice,
              product.priceRange.maxVariantPrice,
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <span className='text-sm text-gray-500'>(24)</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`flex-1 mr-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isAvailable
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAdding ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Adding...
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                {isAvailable ? (
                  <>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
                      />
                    </svg>
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </div>
            )}
          </button>

          <Link
            href={`/products/${product.handle}`}
            className='w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center hover:from-amber-100 hover:to-orange-100 transition-all duration-300 group-hover:scale-110'
          >
            <svg
              className='w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
          </Link>
        </div>

        {/* Product Features */}
        <div className='flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100'>
          <div className='flex items-center'>
            <svg className='w-3 h-3 text-green-500 mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Free Shipping
          </div>
          <div className='flex items-center'>
            <svg className='w-3 h-3 text-blue-500 mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Quick Delivery
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
