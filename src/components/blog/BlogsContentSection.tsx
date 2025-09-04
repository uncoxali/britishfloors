import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyArticle } from '@/lib/types/shopify';

interface BlogsContentSectionProps {
  articles: ShopifyArticle[];
}

const BlogsContentSection: React.FC<BlogsContentSectionProps> = ({ articles }) => {
  return (
    <section className='py-8'>
      <div className='space-y-16'>
        {articles.length > 0
          ? articles.map((article, index) => (
              <article key={article.id} className='max-w-4xl mx-auto'>
                {/* Article Header */}
                <div className='mb-8'>
                  <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>
                    <Link
                      href={`/blogs/${article.handle}`}
                      className='hover:text-blue-700 transition-colors'
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {/* Article Meta */}
                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {article.author?.name && <span>By {article.author.name}</span>}
                  </div>

                  {/* Article Image */}
                  {article.image && (
                    <div className='mb-8'>
                      <Image
                        src={article.image.url}
                        alt={article.title}
                        width={800}
                        height={400}
                        className='w-full h-64 lg:h-96 object-cover rounded-lg'
                      />
                    </div>
                  )}
                </div>

                {/* Article Content */}
                {article.contentHtml ? (
                  <div
                    className='blog-content prose prose-lg max-w-none mb-8'
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />
                ) : article.content ? (
                  <div className='blog-content prose prose-lg max-w-none mb-8'>
                    <p className='text-lg leading-relaxed'>{article.content}</p>
                  </div>
                ) : article.excerpt ? (
                  <div className='blog-content prose prose-lg max-w-none mb-8'>
                    <p className='text-lg leading-relaxed'>{article.excerpt}</p>
                  </div>
                ) : (
                  <p className='text-gray-500 italic text-lg mb-8'>
                    No content available for this article.
                  </p>
                )}

                {/* Article Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className='mb-8'>
                    <div className='flex flex-wrap gap-2'>
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read More Link */}
                <div className='text-center'>
                  <Link
                    href={`/blogs/${article.handle}`}
                    className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors'
                  >
                    Read Full Article
                    <svg
                      className='w-4 h-4 ml-2'
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
                </div>

                {/* Divider between articles */}
                {index < articles.length - 1 && (
                  <div className='border-t border-gray-200 pt-8'></div>
                )}
              </article>
            ))
          : // Fallback content when no articles are available
            [
              {
                id: '1',
                handle: 'what-is-engineered-wood-flooring',
                title: 'What is Engineered Wood Flooring?',
                excerpt: 'Learn about the benefits and features of engineered wood flooring.',
                content:
                  'Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard. This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems. The top layer provides the authentic look and feel of real wood, while the engineered core offers superior stability and resistance to moisture and temperature changes.',
                contentHtml: null,
                publishedAt: '2024-01-15',
                image: {
                  id: '1',
                  url: '/images/sample-product.png',
                  width: 800,
                  height: 400,
                },
                author: { name: 'British Floors Team' },
                tags: ['Engineered Wood', 'Flooring', 'Installation'],
              },
              {
                id: '2',
                handle: 'what-is-vinyl-flooring',
                title: 'What is Vinyl Flooring?',
                excerpt: 'Discover the advantages of vinyl flooring for your home.',
                content:
                  'Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability. Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile. Vinyl flooring is perfect for high-moisture areas like bathrooms and kitchens, and it offers excellent sound absorption properties.',
                contentHtml: null,
                publishedAt: '2024-01-10',
                image: {
                  id: '2',
                  url: '/images/sample-product.png',
                  width: 800,
                  height: 400,
                },
                author: { name: 'British Floors Team' },
                tags: ['Vinyl', 'LVT', 'Waterproof'],
              },
              {
                id: '3',
                handle: 'how-to-lay-engineered-wood-flooring',
                title: 'How to Lay Engineered Wood Flooring',
                excerpt: 'Step-by-step guide to installing engineered wood flooring.',
                content:
                  'Installing engineered wood flooring requires careful preparation and attention to detail. Start by acclimating the flooring to your room conditions for at least 48 hours. Ensure your subfloor is clean, dry, and level. Use the appropriate installation method - floating, glue-down, or nail-down - based on your subfloor type and manufacturer recommendations. Always leave expansion gaps around the perimeter to allow for natural wood movement.',
                contentHtml: null,
                publishedAt: '2024-01-05',
                image: {
                  id: '3',
                  url: '/images/sample-product.png',
                  width: 800,
                  height: 400,
                },
                author: { name: 'British Floors Team' },
                tags: ['Installation', 'DIY', 'Tips'],
              },
            ].map((article, index) => (
              <article key={article.id} className='max-w-4xl mx-auto'>
                {/* Article Header */}
                <div className='mb-8'>
                  <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>
                    <Link
                      href={`/blogs/${article.handle}`}
                      className='hover:text-blue-700 transition-colors'
                    >
                      {article.title}
                    </Link>
                  </h2>

                  {/* Article Meta */}
                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {article.author?.name && <span>By {article.author.name}</span>}
                  </div>

                  {/* Article Image */}
                  {article.image && (
                    <div className='mb-8'>
                      <Image
                        src={article.image.url}
                        alt={article.title}
                        width={800}
                        height={400}
                        className='w-full h-64 lg:h-96 object-cover rounded-lg'
                      />
                    </div>
                  )}
                </div>

                {/* Article Content */}
                {article.contentHtml ? (
                  <div
                    className='blog-content prose prose-lg max-w-none mb-8'
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />
                ) : article.content ? (
                  <div className='blog-content prose prose-lg max-w-none mb-8'>
                    <p className='text-lg leading-relaxed'>{article.content}</p>
                  </div>
                ) : article.excerpt ? (
                  <div className='blog-content prose prose-lg max-w-none mb-8'>
                    <p className='text-lg leading-relaxed'>{article.excerpt}</p>
                  </div>
                ) : (
                  <p className='text-gray-500 italic text-lg mb-8'>
                    No content available for this article.
                  </p>
                )}

                {/* Article Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className='mb-8'>
                    <div className='flex flex-wrap gap-2'>
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Read More Link */}
                <div className='text-center'>
                  <Link
                    href={`/blogs/${article.handle}`}
                    className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors'
                  >
                    Read Full Article
                    <svg
                      className='w-4 h-4 ml-2'
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
                </div>

                {/* Divider between articles */}
                {index < 2 && <div className='border-t border-gray-200 pt-8'></div>}
              </article>
            ))}
      </div>
    </section>
  );
};

export default BlogsContentSection;
