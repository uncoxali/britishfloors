import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import SpecialOffersGrid from '@/components/product/SpecialOffersGrid';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  let error: string | null = null;

  try {
    const response = await shopifyApi.getProducts(8);
    products = response.products.edges.map((edge) => edge.node);
    console.log('Loaded products:', products.length);
    console.log('Sample product:', products[0]);
  } catch (err) {
    error = 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <Layout>
      {/* Hero Section - Image Only */}
      <section
        className='relative h-[90vh] min-h-[500px] bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('/images/hero-img.png')",
        }}
      ></section>

      {/* Featured Categories Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>
              Featured Categories
            </h2>
          </div>

          {/* Categories Grid */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16'>
            {/* Category 1 - Luxury Vinyl */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Luxury Vinyl'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Category 2 - Engineered Wood */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Engineered Wood'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Category 3 - Laminate */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Laminate'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Category 4 - Parquet */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Parquet'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Category 5 - Carpet */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Carpet'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>

            {/* Category 6 - Accessories */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg'>
                <Image
                  src='/images/sample-product.png'
                  alt='Accessories'
                  width={200}
                  height={240}
                  className='object-cover group-hover:scale-110 transition-transform duration-300'
                />
              </div>
            </div>
          </div>

          {/* Special Offers Section */}
          <div className='bg-blue-800 rounded-2xl p-8 relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='flex flex-col lg:flex-row items-center gap-8'>
                {/* Special Offers Image */}
                <div className='lg:w-1/4 flex items-center justify-center h-full'>
                  <Image
                    src='/images/product-pers.png'
                    alt='Special Offers'
                    width={400}
                    height={300}
                    className='w-auto h-auto max-w-full'
                  />
                </div>

                {/* Products Grid */}
                <SpecialOffersGrid products={products} />
              </div>
            </div>

            {/* Background Pattern */}
            <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
              <div className='w-full h-full bg-gradient-to-br from-white to-transparent rounded-full'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>Popular Products</h2>
          </div>

          {/* Popular Products Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Product 1 - Cambridge White Oak Engineered Wood */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='relative overflow-hidden rounded-t-lg'>
                  <img
                    src='/images/sample-product.png'
                    alt='Cambridge White Oak Engineered Wood Flooring'
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end'>
                    <div className='p-4 text-white'>
                      <h3 className='text-sm font-semibold leading-tight'>
                        Cambridge White Oak Engineered Wood Flooring
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2 - Cambridge White Oak Engineered Wood (Herringbone) */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='relative overflow-hidden rounded-t-lg'>
                  <img
                    src='/images/sample-product.png'
                    alt='Cambridge White Oak Engineered Wood Flooring'
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end'>
                    <div className='p-4 text-white'>
                      <h3 className='text-sm font-semibold leading-tight'>
                        Cambridge White Oak Engineered Wood Flooring
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 3 - Light Brown Oak Laminate Herringbone */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='relative overflow-hidden rounded-t-lg'>
                  <img
                    src='/images/sample-product.png'
                    alt='Light Brown Oak Laminate Herringbone Flooring'
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end'>
                    <div className='p-4 text-white'>
                      <h3 className='text-sm font-semibold leading-tight'>
                        Light Brown Oak Laminate Herringbone Flooring
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 4 - Cambridge Natural Oiled Oak Engineered Wood */}
            <div className='group cursor-pointer'>
              <div className='relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='relative overflow-hidden rounded-t-lg'>
                  <img
                    src='/images/sample-product.png'
                    alt='Cambridge Natural Oiled Oak Engineered Wood Flooring'
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-end'>
                    <div className='p-4 text-white'>
                      <h3 className='text-sm font-semibold leading-tight'>
                        Cambridge Natural Oiled Oak Engineered Wood Flooring
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
    </Layout>
  );
}
