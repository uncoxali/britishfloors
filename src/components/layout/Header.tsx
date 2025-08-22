'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

import { useAuthStore } from '@/store/auth';
import SearchBar from '@/components/ui/SearchBar';
import ClientOnly from '@/components/ui/ClientOnly';
import CartDrawer from '@/components/cart/CartDrawer';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalQuantity } = useCartStore();
  const { isAuthenticated, isLoading } = useAuthStore();

  return (
    <>
      {/* Top Section - White background with logo, search, and icons */}
      <div className='bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-3'>
              <img src='/images/logo.png' alt='British Floors Logo' className='h-10 w-auto' />
            </Link>

            {/* Search Bar - Center */}
            <div className='flex-1 max-w-xl mx-8 hidden md:block'>
              <SearchBar />
            </div>

            {/* Right Side Icons */}
            <div className='flex items-center space-x-4'>
              {/* Phone */}
              <div className='flex items-center space-x-2 text-gray-700'>
                <img src='/images/svg/phone-icon.svg' alt='Phone' className='h-5 w-5' />
              </div>

              {/* Account */}
              <ClientOnly>
                {isLoading ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600'></div>
                ) : isAuthenticated ? (
                  <Link
                    href='/account'
                    className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                    title='My Account'
                  >
                    <img src='/images/svg/profile-icon.svg' alt='Profile' className='h-6 w-6' />
                  </Link>
                ) : (
                  <Link
                    href='/auth/login'
                    className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                    title='Sign In'
                  >
                    <img src='/images/svg/profile-icon.svg' alt='Sign In' className='h-6 w-6' />
                  </Link>
                )}
              </ClientOnly>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className='relative p-2 text-gray-700 hover:text-gray-900 transition-colors'
              >
                <img src='/images/svg/iconbasket.svg' alt='Cart' className='h-6 w-6' />
                <ClientOnly>
                  {totalQuantity > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                      {totalQuantity}
                    </span>
                  )}
                </ClientOnly>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='lg:hidden p-2 text-gray-700 hover:text-gray-900'
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
        </div>
      </div>

      {/* Bottom Section - Blue Navigation Bar */}
      <nav className='bg-blue-700 shadow-lg fixed top-16 left-0 right-0 z-30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='hidden lg:flex justify-center space-x-8 h-12 items-center'>
            <Link
              href='/products?category=engineered-wood'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Engineered Wood Flooring
            </Link>
            <Link
              href='/products?category=vinyl-lvt'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Vinyl (LVT)
            </Link>
            <Link
              href='/products?category=laminate'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Laminate
            </Link>
            <Link
              href='/products?category=parquet'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Parquet Flooring
            </Link>
            <Link
              href='/products?category=accessories'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Accessories
            </Link>
            <Link
              href='/inspiration'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Inspiration
            </Link>
            <Link
              href='/blogs'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap'
            >
              Blogs
            </Link>
            <Link
              href='/offers'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors bg-orange-600 hover:bg-orange-500 rounded-md whitespace-nowrap'
            >
              Offers
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className='lg:hidden fixed top-28 left-0 right-0 z-20 bg-blue-700 border-t border-blue-600'>
          <div className='px-4 py-3 space-y-2'>
            <div className='md:hidden mb-4'>
              <SearchBar />
            </div>
            <Link
              href='/products?category=engineered-wood'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Engineered Wood Flooring
            </Link>
            <Link
              href='/products?category=vinyl-lvt'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Vinyl (LVT)
            </Link>
            <Link
              href='/products?category=laminate'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Laminate
            </Link>
            <Link
              href='/products?category=parquet'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Parquet Flooring
            </Link>
            <Link
              href='/products?category=accessories'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link
              href='/inspiration'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Inspiration
            </Link>
            <Link
              href='/blogs'
              className='text-white hover:text-blue-200 hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href='/offers'
              className='text-white hover:text-blue-200 hover:bg-orange-500 bg-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </Link>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
