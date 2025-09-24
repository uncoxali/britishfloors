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
  className = '',
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
      // Keep fallback data if API fails
      setArticles(getFallbackArticles().slice(0, 5));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchFromAPI && initialArticles.length === 0) {
      fetchArticles();
    }
  }, [fetchFromAPI, initialArticles.length, fetchArticles]);

  const getFallbackArticles = (): ShopifyArticle[] => {
    return [
      {
        id: '1',
        handle: 'what-is-engineered-wood-flooring',
        title: 'What is Engineered Wood Flooring?',
        excerpt:
          'Learn about the benefits and features of engineered wood flooring for your home renovation project.',
        content:
          'Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard. This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems. The top layer provides the authentic look and feel of real wood, while the engineered core offers superior stability and resistance to moisture and temperature changes. Engineered wood flooring is an excellent choice for homeowners who want the beauty of real wood with enhanced durability and versatility.',
        contentHtml:
          '<p>Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard.</p><p>This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems.</p><p>The top layer provides the authentic look and feel of real wood, while the engineered core offers superior stability and resistance to moisture and temperature changes.</p><p>Engineered wood flooring is an excellent choice for homeowners who want the beauty of real wood with enhanced durability and versatility.</p>',
        publishedAt: '2024-01-15T10:00:00Z',
        image: {
          id: '1',
          url: '/images/sample-product.png',
          width: 800,
          height: 400,
        },
        author: { name: 'British Floors Team' },
        tags: ['Engineered Wood', 'Flooring Guide', 'Home Improvement'],
      },
      {
        id: '2',
        handle: 'what-is-vinyl-flooring',
        title: 'What is Vinyl Flooring?',
        excerpt:
          'Discover the advantages of vinyl flooring for modern homes and commercial spaces.',
        content:
          "Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability. Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile. Vinyl flooring is particularly popular in kitchens, bathrooms, and other high-moisture areas due to its excellent water resistance. It's also easy to maintain and can withstand heavy foot traffic, making it ideal for both residential and commercial applications.",
        contentHtml:
          "<p>Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability.</p><p>Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile.</p><p>Vinyl flooring is particularly popular in kitchens, bathrooms, and other high-moisture areas due to its excellent water resistance.</p><p>It's also easy to maintain and can withstand heavy foot traffic, making it ideal for both residential and commercial applications.</p>",
        publishedAt: '2024-01-10T14:30:00Z',
        image: {
          id: '2',
          url: '/images/sample-product.png',
          width: 800,
          height: 400,
        },
        author: { name: 'British Floors Team' },
        tags: ['Vinyl Flooring', 'LVT', 'Water Resistant'],
      },
      {
        id: '3',
        handle: 'how-to-lay-engineered-wood-flooring',
        title: 'How to Lay Engineered Wood Flooring',
        excerpt: 'Step-by-step guide to installing engineered wood flooring like a professional.',
        content:
          'Installing engineered wood flooring requires careful preparation and attention to detail. Start by acclimating the flooring to your room conditions for at least 48 hours. Ensure your subfloor is clean, dry, and level. Use the appropriate installation method - floating, glue-down, or nail-down - based on your subfloor type and manufacturer recommendations. Always leave expansion gaps around the perimeter to allow for natural wood movement. Proper installation ensures your engineered wood flooring will look beautiful and last for years to come.',
        contentHtml:
          '<p>Installing engineered wood flooring requires careful preparation and attention to detail.</p><ul><li>Start by acclimating the flooring to your room conditions for at least 48 hours</li><li>Ensure your subfloor is clean, dry, and level</li><li>Use the appropriate installation method - floating, glue-down, or nail-down</li><li>Always leave expansion gaps around the perimeter</li></ul><p>Proper installation ensures your engineered wood flooring will look beautiful and last for years to come.</p>',
        publishedAt: '2024-01-05T09:15:00Z',
        image: {
          id: '3',
          url: '/images/sample-product.png',
          width: 800,
          height: 400,
        },
        author: { name: 'British Floors Team' },
        tags: ['Installation', 'DIY', 'Tips', 'Engineered Wood'],
      },
      {
        id: '4',
        handle: 'how-to-lay-parquet-flooring',
        title: 'How to Lay Parquet Flooring',
        excerpt: 'Complete guide to installing beautiful parquet flooring patterns in your home.',
        content:
          'Parquet flooring installation is an art that creates stunning geometric patterns. The process involves careful measurement, precise cutting, and methodical placement of individual wood pieces. Whether using traditional herringbone, chevron, or custom patterns, proper subfloor preparation and adhesive selection are crucial for a successful installation. Take time to plan your layout, starting from the center of the room and working outward. Parquet flooring adds timeless elegance and sophistication to any space when installed correctly.',
        contentHtml:
          '<p>Parquet flooring installation is an art that creates stunning geometric patterns.</p><p>The process involves careful measurement, precise cutting, and methodical placement of individual wood pieces.</p><p>Whether using traditional herringbone, chevron, or custom patterns, proper subfloor preparation and adhesive selection are crucial for a successful installation.</p><p>Take time to plan your layout, starting from the center of the room and working outward.</p><p>Parquet flooring adds timeless elegance and sophistication to any space when installed correctly.</p>',
        publishedAt: '2024-01-01T16:45:00Z',
        image: {
          id: '4',
          url: '/images/sample-product.png',
          width: 800,
          height: 400,
        },
        author: { name: 'British Floors Team' },
        tags: ['Parquet', 'Installation', 'Design', 'Patterns'],
      },
      {
        id: '5',
        handle: 'how-to-lay-luxury-vinyl-tiles',
        title: 'How to Lay Luxury Vinyl Tiles',
        excerpt: 'Professional tips for installing luxury vinyl tiles (LVT) in any room.',
        content:
          'Luxury vinyl tiles (LVT) offer a great balance of style and practicality. Installation typically involves a click-lock system or adhesive application. Proper subfloor preparation is essential, and the tiles should be installed with expansion gaps around the perimeter. LVT is perfect for areas where moisture resistance is important. The installation process is relatively straightforward, making it a popular choice for DIY enthusiasts. With proper installation, LVT can provide decades of beautiful, low-maintenance flooring.',
        contentHtml:
          '<p>Luxury vinyl tiles (LVT) offer a great balance of style and practicality.</p><p>Installation typically involves a click-lock system or adhesive application.</p><p>Proper subfloor preparation is essential, and the tiles should be installed with expansion gaps around the perimeter.</p><p>LVT is perfect for areas where moisture resistance is important.</p><p>The installation process is relatively straightforward, making it a popular choice for DIY enthusiasts.</p><p>With proper installation, LVT can provide decades of beautiful, low-maintenance flooring.</p>',
        publishedAt: '2023-12-28T11:20:00Z',
        image: {
          id: '5',
          url: '/images/sample-product.png',
          width: 800,
          height: 400,
        },
        author: { name: 'British Floors Team' },
        tags: ['LVT', 'Installation', 'DIY', 'Vinyl'],
      },
    ];
  };

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

  const displayArticles =
    articles.length > 0 ? articles.slice(0, 5) : getFallbackArticles().slice(0, 5);

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
