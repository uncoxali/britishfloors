import React from 'react';
import { ShopifyMetafield } from '@/lib/types/shopify';

interface ProductSpecificationsProps {
  metafields?: ShopifyMetafield[] | null;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ metafields }) => {
  // Default specifications if no metafields are provided
  let specifications = [
    { label: 'W:', value: '100mm' },
    { label: 'T:', value: '12mm' },
    { label: 'L:', value: '600mm' },
    { label: 'Pack Size:', value: '1.92m²' },
  ];

  console.log(metafields);

  // If metafields are provided, extract relevant specifications
  if (metafields && metafields.length > 0) {
    const specMetafields = metafields.filter(
      (metafield) =>
        metafield &&
        metafield.key &&
        metafield.value &&
        (metafield.namespace === 'custom' ||
          metafield.namespace === 'product' ||
          metafield.namespace === 'specifications'),
    );

    // Map metafields to specifications format
    if (specMetafields.length > 0) {
      specifications = specMetafields
        .slice(0, 4) // Limit to 4 specifications to match the grid layout
        .map((metafield) => ({
          label: metafield.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) + ':',
          value: metafield.value,
        }));
    }
  }

  return (
    <div className='grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-200'>
      {specifications.map((spec, index) => (
        <div key={index} className='text-center'>
          <div className='text-xs text-gray-500'>{spec.label}</div>
          <div className='font-medium'>{spec.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecifications;
