'use client';

import React, { useState } from 'react';
import Button from './Button';

interface DiscountCodeProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  discountAmount?: number;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  onApply,
  onRemove,
  appliedCode,
  discountAmount,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation - in real app, this would call your API
      const validCodes = ['SAVE10', 'WELCOME20', 'FLOORING15'];

      if (validCodes.includes(code.toUpperCase())) {
        onApply(code.toUpperCase());
        setCode('');
      } else {
        setError('Invalid discount code');
      }
    } catch (err) {
      setError('Failed to apply discount code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setError('');
  };

  return (
    <div className='bg-gray-50 p-4 rounded-lg'>
      <h3 className='text-lg font-semibold text-gray-900 mb-3'>Discount Code</h3>

      {appliedCode ? (
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md'>
            <div>
              <p className='text-sm font-medium text-green-800'>
                Code applied: <span className='font-bold'>{appliedCode}</span>
              </p>
              {discountAmount && (
                <p className='text-sm text-green-600'>You saved: ${discountAmount.toFixed(2)}</p>
              )}
            </div>
            <Button
              onClick={handleRemove}
              variant='outline'
              size='sm'
              className='text-red-600 border-red-300 hover:bg-red-50'
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder='Enter discount code'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              onKeyPress={(e) => e.key === 'Enter' && handleApply()}
            />
            <Button onClick={handleApply} loading={isLoading} size='sm'>
              Apply
            </Button>
          </div>

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <div className='text-xs text-gray-500'>
            <p>Try these codes: SAVE10, WELCOME20, FLOORING15</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCode;
