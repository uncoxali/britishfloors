import React from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';

interface ProductSpecificationsDetailsProps {
  product?: ShopifyProduct;
}

// Helper function to format field keys into readable labels
const formatLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    'durability_grade': 'Durability Grade',
    'edging': 'Edging',
    'finish': 'Finish',
    'product_code': 'Product Code',
    'spec_value': 'Style',
    'thickness': 'Thickness',
    'dimensions': 'Dimensions',
    'pack_size': 'Pack Size',
  };

  return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const ProductSpecificationsDetails: React.FC<ProductSpecificationsDetailsProps> = ({ product }) => {
  // Default specifications if no product data is provided
  let specifications = [
    { label: 'Product Code', value: 'FHL013' },
    { label: 'Durability Grade', value: 'AC4' },
    { label: 'Finish', value: 'Textured & Embossed' },
    { label: 'Style', value: 'Parquet & Herringbon' },
    { label: 'Edging', value: 'Bevelled 4V' },
    { label: 'Thickness', value: '12mm' },
    { label: 'Dimensions', value: '(L) 600 x (W) 100mm' },
    { label: 'Pack Size', value: '1.92 m2' },
  ];

  // If product specifications data is provided, use that instead
  if (product && product.specifications) {
    // Check for references (array structure)
    if (product.specifications.references && product.specifications.references.nodes.length > 0) {
      const specData = product.specifications.references.nodes[0]; // Take the first reference

      if (specData && specData.fields) {
        // Map the specification fields to the format needed for display
        specifications = specData.fields
          .filter((field) => field.key && field.value) // Ensure we have valid data
          .map((field) => ({
            label: formatLabel(field.key),
            value: field.value,
          }));
      }
    }
    // Check for reference (single object structure)
    else if (product.specifications.reference && product.specifications.reference.fields) {
      const specData = product.specifications.reference;

      if (specData && specData.fields) {
        // Map the specification fields to the format needed for display
        specifications = specData.fields
          .filter((field) => field.key && field.value) // Ensure we have valid data
          .map((field) => ({
            label: formatLabel(field.key),
            value: field.value,
          }));
      }
    }
  }

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
