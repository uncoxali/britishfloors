import React from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Contact Us</h1>
          <p className='text-gray-600'>
            Get in touch with our team for any questions about our flooring products and services.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div className='bg-white p-8 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Send us a Message</h2>
            <form className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Your first name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Your last name'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address
                </label>
                <input
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='your.email@example.com'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                <input
                  type='tel'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Your phone number'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Subject</label>
                <select className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option>General Inquiry</option>
                  <option>Product Information</option>
                  <option>Installation Services</option>
                  <option>Order Support</option>
                  <option>Technical Support</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Message</label>
                <textarea
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Tell us how we can help you...'
                />
              </div>

              <Button type='submit' className='w-full'>
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            <div className='bg-white p-8 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Get in Touch</h2>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <svg
                    className='h-6 w-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-medium text-gray-900'>Address</h3>
                    <p className='text-gray-600 text-sm'>
                      123 Flooring Street
                      <br />
                      London, UK SW1A 1AA
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <svg
                    className='h-6 w-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-medium text-gray-900'>Phone</h3>
                    <p className='text-gray-600 text-sm'>
                      +44 (0) 20 1234 5678
                      <br />
                      Mon-Fri: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <svg
                    className='h-6 w-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-medium text-gray-900'>Email</h3>
                    <p className='text-gray-600 text-sm'>
                      info@britishfloors.com
                      <br />
                      support@britishfloors.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white p-8 rounded-lg shadow-sm border'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Business Hours</h2>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Monday - Friday</span>
                  <span className='font-medium'>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Saturday</span>
                  <span className='font-medium'>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Sunday</span>
                  <span className='font-medium'>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
