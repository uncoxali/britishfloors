'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useCalculator } from '@/hooks/useCalculator';
import { useProductCart } from '@/hooks/useProductCart';
import { useAccordion } from '@/hooks/useAccordion';
import { useInventoryCost } from '@/hooks/useInventoryCost';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';

import ProductGallery from '@/components/product/ProductGallery';
import ProductRating from '@/components/product/ProductRating';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import CalculatorTab from '@/components/product/CalculatorTab';
import OrderTab from '@/components/product/OrderTab';
import ActionButtons from '@/components/product/ActionButtons';
import VisualSimilarProducts from '@/components/product/VisualSimilarProducts';
import ProductSpecificationsDetails from '@/components/product/ProductSpecificationsDetails';
import AccordionItem from '@/components/ui/AccordionItem';
import ProductAccordionItem from '@/components/ui/ProductAccordionItem';
import {
  parseRoomSuitabilityData,
  parseRoomSuitabilityFromTags,
  parseProductDescription,
  getIconPath,
} from '@/utils/roomSuitabilityUtils';

interface ProductDetailModernProps {
  product: ShopifyProduct;
}

// Helper function to safely parse JSON values
const safeJsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// Helper function to extract numeric value from various formats
const extractNumericValue = (value: string): number | null => {
  if (!value) return null;

  // Try direct number conversion first
  const directNum = parseFloat(value);
  if (!isNaN(directNum)) return directNum;

  // Try JSON parsing
  const parsed = safeJsonParse(value);
  if (parsed && typeof parsed === 'object' && parsed !== null && 'value' in parsed) {
    const parsedObj = parsed as { value: unknown };
    if (typeof parsedObj.value === 'number') return parsedObj.value;
  }
  if (typeof parsed === 'number') return parsed;

  return null;
};

