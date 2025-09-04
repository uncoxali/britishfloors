import React from 'react';
import { ShopifyArticle } from '@/lib/types/shopify';
import BlogCard from './BlogCard';

interface BlogsSectionProps {
  articles: ShopifyArticle[];
  showFullContent?: boolean;
  className?: string;
}

const BlogsSection: React.FC<BlogsSectionProps> = ({
  articles,
  showFullContent = false,
  className = '',
}) => {
  return (
    <section className={`py-5 ${className}`}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>Blogs</h2>
        </div>

        <div
          className={`grid gap-6 ${
            showFullContent
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {articles.length > 0
            ? articles.map((article) => (
                <BlogCard key={article.id} article={article} showFullContent={showFullContent} />
              ))
            : // Fallback to hardcoded data if no articles are fetched
              [
                {
                  id: '1',
                  handle: 'what-is-engineered-wood-flooring',
                  title: 'What is Engineered Wood Flooring?',
                  excerpt: 'Learn about the benefits and features of engineered wood flooring.',
                  content:
                    'Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard. This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems.',
                  publishedAt: '2024-01-15',
                  image: {
                    id: '1',
                    url: '/images/sample-product.png',
                    width: 300,
                    height: 200,
                  },
                },
                {
                  id: '2',
                  handle: 'what-is-vinyl-flooring',
                  title: 'What is Vinyl Flooring?',
                  excerpt: 'Discover the advantages of vinyl flooring for your home.',
                  content:
                    'Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability. Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile.',
                  publishedAt: '2024-01-10',
                  image: {
                    id: '2',
                    url: '/images/sample-product.png',
                    width: 300,
                    height: 200,
                  },
                },
                {
                  id: '3',
                  handle: 'how-to-lay-engineered-wood-flooring',
                  title: 'How to Lay Engineered Wood Flooring',
                  excerpt: 'Step-by-step guide to installing engineered wood flooring.',
                  content:
                    'Installing engineered wood flooring requires careful preparation and attention to detail. Start by acclimating the flooring to your room conditions for at least 48 hours. Ensure your subfloor is clean, dry, and level. Use the appropriate installation method - floating, glue-down, or nail-down - based on your subfloor type and manufacturer recommendations.',
                  publishedAt: '2024-01-05',
                  image: {
                    id: '3',
                    url: '/images/sample-product.png',
                    width: 300,
                    height: 200,
                  },
                },
                {
                  id: '4',
                  handle: 'how-to-lay-parquet-flooring',
                  title: 'How to Lay Parquet Flooring',
                  excerpt: 'Complete guide to installing beautiful parquet flooring.',
                  content:
                    'Parquet flooring installation is an art that creates stunning geometric patterns. The process involves careful measurement, precise cutting, and methodical placement of individual wood pieces. Whether using traditional herringbone, chevron, or custom patterns, proper subfloor preparation and adhesive selection are crucial for a successful installation.',
                  publishedAt: '2024-01-01',
                  image: {
                    id: '4',
                    url: '/images/sample-product.png',
                    width: 300,
                    height: 200,
                  },
                },
                {
                  id: '5',
                  handle: 'how-to-lay-luxury-vinyl-tiles',
                  title: 'How to Lay Luxury Vinyl Tiles',
                  excerpt: 'Professional tips for installing luxury vinyl tiles.',
                  content:
                    'Luxury vinyl tiles (LVT) offer a great balance of style and practicality. Installation typically involves a click-lock system or adhesive application. Proper subfloor preparation is essential, and the tiles should be installed with expansion gaps around the perimeter. LVT is perfect for areas where moisture resistance is important.',
                  publishedAt: '2023-12-28',
                  image: {
                    id: '5',
                    url: '/images/sample-product.png',
                    width: 300,
                    height: 200,
                  },
                },
              ].map((article) => (
                <BlogCard key={article.id} article={article} showFullContent={showFullContent} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
