'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import SearchBar from '@/components/ui/SearchBar';
import ClientOnly from '@/components/ui/ClientOnly';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalQuantity } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <span className='text-xl font-bold text-gray-900'>British Floors</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/'
              className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              Home
            </Link>
            <Link
              href='/products'
              className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              Products
            </Link>
            <Link
              href='/collections'
              className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'
            >
              Collections
            </Link>
          </nav>

          {/* Search Bar */}
          <div className='hidden md:block flex-1 max-w-md mx-8'>
            <SearchBar />
          </div>

          {/* Cart and Mobile Menu */}
          <div className='flex items-center space-x-4'>
            {/* Wishlist */}
            <Link
              href='/wishlist'
              className='relative p-2 text-gray-700 hover:text-gray-900 transition-colors'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
              <ClientOnly>
                {getWishlistCount() > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {getWishlistCount()}
                  </span>
                )}
              </ClientOnly>
            </Link>

            {/* Account */}
            <ClientOnly>
              {isAuthenticated ? (
                <Link
                  href='/account'
                  className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                >
                  <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </Link>
              ) : (
                <Link
                  href='/auth/login'
                  className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                >
                  <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                    />
                  </svg>
                </Link>
              )}
            </ClientOnly>

            {/* Cart */}
            <Link
              href='/cart'
              className='relative p-2 text-gray-700 hover:text-gray-900 transition-colors'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
                />
              </svg>
              <ClientOnly>
                {totalQuantity > 0 && (
                  <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                    {totalQuantity}
                  </span>
                )}
              </ClientOnly>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 text-gray-700 hover:text-gray-900'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t'>
              <Link
                href='/'
                className='text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/products'
                className='text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href='/collections'
                className='text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
