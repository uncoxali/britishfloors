import { ShopifyProduct } from '@/lib/types/shopify';

/**
 * Maps color names to hex color codes for flooring products
 */
export const getColorFromName = (name: string): string => {
  const colorName = name.toLowerCase().trim();

  // First check if it's already a hex color
  if (colorName.startsWith('#') && (colorName.length === 7 || colorName.length === 4)) {
    return colorName;
  }

  const colorMap: Record<string, string> = {
    // Wood tones
    oak: '#8B6F47',
    natural: '#8B6F47',
    light: '#A0845C',
    blonde: '#A0845C',
    dark: '#2C2C2C',

    grey: '#9E9E9E',
    walnut: '#8B4513',

    beige: '#F5F5DC',

    honey: '#DEB887',
    white: '#FFFEF7',
    cherry: '#A0522D',

    // Additional common flooring colors
    'light oak': '#D2B48C',
    'dark oak': '#5D4037',
    'natural oak': '#8B6F47',
    'red oak': '#8B4513',
    'white oak': '#E0C8A5',
    'hickory': '#8B6F47',
    'maple': '#F5DEB3',
    'bamboo': '#D8C2A3',
    'ash': '#D2B48C',
    'birch': '#E0C8A5',
    'pine': '#F5DEB3',
    'cedar': '#A0522D',
    'teak': '#965A3E',


    'pecan': '#7B3F00',
    'espresso': '#4B3621',
    'cocoa': '#7D5D3B',
    'sand': '#C2B280',
    'stone': '#A9A9A9',
    'slate': '#708090',
    'graphite': '#383838',
    'silver': '#C0C0C0',
    'platinum': '#E5E4E2',
    'taupe': '#483C32',






    'mustard': '#FFDB58',
    'olive': '#808000',
    'sage': '#BCB88A',
    'mint': '#98FF98',
    'sapphire': '#0F52BA',
    'navy': '#000080',
    'cobalt': '#0047AB',
    'azure': '#007FFF',
    'cerulean': '#007BA7',
    'turquoise': '#40E0D0',
    'teal': '#008080',
    'aqua': '#00FFFF',
    'emerald': '#50C878',
    'jade': '#00A86B',
    'forest': '#228B22',
    'lime': '#32CD32',
    'apple': '#66B2FF',
    'coral': '#FF7F50',
    'salmon': '#FA8072',
    'peach': '#FFE5B4',
    'rose': '#FF007F',
    'blush': '#DE5D83',
    'wine': '#722F37',
    'burgundy': '#800020',
    'maroon': '#800000',
    'crimson': '#DC143C',
    'ruby': '#E0115F',
    'garnet': '#733635',
    'amethyst': '#9966CC',
    'lavender': '#E6E6FA',
    'orchid': '#DA70D6',
    'violet': '#8A2BE2',
    'purple': '#800080',
    'indigo': '#4B0082',
    'periwinkle': '#CCCCFF',

    // Specific colors from the test data
    blue: '#0000FF',
    bronze: '#CD7F32',
    brown: '#A52A2A',
  };

  // Try exact match first
  if (colorMap[colorName]) {
    return colorMap[colorName];
  }

  // Try partial match
  for (const [key, color] of Object.entries(colorMap)) {
    if (colorName.includes(key)) {
      return color;
    }
  }

  return '#8B6F47'; // Default oak color
};

/**
 * Extracts color options from product variants
 */
