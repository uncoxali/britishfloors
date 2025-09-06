import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { shopifyApi } from '@/lib/shopify/api';

interface BlogPostPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const resolvedParams = await params;
    console.log(`Loading blog post with handle: ${resolvedParams.handle}`);
    
    // Try to get the article using the improved API method
    const { article } = await shopifyApi.getArticleByHandle(resolvedParams.handle);

    // If article not found from API, use fallback content
    if (!article) {
      console.log(`Article not found in API for handle: ${resolvedParams.handle}, using fallback content`);
      
      // Fallback articles for common handles
      const fallbackArticles = {
        'what-is-engineered-wood-flooring': {
          id: '1',
          handle: 'what-is-engineered-wood-flooring',
          title: 'What is Engineered Wood Flooring?',
          excerpt: 'Learn about the benefits and features of engineered wood flooring for your home renovation project.',
          content: 'Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard. This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems. The top layer provides the authentic look and feel of real wood, while the engineered core offers superior stability and resistance to moisture and temperature changes.',
          contentHtml: '<p>Engineered wood flooring is a type of flooring that consists of a top layer of real wood veneer bonded to a core of high-quality plywood or fiberboard.</p><p>This construction makes it more stable than solid wood flooring and suitable for installation over concrete subfloors and with underfloor heating systems.</p><p>The top layer provides the authentic look and feel of real wood, while the engineered core offers superior stability and resistance to moisture and temperature changes.</p>',
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
        'what-is-vinyl-flooring': {
          id: '2',
          handle: 'what-is-vinyl-flooring',
          title: 'What is Vinyl Flooring?',
          excerpt: 'Discover the advantages of vinyl flooring for modern homes and commercial spaces.',
          content: 'Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability. Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile.',
          contentHtml: '<p>Vinyl flooring is a synthetic flooring material made from polyvinyl chloride (PVC). It is known for its durability, water resistance, and affordability.</p><p>Modern vinyl flooring comes in various styles including luxury vinyl tiles (LVT) and luxury vinyl planks (LVP) that can mimic the look of wood, stone, or tile.</p>',
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
        'how-to-lay-engineered-wood-flooring': {
          id: '3',
          handle: 'how-to-lay-engineered-wood-flooring',
          title: 'How to Lay Engineered Wood Flooring',
          excerpt: 'Step-by-step guide to installing engineered wood flooring like a professional.',
          content: 'Installing engineered wood flooring requires careful preparation and attention to detail. Start by acclimating the flooring to your room conditions for at least 48 hours. Ensure your subfloor is clean, dry, and level. Use the appropriate installation method - floating, glue-down, or nail-down - based on your subfloor type.',
          contentHtml: '<p>Installing engineered wood flooring requires careful preparation and attention to detail.</p><ul><li>Start by acclimating the flooring to your room conditions for at least 48 hours</li><li>Ensure your subfloor is clean, dry, and level</li><li>Use the appropriate installation method - floating, glue-down, or nail-down</li></ul>',
          publishedAt: '2024-01-05T09:15:00Z',
          image: {
            id: '3',
            url: '/images/sample-product.png',
            width: 800,
            height: 400,
          },
          author: { name: 'British Floors Team' },
          tags: ['Installation', 'DIY', 'Tips'],
        },
        'how-to-lay-parquet-flooring': {
          id: '4',
          handle: 'how-to-lay-parquet-flooring',
          title: 'How to Lay Parquet Flooring',
          excerpt: 'Complete guide to installing beautiful parquet flooring patterns in your home.',
          content: 'Parquet flooring installation is an art that creates stunning geometric patterns. The process involves careful measurement, precise cutting, and methodical placement of individual wood pieces.',
          contentHtml: '<p>Parquet flooring installation is an art that creates stunning geometric patterns.</p><p>The process involves careful measurement, precise cutting, and methodical placement of individual wood pieces.</p>',
          publishedAt: '2024-01-01T16:45:00Z',
          image: {
            id: '4',
            url: '/images/sample-product.png',
            width: 800,
            height: 400,
          },
          author: { name: 'British Floors Team' },
          tags: ['Parquet', 'Installation', 'Design'],
        },
        'how-to-lay-luxury-vinyl-tiles': {
          id: '5',
          handle: 'how-to-lay-luxury-vinyl-tiles',
          title: 'How to Lay Luxury Vinyl Tiles',
          excerpt: 'Professional tips for installing luxury vinyl tiles (LVT) in any room.',
          content: 'Luxury vinyl tiles (LVT) offer a great balance of style and practicality. Installation typically involves a click-lock system or adhesive application.',
          contentHtml: '<p>Luxury vinyl tiles (LVT) offer a great balance of style and practicality.</p><p>Installation typically involves a click-lock system or adhesive application.</p>',
          publishedAt: '2023-12-28T11:20:00Z',
          image: {
            id: '5',
            url: '/images/sample-product.png',
            width: 800,
            height: 400,
          },
          author: { name: 'British Floors Team' },
          tags: ['LVT', 'Installation', 'DIY'],
        },
      };

      const fallbackArticle = fallbackArticles[resolvedParams.handle as keyof typeof fallbackArticles];
      
      if (!fallbackArticle) {
        console.log(`No fallback article available for handle: ${resolvedParams.handle}`);
        notFound();
      }

      // Use fallback article
      const finalArticle = fallbackArticle;
      
      return (
        <Layout>
          <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
            {/* API Error Notice */}
            <div className='max-w-4xl mx-auto mb-4'>
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                <p className='text-amber-700 text-sm'>
                  ⚠️ Showing offline content - article may not be up to date
                </p>
              </div>
            </div>
            
            {/* Back to Blogs Link */}
            <div className='max-w-4xl mx-auto mb-6'>
              <Link
                href='/blogs'
                className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Back to Blogs
              </Link>
            </div>

            {/* Article Header */}
            <div className='max-w-4xl mx-auto'>
              <div className='mb-8'>
                <h1 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>{finalArticle.title}</h1>

                {/* Article Meta */}
                <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
                  {finalArticle.publishedAt && (
                    <span>
                      {new Date(finalArticle.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {finalArticle.author?.name && <span>By {finalArticle.author.name}</span>}
                </div>

                {/* Article Image */}
                {finalArticle.image && (
                  <div className='mb-8'>
                    <Image
                      src={finalArticle.image.url}
                      alt={finalArticle.title}
                      width={800}
                      height={400}
                      className='w-full h-64 lg:h-96 object-cover rounded-lg'
                    />
                  </div>
                )}

                {/* Article Content */}
                {finalArticle.contentHtml ? (
                  <div
                    className='blog-content prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: finalArticle.contentHtml }}
                  />
                ) : finalArticle.content ? (
                  <div className='blog-content prose prose-lg max-w-none'>
                    <p className='text-lg leading-relaxed'>{finalArticle.content}</p>
                  </div>
                ) : finalArticle.excerpt ? (
                  <div className='blog-content prose prose-lg max-w-none'>
                    <p className='text-lg leading-relaxed'>{finalArticle.excerpt}</p>
                  </div>
                ) : (
                  <p className='text-gray-500 italic text-lg'>
                    No content available for this article.
                  </p>
                )}

                {/* Article Tags */}
                {finalArticle.tags && finalArticle.tags.length > 0 && (
                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-3'>Tags:</h3>
                    <div className='flex flex-wrap gap-2'>
                      {finalArticle.tags.map((tag) => (
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
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    // Article found from API

    // Article found from API
    return (
      <Layout>
        <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
          {/* Back to Blogs Link */}
          <div className='max-w-4xl mx-auto mb-6'>
            <Link
              href='/blogs'
              className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
            >
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back to Blogs
            </Link>
          </div>

          {/* Article Header */}
          <div className='max-w-4xl mx-auto'>
            <div className='mb-8'>
              <h1 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-4'>{article.title}</h1>

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

              {/* Article Content */}
              {article.contentHtml ? (
                <div
                  className='blog-content prose prose-lg max-w-none'
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              ) : article.content ? (
                <div className='blog-content prose prose-lg max-w-none'>
                  <p className='text-lg leading-relaxed'>{article.content}</p>
                </div>
              ) : article.excerpt ? (
                <div className='blog-content prose prose-lg max-w-none'>
                  <p className='text-lg leading-relaxed'>{article.excerpt}</p>
                </div>
              ) : (
                <p className='text-gray-500 italic text-lg'>
                  No content available for this article.
                </p>
              )}

              {/* Article Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className='mt-8 pt-6 border-t border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Tags:</h3>
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
            </div>
          </div>
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
