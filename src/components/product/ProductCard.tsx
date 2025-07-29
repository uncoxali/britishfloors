'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/types/shopify';
import { formatPriceRange, truncateText } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import WishlistButton from '@/components/ui/WishlistButton';
import ClientOnly from '@/components/ui/ClientOnly';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const firstImage = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant?.availableForSale;

  const handleAddToCart = async () => {
    if (!firstVariant || !isAvailable) return;

    setIsAdding(true);
    try {
      addItem(product, firstVariant, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
      {/* Wishlist Button */}
      <div className='absolute top-2 right-2 z-10'>
        <ClientOnly>
          <WishlistButton product={product} size='sm' />
        </ClientOnly>
      </div>

      <Link href={`/products/${product.handle}`} className='block'>
        <div className='aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100'>
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              width={400}
              height={400}
              className='h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gray-200'>
              <span className='text-gray-400'>No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className='p-4'>
        <Link href={`/products/${product.handle}`}>
          <h3 className='text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors'>
            {truncateText(product.title, 50)}
          </h3>
        </Link>

        <p className='mt-1 text-sm text-gray-500'>{truncateText(product.description, 80)}</p>

        <div className='mt-2 flex items-center justify-between'>
          <div className='text-lg font-semibold text-gray-900'>
            {formatPriceRange(
              product.priceRange.minVariantPrice,
              product.priceRange.maxVariantPrice,
            )}
          </div>

          <Button
            size='sm'
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            loading={isAdding}
            className='ml-2'
          >
            {isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
