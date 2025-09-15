import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyCollection } from '@/lib/types/shopify';

export default async function CollectionsPage() {
  let collections: ShopifyCollection[] = [];
  let error: string | null = null;

  try {
    const response = await shopifyApi.getCollections(20);
    // Check if we got a valid response
    if (response && response.collections && response.collections.edges) {
      collections = response.collections.edges
        .map((edge) => edge.node)
        .filter((collection) => collection.handle !== 'mock-collection');
    }
  } catch (err) {
    error = 'Failed to load collections';
    console.error('Error loading collections:', err);
  }

  return (
    <Layout>
      {/* Modern Hero Section */}
      <section className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]'></div>
        </div>

        {/* Floating Elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl'></div>

        <div className='relative w-full px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center'>
            {/* Badge */}
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6'>
              <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
              Curated Collections
            </div>

            {/* Main Heading */}
            <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              Explore Our{' '}
              <span className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                Flooring Collections
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Discover our carefully curated collections designed for every room and style. From
              classic hardwood to modern laminate, find the perfect flooring solution for your
              space.
            </p>

            {/* Stats */}
            <div className='flex justify-center items-center space-x-8 text-white/80'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-amber-400'>{collections.length}</div>
                <div className='text-sm'>Collections</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-400'>500+</div>
                <div className='text-sm'>Products</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-400'>25+</div>
                <div className='text-sm'>Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {error ? (
          <div className='text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Error Loading Collections</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <p className='text-sm text-gray-500'>
              Please check your Shopify configuration and try again.
            </p>
          </div>
        ) : (
          <>
            {/* Collections Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className='group block'
                >
                  <div className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2'>
                    {/* Collection Image */}
                    <div className='aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
                      {collection.image ? (
                        <Image
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
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
                    </div>

                    {/* Collection Info */}
                    <div className='p-6'>
                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors'>
                          {collection.title}
                        </h3>
                        <div className='w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <svg
                            className='w-4 h-4 text-white'
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
                        </div>
                      </div>

                      {collection.description && (
                        <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                          {collection.description}
                        </p>
                      )}

                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-500'>Explore Collection</span>
                        <div className='w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center'>
                          <svg
                            className='w-3 h-3 text-white'
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
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Categories Section */}
            <section className='mt-20'>
              <div className='text-center mb-12'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>Popular Categories</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Explore our most popular flooring categories designed for every room and style
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300'>
                  <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
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
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Hardwood</h3>
                  <p className='text-gray-600 text-sm mb-4'>Timeless elegance for your home</p>
                  <Link
                    href='/collections/hardwood'
                    className='text-amber-600 hover:text-amber-700 font-medium text-sm'
                  >
                    Shop Hardwood →
                  </Link>
                </div>

                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300'>
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
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
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Laminate</h3>
                  <p className='text-gray-600 text-sm mb-4'>Durable and affordable options</p>
                  <Link
                    href='/collections/laminate'
                    className='text-blue-600 hover:text-blue-700 font-medium text-sm'
                  >
                    Shop Laminate →
                  </Link>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300'>
                  <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
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
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Vinyl</h3>
                  <p className='text-gray-600 text-sm mb-4'>Waterproof and versatile</p>
                  <Link
                    href='/collections/vinyl'
                    className='text-green-600 hover:text-green-700 font-medium text-sm'
                  >
                    Shop Vinyl →
                  </Link>
                </div>

                <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300'>
                  <div className='w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
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
                        d='M4 6h16M4 10h16M4 14h16M4 18h16'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Carpet</h3>
                  <p className='text-gray-600 text-sm mb-4'>Soft and comfortable</p>
                  <Link
                    href='/collections/carpet'
                    className='text-purple-600 hover:text-purple-700 font-medium text-sm'
                  >
                    Shop Carpet →
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
