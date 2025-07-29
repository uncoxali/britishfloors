'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ClientOnly from '@/components/ui/ClientOnly';
import CheckoutErrorBoundary from '@/components/checkout/CheckoutErrorBoundary';

import PaymentMethods from '@/components/checkout/PaymentMethods';
import OrderSummary from '@/components/checkout/OrderSummary';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, discountCode, discountAmount } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Calculate totals manually since calculateTotals doesn't return values
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const tax = subtotal * 0.2; // 20% VAT for UK
  const total = subtotal + tax - (discountAmount || 0);

  // Handle redirects in useEffect to avoid render-time navigation
  useEffect(() => {
    if (items.length === 0) {
      setIsRedirecting(true);
      router.push('/cart');
      return;
    }

    if (!isAuthenticated) {
      setIsRedirecting(true);
      router.push('/auth/login?redirect=/checkout');
      return;
    }
  }, [items.length, isAuthenticated, router]);

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <ClientOnly>
        <Layout>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
              <h3 className='mt-4 text-lg font-medium text-gray-900'>Redirecting...</h3>
              <p className='text-sm text-gray-500 mt-2'>
                {items.length === 0 ? 'Your cart is empty' : 'Please sign in to continue'}
              </p>
            </div>
          </div>
        </Layout>
      </ClientOnly>
    );
  }

  // Don't render checkout if conditions are not met
  if (items.length === 0 || !isAuthenticated) {
    return null;
  }

  const handleCheckout = async (formData: {
    email: string;
    shippingAddress: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    };
    billingAddress: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    };
  }) => {
    setIsProcessing(true);
    try {
      console.log('Submitting checkout with:', {
        itemsCount: items.length,
        customer: user?.email,
        paymentMethod: selectedPaymentMethod,
        discountCode,
        discountAmount,
      });

      // Create Shopify checkout session
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: user,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          paymentMethod: selectedPaymentMethod,
          discountCode,
          discountAmount,
        }),
      });

      const responseData = await response.json();
      console.log('Checkout API response:', responseData);

      if (response.ok) {
        const { checkoutUrl, isMock } = responseData;

        if (isMock) {
          // For development/mock mode, show success message
          alert('Development mode: Checkout simulation successful! Redirecting to success page...');
        }

        // Redirect to checkout URL (either Shopify or success page)
        window.location.href = checkoutUrl;
      } else {
        // Handle specific error messages
        const errorMessage = responseData.error || 'Failed to create checkout session';
        console.error('Checkout API error:', errorMessage);
        alert(`Checkout Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`There was an error processing your checkout: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CheckoutErrorBoundary>
      <ClientOnly
        fallback={
          <Layout>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                <h3 className='mt-4 text-lg font-medium text-gray-900'>Loading checkout...</h3>
              </div>
            </div>
          </Layout>
        }
      >
        <Layout>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
              <p className='text-gray-600 mt-2'>
                Complete your purchase for premium flooring solutions.
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Checkout Form */}
              <div className='space-y-8'>
                <CheckoutForm user={user} onSubmit={handleCheckout} isProcessing={isProcessing} />

                <PaymentMethods
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                />
              </div>

              {/* Order Summary */}
              <div className='lg:pl-8'>
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  discountCode={discountCode}
                  discountAmount={discountAmount}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-blue-900'>Secure Checkout</h3>
                  <p className='text-sm text-blue-700 mt-1'>
                    Your payment information is encrypted and secure. We use industry-standard SSL
                    encryption to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ClientOnly>
    </CheckoutErrorBoundary>
  );
};

export default CheckoutPage;
