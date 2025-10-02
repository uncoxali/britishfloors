'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SpecialOfferProductCard from '@/components/product/SpecialOfferProductCard';
import { ShopifyProduct } from '@/lib/types/shopify';
import Image from 'next/image';

interface SpecialOffersSliderProps {
  products: ShopifyProduct[];
}

const SpecialOffersSlider: React.FC<SpecialOffersSliderProps> = ({ products }) => {
  return (
    <div className='w-full'>
      {/* Special Offers Title */}
      <div className='text-center mb-6 md:hidden'>
        <h2 className='text-2xl lg:text-3xl font-bold text-blue-900 '>Special Offers</h2>
      </div>

      {/* Special Offers Card */}
      <div className='bg-[#1A4685] md:rounded-2xl p-3 relative overflow-hidden'>
        <div className='relative z-10'>
          <div className='flex flex-col lg:flex-row items-center gap-4'>
            {/* Special Offers Image */}
            <div className='lg:w-[10%] 2xl:w-[30%] items-center justify-center h-full md:block hidden'>
              <Image
                src='/images/product-pers.png'
                alt='Special Offers'
                width={400}
                height={300}
                className='w-auto h-auto max-w-full'
                priority={false}
                loading='lazy'
              />
            </div>

            {/* Products Slider for Mobile/Tablet, Grid for Desktop */}
            <div className='lg:w-4/4 w-full'>
              {/* Mobile/Tablet Slider */}
              <div className='lg:hidden'>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  centeredSlides={false}
                  loop={true}
                  pagination={{
                    clickable: true,
                  }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  className='special-offers-swiper'
                >
                  {products.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className='px-2 w-full'>
                        <SpecialOfferProductCard
                          product={product}
                          showOrderSample={true}
                          redirectToProducts={false}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop Grid */}
              <div className='hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {products.map((product) => (
                  <SpecialOfferProductCard
                    key={product.id}
                    product={product}
                    showOrderSample={true}
                    redirectToProducts={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
          <div className='w-full h-full bg-gradient-to-br from-white to-transparent rounded-full'></div>
        </div>

        <style jsx global>{`
          .special-offers-swiper .swiper-pagination {
            position: static;
            margin-top: 20px;
          }
          .special-offers-swiper .swiper-pagination-bullet {
            background-color: #ffffff;
            opacity: 0.5;
            width: 10px;
            height: 10px;
          }
          .special-offers-swiper .swiper-pagination-bullet-active {
            background-color: #ffffff;
            opacity: 1;
          }
          .special-offers-swiper .swiper-slide {
            height: auto;
            width: 100%;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SpecialOffersSlider;
