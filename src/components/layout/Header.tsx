'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import SearchBar from '@/components/ui/SearchBar';
import ClientOnly from '@/components/ui/ClientOnly';
import CartDrawer from '@/components/cart/CartDrawer';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalQuantity } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  return (
    <header className='bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-30'>
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
              {isLoading ? (
                <div className='flex items-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                  <span className='text-sm text-gray-500 hidden sm:block'>Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <div className='flex items-center space-x-2'>
                  <span className='text-sm text-gray-700 hidden sm:block'>
                    Hi, {user?.firstName || 'User'}
                  </span>
                  <Link
                    href='/account'
                    className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                    title='My Account'
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
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Link
                    href='/auth/login'
                    className='text-sm text-gray-700 hover:text-gray-900 transition-colors hidden sm:block'
                  >
                    Sign In
                  </Link>
                  <Link
                    href='/auth/register'
                    className='text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors'
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </ClientOnly>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className='relative p-2 text-gray-700 hover:text-gray-900 transition-colors'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
              <ClientOnly>
                {totalQuantity > 0 && (
                  <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                    {totalQuantity}
                  </span>
                )}
              </ClientOnly>
            </button>

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

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
