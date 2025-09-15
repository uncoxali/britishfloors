'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { ShopifyProduct } from '@/lib/types/shopify';
import { shopifyApi } from '@/lib/shopify/api';

interface YouMayAlsoLikeProps {
  currentProducts: ShopifyProduct[] | ShopifyProduct; // Accept either array or single product
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({ currentProducts }) => {
  const [similarProducts, setSimilarProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);

        // For single product view (product details page), use the more robust similar products approach
        if (!Array.isArray(currentProducts)) {
          const product = currentProducts;

          // Use the getSimilarProducts function which has better fallback logic
          const similarProducts = await shopifyApi.getSimilarProducts(product, 4);
          setSimilarProducts(similarProducts);
        } else {
          // For product list view, use collection-based approach
          if (currentProducts.length > 0) {
            const firstProduct = currentProducts[0];

            // Fetch products from the same collection
            const collectionProducts = await shopifyApi.getCollectionProducts(firstProduct, 4);
            setSimilarProducts(collectionProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Check if we have valid products to fetch similar products for
    const hasProducts = Array.isArray(currentProducts)
      ? currentProducts.length > 0
      : currentProducts && currentProducts.id;
    if (hasProducts) {
      fetchSimilarProducts();
    }
  }, [
    Array.isArray(currentProducts)
      ? currentProducts.map((p) => p.id).join(',')
      : currentProducts?.id,
  ]); // Use product IDs as dependencies

  if (loading) {
    return (
      <div className='mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold text-blue-900 mb-6 text-center'>You May Also Like</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 relative w-full h-full flex flex-col animate-pulse'
              >
                <div className='aspect-[4/3] w-full bg-gray-200'></div>
                <div className='p-4 flex-1 flex flex-col'>
                  <div className='flex-1'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
                    <div className='h-px bg-gray-200 mb-3'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2 mb-4'></div>
                  </div>
                  <div className='flex items-end justify-between mt-auto'>
                    <div>
                      <div className='h-4 bg-gray-200 rounded w-1/3 mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    </div>
                    <div className='h-8 w-24 bg-gray-200 rounded-lg'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div className='mt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-bold text-blue-900 mb-6 text-center'>You May Also Like</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {similarProducts.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200'
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
