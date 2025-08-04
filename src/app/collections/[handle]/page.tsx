import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyCollection, ShopifyProduct } from '@/lib/types/shopify';

interface CollectionPageProps {
  params: Promise<{
    handle: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const itemsPerPage = 12;
  const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * itemsPerPage - 1}`) : undefined;

  let collection: ShopifyCollection | null = null;
  let products: ShopifyProduct[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false };
  let error: string | null = null;

  try {
    const response = await shopifyApi.getCollectionByHandle(
      resolvedParams.handle,
      itemsPerPage,
      after,
    );
    collection = response.collection;
    if (collection.products) {
      products = collection.products.edges.map((edge) => edge.node);
      pageInfo = collection.products.pageInfo;
    }
  } catch (err) {
    error = 'Failed to load collection';
    console.error('Error loading collection:', err);
  }

  if (error || !collection) {
    notFound();
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          {/* Collection Header */}
          <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mb-8'>
            {collection.image && (
              <div className='w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  width={128}
                  height={128}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>{collection.title}</h1>
              {collection.description && (
                <p className='text-gray-600 max-w-2xl'>{collection.description}</p>
              )}
              {products.length > 0 && (
                <p className='text-sm text-gray-500 mt-2'>{products.length} products</p>
              )}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No products found in this collection.</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
              <div className='flex justify-center items-center space-x-4'>
                {pageInfo.hasPreviousPage && (
                  <a
                    href={`/collections/${resolvedParams.handle}?page=${page - 1}`}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    Previous
                  </a>
                )}

                <span className='text-gray-600'>Page {page}</span>

                {pageInfo.hasNextPage && (
                  <a
                    href={`/collections/${resolvedParams.handle}?page=${page + 1}`}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
