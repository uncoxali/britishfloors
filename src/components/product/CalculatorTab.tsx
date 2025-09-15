import React from 'react';
import { CalculationState, ProductCalculations } from '@/types/product';
import { formatCurrency } from '@/utils/productUtils';
import '@/styles/slider.css';

interface CalculatorTabProps {
  calculationState: CalculationState;
  calculations: ProductCalculations;
  packSize: number;
  onUpdateCalculation: (updates: Partial<CalculationState>) => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({
  calculationState,
  calculations,
  packSize,
  onUpdateCalculation,
}) => {
  const { calcMethod, area, width, length, unit, wastagePercent } = calculationState;
  const { areaWithWastage, packsNeeded, totalPriceCalculate } = calculations;

  return (
    <div className='grid grid-cols-2 rounded-b-lg overflow-hidden' style={{backgroundColor: '#EFE2CC'}}>
      {/* Left side - Calculate flooring */}
      <div className='p-4'>
        {/* Area/Dimensions Selection */}
        <div className='flex items-center gap-4 mb-4'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              name='calcMethod'
              checked={calcMethod === 'area'}
              onChange={() => onUpdateCalculation({ calcMethod: 'area' })}
              className='w-4 h-4 text-amber-600'
            />
            <span className='text-sm text-amber-800'>Total area</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              name='calcMethod'
              checked={calcMethod === 'dims'}
              onChange={() => onUpdateCalculation({ calcMethod: 'dims' })}
              className='w-4 h-4 text-amber-600'
            />
            <span className='text-sm text-amber-800'>Width & Length</span>
          </label>
        </div>

        {/* Unit Selection */}
        <div className='mb-4'>
          <span className='text-sm text-amber-800 block mb-2'>Unit:</span>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onUpdateCalculation({ unit: 'm2' })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                unit === 'm2'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-amber-400 text-amber-800 hover:bg-amber-50'
              }`}
            >
              Metre
            </button>
            <button
              onClick={() => onUpdateCalculation({ unit: 'ft2' })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                unit === 'ft2'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-amber-400 text-amber-800 hover:bg-amber-50'
              }`}
            >
              Feet
            </button>
          </div>
        </div>

        {/* Input Fields */}
        {calcMethod === 'area' && (
          <div className='mb-3'>
            <div className='relative'>
              <input
                value={area}
                onChange={(e) => onUpdateCalculation({ area: e.target.value })}
                placeholder='total area required'
                className='w-full border border-amber-300 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
              />
              <span className='absolute right-3 top-2 text-amber-700 text-sm font-medium'>m²</span>
            </div>
          </div>
        )}

        {calcMethod === 'dims' && (
          <div className='grid grid-cols-2 gap-2 mb-3'>
            <input
              value={width}
              onChange={(e) => onUpdateCalculation({ width: e.target.value })}
              placeholder='Width (m)'
              className='border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
            />
            <input
              value={length}
              onChange={(e) => onUpdateCalculation({ length: e.target.value })}
              placeholder='Length (m)'
              className='border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
            />
          </div>
        )}

        {/* Measuring Guide */}
        <div className='mb-3'>
          <button className='text-sm text-amber-700 underline hover:text-amber-800 italic'>
            Measuring Guide
          </button>
        </div>

        {/* Wastage Slider */}
        <div className='mb-3'>
          <label className='block text-sm text-amber-800 mb-2'>Wastage: {wastagePercent}%</label>
          <div className='relative'>
            <input
              type='range'
              min='0'
              max='15'
              step='1'
              value={wastagePercent}
              onChange={(e) => onUpdateCalculation({ wastagePercent: parseInt(e.target.value) })}
              className='w-full h-1 bg-amber-200 rounded-full appearance-none cursor-pointer slider'
            />
            <div className='flex justify-between text-xs text-amber-700 mt-2'>
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Total */}
      <div className='p-4 border-l border-amber-300'>
        <div className='space-y-2'>
          <p className='font-medium text-amber-800 text-lg'>Total:</p>
          <p className='text-2xl font-bold text-amber-900'>{formatCurrency(totalPriceCalculate)}</p>
          <div className='text-sm text-amber-700 space-y-1'>
            <div>Total (m²): {areaWithWastage.toFixed(2)}</div>
            <div>Total Packs: {packsNeeded}</div>
            <div>(Each pack contains {packSize}m²)</div>
            {wastagePercent > 0 && <div>Wastage: {wastagePercent}%</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorTab;