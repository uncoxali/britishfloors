import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyArticle } from '@/lib/types/shopify';

interface BlogCardProps {
  article: ShopifyArticle;
  className?: string;
  showFullContent?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  article,
  className = '',
  showFullContent = false,
}) => {
  return (
    <Link href={`/blogs/${article.handle}`} className={`group block ${className}`}>
      <div className='relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
        <Image
          src={article.image?.url || '/images/sample-product.png'}
          alt={article.title}
          width={300}
          height={200}
          className='w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {!showFullContent && <div className='absolute inset-0 bg-black/40'></div>}

        <div
          className={`${showFullContent ? 'p-4' : 'absolute inset-x-0 bottom-0 p-3 text-white'}`}
        >
          <h3
            className={`font-semibold leading-tight ${
              showFullContent ? 'text-gray-900 text-lg mb-2' : 'text-sm'
            }`}
          >
            {article.title}
          </h3>

          {article.excerpt && (
            <p
              className={`${
                showFullContent ? 'text-gray-600 text-sm mb-3' : 'text-xs text-gray-200'
              } line-clamp-2`}
            >
              {article.excerpt}
            </p>
          )}

          {article.publishedAt && (
            <p
              className={`${
                showFullContent ? 'text-gray-500 text-xs' : 'text-xs text-gray-300'
              } mt-1`}
            >
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}

          {showFullContent && (article.content || article.excerpt) && (
            <div className='mt-3'>
              <p className='text-gray-600 text-sm line-clamp-3'>
                {article.content 
                  ? article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                  : article.excerpt
                }
              </p>
              <div className='mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors'>
                Read More →
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
