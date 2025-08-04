'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import ClientOnly from '@/components/ui/ClientOnly';

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <footer className='bg-white border-t border-gray-200'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='lg:col-span-1'>
            <div className='mb-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>British Floors</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Premium flooring solutions for your home and business. Quality materials, expert
                installation, and exceptional customer service.
              </p>
            </div>

            {/* Social Media */}
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 transition-colors'
                aria-label='Facebook'
              >
                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 transition-colors'
                aria-label='Instagram'
              >
                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 transition-colors'
                aria-label='Twitter'
              >
                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-gray-500 hover:text-gray-900 transition-colors'
                aria-label='LinkedIn'
              >
                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href='/collections'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href='/wishlist'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href='/cart'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href='/returns'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href='/installation'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  Installation Guide
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Account & Support</h3>
            <ClientOnly>
              <ul className='space-y-2'>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        href='/account'
                        className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/account/orders'
                        className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                      >
                        Order History
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/account/addresses'
                        className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                      >
                        Addresses
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href='/auth/login'
                        className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/auth/register'
                        className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                      >
                        Create Account
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    href='/support'
                    className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                  >
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link
                    href='/warranty'
                    className='text-gray-600 hover:text-gray-900 transition-colors text-sm'
                  >
                    Warranty
                  </Link>
                </li>
              </ul>
            </ClientOnly>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className='mt-12 pt-8 border-t border-gray-200'>
          <div className='max-w-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Stay Updated</h3>
            <p className='text-gray-600 text-sm mb-4'>
              Subscribe to our newsletter for the latest products, offers, and flooring tips.
            </p>
            <form className='flex space-x-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='bg-gray-50 border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Copyright */}
            <div className='text-gray-600 text-sm'>
              <p>&copy; 2024 British Floors. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <div className='flex flex-wrap justify-center space-x-6 text-sm'>
              <Link href='/privacy' className='text-gray-600 hover:text-gray-900 transition-colors'>
                Privacy Policy
              </Link>
              <Link href='/terms' className='text-gray-600 hover:text-gray-900 transition-colors'>
                Terms of Service
              </Link>
              <Link href='/cookies' className='text-gray-600 hover:text-gray-900 transition-colors'>
                Cookie Policy
              </Link>
              <Link
                href='/accessibility'
                className='text-gray-600 hover:text-gray-900 transition-colors'
              >
                Accessibility
              </Link>
            </div>

            {/* Payment Methods */}
            <div className='flex items-center space-x-2'>
              <span className='text-gray-600 text-sm'>We Accept:</span>
              <div className='flex space-x-1'>
                <svg className='h-6 w-8 text-gray-500' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4H0v16h24V4zM4.5 18.5h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13z' />
                </svg>
                <svg className='h-6 w-8 text-gray-500' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4H0v16h24V4zM4.5 18.5h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13z' />
                </svg>
                <svg className='h-6 w-8 text-gray-500' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4H0v16h24V4zM4.5 18.5h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13zm4.5 0h-3v-13h3v13z' />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
