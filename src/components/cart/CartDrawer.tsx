'use client';

import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { useCartStore } from '@/store/cart';
import { useCartDrawerStore } from '@/store/cartDrawer';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ClientOnly from '@/components/ui/ClientOnly';

const CartDrawer: React.FC = () => {
  const { isOpen, close: onClose } = useCartDrawerStore();
  const { items, removeItem, updateQuantity, clearCart, validateCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      onClose();
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
          discountCode: undefined,
          discountAmount: 0,
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
          onClose();
          window.location.href = `/cart?success=true&orderId=${responseData.checkoutId}`;
        } else {
          // Redirect to Shopify checkout
          window.location.href = checkoutUrl;
        }

        onClose();
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

  const handleContinueShopping = () => {
    onClose();
    router.push('/products');
  };

  // Calculate totals manually
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const tax = subtotal * 0.2; // 20% VAT for UK
  const total = subtotal + tax;

  return (
    <ClientOnly>
      <Drawer
        open={isOpen}
        onClose={onClose}
        direction='right'
        size={400}
        className='!bg-white'
        overlayClassName='!bg-black/30'
      >
        <div className='flex h-full flex-col bg-white'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-6 border-b bg-white'>
            <h2 className='text-lg font-semibold text-gray-900'>Shopping Cart</h2>
            <button
              onClick={onClose}
              className='p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100 border border-gray-200'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className='flex-1 overflow-y-auto px-4 py-6 bg-gray-50'>
            {items.length === 0 ? (
              <div className='text-center py-12 bg-white rounded-lg m-4'>
                <svg
                  className='mx-auto h-16 w-16 text-gray-300'
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
                <h3 className='mt-4 text-lg font-medium text-gray-900'>Your cart is empty</h3>
                <p className='mt-2 text-sm text-gray-500'>
                  Start shopping to add items to your cart
                </p>
                <Button
                  onClick={handleContinueShopping}
                  variant='primary'
                  size='sm'
                  className='mt-4'
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <div key={item.id} className='bg-white rounded-lg p-4 shadow-sm border'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
                        {item.image?.url ? (
                          <Image
                            src={item.image.url}
                            alt={item.image.altText || item.title}
                            width={64}
                            height={64}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <span className='text-gray-400 text-xs'>No image</span>
                          </div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium text-gray-900 truncate'>{item.title}</h3>
                        <p className='text-sm text-gray-500'>
                          {item.type === 'sample'
                            ? 'Sample'
                            : item.variantTitle && `Variant: ${item.variantTitle}`}
                        </p>
                        {!item.isSample && (
                          <div className='flex items-center space-x-2 mt-2'>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  Math.max(0, item.quantity - 1),
                                  item.isSample,
                                )
                              }
                              className='w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50'
                            >
                              -
                            </button>
                            <span className='text-sm text-gray-900 w-8 text-center'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1, item.isSample)
                              }
                              className='w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50'
                            >
                              +
                            </button>
                          </div>
                        )}
                        {item.type === 'sample' && (
                          <div className='mt-2'>
                            <span className='inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full'>
                              Sample Order
                            </span>
                          </div>
                        )}
                        {item.type === 'main' && (
                          <div className='mt-2'>
                            <span className='inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full'>
                              Main Product
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col items-end space-y-2'>
                        <p className='text-sm font-medium text-gray-900'>
                          {formatPrice({
                            amount: (parseFloat(item.price.amount) * item.quantity).toString(),
                            currencyCode: item.price.currencyCode,
                          })}
                          {item.type === 'sample' && (
                            <span className='text-xs text-blue-600 ml-1'>(min price)</span>
                          )}
                          {item.type === 'main' && (
                            <span className='text-xs text-green-600 ml-1'>(main)</span>
                          )}
                        </p>
                        <button
                          onClick={() => removeItem(item.variantId, item.isSample)}
                          className='text-red-500 hover:text-red-700 text-sm'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className='border-t bg-white px-4 py-6'>
              <div className='space-y-3 mb-4'>
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
                <div className='border-t pt-3'>
                  <div className='flex justify-between text-base font-semibold'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-gray-900'>
                      {formatPrice({ amount: total.toString(), currencyCode: 'GBP' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <Button
                  onClick={handleCheckout}
                  variant='primary'
                  size='lg'
                  className='w-full'
                  loading={isProcessing}
                  disabled={!isAuthenticated}
                >
                  {isProcessing
                    ? 'Processing...'
                    : isAuthenticated
                    ? 'Proceed to Checkout'
                    : 'Sign In to Checkout'}
                </Button>

                {!isAuthenticated && (
                  <Button
                    onClick={() => {
                      onClose();
                      router.push('/auth/login?redirect=/cart');
                    }}
                    variant='secondary'
                    size='sm'
                    className='w-full'
                  >
                    Sign In
                  </Button>
                )}

                <Button
                  onClick={handleContinueShopping}
                  variant='secondary'
                  size='sm'
                  className='w-full'
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </ClientOnly>
  );
};

export default CartDrawer;
