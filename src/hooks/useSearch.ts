import { useState, useEffect, useCallback } from 'react';
import { shopifyApi } from '@/lib/shopify/api';
// Removed unused ShopifyProduct import

export interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  image: string;
  images?: string[];
  width?: string;
  thickness?: string;
  length?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand?: string;
  description: string;
}

export interface SearchFilters {
  category?: string;
  priceRange?: string;
  brands?: string[];
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  // Add more filter options
  inStock?: boolean;
  onSale?: boolean;
  rating?: number;
}

export interface SearchOptions {
  filters?: SearchFilters;
  limit?: number;
  page?: number;
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [allResults, setAllResults] = useState<SearchProduct[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [availableFilters, setAvailableFilters] = useState<{
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  }>({ categories: [], brands: [], priceRange: { min: 0, max: 1000 } });

  const searchProducts = useCallback(async (searchQuery: string, options?: SearchOptions) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setAllResults([]);
      setFilteredResults([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const limit = options?.limit || 50; // Increase limit to get more results for filtering
      const response = await shopifyApi.searchProducts(searchQuery, limit);

      // Check if response exists before accessing its properties
      if (response && response.products && response.products.edges) {
        // Transform Shopify products to SearchProduct format
        const transformedProducts: SearchProduct[] = response.products.edges.map((edge) => {
          const product = edge.node;

          // Calculate pricing and discounts with error handling
          const price = parseFloat(product.priceRange.minVariantPrice.amount);
          if (isNaN(price)) {
            console.error('Invalid price for product:', product.id);
            return null; // Skip invalid products
          }

          let originalPrice: number | undefined;
          let discount: number | undefined;

          // Check if there's a compareAtPriceRange for discounts
          if (product.compareAtPriceRange &&
            product.compareAtPriceRange.minVariantPrice &&
            !isNaN(parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) &&
            parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > price) {
            originalPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
            discount = Math.round(((originalPrice - price) / originalPrice) * 100);
          } else if (product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount) {
            // Fallback to price range difference if no compareAtPrice
            const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
            if (!isNaN(maxPrice) && maxPrice > price) {
              originalPrice = maxPrice;
              discount = Math.round(((maxPrice - price) / maxPrice) * 100);
            }
          }

          // Extract dimensions from title, description, and metafields if available
          const dimensions = extractDimensions(product.title + ' ' + product.description, product.metafields);
          const brand = extractBrand(product.title, product.tags);

          // Get all images with proper fallbacks
          const images = product.images.edges.map(edge => edge.node.url);
          const mainImage = images.length > 0 ? images[0] : '/images/placeholder-product.jpg';

          return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            image: mainImage,
            images,
            width: dimensions.width,
            thickness: dimensions.thickness,
            length: dimensions.length,
            price,
            originalPrice,
            discount,
            category: extractCategory(product.title, product.description, product.tags),
            brand,
            description: product.description
          };
        }).filter(Boolean) as SearchProduct[]; // Remove null values

        setAllResults(transformedProducts);

        // Generate available filters
        const categories = [...new Set(transformedProducts.map(p => p.category))];
        const brands = [...new Set(transformedProducts.map(p => p.brand).filter(Boolean))] as string[];
        const prices = transformedProducts.map(p => p.price).filter(p => !isNaN(p));
        const priceRange = prices.length > 0 ? {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices))
        } : { min: 0, max: 1000 };

        setAvailableFilters({ categories, brands, priceRange });

        // Apply filters if provided
        const filtered = applyFiltersToResults(transformedProducts, options?.filters);
        setFilteredResults(filtered);
        setResults(options?.limit ? filtered.slice(0, options.limit) : filtered.slice(0, 10));
        setTotalCount(filtered.length);
      } else {
        // Handle case where no products are returned
        setAllResults([]);
        setFilteredResults([]);
        setResults([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search products');
      setResults([]);
      setAllResults([]);
      setFilteredResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback((filters: SearchFilters) => {
    const filtered = applyFiltersToResults(allResults, filters);
    setFilteredResults(filtered);
    setResults(filtered.slice(0, 10));
    setTotalCount(filtered.length);
  }, [allResults]);

  const getMoreResults = useCallback((limit: number) => {
    setResults(filteredResults.slice(0, limit));
  }, [filteredResults]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchProducts(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchProducts]);

  return {
    query,
    setQuery,
    results,
    allResults,
    filteredResults,
    isLoading,
    error,
    totalCount,
    availableFilters,
    searchProducts,
    applyFilters,
    getMoreResults
  };
};

// Helper function to extract dimensions from product text and metafields
function extractDimensions(text: string, metafields?: Array<{ namespace: string; key: string; value: string }> | null): { width?: string; thickness?: string; length?: string } {
  const dimensions: { width?: string; thickness?: string; length?: string } = {};

  // First try to extract from metafields if available
  if (metafields && metafields.length > 0) {
    const dimensionsMetafield = metafields.find(m =>
      m.namespace === 'custom' && m.key === 'dimensions'
    );

    if (dimensionsMetafield && dimensionsMetafield.value) {
      try {
        const dimData = JSON.parse(dimensionsMetafield.value);
        if (dimData.width) dimensions.width = dimData.width;
        if (dimData.thickness) dimensions.thickness = dimData.thickness;
        if (dimData.length) dimensions.length = dimData.length;
      } catch (e) {
        // Fall back to text parsing if JSON parsing fails
      }
    }
  }

  // If no dimensions found in metafields, try text parsing
  if (!dimensions.width && !dimensions.thickness && !dimensions.length) {
    // Look for common dimension patterns
    const widthMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:W|width|wide)/i);
    const thicknessMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:T|thickness|thick)/i);
    const lengthMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:L|length|long)/i);

    if (widthMatch) dimensions.width = `${widthMatch[1]}mm`;
    if (thicknessMatch) dimensions.thickness = `${thicknessMatch[1]}mm`;
    if (lengthMatch) dimensions.length = `${lengthMatch[1]}mm`;

    // Also try alternative patterns
    if (!dimensions.width || !dimensions.thickness || !dimensions.length) {
      // Look for patterns like "192x1285x8mm" or "192 x 1285 x 8"
      const dimensionPattern = text.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*mm?/i);
      if (dimensionPattern) {
        if (!dimensions.width) dimensions.width = `${dimensionPattern[1]}mm`;
        if (!dimensions.length) dimensions.length = `${dimensionPattern[2]}mm`;
        if (!dimensions.thickness) dimensions.thickness = `${dimensionPattern[3]}mm`;
      }
    }
  }

  return dimensions;
}

