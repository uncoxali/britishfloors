import React from 'react';
import Layout from '@/components/layout/Layout';

const ShippingPage: React.FC = () => {
  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Shipping & Delivery</h1>
          <p className='text-gray-600'>
            Learn about our shipping options, delivery times, and policies.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Shipping Options */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Shipping Options</h2>
              <div className='space-y-4'>
                <div className='border-l-4 border-blue-500 pl-4'>
                  <h3 className='font-medium text-gray-900'>Standard Shipping</h3>
                  <p className='text-gray-600 text-sm mt-1'>3-5 business days</p>
                  <p className='text-gray-600 text-sm'>Free on orders over £100</p>
                </div>
                <div className='border-l-4 border-green-500 pl-4'>
                  <h3 className='font-medium text-gray-900'>Express Shipping</h3>
                  <p className='text-gray-600 text-sm mt-1'>1-2 business days</p>
                  <p className='text-gray-600 text-sm'>£15.99 additional fee</p>
                </div>
                <div className='border-l-4 border-purple-500 pl-4'>
                  <h3 className='font-medium text-gray-900'>Next Day Delivery</h3>
                  <p className='text-gray-600 text-sm mt-1'>Order by 2 PM for next day</p>
                  <p className='text-gray-600 text-sm'>£25.99 additional fee</p>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Delivery Areas</h2>
              <div className='space-y-3'>
                <div className='flex items-center space-x-2'>
                  <svg className='h-5 w-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-sm text-gray-700'>
                    Free delivery within 50 miles of London
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='h-5 w-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-sm text-gray-700'>Delivery available across the UK</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg className='h-5 w-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-sm text-gray-700'>
                    Remote areas may incur additional charges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>What to Expect</h2>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-medium text-sm'>1</span>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>Order Confirmation</h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      You&apos;ll receive an email confirmation with tracking information.
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-medium text-sm'>2</span>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>Processing</h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      We&apos;ll prepare your order and arrange delivery within 24 hours.
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-medium text-sm'>3</span>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>Delivery</h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      Our team will contact you to schedule a convenient delivery time.
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-medium text-sm'>4</span>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>Installation</h3>
                    <p className='text-gray-600 text-sm mt-1'>
                      If you&apos;ve opted for installation, our team will complete the work.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Important Notes</h2>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li className='flex items-start space-x-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>Please ensure someone is available to receive the delivery</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>Large orders may require a delivery appointment</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>Inspect all items upon delivery before signing</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>Contact us immediately if there are any issues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking Section */}
        <div className='mt-12 bg-gray-50 p-8 rounded-lg'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Track Your Order</h2>
            <p className='text-gray-600 mb-6'>
              Enter your order number to track your delivery status.
            </p>
            <div className='max-w-md mx-auto'>
              <div className='flex space-x-2'>
                <input
                  type='text'
                  placeholder='Enter order number'
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
                  Track
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPage;
