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
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <div className='flex items-center justify-between'>
            <p className='text-gray-600'>{products.length} products found</p>
            {(search || category || priceRange || brands.length > 0 || sortBy !== 'featured') && (
              <div className='text-sm text-gray-500'>
                Filters applied:{' '}
                {[
                  search && 'Search',
                  category && 'Category',
                  priceRange && 'Price',
                  brands.length > 0 && 'Brands',
                  sortBy !== 'featured' && 'Sort',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
          </div>
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
                {products.length === 0 ? (
                  <div className='text-center py-12'>
                    <svg
                      className='mx-auto h-16 w-16 text-gray-300'
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
                    <h3 className='mt-4 text-lg font-medium text-gray-900'>No products found</h3>
                    <p className='mt-2 text-sm text-gray-500'>
                      Try adjusting your filters or search terms.
                    </p>
                    <div className='mt-6'>
                      <Link
                        href='/products'
                        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                      >
                        Clear all filters
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

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
                        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                      >
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
                        className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        Next
                      </Link>
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
