'use client';

import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { useWishlistStore } from '@/store/wishlist';

const WishlistPage: React.FC = () => {
  const { items, clearWishlist, getWishlistCount } = useWishlistStore();
  const wishlistCount = getWishlistCount();

  if (wishlistCount === 0) {
    return (
      <Layout>
        <div className='text-center py-12'>
          <div className='mb-6'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Your wishlist is empty</h2>
          <p className='text-gray-600 mb-8'>
            Start adding products to your wishlist to save them for later.
          </p>
          <Link href='/products'>
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Wishlist</h1>
            <p className='text-gray-600'>
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          <Button
            onClick={clearWishlist}
            variant='outline'
            className='text-red-600 border-red-300 hover:bg-red-50'
          >
            Clear Wishlist
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
