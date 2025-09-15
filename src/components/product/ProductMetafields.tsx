import React from 'react';
import { ShopifyMetafield } from '@/lib/types/shopify';

interface ProductMetafieldsProps {
  metafields?: ShopifyMetafield[] | null;
  description?: string;
}

const ProductMetafields: React.FC<ProductMetafieldsProps> = ({ metafields, description }) => {
  // Check if we have any data to display
  const hasMetafields = metafields && metafields.length > 0;
  const hasDescription =
    description && description.trim().length > 0 && description.trim() !== 'tree'; // 'tree' seems to be a placeholder

  // Filter out null or undefined metafields
  const displayMetafields = hasMetafields
    ? metafields.filter(
        (metafield) =>
          metafield &&
          metafield.key &&
          metafield.value &&
          // Only show metafields with specific namespaces that are likely to be displayable
          (metafield.namespace === 'custom' ||
            metafield.namespace === 'product' ||
            metafield.namespace === 'specifications' ||
            metafield.namespace === 'details'),
      )
    : [];

  // If we don't have any metafields or description to show, don't render anything
  if (!hasMetafields && !hasDescription && displayMetafields.length === 0) {
    return null;
  }

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-3'>Product Details</h3>

      {/* Show description if available and meaningful */}
      {hasDescription && description.trim() !== 'tree' && (
        <div className='mb-4'>
          <p className='text-gray-700'>{description}</p>
        </div>
      )}

      {/* Show metafields if available */}
      {displayMetafields.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {displayMetafields.map((metafield) => (
            <div key={metafield.id} className='flex items-start'>
              <span className='font-medium text-gray-700 min-w-[120px]'>
                {metafield.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
              </span>
              <span className='text-gray-600 ml-2'>
                {metafield.type === 'json' ? JSON.stringify(metafield.value) : metafield.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMetafields;