// Helper function to apply filters to results
function applyFiltersToResults(products: SearchProduct[], filters?: SearchFilters): SearchProduct[] {
  if (!filters) return products;

  let filtered = [...products];

  // Category filter
  if (filters.category) {
    filtered = filtered.filter(product =>
      product.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(product =>
      filters.brands!.some(brand =>
        product.brand?.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number);
    filtered = filtered.filter(product => {
      if (max === 1000) return product.price >= min; // "Over £500" case
      return product.price >= min && product.price <= max;
    });
  }

  // Custom price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => {
      const price = product.price;
      const minOk = filters.minPrice === undefined || price >= filters.minPrice;
      const maxOk = filters.maxPrice === undefined || price <= filters.maxPrice;
      return minOk && maxOk;
    });
  }

  // In stock filter
  if (filters.inStock) {
    // For now, we'll assume all products are in stock
    // In a real implementation, this would check product availability
  }

  // On sale filter
  if (filters.onSale) {
    filtered = filtered.filter(product => product.discount && product.discount > 0);
  }

  // Rating filter
  if (filters.rating !== undefined) {
    // For now, we'll assume all products have a high rating
    // In a real implementation, this would check product ratings
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        // For now, we'll sort by discount as a proxy for rating
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // 'featured' - keep original order
        break;
    }
  }

  return filtered;
}

