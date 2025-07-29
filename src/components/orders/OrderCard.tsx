'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils/format';
import Button from '@/components/ui/Button';

interface OrderItem {
  id: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText: string };
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: { amount: string; currencyCode: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  cancellationReason?: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      {/* Order Header */}
      <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Order #{order.orderNumber}</h3>
              <p className='text-sm text-gray-500'>Placed on {formatDate(order.date)}</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                order.status,
              )}`}
            >
              {getStatusText(order.status)}
            </span>
            <div className='text-right'>
              <p className='text-lg font-semibold text-gray-900'>{formatPrice(order.total)}</p>
              <p className='text-sm text-gray-500'>
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className='px-6 py-4'>
        <div className='space-y-3'>
          {order.items.map((item) => (
            <div key={item.id} className='flex items-center space-x-4'>
              <div className='flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md'></div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-medium text-gray-900 truncate'>{item.title}</h4>
                {item.variantTitle && <p className='text-sm text-gray-500'>{item.variantTitle}</p>}
                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Actions */}
      <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {order.trackingNumber && (
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>Tracking:</span> {order.trackingNumber}
              </div>
            )}
            {order.estimatedDelivery && (
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>Estimated Delivery:</span>{' '}
                {formatDate(order.estimatedDelivery)}
              </div>
            )}
          </div>
          <div className='flex items-center space-x-3'>
            <Button onClick={() => onViewDetails(order)} variant='outline' size='sm'>
              View Details
            </Button>
            {order.status === 'delivered' && (
              <Button variant='outline' size='sm'>
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
