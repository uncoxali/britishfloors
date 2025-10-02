import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct, ShopifyArticle, ShopifyCollection } from '@/lib/types/shopify';
import ProductCard from '@/components/product/ProductCard';
import BlogsSection from '@/components/blog/BlogsSection';
import SpecialOffersSlider from '@/components/product/SpecialOffersSlider';

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  let articles: ShopifyArticle[] = [];
  let collections: ShopifyCollection[] = [];

  try {
    const response = await shopifyApi.getProducts(8);
    if (response && response.products && response.products.edges) {
      products = response.products.edges.map((edge) => edge.node);
    }
  } catch (err) {
    console.error('Error loading products:', err);
  }

  try {
    const collectionsResponse = await shopifyApi.getCollections(6);
    if (
      collectionsResponse &&
      collectionsResponse.collections &&
      collectionsResponse.collections.edges
    ) {
      collections = collectionsResponse.collections.edges.map((edge) => edge.node);
    }
  } catch (err) {
    console.error('Error loading collections:', err);
  }

  try {
    const articlesResponse = await shopifyApi.getArticlesWithContent(5);
    articles = articlesResponse.articles.edges.map((edge) => edge.node).slice(0, 5);
  } catch (err) {
    console.error('Error loading articles:', err);
    // Keep articles as empty array, fallback will be used in BlogsSection
  }

  return (
    <Layout useContainer={false}>
      {/* Hero Section - Image Only */}
      <section
        className='relative h-[60vh] md:h-[90vh] min-h-[400px] md:min-h-[500px] bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: "url('/images/hero-img.png')",
        }}
      ></section>

      {/* Featured Categories Section */}
      <section className='py-5'>
        <div className='max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>
              Featured Categories
            </h2>
          </div>

          {/* Categories Grid */}
          <div className='w-full flex justify-center'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16'>
              {collections.length > 0 ? (
                collections.slice(0, 5).map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/products?category=${collection.title.toLowerCase().replace(/ /g, '-')}`}
                    className='group cursor-pointer'
                  >
                    <div className='relative overflow-hidden rounded-2xl ring-1 ring-transparent group-hover:ring-purple-500 transition-all duration-300 shadow-sm group-hover:shadow-md h-48 lg:h-80'>
                      <Image
                        src={collection.image?.url || '/images/sample-product.png'}
                        alt={collection.title}
                        width={280}
                        height={320}
                        className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                        priority={false}
                        loading='lazy'
                      />
                      <div className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent' />
                      </div>
                      <div className='absolute left-3 bottom-3'>
                        <span className='text-blue-900 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          {collection.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='col-span-full text-center py-8'>
                  <p className='text-gray-500'>Loading collections...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className='py-5'>
        <div className='md:max-w-[110rem] w-full mx-auto lg:px-8'>
          {products.length > 0 ? (
            <SpecialOffersSlider products={products.slice(0, 4)} />
          ) : (
            <div className='bg-[#1A4685] rounded-2xl p-3 relative overflow-hidden'>
              <div className='relative z-10'>
                <div className='flex flex-col lg:flex-row items-center gap-4'>
                  <div className='lg:w-[10%] 2xl:w-[30%] flex items-center justify-center h-full'>
                    <Image
                      src='/images/product-pers.png'
                      alt='Special Offers'
                      width={400}
                      height={300}
                      className='w-auto h-auto max-w-full'
                      priority={false}
                      loading='lazy'
                    />
                  </div>
                  <div className='lg:w-4/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className='bg-white/20 rounded-2xl h-64 animate-pulse'></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
                <div className='w-full h-full bg-gradient-to-br from-white to-transparent rounded-full'></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className='py-5 max-w-[110rem] mx-auto'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
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
                  <Image
                    src='/images/sample-product.png'
                    alt='Cambridge White Oak Engineered Wood Flooring'
                    width={600}
                    height={400}
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                    priority={false}
                    loading='lazy'
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
                  <Image
                    src='/images/sample-product.png'
                    alt='Cambridge White Oak Engineered Wood Flooring'
                    width={600}
                    height={400}
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                    priority={false}
                    loading='lazy'
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
                  <Image
                    src='/images/sample-product.png'
                    alt='Light Brown Oak Laminate Herringbone Flooring'
                    width={600}
                    height={400}
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                    priority={false}
                    loading='lazy'
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
                  <Image
                    src='/images/sample-product.png'
                    alt='Cambridge Natural Oiled Oak Engineered Wood Flooring'
                    width={600}
                    height={400}
                    className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                    priority={false}
                    loading='lazy'
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
      <section className='py-5 max-w-[110rem] mx-auto'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
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
                priority={false}
                loading='lazy'
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
                priority={false}
                loading='lazy'
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
                priority={false}
                loading='lazy'
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
      <BlogsSection articles={articles} showFullContent={true} />
    </Layout>
  );
}
