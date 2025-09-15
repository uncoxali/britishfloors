import React from 'react';

const ProductSpecificationsDetails: React.FC = () => {
  const specifications = [
    { label: 'Product Code', value: 'FHL013' },
    { label: 'Durability Grade', value: 'AC4' },
    { label: 'Finish', value: 'Textured & Embossed' },
    { label: 'Style', value: 'Parquet & Herringbon' },
    { label: 'Edging', value: 'Bevelled 4V' },
    { label: 'Thickness', value: '12mm' },
    { label: 'Dimensions', value: '(L) 600 x (W) 100mm' },
    { label: 'Pack Size', value: '1.92 m2' },
  ];

  return (
    <div className='bg-white border-2 border-amber-300 rounded-2xl p-6'>
      <h3 className='text-lg font-semibold text-amber-700 mb-4'>Product Specifications</h3>
      <div className='space-y-3'>
        {specifications.map((spec, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center py-2 ${
              index < specifications.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className='text-gray-600'>{spec.label}</span>
            <span className='font-medium'>{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecificationsDetails;