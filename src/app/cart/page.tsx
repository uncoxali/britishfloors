'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import DiscountCode from '@/components/ui/DiscountCode';
import Image from 'next/image';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    removeItem,
    updateQuantity,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    validateCart,
    clearCart,
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Check for success message from checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const orderIdParam = searchParams.get('orderId');

    if (success === 'true' && orderIdParam) {
      setShowSuccess(true);
      setOrderId(orderIdParam);
      // Clear cart after successful checkout
      clearCart();
    }
  }, [searchParams, clearCart]);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const tax = subtotal * 0.2; // 20% VAT for UK
  const total = subtotal + tax - (discountAmount || 0);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    // Validate cart before proceeding
    const cartValidation = validateCart();
    if (!cartValidation.isValid) {
      alert(`Cart validation failed: ${cartValidation.errors.join(', ')}`);
      return;
    }

    setIsProcessing(true);
    try {
      // Create Shopify checkout directly
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: user,
          shippingAddress: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            address1: 'Please update in checkout',
            city: 'Please update in checkout',
            state: 'Please update in checkout',
            zipCode: 'Please update in checkout',
            country: 'GB',
            phone: user.phone || '',
          },
          billingAddress: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            address1: 'Please update in checkout',
            city: 'Please update in checkout',
            state: 'Please update in checkout',
            zipCode: 'Please update in checkout',
            country: 'GB',
            phone: user.phone || '',
          },
          paymentMethod: 'card',
          discountCode,
          discountAmount,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const { checkoutUrl, isMock, clearCart: shouldClearCart } = responseData;

        // Clear cart before redirect since user is going to checkout
        if (shouldClearCart || !isMock) {
          clearCart();
        }

        if (isMock) {
          // For development/mock mode, redirect to cart with success message
          router.push(`/cart?success=true&orderId=${responseData.checkoutId}`);
        } else {
          // Redirect to Shopify checkout
          window.location.href = checkoutUrl;
        }
      } else {
        const errorMessage = responseData.error || 'Failed to create checkout session';
        alert(`Checkout Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show success message
  if (showSuccess) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
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
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>Checkout Successful!</h1>
            <p className='text-lg text-gray-600 mb-6'>
              Your order has been placed successfully. Order ID:{' '}
              <span className='font-semibold'>{orderId}</span>
            </p>
            <div className='space-x-4'>
              <Link
                href='/products'
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setOrderId('');
                }}
                className='inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <svg
              className='mx-auto h-24 w-24 text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
            <h1 className='mt-6 text-2xl font-bold text-gray-900'>Your cart is empty</h1>
            <p className='mt-2 text-gray-600'>Start shopping to add items to your cart</p>
            <div className='mt-6'>
              <Link
                href='/products'
                className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='text-gray-600 mt-2'>Review your items and proceed to checkout</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm border'>
              <div className='px-6 py-4 border-b'>
                <h2 className='text-lg font-semibold text-gray-900'>Cart Items ({items.length})</h2>
              </div>

              <div className='divide-y'>
                {items.map((item) => (
                  <div key={item.id} className='p-6 flex items-center space-x-4'>
                    {/* Product Image */}
                    <div className='flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden'>
                      {item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          width={80}
                          height={80}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <span className='text-gray-400 text-xs'>No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-medium text-gray-900'>{item.title}</h3>
                      {item.variantTitle && (
                        <p className='text-sm text-gray-500 mt-1'>{item.variantTitle}</p>
                      )}
                      <p className='text-lg font-medium text-gray-900 mt-2'>
                        {formatPrice({
                          amount: (parseFloat(item.price.amount) * item.quantity).toString(),
                          currencyCode: item.price.currencyCode,
                        })}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, Math.max(0, item.quantity - 1))
                        }
                        className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50'
                      >
                        -
                      </button>
                      <span className='w-12 text-center text-gray-900'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50'
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className='text-red-600 hover:text-red-700 p-2'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Order Summary</h2>

              <div className='space-y-3 mb-6'>
                <DiscountCode
                  onApply={applyDiscount}
                  onRemove={removeDiscount}
                  appliedCode={discountCode}
                  discountAmount={discountAmount}
                />
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='text-gray-900'>
                    {formatPrice({ amount: subtotal.toString(), currencyCode: 'GBP' })}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Tax (20% VAT)</span>
                  <span className='text-gray-900'>
                    {formatPrice({ amount: tax.toString(), currencyCode: 'GBP' })}
                  </span>
                </div>
                {discountCode && discountAmount > 0 && (
                  <div className='flex justify-between text-sm text-green-600'>
                    <span>Discount ({discountCode})</span>
                    <span>
                      -
                      {formatPrice({
                        amount: discountAmount.toFixed(2),
                        currencyCode: 'GBP',
                      })}
                    </span>
                  </div>
                )}

                <div className='border-t pt-3'>
                  <div className='flex justify-between text-base font-semibold'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-gray-900'>
                      {formatPrice({ amount: total.toString(), currencyCode: 'GBP' })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className='w-full'
                size='lg'
                disabled={items.length === 0 || !isAuthenticated}
                loading={isProcessing}
              >
                {isProcessing
                  ? 'Processing...'
                  : isAuthenticated
                  ? 'Proceed to Checkout'
                  : 'Sign In to Checkout'}
              </Button>

              {!isAuthenticated && (
                <div className='mt-4 text-center'>
                  <Link
                    href='/auth/login?redirect=/cart'
                    className='text-sm text-blue-600 hover:text-blue-700'
                  >
                    Sign In to Continue
                  </Link>
                </div>
              )}

              <div className='mt-4 text-center'>
                <Link href='/products' className='text-sm text-blue-600 hover:text-blue-700'>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
