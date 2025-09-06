'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What types of flooring do you offer?',
    answer:
      'We offer a wide range of flooring options including hardwood, laminate, vinyl, carpet, and tile. Each type comes in various styles, colors, and finishes to suit your needs.',
    category: 'Products',
  },
  {
    question: 'How do I measure my room for flooring?',
    answer:
      'To measure your room, multiply the length by the width to get the square footage. Add 10% extra for waste and cutting. For irregular rooms, break them into rectangles and add the areas together.',
    category: 'Installation',
  },
  {
    question: 'Do you offer installation services?',
    answer:
      'Yes, we offer professional installation services for all our flooring products. Our certified installers ensure proper installation and can handle both residential and commercial projects.',
    category: 'Services',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for unused products in their original packaging. Custom orders and installed products are not eligible for returns. Please contact our customer service for assistance.',
    category: 'Returns',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days for in-stock items. Custom orders may take 2-4 weeks. We also offer expedited shipping options for urgent orders.',
    category: 'Shipping',
  },
  {
    question: 'Do you provide samples?',
    answer:
      'Yes, we offer sample swatches for most flooring products. Samples are available for a small fee that can be applied to your final purchase. Contact us to request samples.',
    category: 'Products',
  },
  {
    question: 'What warranty do you offer?',
    answer:
      'Our products come with manufacturer warranties ranging from 10-25 years depending on the product type. We also offer extended warranty options for additional protection.',
    category: 'Warranty',
  },
  {
    question: 'Can I install flooring myself?',
    answer:
      'While some flooring types like laminate and vinyl can be DIY-friendly, we recommend professional installation for best results. Our team can provide guidance and tools for DIY projects.',
    category: 'Installation',
  },
  {
    question: 'How do I care for my new flooring?',
    answer:
      'Care instructions vary by flooring type. Generally, sweep regularly, use appropriate cleaners, avoid excessive moisture, and protect from furniture scratches. We provide detailed care guides with each purchase.',
    category: 'Care',
  },
  {
    question: 'Do you offer financing options?',
    answer:
      'Yes, we offer flexible financing options including 0% interest plans and monthly payment options. Contact our sales team to discuss available financing programs.',
    category: 'Payment',
  },
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = ['All', ...Array.from(new Set(faqData.map((item) => item.category)))];

  const filteredFAQs =
    activeCategory === 'All' ? faqData : faqData.filter((item) => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <Layout>
      {/* Modern Hero Section */}
      <section className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]'></div>
        </div>

        {/* Floating Elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl'></div>

        <div className='relative w-full px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center'>
            {/* Badge */}
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6'>
              <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
              Help & Support
            </div>

            {/* Main Heading */}
            <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              Frequently Asked{' '}
              <span className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                Questions
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Find answers to common questions about our flooring products, installation services,
              and customer support. Can&apos;t find what you&apos;re looking for? Contact our team.
            </p>

            {/* Stats */}
            <div className='flex justify-center items-center space-x-8 text-white/80'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-amber-400'>10+</div>
                <div className='text-sm'>Categories</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-400'>24/7</div>
                <div className='text-sm'>Support</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-400'>15min</div>
                <div className='text-sm'>Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-3 mb-12'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {filteredFAQs.map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'
            >
              <button
                onClick={() => toggleItem(index)}
                className='w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-300 group'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>{index + 1}</span>
                  </div>
                  <span className='font-semibold text-gray-900 group-hover:text-amber-600 transition-colors'>
                    {item.question}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                    {item.category}
                  </span>
                  <svg
                    className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </button>
              {openItems.includes(index) && (
                <div className='px-8 pb-6 border-t border-gray-100'>
                  <div className='pt-6'>
                    <p className='text-gray-600 leading-relaxed'>{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className='mt-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Still Have Questions?</h2>
            <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
              Can&apos;t find what you&apos;re looking for? Our customer service team is here to help you find
              the perfect flooring solution for your space.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/contact'
                className='inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                Contact Us
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </a>
              <a
                href='tel:+442012345678'
                className='inline-flex items-center justify-center px-8 py-4 border-2 border-amber-500 text-amber-600 font-semibold rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-300'
              >
                Call Us: +44 (0) 20 1234 5678
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