export const getProductColors = (product: ShopifyProduct) => {
  // Extract colors from variants' selected options
  const colorSet = new Set<string>();

  // Process variants to extract color options
  if (product.variants && product.variants.edges) {
    product.variants.edges.forEach((variant) => {
      if (variant.node.selectedOptions) {
        variant.node.selectedOptions.forEach((option) => {
          // Check for color-related option names (case insensitive)
          const optionName = option.name.toLowerCase();
          if (optionName.includes('color') ||
            optionName.includes('colour') ||
            optionName.includes('finish') ||
            optionName.includes('variant')) {
            // Only add non-empty values
            if (option.value && option.value.trim() !== '') {
              colorSet.add(option.value);
            }
          }
        });
      }
    });
  }

  // If no color options found in variants, try to get them from product options
  if (colorSet.size === 0 && product.options && product.options.length > 0) {
    // Look for color-related options first
    for (const option of product.options) {
      const optionName = option.name.toLowerCase();
      if (optionName.includes('color') ||
        optionName.includes('colour') ||
        optionName.includes('finish') ||
        optionName.includes('variant')) {
        // Add all values for this option
        option.values.forEach((value) => {
          if (value && value.trim() !== '') {
            colorSet.add(value);
          }
        });
        break; // Use only the first matching option
      }
    }

    // If still no colors found, use the first option as fallback
    if (colorSet.size === 0) {
      product.options[0].values.forEach((value) => {
        if (value && value.trim() !== '') {
          colorSet.add(value);
        }
      });
    }
  }

  return Array.from(colorSet);
};

/**
 * Gets the price for a specific color/variant
 */
export const getPriceForColor = (product: ShopifyProduct, color: string): string => {
  // Normalize the color value for comparison
  const normalizedColor = color.toLowerCase().trim();

  // Find the variant that matches the color
  const matchingVariant = product.variants.edges.find(variant => {
    // Check if the variant has selected options
    if (!variant.node.selectedOptions) {
      return false;
    }

    // Look for a matching color option
    return variant.node.selectedOptions.some(option => {
      // Normalize option name and value for comparison
      const optionName = option.name.toLowerCase().trim();
      const optionValue = option.value.toLowerCase().trim();

      // Check if this is a color-related option
      const isColorOption = optionName.includes('color') ||
        optionName.includes('colour') ||
        optionName.includes('finish') ||
        optionName.includes('variant');

      // Check if the option value matches the requested color
      const matchesColor = optionValue === normalizedColor;

      return isColorOption && matchesColor;
    });
  });

  // Return the price of the matching variant, or "0" if not found
  if (matchingVariant) {
    return matchingVariant.node.price.amount;
  }

  // Fallback to "0" if no matching variant found
  return "0";
};

/**
 * Gets the variant ID for a specific color
 */
export const getVariantIdForColor = (product: ShopifyProduct, color: string): string | null => {
  const matchingVariant = product.variants.edges.find(variant =>
    variant.node.selectedOptions?.some(option =>
      ((option.name.toLowerCase().includes('color') ||
        option.name.toLowerCase().includes('colour') ||
        option.name.toLowerCase().includes('finish') ||
        option.name.toLowerCase().includes('variant'))
        && option.value.toLowerCase() === color.toLowerCase()) ||
      // Fallback to first option if no color options found
      (product.options && product.options.length > 0 &&
        product.options[0].name === option.name &&
        option.value.toLowerCase() === color.toLowerCase())
    )
  );

  return matchingVariant ? matchingVariant.node.id : null;
};

/**
 * Converts square feet to square meters
 */
export const ftToM2 = (area: number): number => {
  return area * 0.092903;
};

/**
 * Converts square meters to square feet
 */
export const m2ToFt = (area: number): number => {
  return area / 0.092903;
};

/**
 * Converts feet to meters
 */
export const feetToMeters = (feet: number): number => {
  return feet * 0.3048;
};

/**
 * Calculates area with wastage percentage
 */
export const calculateAreaWithWastage = (baseArea: number, wastagePercent: number): number => {
  return baseArea * (1 + wastagePercent / 100);
};

/**
 * Calculates number of packs needed for given area
 */
export const calculatePacksNeeded = (area: number, packSize: number): number => {
  return Math.ceil(area / packSize);
};

/**
 * Formats currency to GBP
 */
export const formatCurrency = (amount: number): string => {
  return `£${amount.toFixed(2)}`;
};