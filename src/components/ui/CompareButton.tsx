'use client';

import React from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useCompareStore } from '@/store/compare';

interface CompareButtonProps {
  product: ShopifyProduct;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ product, size = 'md', className = '' }) => {
  const { addItem, removeItem, isInCompare, getCompareCount, getMaxItems } = useCompareStore();
  const isInCompareList = isInCompare(product.id);
  const compareCount = getCompareCount();
  const maxItems = getMaxItems();

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompareList) {
      removeItem(product.id);
    } else {
      if (compareCount < maxItems) {
        addItem(product);
      }
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={handleToggleCompare}
      className={`${
        sizeClasses[size]
      } ${className} flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isInCompareList ? 'border-blue-500 bg-blue-50' : ''
      }`}
      aria-label={isInCompareList ? 'Remove from compare' : 'Add to compare'}
      disabled={!isInCompareList && compareCount >= maxItems}
    >
      <svg
        className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} ${
          isInCompareList ? 'text-blue-500' : 'text-gray-400'
        }`}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        />
      </svg>
    </button>
  );
};

export default CompareButton;
