'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { shopifyApi } from '@/lib/shopify/api';
import { ShopifyArticle } from '@/lib/types/shopify';
import Image from 'next/image';
import Link from 'next/link';

// Define types for our blog data
interface BlogAuthor {
  name: string;
}

interface BlogImage {
  url: string;
}

interface BlogArticle {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  image: BlogImage;
  author: BlogAuthor;
}

// Define blog categories based on Figma design
const blogCategories = [
  { id: 'default', name: 'Default' },
  { id: 'buyer-guide', name: 'Buyer guide' },
  { id: 'blog', name: 'Blog' },
  { id: 'tips', name: 'Tips' },
  { id: 'installation', name: 'Installation Advice' },
  { id: 'trends', name: 'Flooring Trends' },
];

// Blog card component based on Figma design
const BlogCard = ({ article }: { article: BlogArticle }) => {
  return (
    <div
      className='bg-white rounded-2xl shadow-[0px_0px_5px_0px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-lg w-[420px] max-w-full flex flex-col'
      style={{ height: '520px' }}
    >
      {/* Image container with mask group effect */}
      <div className='relative h-[289.41px] overflow-hidden rounded-t-2xl flex-shrink-0'>
        <div className='absolute inset-0 bg-gray-200'>
          <Image
            src={article.image?.url || '/images/sample-product.png'}
            alt={article.title}
            fill
            className='object-cover'
          />
        </div>
      </div>

      {/* Content */}
      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-base font-bold text-[#C99D55] mb-3 line-clamp-2 text-center'>
          {article.title}
        </h3>

        {/* Description - limited to 2 lines */}
        <p className='text-[#727272] text-xs mb-4 text-justify leading-relaxed line-clamp-2'>
          {article.excerpt || 'Learn more about flooring solutions and home improvement tips.'}
        </p>

        {/* Line separator */}
        <div className='border-t border-[#8E8E8E] w-[361.2px] mx-auto mb-4'></div>

        {/* Meta info */}
        <div className='flex items-center text-[#727272] text-xs mb-6'>
          <div className='flex items-center'>
            {/* Clock icon */}
            <svg width='8.75' height='10' viewBox='0 0 9 10' className='mr-1'>
              <path d='M4.5 1.5V4.5L6.5 5.5' stroke='#727272' strokeWidth='1' fill='none' />
              <circle cx='4.5' cy='4.5' r='3.5' stroke='#727272' strokeWidth='1' fill='none' />
            </svg>
            <span>{article.readTime || '5 Mins'}</span>
          </div>
          <span className='mx-2'>•</span>
          <div className='flex items-center'>
            {/* Calendar icon */}
            <svg width='11.25' height='12' viewBox='0 0 12 13' className='mr-1'>
              <rect
                x='0.5'
                y='2.5'
                width='10'
                height='9'
                rx='1'
                stroke='#727272'
                strokeWidth='1'
                fill='none'
              />
              <path d='M4 0.5V2.5' stroke='#727272' strokeWidth='1' />
              <path d='M8 0.5V2.5' stroke='#727272' strokeWidth='1' />
              <path d='M1.5 5.5H9.5' stroke='#727272' strokeWidth='1' />
            </svg>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'June 10, 2025'}
            </span>
          </div>
          <span className='mx-2'>•</span>
          <div className='flex items-center'>
            {/* User icon */}
            <svg width='11.5' height='15.9' viewBox='0 0 12 16' className='mr-1'>
              <circle cx='6' cy='5' r='3' stroke='#727272' strokeWidth='1' fill='none' />
              <path d='M1 13L3 10L9 10L11 13' stroke='#727272' strokeWidth='1' fill='none' />
            </svg>
            <span>By {article.author?.name || 'British Floors'}</span>
          </div>
        </div>

        {/* Read more button - simple implementation matching Figma */}
        <div className='flex justify-end mt-auto'>
          <Link
            href={`/blogs/${article.handle}`}
            className='bg-[#C99D55] text-white text-xs font-bold py-2 px-4 rounded-[17.74px] hover:bg-[#C99D55]/90 transition-colors inline-block'
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles from Shopify API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await shopifyApi.getArticlesWithContent(100);
        const shopifyArticles = response.articles.edges.map((edge) => edge.node);

        // Transform Shopify articles to our BlogArticle format
        const transformedArticles: BlogArticle[] = shopifyArticles.map(
          (article: ShopifyArticle) => ({
            id: article.id,
            handle: article.handle,
            title: article.title,
            excerpt: article.excerpt || '',
            publishedAt: article.publishedAt,
            readTime: calculateReadTime(article.content || article.excerpt || ''),
            image: {
              url: article.image?.url || '/images/sample-product.png',
            },
            author: {
              name: article.author?.name || 'British Floors Team',
            },
          }),
        );

        setArticles(transformedArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load blog articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Simple read time calculation
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} Min${readTime !== 1 ? 's' : ''}`;
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700'></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <h3 className='text-red-800 font-bold text-lg mb-2'>Error Loading Articles</h3>
            <p className='text-red-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout useContainer={false}>
      {/* Hero Section - Full width without margins */}
      <section className='relative h-[500px] w-full'>
        <div className='absolute inset-0'>
          <Image
            src='/images/blog-hero.jpg'
            alt='Blog Hero'
            fill
            className='object-cover'
            priority
          />
        </div>
        <div className='absolute inset-0 bg-black/40'></div>
        <div className='relative z-10 h-full flex flex-col items-center justify-center text-center px-4'>
          <div className='mb-6'>
            {/* Decorative icon group similar to Figma */}
            <div className='flex justify-center mb-8'>
              <div className='relative w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg'>
                <div className='absolute inset-0 rounded-lg shadow-md'></div>
                <div className='relative w-8 h-8'>
                  <div className='absolute w-full h-full'>
                    <svg viewBox='0 0 32 32' className='w-full h-full text-white'>
                      <path
                        d='M2 6L16 2L30 6L16 30L2 6Z'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      />
                      <path d='M16 2V30' stroke='currentColor' strokeWidth='2' />
                      <path d='M2 6H30' stroke='currentColor' strokeWidth='2' />
                      <path
                        d='M8 10L16 14L24 10'
                        stroke='currentColor'
                        strokeWidth='2'
                        fill='none'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold text-[#FAF5EE] mb-4'>
              How to Choose the Right Patterned Flooring
            </h1>
            <p className='text-xl text-[#FAF5EE] max-w-2xl mx-auto'>
              Discover expert insights, tips, and guides about flooring solutions, installation
              techniques, and home improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Container for content below hero */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
        {/* Blog Categories Navigation */}
        <section className='mb-16'>
          <div className='flex flex-wrap justify-center gap-4 md:gap-8'>
            {blogCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#1A4685] text-white'
                    : 'bg-transparent text-gray-700 hover:text-[#1A4685]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Popular Blogs Section */}
        <section className='mb-16 bg-[#C99D55] py-8 rounded-lg -mx-4 sm:-mx-6 lg:-mx-8'>
          <h2 className='text-3xl font-bold text-center text-white mb-12'>Popular Blogs</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-center'>
            {articles.slice(0, 3).map((article) => (
              <div key={article.id} className='flex justify-center'>
                <BlogCard article={article} />
              </div>
            ))}
          </div>
        </section>

        {/* All Blogs Section */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-center text-[#1A4685] mb-12'>Blogs</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-center'>
            {articles.slice(3).map((article) => (
              <div key={article.id} className='flex justify-center'>
                <BlogCard article={article} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
