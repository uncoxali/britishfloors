'use client';

import React from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useWishlistStore } from '@/store/wishlist';

interface WishlistButtonProps {
  product: ShopifyProduct;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} ${
          isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
        }`}
        fill={isWishlisted ? 'currentColor' : 'none'}
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        />
      </svg>
    </button>
  );
};

export default WishlistButton;
