import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { shopifyApi } from '@/lib/shopify/api';
import { formatPrice } from '@/lib/utils/format';
import { ShopifyProduct } from '@/lib/types/shopify';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: ShopifyProduct | null = null;
  let error: string | null = null;

  try {
    const response = await shopifyApi.getProductByHandle(resolvedParams.handle);
    product = response.product;
  } catch (err) {
    error = 'Failed to load product';
    console.error('Error loading product:', err);
  }

  if (error || !product) {
    notFound();
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Product Image */}
          <div className='relative'>
            <div className='aspect-square w-full overflow-hidden rounded-lg bg-gray-100'>
              {product.images.edges.length > 0 ? (
                <Image
                  src={product.images.edges[0].node.url}
                  alt={product.images.edges[0].node.altText || product.title}
                  width={600}
                  height={600}
                  className='h-full w-full object-cover object-center'
                  priority
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-200'>
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <svg
                        className='w-8 h-8 text-gray-400'
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
                    <span className='text-gray-400 text-sm'>No image available</span>
                  </div>
                </div>
              )}
            </div>
            {/* Additional Images */}
            {product.images.edges.length > 1 && (
              <div className='grid grid-cols-4 gap-4 mt-6'>
                {product.images.edges.slice(1, 5).map((image, index) => (
                  <div
                    key={image.node.id}
                    className='aspect-square overflow-hidden rounded-lg bg-gray-100'
                  >
                    <Image
                      src={image.node.url}
                      alt={image.node.altText || `${product.title} ${index + 2}`}
                      width={150}
                      height={150}
                      className='h-full w-full object-cover object-center'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>{product.title}</h1>
              <p className='text-lg text-gray-600 mb-4'>{product.description}</p>
              <div className='text-2xl font-bold text-gray-900'>
                {formatPrice(product.priceRange.minVariantPrice)}
                {product.priceRange.minVariantPrice.amount !==
                  product.priceRange.maxVariantPrice.amount && (
                  <span className='text-lg font-normal text-gray-500'>
                    {' '}
                    - {formatPrice(product.priceRange.maxVariantPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Variants & Calculator */}
            <ProductDetailClient product={product} />
          </div>
        </div>

        {/* Product Details */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Product Details</h2>
          {product.descriptionHtml ? (
            <div
              className='prose max-w-none text-gray-700'
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <div className='text-gray-700'>
              <p className='mb-4'>
                This premium flooring product offers exceptional quality and durability. Perfect for
                both residential and commercial applications, it combines aesthetic appeal with
                practical functionality.
              </p>
              <p className='mb-4'>
                Our flooring solutions are designed to withstand daily wear and tear while
                maintaining their beautiful appearance for years to come. Each piece is carefully
                crafted using the finest materials and cutting-edge manufacturing processes.
              </p>
              <p>
                Installation is straightforward and can be completed by professional installers or
                experienced DIY enthusiasts. The product comes with comprehensive installation
                instructions and warranty coverage.
              </p>
            </div>
          )}
        </div>

        {/* Features & Specs */}
        <div className='mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Key Features</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>Premium quality materials</span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>Easy installation</span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>Durable and long-lasting</span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>Low maintenance</span>
              </li>
              <li className='flex items-start'>
                <svg
                  className='w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-700'>Warranty included</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Specifications</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Material:</span>
                <span className='text-gray-900 font-medium'>Premium Grade</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Thickness:</span>
                <span className='text-gray-900 font-medium'>12mm</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Coverage:</span>
                <span className='text-gray-900 font-medium'>2.5m² per pack</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Warranty:</span>
                <span className='text-gray-900 font-medium'>25 years</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Installation:</span>
                <span className='text-gray-900 font-medium'>Click-lock system</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className='mt-16 bg-blue-50 rounded-lg p-6'>
          <h3 className='text-xl font-bold text-blue-900 mb-4'>Shipping & Returns</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex items-start'>
              <svg
                className='w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z' />
              </svg>
              <div>
                <p className='font-medium text-blue-900'>Free Shipping</p>
                <p className='text-blue-700 text-sm'>On orders over £100</p>
              </div>
            </div>
            <div className='flex items-start'>
              <svg
                className='w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='font-medium text-blue-900'>30-Day Returns</p>
                <p className='text-blue-700 text-sm'>Money-back guarantee</p>
              </div>
            </div>
            <div className='flex items-start'>
              <svg
                className='w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='font-medium text-blue-900'>Expert Support</p>
                <p className='text-blue-700 text-sm'>Installation guidance available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
