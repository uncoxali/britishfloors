import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import SearchFilters from '@/components/ui/SearchFilters';
import Link from 'next/link';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    price?: string;
    brands?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const category = resolvedSearchParams.category || '';
  const priceRange = resolvedSearchParams.price || '';
  const brands = resolvedSearchParams.brands?.split(',') || [];
  const sortBy = resolvedSearchParams.sort || 'featured';
  const itemsPerPage = 12;
  const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * itemsPerPage - 1}`) : undefined;

  let products: ShopifyProduct[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false };
  let error: string | null = null;

  try {
    // Get all products first
    const response = search
      ? await shopifyApi.searchProducts(search, 100, after) // Get more products for filtering
      : await shopifyApi.getProducts(100, after); // Get more products for filtering

    let filteredProducts = response.products.edges.map((edge) => edge.node);

    // Apply category filter (based on title and description)
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(category.toLowerCase()) ||
          product.description.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Apply brand filter (based on title)
    if (brands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        brands.some((brand) => product.title.toLowerCase().includes(brand.toLowerCase())),
      );
    }

    // Apply price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter((product) => {
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        if (max === 1000) {
          return price >= min; // "Over $500" case
        }
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount),
        );
        break;
      case 'price-high':
        filteredProducts.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount),
        );
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        // Sort by ID (assuming newer products have higher IDs)
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Featured - keep original order
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    products = filteredProducts.slice(startIndex, endIndex);

    // Update page info
    pageInfo = {
      hasNextPage: endIndex < filteredProducts.length,
      hasPreviousPage: page > 1,
    };
  } catch (err) {
    error = 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <p className='text-gray-600'>{products.length} products found</p>
        </div>

        {/* Active Filters */}
        {(search || category || priceRange || brands.length > 0 || sortBy !== 'featured') && (
          <div className='mb-6'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>Active filters:</span>
              <div className='flex flex-wrap gap-2'>
                {search && (
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Search: {search}
                  </span>
                )}
                {category && (
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Category: {category}
                  </span>
                )}
                {priceRange && (
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                    Price: {priceRange}
                  </span>
                )}
                {brands.length > 0 && (
                  <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                    Brands: {brands.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filters</h3>
              <SearchFilters />
            </div>
          </div>

          {/* Products Grid */}
          <div className='lg:col-span-3'>
            {error ? (
              <div className='text-center py-16'>
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
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Error Loading Products</h3>
                <p className='text-gray-600 mb-4'>{error}</p>
                <p className='text-sm text-gray-500'>
                  Please check your Shopify configuration and try again.
                </p>
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className='text-center py-16'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
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
                          d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                        />
                      </svg>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>No products found</h3>
                    <p className='text-gray-600 mb-6'>
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                    <Link
                      href='/products'
                      className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Clear all filters
                      <svg
                        className='ml-2 w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                        />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {products.length > 0 && (pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                      <div className='flex justify-center items-center space-x-4'>
                        {pageInfo.hasPreviousPage && (
                          <Link
                            href={`/products?page=${page - 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}`}
                            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                          >
                            <svg
                              className='w-4 h-4 mr-2'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 19l-7-7 7-7'
                              />
                            </svg>
                            Previous
                          </Link>
                        )}

                        <span className='text-gray-600'>Page {page}</span>

                        {pageInfo.hasNextPage && (
                          <Link
                            href={`/products?page=${page + 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}`}
                            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                          >
                            Next
                            <svg
                              className='w-4 h-4 ml-2'
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
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
