'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';
import { useAuthStore } from '@/store/auth';
import SearchBar from '@/components/ui/SearchBar';
import ClientOnly from '@/components/ui/ClientOnly';
import CartDrawer from '@/components/cart/CartDrawer';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  href?: string;
  hasMegaMenu: boolean;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { open: openCart } = useCartDrawerStore();
  const { totalQuantity } = useCartStore();
  const { isAuthenticated, isLoading } = useAuthStore();

  const handleCategoryHover = (category: string) => {
    setActiveCategory(category);
    setIsMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
    setActiveCategory(null);
  };

  return (
    <>
      {/* Top Section - White background with logo, search, and icons */}
      <div className='bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40'>
        <div className='max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-3'>
              <Image
                src='/images/logo.png'
                alt='British Floors Logo'
                width={120}
                height={40}
                className='h-10 w-auto'
              />
            </Link>

            {/* Search Bar - Center */}
            <div className='flex-1 max-w-xl mx-8 hidden md:block'>
              <SearchBar />
            </div>

            {/* Right Side Icons */}
            <div className='flex items-center space-x-4'>
              {/* Phone */}
              <div className='flex items-center space-x-2 text-gray-700'>
                <Image
                  src='/images/svg/phone-icon.svg'
                  alt='Phone'
                  width={20}
                  height={20}
                  className='h-5 w-5'
                />
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
                    <Image
                      src='/images/svg/profile-icon.svg'
                      alt='Profile'
                      width={24}
                      height={24}
                      className='h-6 w-6'
                    />
                  </Link>
                ) : (
                  <Link
                    href='/auth/login'
                    className='p-2 text-gray-700 hover:text-gray-900 transition-colors'
                    title='Sign In'
                  >
                    <Image
                      src='/images/svg/profile-icon.svg'
                      alt='Sign In'
                      width={24}
                      height={24}
                      className='h-6 w-6'
                    />
                  </Link>
                )}
              </ClientOnly>

              {/* Cart */}
              <button
                onClick={openCart}
                className='relative p-2 text-gray-700 hover:text-gray-900 transition-colors'
              >
                <Image
                  src='/images/svg/iconbasket.svg'
                  alt='Cart'
                  width={24}
                  height={24}
                  className='h-6 w-6'
                />
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
      <nav className='bg-[#1A4685] shadow-lg fixed top-16 left-0 right-0 z-30'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          <div className='hidden max-w-[110rem] mx-auto lg:flex justify-center space-x-8 h-12 items-center'>
            <div
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group'
              onMouseEnter={() => handleCategoryHover('engineered-wood')}
            >
              Engineered Wood Flooring
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left ${
                  activeCategory === 'engineered-wood'
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></div>
            </div>
            <div
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group'
              onMouseEnter={() => handleCategoryHover('vinyl-lvt')}
            >
              Vinyl (LVT)
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left ${
                  activeCategory === 'vinyl-lvt'
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></div>
            </div>
            <div
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group'
              onMouseEnter={() => handleCategoryHover('laminate')}
            >
              Laminate
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left ${
                  activeCategory === 'laminate'
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></div>
            </div>
            <div
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group'
              onMouseEnter={() => handleCategoryHover('parquet')}
            >
              Parquet Flooring
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left ${
                  activeCategory === 'parquet' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></div>
            </div>
            <div
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative group'
              onMouseEnter={() => handleCategoryHover('accessories')}
            >
              Accessories
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left ${
                  activeCategory === 'accessories'
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></div>
            </div>
            <Link
              href='/inspiration'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative group'
            >
              Inspiration
              <div className='absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left'></div>
            </Link>
            <Link
              href='/blogs'
              className='text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative group'
            >
              Blogs
              <div className='absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left'></div>
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
        <div className='lg:hidden fixed top-28 left-0 right-0 z-20 bg-blue-700 border-t border-blue-600 max-h-[calc(100vh-7rem)] overflow-y-auto'>
          <div className='px-4 py-3 space-y-2 pb-4'>
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
      <CartDrawer />

      {/* Mega Menu */}
      {isMegaMenuOpen && activeCategory && (
        <div
          className='fixed top-28 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-lg border border-gray-200 rounded-lg max-w-7xl w-full mx-4'
          onMouseLeave={closeMegaMenu}
        >
          <div className='p-6'>
            <div className='grid grid-cols-12 gap-6'>
              {/* Left Side - Filters (8 columns) */}
              <div className='col-span-8'>
                <div className='grid grid-cols-5 gap-6'>
                  {/* Shop by Feature */}
                  <div>
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                      <h3 className='font-medium text-blue-900 text-sm mb-2'>Shop by Feature</h3>
                      <div className='space-y-1'>
                        <Link
                          href={`/products?category=${activeCategory}&filter=room`}
                          className='block text-xs text-blue-700 hover:text-blue-900 transition-colors'
                        >
                          Shop by Room
                        </Link>
                        <Link
                          href={`/products?category=${activeCategory}&filter=bestseller`}
                          className='block text-xs text-blue-700 hover:text-blue-900 transition-colors'
                        >
                          Best Seller
                        </Link>
                      </div>
                    </div>
                    <Link
                      href={`/products?category=${activeCategory}`}
                      className='inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs text-center rounded hover:bg-blue-700 transition-colors'
                    >
                      View Full Collection
                    </Link>
                  </div>

                  {/* Colour */}
                  <div>
                    <h3 className='font-medium text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200'>
                      Colour
                    </h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full bg-white border border-gray-300'></div>
                        <div className='text-xs font-medium text-gray-900'>White</div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full bg-gray-400 border border-gray-300'></div>
                        <div className='text-xs font-medium text-gray-900'>Grey</div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full bg-yellow-200 border border-gray-300'></div>
                        <div className='text-xs font-medium text-gray-900'>Light</div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full bg-yellow-600 border border-gray-300'></div>
                        <div className='text-xs font-medium text-gray-900'>Medium</div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 rounded-full bg-yellow-900 border border-gray-300'></div>
                        <div className='text-xs font-medium text-gray-900'>Dark</div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className='font-medium text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200'>
                      Price
                    </h3>
                    <div className='space-y-1'>
                      <div className='text-xs text-gray-600'>£30 - £39.99 Per m²</div>
                      <div className='text-xs text-gray-600'>£40 - £49.99 Per m²</div>
                      <div className='text-xs text-gray-600'>£50 - £59.99 Per m²</div>
                      <div className='text-xs text-gray-600'>£60 - £69.99 Per m²</div>
                      <div className='text-xs text-gray-600'>Above £70 Per m²</div>
                    </div>
                  </div>

                  {/* Finish */}
                  <div>
                    <h3 className='font-medium text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200'>
                      Finish
                    </h3>
                    <div className='space-y-1'>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Oiled
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Lacquered
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Invisible Oiled
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Brushed
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Distressed
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Smoked
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Unfinished
                      </div>
                    </div>
                  </div>

                  {/* Floor Style & Species */}
                  <div>
                    <h3 className='font-medium text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200'>
                      Floor Style
                    </h3>
                    <div className='space-y-1 mb-4'>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Unfinished
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Parquet
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Herringbone
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Versailles
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Waterproof
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Random
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Length
                      </div>
                    </div>

                    <h3 className='font-medium text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200'>
                      Species
                    </h3>
                    <div className='space-y-1'>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Oak Flooring
                      </div>
                      <div className='text-xs text-gray-600 hover:text-blue-600 cursor-pointer'>
                        Narrow Wood
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Product Showcase (4 columns) */}
              <div className='col-span-4'>
                <div className='relative h-64 rounded-lg overflow-hidden'>
                  <Image
                    src='/images/hero-img.png'
                    alt='Featured Product'
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
