import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      {/* Modern Hero Section */}
      <section className='relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]'></div>
        </div>

        {/* Floating Elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl'></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Content */}
            <div className='text-center lg:text-left'>
              {/* Badge */}
              <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8'>
                <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
                Premium Flooring Collection
              </div>

              {/* Main Heading */}
              <h1 className='text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight'>
                Elevate Your
                <br />
                <span className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                  Living Space
                </span>
              </h1>

              {/* Subtitle */}
              <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
                Discover our curated collection of premium flooring solutions. From elegant hardwood
                to durable laminate, transform your home with the finest materials and expert
                craftsmanship.
              </p>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12'>
                <Link
                  href='/products'
                  className='group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-1'
                >
                  Explore Collection
                  <svg
                    className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </Link>
                <Link
                  href='/collections'
                  className='group inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300'
                >
                  View Categories
                  <svg
                    className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className='flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-400'>
                <div className='flex items-center'>
                  <div className='w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse'></div>
                  Free UK Delivery
                </div>
                <div className='flex items-center'>
                  <div className='w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse'></div>
                  30-Day Returns
                </div>
                <div className='flex items-center'>
                  <div className='w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse'></div>
                  Expert Installation
                </div>
              </div>
            </div>

            {/* Visual Showcase */}
            <div className='relative'>
              {/* Main Product Card */}
              <div className='relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500'>
                <div className='aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center overflow-hidden'>
                  <div className='text-center p-6'>
                    <div className='w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl'>
                      <svg
                        className='w-16 h-16 text-white'
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
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>Premium Hardwood</h3>
                    <p className='text-gray-600 mb-4'>Starting from £45/m²</p>
                    <div className='inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium'>
                      Best Seller
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className='absolute -top-6 -right-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-300'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white mb-1'>25+</div>
                  <div className='text-blue-100 text-sm'>Years Experience</div>
                </div>
              </div>

              <div className='absolute -bottom-6 -left-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-300'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white mb-1'>10K+</div>
                  <div className='text-green-100 text-sm'>Happy Customers</div>
                </div>
              </div>

              {/* Floating Product Cards */}
              <div className='absolute top-1/2 -left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl transform -translate-y-1/2 rotate-6 hover:rotate-0 transition-all duration-300'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center'>
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
                      d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                    />
                  </svg>
                </div>
                <div className='text-center mt-2'>
                  <div className='text-white font-semibold text-sm'>Laminate</div>
                  <div className='text-gray-300 text-xs'>From £25/m²</div>
                </div>
              </div>

              <div className='absolute top-1/2 -right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl transform -translate-y-1/2 -rotate-6 hover:rotate-0 transition-all duration-300'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center'>
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
                      d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                    />
                  </svg>
                </div>
                <div className='text-center mt-2'>
                  <div className='text-white font-semibold text-sm'>Vinyl</div>
                  <div className='text-gray-300 text-xs'>From £30/m²</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
          <div className='flex flex-col items-center text-white/60'>
            <span className='text-sm mb-2'>Scroll to explore</span>
            <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
              <div className='w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce'></div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Featured Products */}
        <section className='mb-16'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>Featured Products</h2>
              <p className='text-gray-600'>Handpicked flooring solutions for your home</p>
            </div>
            <Link
              href='/products'
              className='text-blue-600 hover:text-blue-700 font-medium flex items-center'
            >
              View All
              <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
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
        <section className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <div className='text-center group'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors'>
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

          <div className='text-center group'>
            <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors'>
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

          <div className='text-center group'>
            <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors'>
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
        <section className='mb-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Shop by Category</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Explore our comprehensive range of flooring options designed for every room and style
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group'>
              <div className='text-center'>
                <div className='bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors'>
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
                  className='text-blue-600 hover:text-blue-700 font-medium group-hover:underline'
                >
                  Shop Hardwood →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group'>
              <div className='text-center'>
                <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors'>
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
                  className='text-blue-600 hover:text-blue-700 font-medium group-hover:underline'
                >
                  Shop Laminate →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group'>
              <div className='text-center'>
                <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors'>
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
                  className='text-blue-600 hover:text-blue-700 font-medium group-hover:underline'
                >
                  Shop Vinyl →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group'>
              <div className='text-center'>
                <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors'>
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
                  className='text-blue-600 hover:text-blue-700 font-medium group-hover:underline'
                >
                  Shop Carpet →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className='bg-gradient-to-br from-gray-50 to-blue-50 p-12 rounded-2xl mb-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Why Choose British Floors?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We&apos;re your trusted partner for premium flooring solutions, offering quality
              products, expert installation, and exceptional customer service.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center group'>
              <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors'>
                <span className='text-blue-600 font-bold text-xl'>25+</span>
              </div>
              <h3 className='font-semibold mb-2 text-gray-900'>Years Experience</h3>
              <p className='text-gray-600 text-sm'>Decades of flooring expertise</p>
            </div>
            <div className='text-center group'>
              <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors'>
                <span className='text-green-600 font-bold text-xl'>10K+</span>
              </div>
              <h3 className='font-semibold mb-2 text-gray-900'>Happy Customers</h3>
              <p className='text-gray-600 text-sm'>Satisfied homeowners nationwide</p>
            </div>
            <div className='text-center group'>
              <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors'>
                <span className='text-purple-600 font-bold text-xl'>500+</span>
              </div>
              <h3 className='font-semibold mb-2 text-gray-900'>Products</h3>
              <p className='text-gray-600 text-sm'>Wide selection of flooring options</p>
            </div>
            <div className='text-center group'>
              <div className='bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors'>
                <span className='text-amber-600 font-bold text-xl'>24/7</span>
              </div>
              <h3 className='font-semibold mb-2 text-gray-900'>Support</h3>
              <p className='text-gray-600 text-sm'>Always here when you need us</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
