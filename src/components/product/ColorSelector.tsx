import React from 'react';
import { ColorSelectorProps } from '@/types/product';
import { getColorFromName } from '@/utils/productUtils';

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  activeIndex,
  onColorSelect,
  images,
}) => {
  // Debug: Log the colors being passed to the component
  React.useEffect(() => {}, [colors]);

  if (colors.length === 0) {
    return null;
  }

  return (
    <div>
      <p className='text-sm font-medium text-gray-700 mb-3'>Colours:</p>
      <div className='flex items-center gap-2 flex-wrap'>
        {colors.map((colorValue, idx) => (
          <button
            key={`color-${idx}`}
            onClick={() => onColorSelect(idx)}
            className={`w-8 h-8 rounded-lg border-2 ${
              activeIndex === idx ? 'border-[#1e3a8a]' : 'border-gray-300'
            } transition-all duration-200 hover:scale-105 shadow-sm`}
            style={{ backgroundColor: getColorFromName(colorValue) }}
            title={colorValue}
            aria-label={`Select ${colorValue} colour`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
