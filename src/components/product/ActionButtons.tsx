import React, { useState, useEffect } from 'react';

interface ActionButtonsProps {
  onAddToCart: (quantity: number) => Promise<void>;
  handleOrderSample: () => Promise<void>;
  isInCart: boolean;
  isSampleInCart: boolean;
  isAddingToCart: boolean;
  isOrderingSample: boolean;
  quantity: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddToCart,
  handleOrderSample,
  isInCart,
  isSampleInCart,
  isAddingToCart,
  isOrderingSample,
  quantity,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddClick = () => {
    onAddToCart(quantity);
  };

  return (
    <div className='mt-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <button
          onClick={handleAddClick}
          disabled={isAddingToCart}
          className={`flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors ${
            isAddingToCart
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : mounted && isInCart
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {isAddingToCart ? (
            <>
              <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
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
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Adding...
            </>
          ) : mounted && isInCart ? (
            <>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              View basket
            </>
          ) : (
            <>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
              Add to basket
            </>
          )}
        </button>
        <button
          onClick={handleOrderSample}
          disabled={isOrderingSample}
          className={`flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors ${
            isOrderingSample
              ? 'bg-gray-400 cursor-not-allowed text-white border border-gray-400'
              : isSampleInCart
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
              : 'border border-amber-600 text-amber-600 hover:bg-amber-50'
          }`}
        >
          {isOrderingSample ? (
            <>
              <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
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
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Adding...
            </>
          ) : isSampleInCart ? (
            <>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              Sample in basket
            </>
          ) : (
            'Order sample'
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
