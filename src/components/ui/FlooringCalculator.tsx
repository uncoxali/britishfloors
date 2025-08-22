'use client';

import React, { useState, useEffect } from 'react';
import { ShopifyProduct, ShopifyProductVariant } from '@/lib/types/shopify';
import { formatPrice } from '@/lib/utils/format';

interface FlooringCalculatorProps {
  product: ShopifyProduct;
  selectedVariant: ShopifyProductVariant;
  onAddToCart?: (quantity: number) => void;
  isAdding?: boolean;
}

interface CalculationResult {
  area: number;
  wastage: number;
  totalArea: number;
  packsRequired: number;
  packPrice: number;
  totalPrice: number;
  wastagePercentage: number;
}

const FlooringCalculator: React.FC<FlooringCalculatorProps> = ({
  product,
  selectedVariant,
  onAddToCart,
  isAdding = false,
}) => {
  const [area, setArea] = useState<number>(0);
  const [wastagePercentage, setWastagePercentage] = useState<number>(10); // Default 10%
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  // Extract product specifications from title or description
  const getProductSpecs = () => {
    const title = product.title.toLowerCase();
    const description = product.description.toLowerCase();

    // Default values
    let packSize = 2.23; // Default pack size in m²
    let thickness = '5mm';
    const dimensions = '600mm x 120mm';
    let plankWidth = '120mm';
    let plankLength = '600mm';

    // Try to extract from title/description
    if (title.includes('herringbone') || description.includes('herringbone')) {
      packSize = 2.23; // Typical herringbone pack size
      plankWidth = '120mm';
      plankLength = '600mm';
    }

    // Extract thickness if mentioned
    const thicknessMatch = title.match(/(\d+)mm/) || description.match(/(\d+)mm/);
    if (thicknessMatch) {
      thickness = `${thicknessMatch[1]}mm`;
    }

    return { packSize, thickness, dimensions, plankWidth, plankLength };
  };

  const { packSize, thickness, plankWidth, plankLength } = getProductSpecs();

  // Calculate flooring requirements
  useEffect(() => {
    if (area <= 0) {
      setCalculation(null);
      return;
    }

    const wastage = (area * wastagePercentage) / 100;
    const totalArea = area + wastage;
    const packsRequired = Math.ceil(totalArea / packSize);
    const packPrice = parseFloat(selectedVariant.price.amount);
    const totalPrice = packsRequired * packPrice;

    setCalculation({
      area,
      wastage,
      totalArea,
      packsRequired,
      packPrice,
      totalPrice,
      wastagePercentage,
    });
  }, [area, wastagePercentage, selectedVariant.price.amount, packSize]);

  const handleAreaChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setArea(numValue);
  };

  const handleWastageChange = (percentage: number) => {
    setWastagePercentage(percentage);
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
      {/* Area Input */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Enter your area (m²):
        </label>
        <div className='relative'>
          <input
            type='number'
            min='0'
            step='0.01'
            value={area || ''}
            onChange={(e) => handleAreaChange(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='0.00'
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
            m²
          </div>
        </div>
      </div>

      {/* Wastage Selection */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Wastage:</label>
        <div className='flex gap-2'>
          {[5, 10, 15, 20].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handleWastageChange(percentage)}
              className={`px-3 py-2 text-sm border rounded-lg transition-all duration-200 font-medium ${
                wastagePercentage === percentage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {percentage}%
            </button>
          ))}
        </div>
        <p className='text-xs text-gray-500 mt-2'>
          Wastage accounts for cutting, pattern matching, and installation errors
        </p>
      </div>

      {/* Calculation Results */}
      {calculation && (
        <div className='space-y-4'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>Your area:</span>
              <span className='font-medium'>{calculation.area.toFixed(2)} m²</span>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>
                Wastage ({calculation.wastagePercentage}%):
              </span>
              <span className='font-medium'>{calculation.wastage.toFixed(2)} m²</span>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>Total area needed:</span>
              <span className='font-medium'>{calculation.totalArea.toFixed(2)} m²</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Packs required:</span>
              <span className='font-medium'>{calculation.packsRequired}</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>Pack price:</span>
              <span className='font-medium'>{formatPrice(selectedVariant.price)}</span>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>Quantity:</span>
              <span className='font-medium'>{calculation.packsRequired} packs</span>
            </div>
            <div className='border-t border-blue-200 pt-2'>
              <div className='flex justify-between items-center'>
                <span className='text-lg font-semibold text-gray-900'>Total:</span>
                <span className='text-xl font-bold text-gray-900'>
                  {formatPrice({
                    amount: calculation.totalPrice.toString(),
                    currencyCode: selectedVariant.price.currencyCode,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-medium text-gray-900 mb-3'>Product Specifications</h4>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <span className='text-gray-600'>Pack size:</span>
                <span className='ml-2 font-medium'>{packSize} m²</span>
              </div>
              <div>
                <span className='text-gray-600'>Thickness:</span>
                <span className='ml-2 font-medium'>{thickness}</span>
              </div>
              <div>
                <span className='text-gray-600'>Plank width:</span>
                <span className='ml-2 font-medium'>{plankWidth}</span>
              </div>
              <div>
                <span className='text-gray-600'>Plank length:</span>
                <span className='ml-2 font-medium'>{plankLength}</span>
              </div>
              <div>
                <span className='text-gray-600'>Coverage per pack:</span>
                <span className='ml-2 font-medium'>{packSize} m²</span>
              </div>
              <div>
                <span className='text-gray-600'>Installation:</span>
                <span className='ml-2 font-medium'>Click system</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className='mt-6 space-y-3'>
        <button
          className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={!selectedVariant.availableForSale || isAdding || !calculation}
          onClick={() => calculation && onAddToCart?.(calculation.packsRequired)}
        >
          {isAdding
            ? 'Adding...'
            : selectedVariant.availableForSale
            ? 'Add to cart'
            : 'Out of Stock'}
        </button>
        <button
          className='w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors'
          onClick={() => {
            // Add sample to cart with quantity 1
            onAddToCart?.(1);
          }}
        >
          Order a Sample
        </button>
      </div>

      {/* Stock Status */}
      <div className='mt-4 text-center'>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            selectedVariant.availableForSale
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {selectedVariant.availableForSale ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
};

export default FlooringCalculator;
