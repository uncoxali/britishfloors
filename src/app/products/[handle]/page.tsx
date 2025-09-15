import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { shopifyApi } from '@/lib/shopify/api';

import { ShopifyProduct } from '@/lib/types/shopify';
import ProductDetailClient from './ProductDetailClient';
import YouMayAlsoLike from '@/components/product/YouMayAlsoLike';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product: ShopifyProduct | null = null;
  let error: string | null = null;

  try {
    const response = await shopifyApi.getProductByHandle(resolvedParams.handle);
    product = response.product;
  } catch (err) {
    error = 'Failed to load product';
    console.error('Error loading product:', err);
  }

  if (error || !product) {
    notFound();
  }

  return (
    <Layout>
      <div className='px-4 sm:px-6 lg:px-8 py-8'>
        <ProductDetailClient product={product} />
      </div>
    </Layout>
  );
}
