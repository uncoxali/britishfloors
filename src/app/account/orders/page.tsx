'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils/format';
import OrderCard from '@/components/orders/OrderCard';

// Mock order data (kept for fallback/development)
const mockOrders = [
  {
    id: 'BRF-2024-001',
    orderNumber: 'BRF-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: { amount: '299.99', currencyCode: 'GBP' },
    items: [
      {
        id: '1',
        title: 'Premium Oak Hardwood Flooring',
        variantTitle: 'Natural Oak, 20mm thickness',
        quantity: 2,
        price: { amount: '149.99', currencyCode: 'GBP' },
        image: { url: '/placeholder.jpg', altText: 'Oak Flooring' },
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      city: 'London',
      province: 'England',
      zip: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20',
  },
  {
    id: 'BRF-2024-002',
    orderNumber: 'BRF-2024-002',
    date: '2024-01-10',
    status: 'processing',
    total: { amount: '599.98', currencyCode: 'GBP' },
    items: [
      {
        id: '2',
        title: 'Engineered Maple Flooring',
        variantTitle: 'Light Maple, 15mm thickness',
        quantity: 3,
        price: { amount: '199.99', currencyCode: 'GBP' },
        image: { url: '/placeholder.jpg', altText: 'Maple Flooring' },
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      city: 'London',
      province: 'England',
      zip: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    trackingNumber: null,
    estimatedDelivery: '2024-01-25',
  },
  {
    id: 'BRF-2024-003',
    orderNumber: 'BRF-2024-003',
    date: '2024-01-05',
    status: 'cancelled',
    total: { amount: '149.99', currencyCode: 'GBP' },
    items: [
      {
        id: '3',
        title: 'Bamboo Flooring',
        variantTitle: 'Natural Bamboo, 12mm thickness',
        quantity: 1,
        price: { amount: '149.99', currencyCode: 'GBP' },
        image: { url: '/placeholder.jpg', altText: 'Bamboo Flooring' },
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      city: 'London',
      province: 'England',
      zip: 'SW1A 1AA',
      country: 'United Kingdom',
    },
    trackingNumber: null,
    estimatedDelivery: null,
    cancellationReason: 'Customer requested cancellation',
  },
];

// Define types for Order and its sub-objects
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: { amount: string; currencyCode: string };
  items: Array<{
    id: string;
    title: string;
    variantTitle?: string;
    quantity: number;
    price: { amount: string; currencyCode: string };
    image?: { url: string; altText: string };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  cancellationReason?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

const OrderHistoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsRedirecting(true);
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history');
        // Fallback to mock data for development
        setOrders(mockOrders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || isRedirecting) {
    return (
      <Layout>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Loading...</h3>
          </div>
        </div>
      </Layout>
    );
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Order History</h1>
          <Link href='/account'>
            <Button variant='outline' size='sm'>
              Back to Account
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Loading orders...</h3>
            <p className='mt-2 text-sm text-gray-500'>
              Please wait while we fetch your order history.
            </p>
          </div>
        ) : error ? (
          <div className='text-center py-12'>
            <svg
              className='mx-auto h-16 w-16 text-red-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Error loading orders</h3>
            <p className='mt-2 text-sm text-gray-500'>{error}</p>
            <div className='mt-6'>
              <Button onClick={() => window.location.reload()} variant='primary'>
                Try Again
              </Button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className='text-center py-12'>
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
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>No orders found</h3>
            <p className='mt-2 text-sm text-gray-500'>You haven&apos;t placed any orders yet.</p>
            <div className='mt-6'>
              <Link href='/products'>
                <Button variant='primary'>Start Shopping</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetails={handleViewOrder} />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {isOrderModalOpen && selectedOrder && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600'>
                    <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                {/* Order Status */}
                <div className='mb-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-500'>Order Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                          selectedOrder.status,
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>Order Date</p>
                      <p className='text-sm font-medium text-gray-900'>
                        {formatDate(selectedOrder.date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className='mb-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>Order Items</h3>
                  <div className='space-y-4'>
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center space-x-4 p-4 border rounded-lg'
                      >
                        <div className='flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md'></div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-medium text-gray-900'>{item.title}</h4>
                          {item.variantTitle && (
                            <p className='text-sm text-gray-500'>{item.variantTitle}</p>
                          )}
                          <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className='mb-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>Shipping Information</h3>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-900'>
                      {selectedOrder.shippingAddress.firstName}{' '}
                      {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {selectedOrder.shippingAddress.address1}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}{' '}
                      {selectedOrder.shippingAddress.zip}
                    </p>
                    <p className='text-sm text-gray-600'>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className='border-t pt-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-900'>Total</span>
                    <span className='text-lg font-semibold text-gray-900'>
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedOrder.trackingNumber && (
                  <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                    <h4 className='text-sm font-medium text-blue-900 mb-2'>Tracking Information</h4>
                    <p className='text-sm text-blue-700'>
                      Tracking Number: {selectedOrder.trackingNumber}
                    </p>
                    {selectedOrder.estimatedDelivery && (
                      <p className='text-sm text-blue-700'>
                        Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                  <div className='mt-4 p-4 bg-red-50 rounded-lg'>
                    <h4 className='text-sm font-medium text-red-900 mb-2'>Cancellation Reason</h4>
                    <p className='text-sm text-red-700'>{selectedOrder.cancellationReason}</p>
                  </div>
                )}
              </div>

              <div className='px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3'>
                <Button onClick={handleCloseModal} variant='outline'>
                  Close
                </Button>
                {selectedOrder.status === 'delivered' && <Button variant='primary'>Reorder</Button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;
