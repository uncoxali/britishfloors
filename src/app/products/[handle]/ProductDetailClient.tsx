'use client';

import React, { useState } from 'react';
import FlooringCalculator from '@/components/ui/FlooringCalculator';
import { useCartStore } from '@/store/cart';
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

      {/* Flooring Calculator */}
      <FlooringCalculator
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={(quantity) => {
          setQuantity(quantity);
          handleAddToCart();
        }}
        isAdding={isAdding}
      />

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
