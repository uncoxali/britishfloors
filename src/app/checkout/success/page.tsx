'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';

const CheckoutSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    // Clear the cart after successful checkout
    clearCart();
    setIsLoading(false);
  }, [searchParams, clearCart]);

  if (isLoading) {
    return (
      <Layout>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Processing your order...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='text-center'>
          {/* Success Icon */}
          <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6'>
            <svg
              className='h-8 w-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Thank You for Your Order!</h1>
          <p className='text-lg text-gray-600 mb-8'>
            Your order has been successfully placed and is being processed.
          </p>

          {/* Order Details */}
          <div className='bg-white p-6 rounded-lg shadow-sm border mb-8'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Order Details</h2>
            <div className='space-y-3 text-left'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Order ID:</span>
                <span className='font-medium text-gray-900'>
                  {orderId || 'BRF-' + Date.now().toString().slice(-8)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Order Date:</span>
                <span className='font-medium text-gray-900'>
                  {new Date().toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Status:</span>
                <span className='font-medium text-green-600'>Confirmed</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className='bg-blue-50 p-6 rounded-lg mb-8'>
            <h3 className='text-lg font-semibold text-blue-900 mb-4'>What Happens Next?</h3>
            <div className='space-y-3 text-left'>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                  1
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-900'>Order Confirmation</p>
                  <p className='text-sm text-blue-700'>
                    You&apos;ll receive an email confirmation with your order details.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                  2
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-900'>Processing</p>
                  <p className='text-sm text-blue-700'>
                    We&apos;ll prepare your order and arrange delivery within 24 hours.
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                  3
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-900'>Delivery</p>
                  <p className='text-sm text-blue-700'>
                    Our team will contact you to schedule a convenient delivery time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/account'>
                <Button variant='primary' size='lg'>
                  View Order History
                </Button>
              </Link>
              <Link href='/'>
                <Button variant='outline' size='lg'>
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className='text-sm text-gray-500'>
              <p>
                Questions about your order?{' '}
                <Link href='/contact' className='text-blue-600 hover:text-blue-700 font-medium'>
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CheckoutSuccessPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading...</p>
            </div>
          </div>
        </Layout>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;
