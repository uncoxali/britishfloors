import React from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const ContactPage: React.FC = () => {
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

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center'>
            {/* Badge */}
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6'>
              <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
              Get in Touch
            </div>

            {/* Main Heading */}
            <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              Let's{' '}
              <span className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                Connect
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Have questions about our flooring products or need expert advice? Our team is here to
              help you find the perfect flooring solution for your space.
            </p>

            {/* Stats */}
            <div className='flex justify-center items-center space-x-8 text-white/80'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-amber-400'>24/7</div>
                <div className='text-sm'>Support</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-400'>15min</div>
                <div className='text-sm'>Response Time</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-400'>98%</div>
                <div className='text-sm'>Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Send us a Message</h2>
              <p className='text-gray-600'>We'll get back to you within 15 minutes</p>
            </div>

            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'
                    placeholder='Your first name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'
                    placeholder='Your last name'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'
                  placeholder='your.email@example.com'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'
                  placeholder='Your phone number'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Subject</label>
                <select className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'>
                  <option>General Inquiry</option>
                  <option>Product Information</option>
                  <option>Installation Services</option>
                  <option>Order Support</option>
                  <option>Technical Support</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Message</label>
                <textarea
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300'
                  placeholder='Tell us how we can help you...'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                Send Message
                <svg
                  className='inline-block w-5 h-5 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Get in Touch</h2>
              <div className='space-y-6'>
                <div className='flex items-start space-x-4 group'>
                  <div className='w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <svg
                      className='h-6 w-6 text-white'
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
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Address</h3>
                    <p className='text-gray-600'>
                      123 Flooring Street
                      <br />
                      London, UK SW1A 1AA
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4 group'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <svg
                      className='h-6 w-6 text-white'
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
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Phone</h3>
                    <p className='text-gray-600'>
                      +44 (0) 20 1234 5678
                      <br />
                      Mon-Fri: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4 group'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <svg
                      className='h-6 w-6 text-white'
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
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                    <p className='text-gray-600'>
                      info@britishfloors.com
                      <br />
                      support@britishfloors.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Business Hours</h2>
              <div className='space-y-4'>
                <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>Monday - Friday</span>
                  <span className='font-semibold text-gray-900'>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>Saturday</span>
                  <span className='font-semibold text-gray-900'>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between items-center py-3'>
                  <span className='text-gray-600 font-medium'>Sunday</span>
                  <span className='font-semibold text-gray-900'>Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Need Immediate Help?</h3>
              <p className='text-gray-600 mb-6'>
                Our customer support team is available 24/7 to assist you with any questions.
              </p>
              <div className='flex flex-col sm:flex-row gap-3'>
                <button className='flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300'>
                  Live Chat
                </button>
                <button className='flex-1 border-2 border-amber-500 text-amber-600 font-semibold py-3 px-6 rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-300'>
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