const ProductDetailModern: React.FC<ProductDetailModernProps> = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'calculate' | 'order'>('calculate');

  // Independent accordion states - each can be opened/closed separately
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isRoomSuitabilityOpen, setIsRoomSuitabilityOpen] = useState(false);

  // Fetch cost per item from Admin API
  const {
    costPerItem: adminCostPerItem,
    currencyCode,
    isLoading: isCostLoading,
    error: costError,
  } = useInventoryCost(product.id);

  // Parse dynamic data
  const roomSuitabilityData = parseRoomSuitabilityFromTags(product.tags);
  const descriptionParagraphs = parseProductDescription(product.description);

  // Toggle functions - completely independent behavior
  const handleDescriptionToggle = useCallback(() => {
    setIsDescriptionOpen((current) => !current);
  }, []);

  const handleRoomSuitabilityToggle = useCallback(() => {
    setIsRoomSuitabilityOpen((current) => !current);
  }, []);

  // Service accordions hook (separate from product detail accordions)
  const { accordionState, toggleAccordion } = useAccordion({
    delivery: false,
    klarna: false,
    returns: false,
  });

  // Initialize with default values for hooks that need product data
  const defaultPackSize = 1.92;
  const defaultPricePerM2 = product.priceRange?.minVariantPrice
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : 0;

  const { calculationState, orderState, calculations, updateCalculationState, updateOrderState } =
    useCalculator(defaultPackSize, defaultPricePerM2, adminCostPerItem);

  const {
    handleAddToCartWithQuantity: originalHandleAddToCart,
    handleOrderSample,
    isInCart,
    isAddingToCart,
    isOrderingSample,
  } = useProductCart(product);

  // Get sample cart state separately
  const { isProductInCart } = useCartStore();
  const isSampleInCart = isProductInCart(product.id, true);

  // Custom add to cart function that uses calculated pricing
  const handleAddToCartWithCalculatedPrice = useCallback(async (quantity: number) => {
    if (isInCart) {
      const { open: openCart } = useCartDrawerStore.getState();
      openCart();
      return;
    }

    try {
      const firstVariant = product.variants?.edges[0]?.node;
      if (firstVariant) {
        // Calculate the correct price per pack based on admin cost or pack calculation
        const pricePerPack = adminCostPerItem || (defaultPackSize * defaultPricePerM2);
        
        // Create a modified variant with the calculated price
        const modifiedVariant = {
          ...firstVariant,
          price: {
            amount: pricePerPack.toFixed(2),
            currencyCode: firstVariant.price.currencyCode || 'GBP'
          }
        };

        // Add item with calculated price
        const { addItem } = useCartStore.getState();
        addItem(product, modifiedVariant, quantity, false);
        
        // Open cart after a short delay
        setTimeout(() => {
          const { open: openCart } = useCartDrawerStore.getState();
          openCart();
        }, 300);
      } else {
        console.error('No variants available for this product');
      }
    } catch (error) {
      console.error('Error adding to cart with calculated price:', error);
    }
  }, [isInCart, product, adminCostPerItem, defaultPackSize, defaultPricePerM2]);

  // Memoized product data extraction
  const productData = useMemo(() => {
    // Extract images safely
    const images = product.images?.edges?.map((edge) => edge.node) || [];

    // Function to extract pack size from various sources
    const getPackSize = (): number => {
      const defaultPackSize = 1.92;

      // Try dimensions first
      if (product.dimensions) {
        const dimensionSources = [
          product.dimensions.reference,
          ...(product.dimensions.references?.nodes || []),
        ].filter(Boolean);

        for (const source of dimensionSources) {
          if (source?.fields) {
            const packSizeField = source.fields.find((field) => field.key === 'pack_size');
            if (packSizeField?.value) {
              const numValue = extractNumericValue(packSizeField.value);
              if (numValue && numValue > 0) return numValue;
            }
          }
        }
      }

      // Try specifications as fallback
      if (product.specifications) {
        const specSources = [
          product.specifications.reference,
          ...(product.specifications.references?.nodes || []),
        ].filter(Boolean);

        for (const source of specSources) {
          if (source?.fields) {
            const packSizeField = source.fields.find((field) => field.key === 'pack_size');
            if (packSizeField?.value) {
              const numValue = extractNumericValue(packSizeField.value);
              if (numValue && numValue > 0) return numValue;
            }
          }
        }
      }

      // Try metafields as last resort
      if (product.metafields) {
        const packSizeMetafield = product.metafields.find(
          (field) => field.key === 'pack_size' || field.key === 'packSize',
        );
        if (packSizeMetafield?.value) {
          const numValue = extractNumericValue(packSizeMetafield.value);
          if (numValue && numValue > 0) return numValue;
        }
      }

      return defaultPackSize;
    };

    // Extract pricing information safely
    const maxPrice = product.priceRange?.maxVariantPrice;
    const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice;

    if (!maxPrice) {
      console.error('No price information available for product:', product.id);
      return null;
    }

    const pricePerM2 = parseFloat(maxPrice.amount);
    const packSize = getPackSize();

    // Calculate discount information
    const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > pricePerM2;
    const discountPercentage = hasDiscount
      ? Math.round(
          ((parseFloat(compareAtPrice.amount) - pricePerM2) / parseFloat(compareAtPrice.amount)) *
            100,
        )
      : 0;

    // Calculate cost per pack - use API value if available, otherwise calculate
    const apiCostPerItem = product.costPerItem?.value
      ? extractNumericValue(product.costPerItem.value)
      : null;
    const costPerPack =
      apiCostPerItem && apiCostPerItem > 0 ? apiCostPerItem : pricePerM2 * packSize;
    const originalCostPerPack = hasDiscount
      ? parseFloat(compareAtPrice.amount) * packSize
      : costPerPack;

    return {
      images,
      packSize,
      pricePerM2,
      costPerPack,
      originalCostPerPack,
      hasDiscount,
      discountPercentage,
      compareAtPrice,
      maxPrice,
    };
  }, [product]);

  // Handle case where product data extraction failed
  if (!productData) {
    return (
      <div className='w-full px-4 py-6'>
        <div className='text-center text-red-600'>
          <p>Error loading product information. Please try again.</p>
        </div>
      </div>
    );
  }

  const {
    images,
    packSize,
    pricePerM2,
    costPerPack,
    originalCostPerPack,
    hasDiscount,
    discountPercentage,
    compareAtPrice,
    maxPrice,
  } = productData;

  // Get appropriate quantity based on active tab
  const getQuantityForCart = () => {
    return activeTab === 'calculate' ? calculations.packsNeeded : orderState.quantity;
  };

  // Ensure we have at least one image for the gallery
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: 'placeholder',
            url: '/placeholder-product.jpg',
            altText: product.title,
            width: 800,
            height: 600,
          },
        ];

  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 py-6'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12'>
        {/* Left: Gallery */}
        <div className='w-full'>
          <ProductGallery
            images={galleryImages}
            activeIndex={activeIndex}
            onImageSelect={setActiveIndex}
            productTitle={product.title}
          />
        </div>

        {/* Right: Details */}
        <div className='flex flex-col justify-start space-y-4 w-full'>
          {/* Breadcrumb */}
          <div className='text-sm text-gray-500'>
            <span>Home</span> <span>/</span> <span>Shop</span>
            {product.collections?.edges?.[0]?.node && (
              <>
                <span>/</span> <span>{product.collections.edges[0].node.title}</span>
              </>
            )}
            <span>/</span> <span className='text-gray-700'>{product.title}</span>
          </div>

          {/* Rating */}
          <ProductRating />

          {/* Title */}
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e3a8a] break-words'>
            {product.title || 'Product Title'}
          </h1>

          {/* Description */}
          {product.description && (
            <div className='text-gray-600 text-sm'>
              <p>
                {product.description.length > 150
                  ? `${product.description.substring(0, 150)}...`
                  : product.description}
              </p>
            </div>
          )}

          {/* Specifications (use dimensions or specifications data from API) */}
          <ProductSpecifications
            metafields={product.metafields}
            specifications={product.dimensions || product.specifications}
          />

          {/* Price */}
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <span className='text-lg sm:text-xl font-bold text-gray-900'>
                NOW: £{maxPrice.amount} per m²
              </span>
              {hasDiscount && compareAtPrice && (
                <div className='flex items-center gap-2'>
                  <span className='text-red-600 font-medium text-sm sm:text-base'>
                    Was: £{compareAtPrice.amount}
                  </span>
                  <span className='bg-red-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap'>
                    -{discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Cost per item from Admin API */}
            {(adminCostPerItem || isCostLoading) && (
              <div className='mt-2'>
                {isCostLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin'></div>
                    <span className='text-sm text-gray-500'>Loading inventory cost...</span>
                  </div>
                ) : (
                  <div className='mt-1'>
                    <span className='text-lg font-semibold text-gray-800'>
                      {currencyCode === 'GBP' ? '£' : currencyCode || '£'}
                      {adminCostPerItem?.toFixed(2)} per pack
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calculate and Order Section - Tabbed Interface */}
          <div className='space-y-0'>
            {/* Tab Navigation */}
            <div className='flex gap-1 sm:gap-2 mb-0'>
              <button
                onClick={() => setActiveTab('calculate')}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-6 text-center font-medium rounded-t-lg transition-colors text-sm sm:text-base ${
                  activeTab === 'calculate'
                    ? 'text-amber-700'
                    : 'bg-transparent border border-amber-600 text-amber-700 hover:bg-amber-50 mb-1'
                }`}
                style={activeTab === 'calculate' ? { backgroundColor: '#EFE2CC' } : {}}
              >
                Calculate flooring
              </button>
              <button
                onClick={() => setActiveTab('order')}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-6 text-center font-medium rounded-t-lg transition-colors text-sm sm:text-base ${
                  activeTab === 'order'
                    ? 'text-amber-700'
                    : 'bg-transparent border border-amber-600 text-amber-700 hover:bg-amber-50 mb-1'
                }`}
                style={activeTab === 'order' ? { backgroundColor: '#EFE2CC' } : {}}
              >
                Order packets
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'calculate' && (
              <CalculatorTab
                calculationState={calculationState}
                calculations={calculations}
                packSize={packSize}
                onUpdateCalculation={updateCalculationState}
              />
            )}

            {activeTab === 'order' && (
              <OrderTab
                orderState={orderState}
                calculations={calculations}
                packSize={packSize}
                onUpdateOrder={updateOrderState}
              />
            )}
          </div>

          {/* Action Buttons */}
          {product.variants?.edges?.length > 0 ? (
            <ActionButtons
              onAddToCart={handleAddToCartWithCalculatedPrice}
              handleOrderSample={handleOrderSample}
              isInCart={isInCart}
              isSampleInCart={isSampleInCart}
              isAddingToCart={isAddingToCart}
              isOrderingSample={isOrderingSample}
              quantity={getQuantityForCart()}
            />
          ) : (
            <div className='p-4 bg-gray-100 rounded-lg text-center'>
              <p className='text-gray-600'>This product is currently unavailable</p>
            </div>
          )}

          {/* Visual Products Section */}
          <VisualSimilarProducts currentProduct={product} />
        </div>
      </div>

      {/* Lower Section - Product Info & Accordions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12'>
        {/* Left - Product Specifications */}
        <ProductSpecificationsDetails product={product} />

        {/* Right - Services */}
        <div className='space-y-4'>
          {/* Delivery Banner */}
          <div className='bg-red-600 text-white rounded-xl p-4 text-center'>
            <p className='font-semibold'>
              FREE IN-HOME DELIVERY <span className='italic'>On Orders Over £499</span>
            </p>
          </div>

          {/* Service Accordions */}
          <AccordionItem
            title='Choose Your Delivery Date'
            isOpen={accordionState.delivery}
            onToggle={() => toggleAccordion('delivery')}
            icon={
              <svg
                className={`w-5 h-5 ${accordionState.delivery ? 'text-white' : 'text-blue-600'}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 003 2z'
                />
              </svg>
            }
          >
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>Select your preferred delivery date:</p>
              <div className='grid grid-cols-2 gap-2'>
                {(() => {
                  const today = new Date();
                  const deliveryDates = [];
                  for (let i = 1; i <= 4; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
                    const dateStr = date.toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric',
                    });
                    deliveryDates.push(`${dayName}, ${dateStr}`);
                  }
                  return deliveryDates.map((dateStr, index) => (
                    <button
                      key={index}
                      className='p-2 border border-blue-200 rounded-lg text-xs sm:text-sm hover:bg-blue-50 transition-colors'
                    >
                      {dateStr}
                    </button>
                  ));
                })()}
              </div>
              <p className='text-xs text-gray-500'>Free delivery on orders over £499</p>
            </div>
          </AccordionItem>

          <AccordionItem
            title='Flexible Payment Plans With Klarna'
            isOpen={accordionState.klarna}
            onToggle={() => toggleAccordion('klarna')}
            icon={
              <svg
                className={`w-5 h-5 ${accordionState.klarna ? 'text-white' : 'text-blue-600'}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                />
              </svg>
            }
          >
            <div className='text-sm text-gray-600 space-y-2'>
              <p>
                With our flexible payment plans through Klarna, you can easily manage the cost of
                your new flooring.
              </p>
              <p>
                Choose from options like splitting the total into interest-free instalments or
                delaying payment for up to 30 days.
              </p>
              <p>
                Check out our Klarna page for more information and find the payment option that
                works best for you.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem
            title='30-Day Hassle Free Returns'
            isOpen={accordionState.returns}
            onToggle={() => toggleAccordion('returns')}
            icon={
              <svg
                className={`w-5 h-5 ${accordionState.returns ? 'text-white' : 'text-blue-600'}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                />
              </svg>
            }
          >
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>Easy returns within 30 days of purchase:</p>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Free return collection service</li>
                <li>• Full refund on unused items</li>
                <li>• Original packaging required</li>
                <li>• No restocking fees</li>
              </ul>
              <p className='text-xs text-gray-500'>
                Terms and conditions apply. See our returns policy for full details.
              </p>
            </div>
          </AccordionItem>
        </div>
      </div>

      {/* Product Details Accordions - Below Product Specifications */}
      <div className='mt-6 sm:mt-8 space-y-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Description Accordion */}
          <div key='description-accordion'>
            <ProductAccordionItem
              title='Description'
              isOpen={isDescriptionOpen}
              onToggle={handleDescriptionToggle}
              variant='golden'
            >
              <div className='text-gray-700 text-sm leading-relaxed space-y-3'>
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>No description available for this product.</p>
                )}
              </div>
            </ProductAccordionItem>
          </div>

          {/* Room Suitability Accordion */}
          <div key='room-suitability-accordion'>
            <ProductAccordionItem
              title='Room Suitability'
              isOpen={isRoomSuitabilityOpen}
              onToggle={handleRoomSuitabilityToggle}
              variant='golden'
            >
              <div className='space-y-4'>
                {/* Room Icons - Responsive Grid */}
                {roomSuitabilityData.rooms.length > 0 && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                    {roomSuitabilityData.rooms.map((room) => (
                      <div
                        key={room.id}
                        className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg'
                      >
                        <div className='w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                          <svg
                            className='w-4 h-4 sm:w-5 sm:h-5 text-amber-600'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d={getIconPath(room.icon)} />
                          </svg>
                        </div>
                        <span className='text-xs sm:text-sm font-medium text-gray-700 truncate'>
                          {room.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Additional Features - Responsive Grid */}
                {roomSuitabilityData.features.length > 0 && (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {roomSuitabilityData.features.map((feature) => (
                      <div
                        key={feature.id}
                        className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg'
                      >
                        <div className='w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                          <svg
                            className='w-4 h-4 sm:w-5 sm:h-5 text-amber-600'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d={getIconPath(feature.icon)} />
                          </svg>
                        </div>
                        <span className='text-xs sm:text-sm font-medium text-gray-700'>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback message if no data */}
                {roomSuitabilityData.rooms.length === 0 &&
                  roomSuitabilityData.features.length === 0 && (
                    <div className='text-center text-gray-500 py-4'>
                      <p>No room suitability information available for this product.</p>
                    </div>
                  )}
              </div>
            </ProductAccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModern;
