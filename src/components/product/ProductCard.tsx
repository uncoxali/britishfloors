'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';

interface ProductCardProps {
  product: ShopifyProduct;
  showOrderSample?: boolean;
  redirectToProducts?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showOrderSample = true,
  redirectToProducts = false,
}) => {
  const router = useRouter();
  const { addItem, isProductInCart } = useCartStore();
  const { open: openCart } = useCartDrawerStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Extract specific variants
  const mainVariant = product.variants.edges.find(
    (edge) => edge.node.title.toLowerCase() === 'main',
  )?.node;

  const sampleVariant = product.variants.edges.find((edge) =>
    edge.node.title.toLowerCase().includes('sample'),
  )?.node;

  const image = product.images.edges[0]?.node;

  // Use main variant price, fallback to current approach if not found
  const price = mainVariant
    ? parseFloat(mainVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  // Prevent hydration mismatch by only checking cart state after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isInCart = mounted ? isProductInCart(product.id, false) : false; // Regular product
  const isSampleInCart = mounted ? isProductInCart(product.id, true) : false; // Sample

  // Calculate discount based on compareAtPrice of main variant or fallback
  let originalPrice: number | undefined;
  let discount: number | undefined;

  // Check main variant for compareAtPrice first
  if (mainVariant?.compareAtPrice?.amount) {
    const compareAtPrice = parseFloat(mainVariant.compareAtPrice.amount);
    if (!isNaN(compareAtPrice) && compareAtPrice > price) {
      originalPrice = compareAtPrice;
      discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    }
  }
  // Fallback to product level compareAtPriceRange
  else if (product.compareAtPriceRange?.minVariantPrice?.amount) {
    const compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
    if (!isNaN(compareAtPrice) && compareAtPrice > price) {
      originalPrice = compareAtPrice;
      discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    }
  }

  const hasDiscount = !!discount && discount > 0;

  // Extract dimensions from metaobject (preferred) or fallback to title
  const parseDimJSON = (val?: string): { value?: number; unit?: string } => {
    if (!val) return {};
    try {
      const o = JSON.parse(val);
      return { value: o?.value, unit: o?.unit };
    } catch {
      return {};
    }
  };

  const getDimensions = () => {
    // Prefer dimensions from product.dimensions or product.specifications metaobject reference
    const refFields =
      product?.dimensions?.reference?.fields || product?.specifications?.reference?.fields;
    if (Array.isArray(refFields)) {
      const find = (k: string) => refFields.find((f) => f?.key === k)?.value as string | undefined;
      const width = parseDimJSON(find('width')).value;
      const thickness = parseDimJSON(find('thickness')).value;
      const length = parseDimJSON(find('length')).value;
      return {
        width: typeof width === 'number' ? `${width}mm` : undefined,
        thickness: typeof thickness === 'number' ? `${thickness}mm` : undefined,
        length: typeof length === 'number' ? `${length}mm` : undefined,
      } as { width?: string; thickness?: string; length?: string };
    }

    // Fallback: try to extract from title text pattern like "100mm 12mm 600mm"
    const dimensions: { width?: string; thickness?: string; length?: string } = {};
    const matches = product.title.match(/(\d+(?:\.\d+)?)\s*mm/gi);
    if (matches && matches.length >= 2) {
      dimensions.width = matches[0];
      dimensions.thickness = matches[1];
      if (matches[2]) dimensions.length = matches[2];
    }
    return dimensions;
  };

  const dimensions = getDimensions();

  const handleOrderSample = async () => {
    if (redirectToProducts) {
      router.push('/products');
      return;
    }

    if (isSampleInCart) {
      openCart();
    } else {
      setIsLoading(true);
      try {
        // Use sample variant if available, otherwise fallback to first variant
        const variantToUse = sampleVariant || product.variants?.edges[0]?.node;
        if (variantToUse) {
          addItem(product, variantToUse, 1, true); // Pass true for isSample
          // Open cart drawer after adding sample
          openCart();
        }
        // Small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 relative w-full h-full flex flex-col'>
      {/* Discount badge */}
      {hasDiscount && discount && discount > 0 && (
        <div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10'>
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.handle}`} className='block'>
        <div className='aspect-[4/3] w-full overflow-hidden bg-gray-50'>
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              width={800}
              height={600}
              className='w-full h-full object-cover'
              priority={false}
              loading='lazy'
            />
          ) : (
            <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
              <span className='text-gray-400 text-sm'>No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className='p-3 xl:p-4 2xl:p-5 flex-1 flex flex-col'>
        {/* Top Content */}
        <div className='flex-1'>
          {/* Product Title - Blue, two lines */}
          <Link href={`/products/${product.handle}`}>
            <h3 className='text-lg font-bold text-blue-900 mb-1.5 leading-tight text-center line-clamp-2'>
              {product.title}
            </h3>
          </Link>

          {/* Divider Line */}
          <div className='w-full h-px bg-gray-500 mb-1.5'></div>

          {/* Specifications - Single line format */}
          <div className='text-xs text-gray-600 mb-2 text-center'>
            W:{dimensions.width || '—'} &nbsp;&nbsp; T:{dimensions.thickness || '—'} &nbsp;&nbsp; L:
            {dimensions.length || '—'}
          </div>
        </div>

        {/* Bottom Content - Pricing and Button Row */}
        <div className='flex items-end justify-between mt-auto'>
          <div>
            {hasDiscount && originalPrice && (
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-xs text-gray-400 line-through'>
                  £{originalPrice.toFixed(2)} m²
                </span>
              </div>
            )}
            <div className='text-lg font-bold text-gray-500'>
              £{price.toFixed(2)} <span className='text-lg'>m2</span>
            </div>
          </div>

          {/* Order Sample Button */}
          {showOrderSample && (
            <button
              onClick={handleOrderSample}
              disabled={isLoading}
              className={`py-1.5 px-2.5 xl:py-2 xl:px-3 rounded-full text-xs font-bold transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isSampleInCart
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {isLoading ? (
                <span className='flex items-center gap-1'>
                  <svg className='w-3 h-3 animate-spin' fill='none' viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='hidden sm:inline'>Adding...</span>
                </span>
              ) : isSampleInCart ? (
                <span className='flex items-center gap-1'>
                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='hidden sm:inline'>View Basket</span>
                  <span className='sm:hidden'>Basket</span>
                </span>
              ) : (
                <span>
                  <span className='hidden sm:inline'>Order Sample</span>
                  <span className='sm:hidden'>Sample</span>
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
