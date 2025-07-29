'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { ShopifyProduct, ShopifyProductVariant } from '@/lib/types/shopify';

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(
    product.variants.edges[0]?.node || null,
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Initialize selected options from the first variant
  React.useEffect(() => {
    if (product.variants.edges[0]?.node?.selectedOptions) {
      const initialOptions: Record<string, string> = {};
      product.variants.edges[0].node.selectedOptions.forEach((option) => {
        initialOptions[option.name] = option.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // Find variant based on selected options
  const findVariantByOptions = (options: Record<string, string>): ShopifyProductVariant | null => {
    return (
      product.variants.edges.find((edge) => {
        const variant = edge.node;
        if (!variant.selectedOptions) return false;

        return variant.selectedOptions.every((option) => options[option.name] === option.value);
      })?.node || null
    );
  };

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const variant = findVariantByOptions(newOptions);
    setSelectedVariant(variant);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;

    setIsAdding(true);
    try {
      addItem(product, selectedVariant, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!selectedVariant) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-8'>
      {/* Product Options */}
      {product.options && product.options.length > 0 && (
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900'>Product Options</h3>
          {product.options.map((option) => (
            <div key={option.id} className='bg-gray-50 p-4 rounded-lg'>
              <label className='block text-sm font-medium text-gray-700 mb-3'>{option.name}</label>
              <div className='flex flex-wrap gap-3'>
                {option.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`px-4 py-2 text-sm border-2 rounded-lg transition-all duration-200 font-medium ${
                      selectedOptions[option.name] === value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Variant Info */}
      <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <span className='text-3xl font-bold text-gray-900'>
              {formatPrice(selectedVariant.price)}
            </span>
            {product.priceRange.minVariantPrice.amount !==
              product.priceRange.maxVariantPrice.amount && (
              <span className='text-lg text-gray-500 ml-2'>
                - {formatPrice(product.priceRange.maxVariantPrice)}
              </span>
            )}
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              selectedVariant.availableForSale
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-3'>Quantity:</label>
          <div className='flex items-center border border-gray-300 rounded-lg w-fit'>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50'
              disabled={quantity <= 1}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
              </svg>
            </button>
            <span className='px-6 py-2 text-gray-900 font-medium border-x border-gray-300'>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className='px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant.availableForSale || isAdding}
          loading={isAdding}
          className='w-full'
          size='lg'
        >
          {selectedVariant.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </Button>

        {/* Quick Actions */}
        <div className='mt-4 flex gap-3'>
          <button className='flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium'>
            <svg
              className='w-4 h-4 inline mr-2'
              fill='none'
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
            Wishlist
          </button>
          <button className='flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium'>
            <svg
              className='w-4 h-4 inline mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
            Compare
          </button>
        </div>
      </div>

      {/* Product Highlights */}
      <div className='bg-blue-50 p-4 rounded-lg'>
        <h4 className='font-semibold text-blue-900 mb-3'>Why Choose This Product?</h4>
        <ul className='space-y-2 text-sm text-blue-800'>
          <li className='flex items-center'>
            <svg className='w-4 h-4 mr-2 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Premium quality materials
          </li>
          <li className='flex items-center'>
            <svg className='w-4 h-4 mr-2 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            Easy click-lock installation
          </li>
          <li className='flex items-center'>
            <svg className='w-4 h-4 mr-2 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            25-year warranty included
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailClient;
