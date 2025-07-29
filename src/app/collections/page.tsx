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
    collections = response.collections.edges.map((edge) => edge.node);
  } catch (err) {
    error = 'Failed to load collections';
    console.error('Error loading collections:', err);
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Collections</h1>
          <p className='text-gray-600'>Browse our curated collections</p>
        </div>

        {error ? (
          <div className='text-center py-12'>
            <p className='text-red-600'>{error}</p>
            <p className='text-gray-500 mt-2'>
              Please check your Shopify configuration and try again.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className='group block'
              >
                <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
                  {/* Collection Image */}
                  <div className='aspect-square w-full overflow-hidden bg-gray-100'>
                    {collection.image ? (
                      <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        width={400}
                        height={400}
                        className='h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-gray-200'>
                        <span className='text-gray-400'>No image</span>
                      </div>
                    )}
                  </div>

                  {/* Collection Info */}
                  <div className='p-6'>
                    <h3 className='text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2'>
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className='text-gray-600 text-sm line-clamp-2'>{collection.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
