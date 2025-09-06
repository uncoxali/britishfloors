'use client';

import React from 'react';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/types/shopify';
import { formatPrice } from '@/lib/utils/format';

// Custom slider styles
const sliderStyles = `
  .slider {
    -webkit-appearance: none;
    appearance: none;
    background: #fde68a;
    outline: none;
    border-radius: 9999px;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    border: 2px solid white;
  }
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #92400e;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

interface ProductDetailModernProps {
  product: ShopifyProduct;
}

const ProductDetailModern: React.FC<ProductDetailModernProps> = ({ product }) => {
  const images = product.images.edges.map((e) => e.node);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<'calculate' | 'order'>('calculate');
  const [calcMethod, setCalcMethod] = React.useState<'area' | 'dims'>('area');
  const [area, setArea] = React.useState<string>('');
  const [width, setWidth] = React.useState<string>('');
  const [length, setLength] = React.useState<string>('');
  const [unit, setUnit] = React.useState<'m2' | 'ft2'>('m2');
  const [wastagePercent, setWastagePercent] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1);
  const [deliveryAccordionOpen, setDeliveryAccordionOpen] = React.useState<boolean>(false);
  const [klarnaAccordionOpen, setKlarnaAccordionOpen] = React.useState<boolean>(true);
  const [returnsAccordionOpen, setReturnsAccordionOpen] = React.useState<boolean>(false);

  const minPrice = product.priceRange.minVariantPrice;
  const packSize = 1.92; // m² per pack
  const pricePerM2 = parseFloat(minPrice.amount);

  // Calculate total area
  const areaFromArea = Number(area) || 0;
  const areaFromDims = (() => {
    const w = Number(width) || 0;
    const l = Number(length) || 0;
    return w * l;
  })();
  const baseArea = calcMethod === 'area' ? areaFromArea : areaFromDims;
  const areaInM2 = unit === 'm2' ? baseArea : baseArea * 0.092903; // Convert ft² to m²
  const areaWithWastage = areaInM2 * (1 + wastagePercent / 100);
  const packsNeeded = Math.ceil(areaWithWastage / packSize);
  const totalAreaCovered = packsNeeded * packSize;
  const totalPriceCalculate = totalAreaCovered * pricePerM2;

  // Order packets calculation
  const totalPriceOrder = quantity * packSize * pricePerM2;

  return (
    <div className='w-full px-4 py-6'>
      <style jsx>{sliderStyles}</style>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        {/* Left: Gallery */}
        <div>
          <div className='relative rounded-lg overflow-hidden bg-gray-50'>
            <div className='aspect-[3/4] w-full'>
              {images[activeIndex] ? (
                <Image
                  src={images[activeIndex].url}
                  alt={images[activeIndex].altText || product.title}
                  width={1200}
                  height={1600}
                  className='h-full w-full object-cover'
                  priority
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center text-gray-400'>
                  No image
                </div>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className='mt-4 flex items-center gap-2 overflow-x-auto pb-2'>
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-16 w-20 rounded-lg overflow-hidden border-2 ${
                    activeIndex === idx ? 'border-blue-600' : 'border-gray-200'
                  } flex-shrink-0`}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    className='object-cover'
                  />
                </button>
              ))}
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className='flex flex-col justify-between space-y-2'>
          {/* Breadcrumb */}
          <div className='text-sm text-gray-500'>
            <span>Home</span> <span>/</span> <span>Shop</span> <span>/</span> <span className='text-gray-700'>{product.title}</span>
          </div>

          {/* Rating */}
          <div className='flex items-center gap-2'>
            <div className='flex text-amber-400'>
              {[1, 2, 3, 4].map((star) => (
                <svg key={star} className='w-5 h-5 fill-current' viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
              <svg className='w-5 h-5 text-gray-300' viewBox='0 0 20 20'>
                <path fill='currentColor' d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            </div>
            <span className='text-gray-600'>4.0</span>
          </div>

          {/* Title */}
          <h1 className='text-3xl font-bold text-[#1e3a8a]'>{product.title}</h1>

          {/* Specifications */}
          <div className='grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-200'>
            <div className='text-center'>
              <div className='text-xs text-gray-500'>W:</div>
              <div className='font-medium'>100mm</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500'>T:</div>
              <div className='font-medium'>12mm</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500'>L:</div>
              <div className='font-medium'>600mm</div>
            </div>
            <div className='text-center'>
              <div className='text-xs text-gray-500'>Pack Size:</div>
              <div className='font-medium'>1.92m²</div>
            </div>
          </div>

          {/* Colours */}
          <div>
            <p className='text-sm font-medium text-gray-700 mb-3'>Colours:</p>
            <div className='flex items-center gap-2 flex-wrap'>
              {product.options?.find(option => option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour'))?.values?.map((colorValue, idx) => {
                // Default color mapping for common flooring color names
                const getColorFromName = (name: string) => {
                  const colorName = name.toLowerCase();
                  if (colorName.includes('oak') || colorName.includes('natural')) return '#8B6F47';
                  if (colorName.includes('light') || colorName.includes('blonde')) return '#A0845C';
                  if (colorName.includes('dark') || colorName.includes('charcoal') || colorName.includes('black')) return '#2C2C2C';
                  if (colorName.includes('grey') || colorName.includes('gray')) return '#9E9E9E';
                  if (colorName.includes('walnut') || colorName.includes('brown')) return '#8B4513';
                  if (colorName.includes('beige') || colorName.includes('cream')) return '#F5F5DC';
                  if (colorName.includes('ebony')) return '#404040';
                  if (colorName.includes('honey') || colorName.includes('golden')) return '#DEB887';
                  if (colorName.includes('white') || colorName.includes('ivory')) return '#FFFEF7';
                  if (colorName.includes('cherry') || colorName.includes('mahogany')) return '#A0522D';
                  // Default fallback color
                  return '#8B6F47';
                };
                
                return (
                  <button
                    key={`color-${idx}`}
                    onClick={() => setActiveIndex(idx % images.length)}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      activeIndex === idx % images.length ? 'border-[#1e3a8a]' : 'border-gray-300'
                    } transition-all duration-200 hover:scale-105 shadow-sm`}
                    style={{ backgroundColor: getColorFromName(colorValue) }}
                    title={colorValue}
                    aria-label={`Select ${colorValue} colour`}
                  >
                  </button>
                );
              }) || (
                // Fallback to images if no color options available
                images.slice(0, 8).map((img, idx) => (
                  <button
                    key={`img-color-${img.id}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border-2 ${
                      activeIndex === idx ? 'border-[#1e3a8a]' : 'border-gray-300'
                    } transition-all duration-200 hover:scale-105 shadow-sm`}
                    title={`Color option ${idx + 1}`}
                    aria-label={`Select color option ${idx + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || product.title}
                      width={32}
                      height={32}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Price */}
          <div className=''>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-bold text-gray-900'>
                Total Price: £22.99 <span className='text-sm font-normal'>per m²</span>
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
                style={activeTab === 'calculate' ? {backgroundColor: '#EFE2CC'} : {}}
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
                style={activeTab === 'order' ? {backgroundColor: '#EFE2CC'} : {}}
              >
                Order packets
              </button>
            </div>

            {/* Tab Content - Connected to tabs */}
            {activeTab === 'calculate' && (
              <div className='grid grid-cols-2 rounded-b-lg overflow-hidden' style={{backgroundColor: '#EFE2CC'}}>
                {/* Left side - Calculate flooring */}
                <div className='p-4'>
                  {/* Area/Dimensions Selection */}
                  <div className='flex items-center gap-4 mb-4'>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='calcMethod'
                        checked={calcMethod === 'area'}
                        onChange={() => setCalcMethod('area')}
                        className='w-4 h-4 text-amber-600'
                      />
                      <span className='text-sm text-amber-800'>Total area</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='calcMethod'
                        checked={calcMethod === 'dims'}
                        onChange={() => setCalcMethod('dims')}
                        className='w-4 h-4 text-amber-600'
                      />
                      <span className='text-sm text-amber-800'>Width & Length</span>
                    </label>
                  </div>

                  {/* Unit Selection */}
                  <div className='mb-4'>
                    <span className='text-sm text-amber-800 block mb-2'>Unit:</span>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => setUnit('m2')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          unit === 'm2'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-amber-400 text-amber-800 hover:bg-amber-50'
                        }`}
                      >
                        Metre
                      </button>
                      <button
                        onClick={() => setUnit('ft2')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          unit === 'ft2'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-amber-400 text-amber-800 hover:bg-amber-50'
                        }`}
                      >
                        Feet
                      </button>
                    </div>
                  </div>

                  {/* Input Field */}
                  {calcMethod === 'area' && (
                    <div className='mb-3'>
                      <div className='relative'>
                        <input
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder='total area required'
                          className='w-full border border-amber-300 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
                        />
                        <span className='absolute right-3 top-2 text-amber-700 text-sm font-medium'>m²</span>
                      </div>
                    </div>
                  )}

                  {calcMethod === 'dims' && (
                    <div className='grid grid-cols-2 gap-2 mb-3'>
                      <input
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder='Width (m)'
                        className='border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
                      />
                      <input
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder='Length (m)'
                        className='border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
                      />
                    </div>
                  )}

                  {/* Measuring Guide */}
                  <div className='mb-3'>
                    <button className='text-sm text-amber-700 underline hover:text-amber-800 italic'>
                      Measuring Guide
                    </button>
                  </div>

                  {/* Wastage Slider */}
                  <div className='mb-3'>
                    <label className='block text-sm text-amber-800 mb-2'>Wastage: {wastagePercent}%</label>
                    <div className='relative'>
                      <input
                        type='range'
                        min='0'
                        max='15'
                        step='1'
                        value={wastagePercent}
                        onChange={(e) => setWastagePercent(parseInt(e.target.value))}
                        className='w-full h-1 bg-amber-200 rounded-full appearance-none cursor-pointer slider'
                      />
                      <div className='flex justify-between text-xs text-amber-700 mt-2'>
                        <span>0%</span>
                        <span>5%</span>
                        <span>10%</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Total */}
                <div className='p-4 border-l border-amber-300'>
                  <div className='space-y-2'>
                    <p className='font-medium text-amber-800 text-lg'>Total:</p>
                    <p className='text-2xl font-bold text-amber-900'>£{totalPriceCalculate.toFixed(2)}</p>
                    <div className='text-sm text-amber-700 space-y-1'>
                      <div>Total (m²): {areaWithWastage.toFixed(2)}</div>
                      <div>Total Packs: {packsNeeded}</div>
                      <div>(Each pack contains {packSize}m²)</div>
                      {wastagePercent > 0 && <div>Wastage: {wastagePercent}%</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'order' && (
              <div className='grid grid-cols-2 rounded-b-lg overflow-hidden' style={{backgroundColor: '#EFE2CC'}}>
                {/* Left side - Quantity selector */}
                <div className='p-4'>
                  <div className='space-y-4'>
                    <div>
                      <p className='text-sm font-medium text-amber-700 mb-3'>Quantity of packs:</p>
                      <div className='flex items-center w-fit border border-gray-300 rounded-lg overflow-hidden bg-white'>
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className='px-4 py-2 hover:bg-gray-50 text-gray-600 border-r border-gray-300'
                        >
                          -
                        </button>
                        <input
                          type='number'
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className='w-16 text-center py-2 border-0 focus:outline-none bg-transparent font-medium'
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className='px-4 py-2 hover:bg-gray-50 text-gray-600 border-l border-gray-300'
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Total */}
                <div className='p-4 border-l border-amber-300'>
                  <div className='space-y-2'>
                    <p className='font-medium text-amber-800 text-lg'>Total:</p>
                    <p className='text-2xl font-bold text-amber-900'>£{totalPriceOrder.toFixed(2)}</p>
                    <div className='text-sm text-amber-700 space-y-1'>
                      <div>Total (m²): {(quantity * packSize).toFixed(2)}</div>
                      <div>Total Packs: {quantity}</div>
                      <div>(Each pack contains {packSize}m²)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='mt-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <button className='flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
                </svg>
                Add to basket
              </button>
              <button className='flex items-center justify-center gap-2 border border-amber-600 text-amber-600 hover:bg-amber-50 font-medium py-3 px-4 rounded-lg transition-colors'>
                Order sample
              </button>
            </div>
          </div>

          {/* Visual Products Section */}
          <div className='bg-white border-2 border-gray-300 rounded-2xl p-3 mt-6'>
            <div className='flex items-center justify-between gap-4'>
              {/* Left side - Text and button (vertical) */}
              <div className='flex flex-col gap-2'>
                <span className='text-sm text-gray-700'>View visual similar products</span>
                <button className='flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm py-2 px-3 rounded-full transition-colors w-fit'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 616 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  Explore now
                </button>
              </div>
              
              {/* Right side - Product thumbnails */}
              <div className='flex items-center gap-2'>
                {images.slice(0, 5).map((img, idx) => (
                  <div key={`visual-${img.id}`} className='w-12 h-12 rounded-lg overflow-hidden border border-gray-200'>
                    <Image
                      src={img.url}
                      alt={img.altText || product.title}
                      width={48}
                      height={48}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lower Section - Product Info & Services */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12'>
        {/* Left - Product Specifications */}
        <div className='bg-white border-2 border-amber-300 rounded-2xl p-6'>
          <h3 className='text-lg font-semibold text-amber-700 mb-4'>Product Specifications</h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Product Code</span>
              <span className='font-medium'>FHL013</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Durability Grade</span>
              <span className='font-medium'>AC4</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Finish</span>
              <span className='font-medium'>Textured & Embossed</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Style</span>
              <span className='font-medium'>Parquet & Herringbon</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Edging</span>
              <span className='font-medium'>Bevelled 4V</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Thickness</span>
              <span className='font-medium'>12mm</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Dimensions</span>
              <span className='font-medium'>(L) 600 x (W) 100mm</span>
            </div>
            <div className='flex justify-between items-center py-2'>
              <span className='text-gray-600'>Pack Size</span>
              <span className='font-medium'>1.92 m2</span>
            </div>
          </div>
        </div>
        
        {/* Right - Services */}
        <div className='space-y-4'>
          {/* Delivery Banner */}
          <div className='bg-red-600 text-white rounded-xl p-4 text-center'>
            <p className='font-semibold'>FREE IN-HOME DELIVERY <span className='italic'>On Orders Over £499</span></p>
          </div>
          
          {/* Delivery Date */}
          <div className='bg-white border-2 border-gray-300 rounded-xl overflow-hidden'>
            <button 
              onClick={() => setDeliveryAccordionOpen(!deliveryAccordionOpen)}
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                deliveryAccordionOpen 
                  ? 'bg-blue-900 text-white hover:bg-blue-800' 
                  : 'bg-white text-blue-900 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  deliveryAccordionOpen 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    deliveryAccordionOpen ? 'text-white' : 'text-blue-600'
                  }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
                <span className='font-medium'>Choose Your Delivery Date</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${
                  deliveryAccordionOpen ? 'rotate-180 text-white' : 'text-gray-400'
                }`} 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
            {deliveryAccordionOpen && (
              <div className='px-4 pb-4 border-t border-gray-200'>
                <div className='pt-4 space-y-3'>
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
              </div>
            )}
          </div>
          
          {/* Klarna Payment */}
          <div className='bg-white border-2 border-gray-300 rounded-xl overflow-hidden'>
            <button 
              onClick={() => setKlarnaAccordionOpen(!klarnaAccordionOpen)}
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                klarnaAccordionOpen 
                  ? 'bg-blue-900 text-white hover:bg-blue-800' 
                  : 'bg-white text-blue-900 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  klarnaAccordionOpen 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    klarnaAccordionOpen ? 'text-white' : 'text-blue-600'
                  }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                  </svg>
                </div>
                <span className='font-medium'>Flexible Payment Plans With Klarna</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${
                  klarnaAccordionOpen ? 'rotate-180 text-white' : 'text-gray-400'
                }`} 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
            {klarnaAccordionOpen && (
              <div className='px-4 pb-4 border-t border-gray-200'>
                <div className='pt-4 text-sm text-gray-600 space-y-2'>
                  <p>With our flexible payment plans through Klarna, you can easily manage the cost of your new flooring.</p>
                  <p>Choose from options like splitting the total into interest-free instalments or delaying payment for up to 30 days.</p>
                  <p>Check out our Klarna page for more information and find the payment option that works best for you.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Returns */}
          <div className='bg-white border-2 border-gray-300 rounded-xl overflow-hidden'>
            <button 
              onClick={() => setReturnsAccordionOpen(!returnsAccordionOpen)}
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                returnsAccordionOpen 
                  ? 'bg-blue-900 text-white hover:bg-blue-800' 
                  : 'bg-white text-blue-900 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  returnsAccordionOpen 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    returnsAccordionOpen ? 'text-white' : 'text-blue-600'
                  }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
                  </svg>
                </div>
                <span className='font-medium'>30-Day Hassle Free Returns</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${
                  returnsAccordionOpen ? 'rotate-180 text-white' : 'text-gray-400'
                }`} 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
            {returnsAccordionOpen && (
              <div className='px-4 pb-4 border-t border-gray-200'>
                <div className='pt-4 space-y-3'>
                  <p className='text-sm text-gray-600'>Easy returns within 30 days of purchase:</p>
                  <ul className='text-sm text-gray-600 space-y-1'>
                    <li>• Free return collection service</li>
                    <li>• Full refund on unused items</li>
                    <li>• Original packaging required</li>
                    <li>• No restocking fees</li>
                  </ul>
                  <p className='text-xs text-gray-500'>Terms and conditions apply. See our returns policy for full details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// --- Lower section widgets (specs + accordions) ---
const AccordionItem: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div
      className={`border border-[#E8E0D2] rounded-xl overflow-hidden ${
        open ? 'bg-white' : 'bg-white'
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left ${
          open ? 'bg-[#1E4F8E] text-white' : 'bg-white text-[#1E4F8E]'
        }`}
      >
        <div className='flex items-center gap-3'>
          <span className='inline-flex items-center justify-center w-8 h-8 rounded-full border border-current'>
            {open ? '−' : '+'}
          </span>
          <span className='font-semibold'>{title}</span>
        </div>
        <span className='text-lg'>{open ? '▴' : '▾'}</span>
      </button>
      {open && <div className='p-4 bg-white'>{children}</div>}
    </div>
  );
};

export default ProductDetailModern;