// Helper function to extract brand from product title and tags
function extractBrand(title: string, tags?: string[]): string {
  // First check tags for brand information
  if (tags && tags.length > 0) {
    const brandTag = tags.find(tag =>
      tag.toLowerCase().includes('brand:') ||
      tag.toLowerCase().includes('manufacturer:')
    );
    if (brandTag) {
      const brand = brandTag.split(':')[1]?.trim();
      if (brand) return brand;
    }

    // Check for common brand names in tags
    const commonBrands = [
      'Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett', 'Quick-Step',
      'Pergo', 'Karndean', 'Amtico', 'Moduleo', 'COREtec', 'Luxury Vinyl',
      'Laminate', 'Engineered', 'SPC', 'WPC', 'LVT', 'LVP'
    ];

    for (const brand of commonBrands) {
      if (tags.some(tag => tag.toLowerCase().includes(brand.toLowerCase()))) {
        return brand;
      }
    }
  }

  // Extract the first word as brand, or detect common brand patterns in title
  const titleWords = title.split(' ');
  const commonBrands = [
    'Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett', 'Quick-Step',
    'Pergo', 'Karndean', 'Amtico', 'Moduleo', 'COREtec'
  ];

  const titleLower = title.toLowerCase();
  for (const brand of commonBrands) {
    if (titleLower.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // Fallback to first word if it's not a generic term
  const firstWord = titleWords[0] || 'Unknown';
  const genericTerms = ['laminate', 'engineered', 'luxury', 'vinyl', 'wood', 'flooring', 'plank'];

  if (!genericTerms.includes(firstWord.toLowerCase())) {
    return firstWord;
  }

  return 'Unknown';
}

// Helper function to extract category from product text and tags
function extractCategory(title: string, description: string, tags?: string[]): string {
  const text = (title + ' ' + description).toLowerCase();

  // First check tags for category information
  if (tags && tags.length > 0) {
    const categoryTag = tags.find(tag =>
      tag.toLowerCase().includes('category:') ||
      tag.toLowerCase().includes('type:')
    );
    if (categoryTag) {
      const category = categoryTag.split(':')[1]?.trim();
      if (category) return category;
    }
  }

  // Check for specific product type keywords with higher priority
  if (text.includes('luxury vinyl') || text.includes('lvt') || text.includes('lvp')) return 'Luxury Vinyl';
  if (text.includes('spc') || text.includes('stone plastic composite')) return 'SPC Flooring';
  if (text.includes('wpc') || text.includes('wood plastic composite')) return 'WPC Flooring';
  if (text.includes('laminate')) return 'Laminate';
  if (text.includes('engineered wood') || (text.includes('engineered') && text.includes('wood'))) return 'Engineered Wood';
  if (text.includes('solid wood') || (text.includes('solid') && text.includes('wood'))) return 'Solid Wood';
  if (text.includes('vinyl') && !text.includes('luxury')) return 'Vinyl';
  if (text.includes('parquet')) return 'Parquet';
  if (text.includes('bamboo')) return 'Bamboo';
  if (text.includes('cork')) return 'Cork';
  if (text.includes('linoleum')) return 'Linoleum';
  if (text.includes('carpet')) return 'Carpet';
  if (text.includes('tile') || text.includes('ceramic') || text.includes('porcelain')) return 'Tile';
  if (text.includes('stone') || text.includes('natural stone')) return 'Natural Stone';

  // Check tags for product type
  if (tags && tags.length > 0) {
    const productTypes = [
      'Luxury Vinyl', 'Laminate', 'Engineered Wood', 'Solid Wood', 'SPC', 'WPC',
      'Vinyl', 'Parquet', 'Bamboo', 'Cork', 'Carpet', 'Tile', 'Stone'
    ];

    for (const type of productTypes) {
      if (tags.some(tag => tag.toLowerCase().includes(type.toLowerCase()))) {
        return type;
      }
    }
  }

  // Try to extract category from title structure (e.g., "Brand Category Name")
  const titleWords = title.split(' ');
  if (titleWords.length >= 2) {
    // Check if second word is a common category
    const possibleCategory = titleWords[1].toLowerCase();
    const commonCategories = ['laminate', 'engineered', 'vinyl', 'parquet', 'bamboo', 'cork'];
    if (commonCategories.includes(possibleCategory)) {
      return possibleCategory.charAt(0).toUpperCase() + possibleCategory.slice(1);
    }
  }

  return 'Flooring';
}
