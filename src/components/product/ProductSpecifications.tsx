import React from 'react';
import { ShopifyMetafield } from '@/lib/types/shopify';

// Define the structure for the specifications data
interface DimensionField {
  key: string;
  value: string;
}

interface DimensionReference {
  id: string;
  type?: string;
  fields: DimensionField[];
}

interface SpecificationsData {
  reference?: DimensionReference;
  references?: {
    nodes: DimensionReference[];
  };
}

interface ProductSpecificationsProps {
  metafields?: ShopifyMetafield[] | null;
  specifications?: SpecificationsData | null;
}

// Helper function to parse dimension values
const parseDimensionValue = (value: string): { value: number; unit: string } | null => {
  try {
    const parsed = JSON.parse(value);
    return {
      value: parsed.value,
      unit: parsed.unit,
    };
  } catch (e) {
    // If JSON parsing fails, try to handle as a simple number (for pack_size)
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return {
        value: numValue,
        unit: 'SQUARE_METERS', // Default unit for pack size
      };
    }
    return null;
  }
};

// Helper function to format dimension labels
const formatDimensionLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    'length': 'L:',
    'width': 'W:',
    'thickness': 'T:',
    'pack_size': 'Pack Size:',
  };

  return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) + ':';
};

// Helper function to format dimension values
const formatDimensionValue = (key: string, value: string): string => {
  const parsed = parseDimensionValue(value);
  if (!parsed || parsed.value === undefined || parsed.value === null) return value;

  // Format the unit for display
  const unitMap: Record<string, string> = {
    'MILLIMETERS': 'mm',
    'METERS': 'm',
    'CENTIMETERS': 'cm',
    'SQUARE_METERS': 'm²',
  };

  // Special handling for pack size - should be square meters even if API says millimeters
  if (key === 'pack_size') {
    return `${Number(parsed.value).toFixed(2)} m²`;
  }

  const displayUnit = unitMap[parsed.unit] || parsed.unit.toLowerCase();

  return `${parsed.value} ${displayUnit}`;
};

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  metafields,
  specifications,
}) => {
  let specificationsData: { label: string; value: string }[] = [];

  // Debug logging
  console.log('ProductSpecifications props:', { metafields, specifications });

  // If specifications object is provided (from metaobject), use that data
  if (specifications) {
    console.log('Processing specifications');

    // Handle the reference structure directly (single object)
    if (specifications.reference && specifications.reference.fields) {
      console.log('Processing reference structure');
      const dimensionData = specifications.reference;

      specificationsData = dimensionData.fields
        .filter((field) => field.key && field.value) // Ensure we have valid data
        .map((field) => ({
          label: formatDimensionLabel(field.key),
          value: formatDimensionValue(field.key, field.value),
        }))
        // Limit to 4 specifications to match the grid layout
        .slice(0, 4);
    }
    // Handle the references structure (array of objects)
    else if (
      specifications.references &&
      specifications.references.nodes &&
      specifications.references.nodes.length > 0
    ) {
      console.log('Processing references structure');
      const dimensionData = specifications.references.nodes[0]; // Take the first reference

      if (dimensionData && dimensionData.fields) {
        // Map the dimension fields to specifications format
        specificationsData = dimensionData.fields
          .filter((field) => field.key && field.value) // Ensure we have valid data
          .map((field) => ({
            label: formatDimensionLabel(field.key),
            value: formatDimensionValue(field.key, field.value),
          }))
          // Limit to 4 specifications to match the grid layout
          .slice(0, 4);
      }
    }
  }

  // Fallback to metafields if no specifications data
  if (specificationsData.length === 0 && metafields && metafields.length > 0) {
    console.log('Processing metafields as fallback');
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
      specificationsData = specMetafields
        .slice(0, 4) // Limit to 4 specifications to match the grid layout
        .map((metafield) => ({
          label: formatDimensionLabel(metafield.key),
          value: formatDimensionValue(metafield.key, metafield.value),
        }));
    }
  }

  console.log('Specifications data to render:', specificationsData);

  // Reorder specifications to put "Pack Size" last
  if (specificationsData.length > 0) {
    const packSizeIndex = specificationsData.findIndex((spec) => spec.label === 'Pack Size:');
    if (packSizeIndex !== -1 && packSizeIndex !== specificationsData.length - 1) {
      const packSizeItem = specificationsData.splice(packSizeIndex, 1)[0];
      specificationsData.push(packSizeItem);
    }
  }

  // Only render if we have specifications data
  if (specificationsData.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-200'>
      {specificationsData.map((spec, index) => (
        <div key={index} className='text-center'>
          <div className='text-xs text-gray-500'>{spec.label}</div>
          <div className='font-medium'>{spec.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecifications;
