'use client';

import React from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ClientOnly from '@/components/ui/ClientOnly';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

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

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
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
                  Start shopping to add items to your cart.
                </p>
                <div className='mt-8'>
                  <Button onClick={handleContinueShopping} variant='primary' className='px-8'>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex space-x-4 p-4 bg-white border rounded-lg shadow-sm'
                  >
                    {/* Product Image */}
                    <div className='flex-shrink-0'>
                      <Image
                        src={item.image?.url || '/placeholder.jpg'}
                        alt={item.image?.altText || item.title}
                        width={80}
                        height={80}
                        className='rounded-md object-cover'
                      />
                    </div>

                    {/* Product Details */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-sm font-medium text-gray-900 truncate'>{item.title}</h3>
                      {item.variantTitle && (
                        <p className='text-sm text-gray-500'>{item.variantTitle}</p>
                      )}
                      <p className='text-sm font-medium text-gray-900 mt-1'>
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className='flex items-center space-x-2 mt-3'>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors'
                        >
                          <svg
                            className='h-4 w-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M20 12H4'
                            />
                          </svg>
                        </button>
                        <span className='text-sm font-medium text-gray-900 w-8 text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors'
                        >
                          <svg
                            className='h-4 w-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 4v16m8-8H4'
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className='flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors'
                    >
                      <svg
                        className='h-4 w-4'
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
            )}
          </div>

          {/* Footer with Totals and Actions */}
          {items.length > 0 && (
            <div className='border-t px-4 py-6 space-y-4 bg-white'>
              {/* Totals */}
              <div className='space-y-2'>
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
                <div className='flex justify-between text-lg font-semibold border-t pt-2'>
                  <span className='text-gray-900'>Total</span>
                  <span className='text-gray-900'>
                    {formatPrice({ amount: total.toString(), currencyCode: 'GBP' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                <Button onClick={handleCheckout} variant='primary' className='w-full' size='lg'>
                  Proceed to Checkout
                </Button>
                <Button onClick={handleContinueShopping} variant='secondary' className='w-full'>
                  Continue Shopping
                </Button>
                <button
                  onClick={clearCart}
                  className='w-full text-sm text-red-600 hover:text-red-700 transition-colors'
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </ClientOnly>
  );
};

export default CartDrawer;
