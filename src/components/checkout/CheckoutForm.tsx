'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface CheckoutFormProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  } | null;
  onSubmit: (formData: {
    email: string;
    shippingAddress: Address;
    billingAddress: Address;
  }) => void;
  isProcessing: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ user, onSubmit, isProcessing }) => {
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Kingdom',
    phone: user?.phone || '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Kingdom',
    phone: user?.phone || '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      shippingAddress,
      billingAddress: useSameAddress ? shippingAddress : billingAddress,
    });
  };

  // const updateBillingAddress = (field: keyof Address, value: string) => {
  //   if (useSameAddress) {
  //     setShippingAddress((prev) => ({ ...prev, [field]: value }));
  //   } else {
  //     setBillingAddress((prev) => ({ ...prev, [field]: value }));
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Contact Information */}
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Contact Information</h2>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Shipping Address</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
            <input
              type='text'
              required
              value={shippingAddress.firstName}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
            <input
              type='text'
              required
              value={shippingAddress.lastName}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Company (Optional)</label>
          <input
            type='text'
            value={shippingAddress.company}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, company: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Address Line 1</label>
          <input
            type='text'
            required
            value={shippingAddress.address1}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, address1: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Address Line 2 (Optional)
          </label>
          <input
            type='text'
            value={shippingAddress.address2}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, address2: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
            <input
              type='text'
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>County</label>
            <input
              type='text'
              required
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress((prev) => ({ ...prev, state: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Postcode</label>
            <input
              type='text'
              required
              value={shippingAddress.zipCode}
              onChange={(e) => setShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
          <input
            type='tel'
            required
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Billing Address */}
      <div className='bg-white p-6 rounded-lg shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Billing Address</h2>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <span className='ml-2 text-sm text-gray-700'>Same as shipping address</span>
          </label>
        </div>

        {!useSameAddress && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
                <input
                  type='text'
                  required
                  value={billingAddress.firstName}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
                <input
                  type='text'
                  required
                  value={billingAddress.lastName}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address Line 1</label>
              <input
                type='text'
                required
                value={billingAddress.address1}
                onChange={(e) =>
                  setBillingAddress((prev) => ({ ...prev, address1: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                <input
                  type='text'
                  required
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>County</label>
                <input
                  type='text'
                  required
                  value={billingAddress.state}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Postcode</label>
                <input
                  type='text'
                  required
                  value={billingAddress.zipCode}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type='submit' variant='primary' size='lg' className='w-full' loading={isProcessing}>
        {isProcessing ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </form>
  );
};

export default CheckoutForm;
