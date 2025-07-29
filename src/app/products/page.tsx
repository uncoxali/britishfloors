import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import SearchFilters from '@/components/ui/SearchFilters';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const itemsPerPage = 12;
  const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * itemsPerPage - 1}`) : undefined;

  let products: ShopifyProduct[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false };
  let error: string | null = null;

  try {
    const response = search
      ? await shopifyApi.searchProducts(search, itemsPerPage, after)
      : await shopifyApi.getProducts(itemsPerPage, after);

    products = response.products.edges.map((edge) => edge.node);
    pageInfo = response.products.pageInfo;
  } catch (err) {
    error = 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <p className='text-gray-600'>{products.length} products found</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <div className='lg:col-span-1'>
            <SearchFilters />
          </div>

          {/* Products Grid */}
          <div className='lg:col-span-3'>
            {error ? (
              <div className='text-center py-12'>
                <p className='text-red-600'>{error}</p>
                <p className='text-gray-500 mt-2'>
                  Please check your Shopify configuration and try again.
                </p>
              </div>
            ) : (
              <>
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
                        href={`/products?page=${page - 1}${search ? `&search=${search}` : ''}`}
                        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Previous
                      </a>
                    )}

                    <span className='text-gray-600'>Page {page}</span>

                    {pageInfo.hasNextPage && (
                      <a
                        href={`/products?page=${page + 1}${search ? `&search=${search}` : ''}`}
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
        </div>
      </div>
    </Layout>
  );
}
