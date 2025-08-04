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
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Frequently Asked Questions</h1>
          <p className='text-gray-600'>
            Find answers to common questions about our flooring products and services.
          </p>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {filteredFAQs.map((item, index) => (
            <div key={index} className='bg-white rounded-lg shadow-sm border'>
              <button
                onClick={() => toggleItem(index)}
                className='w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors'
              >
                <span className='font-medium text-gray-900'>{item.question}</span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
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
              </button>
              {openItems.includes(index) && (
                <div className='px-6 pb-4'>
                  <p className='text-gray-600'>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className='mt-12 text-center bg-gray-50 p-8 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Still Have Questions?</h2>
          <p className='text-gray-600 mb-6'>
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/contact'
              className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors'
            >
              Contact Us
            </a>
            <a
              href='tel:+442012345678'
              className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors'
            >
              Call Us: +44 (0) 20 1234 5678
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
