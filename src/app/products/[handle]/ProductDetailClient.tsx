'use client';

import React, { useState, useEffect } from 'react';
import { ShopifyProduct } from '@/lib/types/shopify';
import { useCalculator } from '@/hooks/useCalculator';
import { useProductCart } from '@/hooks/useProductCart';
import { useAccordion } from '@/hooks/useAccordion';
import { getProductColors, getPriceForColor } from '@/utils/productUtils';

import ProductGallery from '@/components/product/ProductGallery';
import ColorSelector from '@/components/product/ColorSelector';
import ProductRating from '@/components/product/ProductRating';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import CalculatorTab from '@/components/product/CalculatorTab';
import OrderTab from '@/components/product/OrderTab';
import ActionButtons from '@/components/product/ActionButtons';
import VisualSimilarProducts from '@/components/product/VisualSimilarProducts';
import ProductSpecificationsDetails from '@/components/product/ProductSpecificationsDetails';
import AccordionItem from '@/components/ui/AccordionItem';

interface ProductDetailModernProps {
  product: ShopifyProduct;
}

const ProductDetailModern: React.FC<ProductDetailModernProps> = ({ product }) => {
  const images = product.images.edges.map((e) => e.node);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'calculate' | 'order'>('calculate');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const colors = getProductColors(product);

  // Set the first color as selected by default if colors exist
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Constants
  const minPrice = product.priceRange.minVariantPrice;
  const packSize = 1.92; // m² per pack
  const pricePerM2 = parseFloat(minPrice.amount);

  // Custom hooks
  const { calculationState, orderState, calculations, updateCalculationState, updateOrderState } =
    useCalculator(packSize, pricePerM2);

  const {
    handleAddToCartWithQuantity,
    handleOrderSample,
    isInCart,
    isAddingToCart,
    isOrderingSample,
  } = useProductCart(product);

  const { accordionState, toggleAccordion } = useAccordion();

  // Get appropriate quantity based on active tab
  const getQuantityForCart = () => {
    return activeTab === 'calculate' ? calculations.packsNeeded : orderState.quantity;
  };

  // Handle color selection
  const handleColorSelect = (index: number) => {
    if (colors[index]) {
      setSelectedColor(colors[index]);
      // Update the active image index to match the color if possible
      setActiveIndex(index % images.length);
    }
  };

  return (
    <div className='w-full px-4 py-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        {/* Left: Gallery */}
        <ProductGallery
          images={images}
          activeIndex={activeIndex}
          onImageSelect={setActiveIndex}
          productTitle={product.title}
        />

        {/* Right: Details */}
        <div className='flex flex-col justify-between space-y-2'>
          {/* Breadcrumb */}
          <div className='text-sm text-gray-500'>
            <span>Home</span> <span>/</span> <span>Shop</span> <span>/</span>{' '}
            <span className='text-gray-700'>{product.title}</span>
          </div>

          {/* Rating */}
          <ProductRating />

          {/* Title */}
          <h1 className='text-3xl font-bold text-[#1e3a8a]'>{product.title}</h1>

          {/* Specifications (use raw dimensions data from API) */}
          <ProductSpecifications
            metafields={product.metafields}
            specifications={product.dimensions}
          />

          {/* Traditional Color Selector - only show if colors exist */}
          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              activeIndex={colors.indexOf(selectedColor)}
              onColorSelect={handleColorSelect}
              images={images}
            />
          )}

          {/* Price */}
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-bold text-gray-900'>
                Total Price: £
                {selectedColor
                  ? (
                      parseFloat(product.priceRange.minVariantPrice.amount) +
                      parseFloat(getPriceForColor(product, selectedColor))
                    ).toFixed(2)
                  : product.priceRange.minVariantPrice.amount}{' '}
                <span className='text-sm font-normal'>per m²</span>
              </span>
              <div className='flex items-center gap-2'>
                <span className='text-red-600 font-medium'>Was:£34.99</span>
                <span className='bg-red-600 text-white text-xs px-2 py-1 rounded-full'>-34%</span>
              </div>
            </div>
            <p className='text-sm text-gray-600'>£44.14 per pack</p>
          </div>

          {/* Calculate and Order Section - Tabbed Interface */}
          <div className='space-y-0'>
            {/* Tab Navigation */}
            <div className='flex gap-2 mb-0'>
              <button
                onClick={() => setActiveTab('calculate')}
                className={`flex-1 py-3 px-6 text-center font-medium rounded-t-lg transition-colors ${
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
                className={`flex-1 py-3 px-6 text-center font-medium rounded-t-lg transition-colors ${
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
          <ActionButtons
            onAddToCart={handleAddToCartWithQuantity}
            handleOrderSample={handleOrderSample}
            isInCart={isInCart}
            isAddingToCart={isAddingToCart}
            isOrderingSample={isOrderingSample}
            quantity={getQuantityForCart()}
          />

          {/* Visual Products Section */}
          <VisualSimilarProducts currentProduct={product} />
        </div>
      </div>

      {/* Lower Section - Product Info & Services */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12'>
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

          {/* Accordions */}
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
                <button className='p-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors'>
                  Monday, Dec 16
                </button>
                <button className='p-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors'>
                  Tuesday, Dec 17
                </button>
                <button className='p-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors'>
                  Wednesday, Dec 18
                </button>
                <button className='p-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors'>
                  Thursday, Dec 19
                </button>
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
    </div>
  );
};

export default ProductDetailModern;
