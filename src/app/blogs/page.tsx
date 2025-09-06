import React from 'react';
import Layout from '@/components/layout/Layout';
import BlogsContentSection from '@/components/blog/BlogsContentSection';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyArticle } from '@/lib/types/shopify';

export default async function BlogsPage() {
  let articles: ShopifyArticle[] = [];
  let error: string | null = null;

  try {
    // Fetch blog articles from Shopify with full content
    const response = await shopifyApi.getArticlesWithContent(100);
    articles = response.articles.edges.map((edge) => edge.node);
    console.log(`Loaded ${articles.length} articles from Shopify API`);
  } catch (err) {
    console.error('Error loading blogs page:', err);
    error = 'Unable to load latest articles';
    articles = []; // Will use fallback data in component
  }

  return (
    <Layout>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl lg:text-5xl font-bold text-blue-900 mb-4'>Our Blog</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Discover expert insights, tips, and guides about flooring solutions, installation
            techniques, and home improvement.
          </p>
          {error && (
            <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
              <p className='text-amber-700 text-sm'>
                ⚠️ Unable to load latest articles from server. Showing offline content.
              </p>
            </div>
          )}
        </div>

        <BlogsContentSection articles={articles} />
      </div>
    </Layout>
  );
}
