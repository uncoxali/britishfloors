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
          const price = parseFloat(product.priceRange.minVariantPrice.amount);

          // Extract dimensions from title or description if available
          const dimensions = extractDimensions(product.title + ' ' + product.description);
          const brand = extractBrand(product.title);

          // Calculate discount if there's a price range
          let originalPrice: number | undefined;
          let discount: number | undefined;

          if (product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount) {
            const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
            if (maxPrice > price) {
              originalPrice = maxPrice;
              discount = Math.round(((maxPrice - price) / maxPrice) * 100);
            }
          }

          // Get all images
          const images = product.images.edges.map(edge => edge.node.url);

          return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            image: images[0] || '/images/sample-product.png',
            images,
            width: dimensions.width,
            thickness: dimensions.thickness,
            length: dimensions.length,
            price,
            originalPrice,
            discount,
            category: extractCategory(product.title, product.description),
            brand,
            description: product.description
          };
        });

        setAllResults(transformedProducts);

        // Generate available filters
        const categories = [...new Set(transformedProducts.map(p => p.category))];
        const brands = [...new Set(transformedProducts.map(p => p.brand).filter(Boolean))] as string[];
        const prices = transformedProducts.map(p => p.price);
        const priceRange = {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices))
        };

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

// Helper function to extract dimensions from product text
function extractDimensions(text: string): { width?: string; thickness?: string; length?: string } {
  const dimensions: { width?: string; thickness?: string; length?: string } = {};

  // Look for common dimension patterns
  const widthMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:W|width)/i);
  const thicknessMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:T|thickness)/i);
  const lengthMatch = text.match(/(\d+(?:\.\d+)?)\s*mm?\s*(?:L|length)/i);

  if (widthMatch) dimensions.width = `${widthMatch[1]}mm`;
  if (thicknessMatch) dimensions.thickness = `${thicknessMatch[1]}mm`;
  if (lengthMatch) dimensions.length = `${lengthMatch[1]}mm`;

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
      default:
        // 'featured' - keep original order
        break;
    }
  }

  return filtered;
}

// Helper function to extract brand from product title
function extractBrand(title: string): string {
  // Extract the first word as brand, or detect common brand patterns
  const commonBrands = ['Shaw', 'Mohawk', 'Armstrong', 'Mannington', 'Tarkett', 'Quick-Step', 'Pergo', 'Karndean'];
  const titleLower = title.toLowerCase();

  for (const brand of commonBrands) {
    if (titleLower.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // Fallback to first word
  return title.split(' ')[0] || 'Unknown';
}

// Helper function to extract category from product text
function extractCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('laminate')) return 'Laminate';
  if (text.includes('engineered') || text.includes('wood')) return 'Engineered Wood';
  if (text.includes('vinyl') || text.includes('lvt')) return 'Vinyl (LVT)';
  if (text.includes('parquet')) return 'Parquet';
  if (text.includes('carpet')) return 'Carpet';
  if (text.includes('tile')) return 'Tile';

  return 'Flooring';
}
