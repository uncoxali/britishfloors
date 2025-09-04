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
    // First try to get the article directly by handle
    const response = await shopifyApi.getArticles(100); // Get more articles to find the one we need
    const articles = response.articles.edges.map((edge) => edge.node);

    // Find the article with matching handle
    const article = articles.find((article) => article.handle === resolvedParams.handle);

    if (!article) {
      notFound();
    }

    return (
      <Layout>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
