'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ShopifyArticle } from '@/lib/types/shopify';
import BlogCard from './BlogCard';
import { shopifyApi } from '@/lib/shopify/api';

interface BlogsSectionProps {
  articles?: ShopifyArticle[];
  showFullContent?: boolean;
  className?: string;
  fetchFromAPI?: boolean;
  maxArticles?: number;
}

const BlogsSection: React.FC<BlogsSectionProps> = ({
  articles: initialArticles = [],
  showFullContent = false,
  className = 'max-w-[110rem] mx-auto',
  fetchFromAPI = false,
  maxArticles = 10,
}) => {
  const [articles, setArticles] = useState<ShopifyArticle[]>(initialArticles);
  const [loading, setLoading] = useState(fetchFromAPI && initialArticles.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shopifyApi.getArticlesWithContent(5);
      const fetchedArticles = response.articles.edges.map((edge) => edge.node).slice(0, 5);
      setArticles(fetchedArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load blog articles');
      // No fallback data - show error message only
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchFromAPI && initialArticles.length === 0) {
      fetchArticles();
    }
  }, [fetchFromAPI, initialArticles.length, fetchArticles]);

  // No fallback articles - only real data from API should be used

  if (loading) {
    return (
      <section className={`py-5 ${className}`}>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>Blogs</h2>
          </div>
          <div className='flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900'></div>
            <span className='ml-3 text-gray-600'>Loading blog articles...</span>
          </div>
        </div>
      </section>
    );
  }

  const displayArticles = articles.length > 0 ? articles.slice(0, 5) : [];

  return (
    <section className={`py-5 ${className}`}>
      <div className='w-full px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>Blogs</h2>
          {error && (
            <p className='text-amber-600 text-sm mb-4'>
              ⚠️ Using offline content - some articles may not be up to date
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
          {displayArticles.map((article) => (
            <BlogCard key={article.id} article={article} showFullContent={showFullContent} />
          ))}
          {displayArticles.length === 0 && !loading && (
            <div className='col-span-full text-center py-12'>
              <p className='text-gray-500'>
                {error ? error : 'No blog articles available at the moment.'}
              </p>
            </div>
          )}
        </div>

        {/* Retry button if there was an error */}
        {error && fetchFromAPI && (
          <div className='text-center mt-8'>
            <button
              onClick={fetchArticles}
              className='inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors'
            >
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Retry Loading
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogsSection;
