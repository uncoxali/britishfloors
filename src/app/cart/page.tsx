'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils/format';
import DiscountCode from '@/components/ui/DiscountCode';

const CartPage: React.FC = () => {
  const router = useRouter();
  const {
    items,
    totalQuantity,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <div className='text-center py-12'>
          <div className='mb-6'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Your cart is empty</h2>
          <p className='text-gray-600 mb-8'>
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href='/products'>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Shopping Cart</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm border'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Cart Items ({totalQuantity})
                  </h2>
                  <button onClick={clearCart} className='text-sm text-red-600 hover:text-red-700'>
                    Clear Cart
                  </button>
                </div>

                <div className='space-y-6'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center space-x-4 py-4 border-b last:border-b-0'
                    >
                      {/* Product Image */}
                      <div className='flex-shrink-0'>
                        {item.image ? (
                          <Image
                            src={item.image.url}
                            alt={item.image.altText || item.title}
                            width={80}
                            height={80}
                            className='w-20 h-20 object-cover rounded-md'
                          />
                        ) : (
                          <div className='w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center'>
                            <span className='text-gray-400 text-xs'>No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className='flex-1 min-w-0'>
                        <Link href={`/products/${item.handle}`}>
                          <h3 className='text-sm font-medium text-gray-900 hover:text-blue-600'>
                            {item.title}
                          </h3>
                        </Link>
                        {item.variantTitle && (
                          <p className='text-sm text-gray-500 mt-1'>{item.variantTitle}</p>
                        )}
                        <p className='text-sm font-semibold text-gray-900 mt-1'>
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50'
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className='w-12 text-center text-sm text-gray-900'>
                          {item.quantity}
                        </span>
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
                  <span className='text-gray-900'>{formatPrice(subtotal)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='text-gray-900'>Free</span>
                </div>
                {discountCode && (
                  <div className='flex justify-between text-sm text-green-600'>
                    <span>Discount ({discountCode})</span>
                    <span>
                      -
                      {formatPrice({
                        amount: discountAmount.toFixed(2),
                        currencyCode: subtotal.currencyCode,
                      })}
                    </span>
                  </div>
                )}

                <div className='border-t pt-3'>
                  <div className='flex justify-between text-base font-semibold'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-gray-900'>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className='w-full'
                size='lg'
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>

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
