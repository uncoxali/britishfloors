import React from 'react';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import SpecialOffersGrid from '@/components/product/SpecialOffersGrid';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';

export default async function HomePage() {
  let products: ShopifyProduct[] = [];

  try {
    const response = await shopifyApi.getProducts(8);
    products = response.products.edges.map((edge) => edge.node);
    console.log('Loaded products:', products.length);
    console.log('Sample product:', products[0]);
  } catch (err) {
    console.error('Error loading products:', err);
  }

  return (
    <Layout useContainer={false}>
      {/* Hero Section - Image Only */}
      <section
        className='relative h-[90vh] min-h-[500px] bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('/images/hero-img.png')",
        }}
      ></section>

      {/* Featured Categories Section */}
      <section className='py-5'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>
              Featured Categories
            </h2>
          </div>

          {/* Categories Grid */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16'>
            {[
              { name: 'Luxury Vinyl', image: '/images/sample-product.png' },
              { name: 'Engineered Wood', image: '/images/sample-product.png' },
              { name: 'Laminate', image: '/images/sample-product.png' },
              { name: 'Parquet', image: '/images/sample-product.png' },
              { name: 'Carpet', image: '/images/sample-product.png' },
              { name: 'Accessories', image: '/images/sample-product.png' },
            ].map((category) => (
              <div key={category.name} className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-2xl ring-1 ring-transparent group-hover:ring-purple-500 transition-all duration-300 shadow-sm group-hover:shadow-md'>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={240}
                    className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent' />
                  </div>
                  <div className='absolute left-3 bottom-3'>
                    <span className='text-blue-900 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      {category.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
      <section className='py-5'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
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

      {/* About Us Section */}
      <section className='py-5'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>About Us</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 text-center'>
            <div className='flex flex-col items-center'>
              <Image
                src='/images/svg/about-1.svg'
                alt='Quality & Authenticity'
                width={72}
                height={72}
                className='mb-4'
              />
              <h3 className='text-blue-900 font-bold text-lg mb-2'>Quality & Authenticity</h3>
              <p className='text-gray-600 text-sm leading-6 max-w-xs'>
                At British Floors, we believe true beauty lies in authenticity. That’s why we
                carefully source only the finest natural wood, ensuring every floor reflects
                timeless elegance, strength, and character.
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <Image
                src='/images/svg/about-1.svg'
                alt='Innovation & Design'
                width={72}
                height={72}
                className='mb-4'
              />
              <h3 className='text-blue-900 font-bold text-lg mb-2'>Innovation & Design</h3>
              <p className='text-gray-600 text-sm leading-6 max-w-xs'>
                We blend modern innovation with timeless design traditions—solutions crafted to
                inspire architects, designers, and homeowners alike with beauty and function.
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <Image
                src='/images/svg/about-1.svg'
                alt='Trust & Service'
                width={72}
                height={72}
                className='mb-4'
              />
              <h3 className='text-blue-900 font-bold text-lg mb-2'>Trust & Service</h3>
              <p className='text-gray-600 text-sm leading-6 max-w-xs'>
                Trust is at the heart of everything we do—from consultation to installation and
                beyond—with dependable service and a commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className='py-5 '>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900'>Blogs</h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
            {[
              'What is Engineered Wood Flooring?',
              'What is Vinyl Flooring?',
              'How to Lay Engineered Wood Flooring',
              'How to Lay Parquet Flooring',
              'How to Lay Luxury Vinyl Tiles',
            ].map((title) => (
              <div key={title} className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                  <Image
                    src='/images/sample-product.png'
                    alt={title}
                    width={300}
                    height={200}
                    className='w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black/40'></div>
                  <div className='absolute inset-x-0 bottom-0 p-3 text-white'>
                    <h3 className='text-sm font-semibold leading-tight'>{title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
    </Layout>
  );
}
