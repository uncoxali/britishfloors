import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  let error: string | null = null;

  try {
    const response = await shopifyApi.getProducts(8);
    products = response.products.edges.map((edge) => edge.node);
  } catch (err) {
    error = 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <section className='text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-12'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>Welcome to British Floors</h1>
            <p className='text-xl mb-8 text-blue-100 max-w-2xl mx-auto'>
              Discover premium flooring solutions for your home. From elegant hardwood to durable
              laminate, we offer the finest quality materials with expert installation and
              exceptional service.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/products'
                className='inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
              >
                Shop All Products
              </Link>
              <Link
                href='/collections'
                className='inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className='mb-12'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>Featured Products</h2>
            <Link href='/products' className='text-blue-600 hover:text-blue-700 font-medium'>
              View All →
            </Link>
          </div>

          {error ? (
            <div className='text-center py-12'>
              <p className='text-red-600'>{error}</p>
              <p className='text-gray-500 mt-2'>
                Please check your Shopify configuration and try again.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          <div className='text-center'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Free Shipping</h3>
            <p className='text-gray-600'>Free shipping on orders over £100</p>
          </div>

          <div className='text-center'>
            <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Quality Guarantee</h3>
            <p className='text-gray-600'>30-day money-back guarantee</p>
          </div>

          <div className='text-center'>
            <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>24/7 Support</h3>
            <p className='text-gray-600'>Round-the-clock customer support</p>
          </div>
        </section>

        {/* Categories Section */}
        <section className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>Shop by Category</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow'>
              <div className='text-center'>
                <div className='bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-amber-600'
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
                <h3 className='text-lg font-semibold mb-2'>Hardwood</h3>
                <p className='text-gray-600 text-sm mb-4'>
                  Premium hardwood flooring for timeless elegance
                </p>
                <Link
                  href='/collections/hardwood'
                  className='text-blue-600 hover:text-blue-700 font-medium'
                >
                  Shop Hardwood →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow'>
              <div className='text-center'>
                <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Laminate</h3>
                <p className='text-gray-600 text-sm mb-4'>
                  Durable laminate flooring with realistic wood looks
                </p>
                <Link
                  href='/collections/laminate'
                  className='text-blue-600 hover:text-blue-700 font-medium'
                >
                  Shop Laminate →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow'>
              <div className='text-center'>
                <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Vinyl</h3>
                <p className='text-gray-600 text-sm mb-4'>Waterproof vinyl flooring for any room</p>
                <Link
                  href='/collections/vinyl'
                  className='text-blue-600 hover:text-blue-700 font-medium'
                >
                  Shop Vinyl →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow'>
              <div className='text-center'>
                <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 10h16M4 14h16M4 18h16'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Carpet</h3>
                <p className='text-gray-600 text-sm mb-4'>
                  Soft, comfortable carpet for cozy spaces
                </p>
                <Link
                  href='/collections/carpet'
                  className='text-blue-600 hover:text-blue-700 font-medium'
                >
                  Shop Carpet →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className='bg-gray-50 p-8 rounded-lg mb-12'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Why Choose British Floors?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We&apos;re your trusted partner for premium flooring solutions, offering quality
              products, expert installation, and exceptional customer service.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-blue-600 font-bold text-lg'>25+</span>
              </div>
              <h3 className='font-semibold mb-1'>Years Experience</h3>
              <p className='text-gray-600 text-sm'>Decades of flooring expertise</p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-green-600 font-bold text-lg'>10K+</span>
              </div>
              <h3 className='font-semibold mb-1'>Happy Customers</h3>
              <p className='text-gray-600 text-sm'>Satisfied homeowners nationwide</p>
            </div>
            <div className='text-center'>
              <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-purple-600 font-bold text-lg'>500+</span>
              </div>
              <h3 className='font-semibold mb-1'>Products</h3>
              <p className='text-gray-600 text-sm'>Wide selection of flooring options</p>
            </div>
            <div className='text-center'>
              <div className='bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-amber-600 font-bold text-lg'>24/7</span>
              </div>
              <h3 className='font-semibold mb-1'>Support</h3>
              <p className='text-gray-600 text-sm'>Always here when you need us</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
