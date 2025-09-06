import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';
import LeftSidebarFilters from '@/components/ui/LeftSidebarFilters';
import MobileFiltersWrapper from '@/components/ui/MobileFiltersWrapper';
import SortByDropdown from '@/components/ui/SortByDropdown';
import GridToggle from '@/components/ui/GridToggle';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    price?: string;
    brands?: string;
    sort?: string;
    grid?: string;
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
  const gridParam = parseInt(resolvedSearchParams.grid || '0');
  const currentGrid = gridParam && gridParam >= 2 && gridParam <= 4 ? gridParam : 3;
  const itemsPerPage = 8;

  let products: ShopifyProduct[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false };
  let totalProducts = 0;
  let error: string | null = null;

  try {
    // Get all products first
    const response = search
      ? await shopifyApi.searchProducts(search, 100)
      : await shopifyApi.getProducts(100);

    let filteredProducts = response.products.edges.map((edge) => edge.node);
    totalProducts = filteredProducts.length;

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(category.toLowerCase()) ||
          product.description.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Apply brand filter
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
          return price >= min;
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
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    products = filteredProducts.slice(startIndex, endIndex);
    totalProducts = filteredProducts.length;

    // Update page info
    pageInfo = {
      hasNextPage: endIndex < filteredProducts.length,
      hasPreviousPage: page > 1,
    };
  } catch (err) {
    error = 'Failed to load products';
    console.error('Error loading products:', err);
  }

  // Get unique categories and brands for filters
  const allProducts = await shopifyApi.getProducts(100);
  const uniqueCategories = [
    ...new Set(
      allProducts.products.edges.map((edge) => {
        const title = edge.node.title.toLowerCase();
        if (title.includes('laminate')) return 'Laminate';
        if (title.includes('vinyl')) return 'Vinyl';
        if (title.includes('wood')) return 'Wood';
        if (title.includes('carpet')) return 'Carpet';
        return 'Other';
      }),
    ),
  ];

  const uniqueBrands = [
    ...new Set(
      allProducts.products.edges.map((edge) => {
        const title = edge.node.title;
        // Extract brand from title (assuming brand is first word)
        return title.split(' ')[0];
      }),
    ),
  ];

  return (
    <Layout>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumbs */}
        <nav className='flex mb-6' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center space-x-1 md:space-x-3'>
            <li className='inline-flex items-center'>
              <Link href='/' className='text-gray-700 hover:text-blue-600'>
                Home
              </Link>
            </li>
            <li>
              <div className='flex items-center'>
                <svg className='w-6 h-6 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-gray-500'>
                  {search ? `Search results for: '${search}'` : 'Products'}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Content Layout */}
        <div className='flex gap-8'>
          {/* Left Sidebar - Filters */}
          <div className='w-80 flex-shrink-0 hidden lg:block'>
            <LeftSidebarFilters
              categories={uniqueCategories}
              brands={uniqueBrands}
              totalResults={products.length}
            />
          </div>

          {/* Right Content - Products */}
          <div className='flex-1 min-w-0'>
            {/* Page Header */}
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-blue-900 mb-2'>
                {search ? `Search results for '${search}'` : 'All Products'}
              </h1>
              <p className='text-gray-600'>
                {search
                  ? `${products.length} results found`
                  : `${products.length} products available`}
              </p>
            </div>

            {/* Mobile Filters Button - Show on smaller screens */}
            <div className='lg:hidden mb-6'>
              <MobileFiltersWrapper
                categories={uniqueCategories}
                brands={uniqueBrands}
                totalResults={products.length}
              />
            </div>

            {/* Results Summary */}
            <div className='mb-6 flex justify-between items-center'>
              <div className='flex items-center gap-4'>
                <GridToggle currentGrid={currentGrid} />
              </div>

              {/* Sort - Right Side */}
              <SortByDropdown currentSort={sortBy} />
            </div>

            {/* Products Grid */}
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
              </div>
            ) : products.length === 0 ? (
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
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {search ? <>No products found for &quot;{search}&quot;</> : 'No products found'}
                </h3>
                <p className='text-gray-600 mb-6'>
                  {search
                    ? 'Try different keywords or adjust your filters.'
                    : 'Try adjusting your filters or search terms.'}
                </p>
                <div className='space-y-3'>
                  <Link
                    href='/products'
                    className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mr-4'
                  >
                    Clear all filters
                  </Link>
                  {search && (
                    <Link
                      href={`/products?${new URLSearchParams({
                        ...(category && { category }),
                        ...(priceRange && { price: priceRange }),
                        ...(brands.length > 0 && { brands: brands.join(',') }),
                        ...(sortBy !== 'featured' && { sort: sortBy }),
                      }).toString()}`}
                      className='inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors'
                    >
                      Remove search term
                    </Link>
                  )}
                </div>
                {search && (
                  <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-medium text-blue-900 mb-2'>Search suggestions:</h4>
                    <ul className='text-sm text-blue-700 space-y-1'>
                      <li>
                        • Try broader terms like &quot;laminate&quot;, &quot;vinyl&quot;, or
                        &quot;wood&quot;
                      </li>
                      <li>• Check spelling and try alternative words</li>
                      <li>• Browse categories using the filters on the left</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className={`${'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'} ${
                    currentGrid === 2
                      ? 'xl:grid-cols-2 2xl:grid-cols-2 gap-4 xl:gap-6'
                      : currentGrid === 3
                      ? 'xl:grid-cols-3 2xl:grid-cols-3 gap-4 xl:gap-6'
                      : 'xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5'
                  } items-start`}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination - MUI Style */}
                {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <div className='flex justify-center'>
                      <nav className='flex items-center space-x-1'>
                        {/* Previous Button */}
                        {pageInfo.hasPreviousPage ? (
                          <Link
                            href={`/products?page=${page - 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}${
                              currentGrid !== 3 ? `&grid=${currentGrid}` : ''
                            }`}
                            className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors'
                            aria-label='Previous page'
                          >
                            <svg
                              className='w-5 h-5'
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
                          </Link>
                        ) : (
                          <span className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-300 cursor-not-allowed'>
                            <svg
                              className='w-5 h-5'
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
                          </span>
                        )}

                        {/* Page Numbers */}
                        {(() => {
                          const totalPages = Math.ceil(totalProducts / itemsPerPage);
                          const pages = [];
                          const maxVisiblePages = 5;

                          let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                          const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }

                          // First page + ellipsis
                          if (startPage > 1) {
                            pages.push(
                              <Link
                                key={1}
                                href={`/products?page=1${search ? `&search=${search}` : ''}${
                                  category ? `&category=${category}` : ''
                                }${priceRange ? `&price=${priceRange}` : ''}${
                                  brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                                }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}${
                                  currentGrid !== 3 ? `&grid=${currentGrid}` : ''
                                }`}
                                className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                              >
                                1
                              </Link>,
                            );
                            if (startPage > 2) {
                              pages.push(
                                <span
                                  key='ellipsis1'
                                  className='inline-flex items-center justify-center w-10 h-10 text-gray-500'
                                >
                                  ...
                                </span>,
                              );
                            }
                          }

                          // Page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Link
                                key={i}
                                href={`/products?page=${i}${search ? `&search=${search}` : ''}${
                                  category ? `&category=${category}` : ''
                                }${priceRange ? `&price=${priceRange}` : ''}${
                                  brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                                }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}${
                                  currentGrid !== 3 ? `&grid=${currentGrid}` : ''
                                }`}
                                className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                                  i === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {i}
                              </Link>,
                            );
                          }

                          // Ellipsis + last page
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span
                                  key='ellipsis2'
                                  className='inline-flex items-center justify-center w-10 h-10 text-gray-500'
                                >
                                  ...
                                </span>,
                              );
                            }
                            pages.push(
                              <Link
                                key={totalPages}
                                href={`/products?page=${totalPages}${
                                  search ? `&search=${search}` : ''
                                }${category ? `&category=${category}` : ''}${
                                  priceRange ? `&price=${priceRange}` : ''
                                }${brands.length > 0 ? `&brands=${brands.join(',')}` : ''}${
                                  sortBy !== 'featured' ? `&sort=${sortBy}` : ''
                                }${currentGrid !== 3 ? `&grid=${currentGrid}` : ''}`}
                                className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                              >
                                {totalPages}
                              </Link>,
                            );
                          }

                          return pages;
                        })()}

                        {/* Next Button */}
                        {pageInfo.hasNextPage ? (
                          <Link
                            href={`/products?page=${page + 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}${
                              currentGrid !== 3 ? `&grid=${currentGrid}` : ''
                            }`}
                            className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors'
                            aria-label='Next page'
                          >
                            <svg
                              className='w-5 h-5'
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
                        ) : (
                          <span className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-300 cursor-not-allowed'>
                            <svg
                              className='w-5 h-5'
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
                          </span>
                        )}
                      </nav>
                    </div>
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
