'use client';

import React from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';
import { CartItem } from '@/lib/types/shopify';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  discountCode?: string;
  discountAmount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  total,
  discountCode,
  discountAmount = 0,
}) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Order Summary</h2>

      {/* Items */}
      <div className='space-y-4 mb-6'>
        {items.map((item) => (
          <div key={item.id} className='flex items-center space-x-4'>
            <div className='flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText || item.title}
                  width={64}
                  height={64}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <span className='text-gray-400 text-xs'>No image</span>
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-medium text-gray-900 truncate'>{item.title}</h3>
              <p className='text-sm text-gray-500'>
                {item.variantTitle && `Variant: ${item.variantTitle}`}
              </p>
              <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
            </div>
            <div className='flex-shrink-0'>
              <p className='text-sm font-medium text-gray-900'>
                {formatPrice({
                  amount: (parseFloat(item.price.amount) * item.quantity).toString(),
                  currencyCode: item.price.currencyCode,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className='border-t border-gray-200 pt-4 space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Subtotal</span>
          <span className='text-gray-900'>
            {formatPrice({ amount: subtotal.toString(), currencyCode: 'GBP' })}
          </span>
        </div>

        {discountCode && discountAmount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Discount ({discountCode})</span>
            <span className='text-green-600'>
              -{formatPrice({ amount: discountAmount.toString(), currencyCode: 'GBP' })}
            </span>
          </div>
        )}

        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Shipping</span>
          <span className='text-gray-900'>
            {subtotal >= 100 ? 'Free' : formatPrice({ amount: '10.00', currencyCode: 'GBP' })}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Tax</span>
          <span className='text-gray-900'>
            {formatPrice({ amount: tax.toString(), currencyCode: 'GBP' })}
          </span>
        </div>

        <div className='border-t border-gray-200 pt-3'>
          <div className='flex justify-between text-base font-semibold'>
            <span className='text-gray-900'>Total</span>
            <span className='text-gray-900'>
              {formatPrice({ amount: total.toString(), currencyCode: 'GBP' })}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-900'>Free Shipping</h3>
            <p className='text-sm text-gray-600 mt-1'>
              Free standard shipping on orders over £100. Estimated delivery: 3-5 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
        <div className='flex items-start space-x-3'>
          <div className='flex-shrink-0'>
            <svg className='h-5 w-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-sm font-medium text-blue-900'>30-Day Returns</h3>
            <p className='text-sm text-blue-700 mt-1'>
              Not satisfied? Return your order within 30 days for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
