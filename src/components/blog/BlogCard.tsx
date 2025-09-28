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
      <div className='relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-[300px]'>
        <Image
          src={article.image?.url || '/images/sample-product.png'}
          alt={article.title}
          width={400}
          height={300}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300'></div>

        {/* Text content at bottom center */}
        <div className='absolute inset-x-0 bottom-0 p-4 text-white text-center'>
          <h3 className='font-semibold text-base leading-tight mb-1'>{article.title}</h3>

          {article.publishedAt && (
            <p className='text-xs text-gray-200 opacity-90'>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
