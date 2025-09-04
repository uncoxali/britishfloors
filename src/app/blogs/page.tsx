import React from 'react';
import Layout from '@/components/layout/Layout';
import BlogsContentSection from '@/components/blog/BlogsContentSection';
import { shopifyApi } from '@/lib/shopify/api';

export default async function BlogsPage() {
  try {
    // Fetch blog articles from Shopify
    const response = await shopifyApi.getArticles(100);
    const articles = response.articles.edges.map((edge) => edge.node);

    return (
      <Layout>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl lg:text-5xl font-bold text-blue-900 mb-4'>Our Blog</h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Discover expert insights, tips, and guides about flooring solutions, installation
              techniques, and home improvement.
            </p>
          </div>

          <BlogsContentSection articles={articles} />
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading blogs page:', error);

    // Fallback with empty articles array
    return (
      <Layout>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl lg:text-5xl font-bold text-blue-900 mb-4'>Our Blog</h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Discover expert insights, tips, and guides about flooring solutions, installation
              techniques, and home improvement.
            </p>
          </div>

          <BlogsContentSection articles={[]} />
        </div>
      </Layout>
    );
  }
}
