import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyProduct } from '@/lib/types/shopify';
import LeftSidebarFilters from '@/components/ui/LeftSidebarFilters';
import MobileFiltersWrapper from '@/components/ui/MobileFiltersWrapper';
import SortByDropdown from '@/components/ui/SortByDropdown';

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
  const itemsPerPage = 20;
  const after = page > 1 ? btoa(`arrayconnection:${(page - 1) * itemsPerPage - 1}`) : undefined;

  let products: ShopifyProduct[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false };
  let error: string | null = null;

  try {
    // Get all products first
    const response = search
      ? await shopifyApi.searchProducts(search, 100, after)
      : await shopifyApi.getProducts(100, after);

    let filteredProducts = response.products.edges.map((edge) => edge.node);

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
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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

            {/* Active Filters Display */}
            {(search || category || priceRange || brands.length > 0 || sortBy !== 'featured') && (
              <div className='mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h3 className='text-sm font-semibold text-blue-900 mb-3 flex items-center'>
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
                      d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
                    />
                  </svg>
                  Active Filters
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {search && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-200 text-blue-800'>
                      Search: &quot;{search}&quot;
                      <Link href='/products' className='ml-2 text-blue-600 hover:text-blue-800'>
                        ×
                      </Link>
                    </span>
                  )}
                  {category && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-200 text-green-800'>
                      Category: {category}
                    </span>
                  )}
                  {priceRange && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-200 text-purple-800'>
                      Price: {priceRange.split('-').map(Number).join(' - £')}
                    </span>
                  )}
                  {brands.map((brand) => (
                    <span
                      key={brand}
                      className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-200 text-orange-800'
                    >
                      Brand: {brand}
                    </span>
                  ))}
                  {sortBy !== 'featured' && (
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-200 text-indigo-800'>
                      Sort: {sortBy.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className='mb-6 flex justify-between items-center'>
              <div className='text-gray-700'>
                <span className='font-medium'>{products.length}</span> products found
                {search && <span className='text-gray-500 ml-2'>for &quot;{search}&quot;</span>}
              </div>

              {/* Sort By - Right Side */}
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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
                  {' '}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination - Enhanced design below the cards */}
                {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                  <div className='mt-12 py-8 border-t border-gray-200'>
                    <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
                      {/* Page Info */}
                      <div className='text-sm text-gray-600'>
                        Showing page <span className='font-medium'>{page}</span>
                        {pageInfo.hasNextPage && ' of multiple pages'}
                      </div>

                      {/* Navigation Buttons */}
                      <div className='flex items-center space-x-4'>
                        {pageInfo.hasPreviousPage && (
                          <Link
                            href={`/products?page=${page - 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}`}
                            className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm'
                          >
                            <svg
                              className='w-5 h-5 mr-2'
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

                        <div className='flex items-center space-x-2'>
                          <span className='px-4 py-2 bg-blue-600 text-white rounded-lg font-medium'>
                            {page}
                          </span>
                        </div>

                        {pageInfo.hasNextPage && (
                          <Link
                            href={`/products?page=${page + 1}${search ? `&search=${search}` : ''}${
                              category ? `&category=${category}` : ''
                            }${priceRange ? `&price=${priceRange}` : ''}${
                              brands.length > 0 ? `&brands=${brands.join(',')}` : ''
                            }${sortBy !== 'featured' ? `&sort=${sortBy}` : ''}`}
                            className='inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm'
                          >
                            Next
                            <svg
                              className='w-5 h-5 ml-2'
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
