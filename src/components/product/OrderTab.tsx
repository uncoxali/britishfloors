import React from 'react';
import { OrderState, ProductCalculations } from '@/types/product';
import { formatCurrency, m2ToFt } from '@/utils/productUtils';

interface OrderTabProps {
  orderState: OrderState;
  calculations: ProductCalculations;
  packSize: number;
  unit: 'm2' | 'ft2';
  onUpdateOrder: (updates: Partial<OrderState>) => void;
}

const OrderTab: React.FC<OrderTabProps> = ({
  orderState,
  calculations,
  packSize,
  unit,
  onUpdateOrder,
}) => {
  const { quantity } = orderState;
  const { totalPriceOrder } = calculations;

  // Get unit symbol for display
  const unitSymbol = unit === 'm2' ? 'm²' : 'ft²';
  
  // Convert pack size based on selected unit
  const convertedPackSize = unit === 'm2' ? packSize : m2ToFt(packSize);

  const handleQuantityChange = (newQuantity: number) => {
    onUpdateOrder({ quantity: Math.max(1, newQuantity) });
  };

  return (
    <div
      className='grid grid-cols-2 rounded-b-lg overflow-hidden'
      style={{ backgroundColor: '#EFE2CC' }}
    >
      {/* Left side - Quantity selector */}
      <div className='p-4'>
        <div className='space-y-4'>
          <div>
            <p className='text-sm font-medium text-amber-700 mb-3'>Quantity of packs:</p>
            <div className='flex items-center w-fit border border-gray-300 rounded-lg overflow-hidden bg-white'>
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className='px-4 py-2 hover:bg-gray-50 text-gray-600 border-r border-gray-300'
              >
                -
              </button>
              <input
                type='number'
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className='w-16 text-center py-2 border-0 focus:outline-none bg-transparent font-medium'
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className='px-4 py-2 hover:bg-gray-50 text-gray-600 border-l border-gray-300'
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Total */}
      <div className='p-4 border-l border-amber-300'>
        <div className='space-y-2'>
          <p className='font-medium text-amber-800 text-lg'>Total:</p>
          <p className='text-2xl font-bold text-amber-900'>{formatCurrency(totalPriceOrder)}</p>
          <div className='text-sm text-amber-700 space-y-1'>
            <div>
              Total ({unitSymbol}): {(quantity * packSize).toFixed(2)}
            </div>
            <div>Total Packs: {quantity}</div>
            <div>
              (Each pack contains {convertedPackSize.toFixed(2)}
              {unitSymbol})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTab;
