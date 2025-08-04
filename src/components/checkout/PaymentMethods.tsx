'use client';

import React from 'react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      description: 'Pay with Visa, Mastercard, American Express',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' />
        </svg>
      ),
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H18v-1.956h.223c.681 0 1.352-.163 1.844-.478zM7.5 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H5.5v-1.956h.156c.681 0 1.352-.163 1.844-.478zM22 12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v6z' />
        </svg>
      ),
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Pay with Apple Pay',
      icon: (
        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
        </svg>
      ),
    },
  ];

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Payment Method</h2>

      <div className='space-y-3'>
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type='radio'
              name='paymentMethod'
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className='sr-only'
            />

            <div className='flex items-center space-x-3 flex-1'>
              <div
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded ${
                  selectedMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {method.icon}
              </div>

              <div className='flex-1'>
                <h3 className='text-sm font-medium text-gray-900'>{method.name}</h3>
                <p className='text-sm text-gray-500'>{method.description}</p>
              </div>
            </div>

            <div
              className={`flex-shrink-0 w-4 h-4 border-2 rounded-full ${
                selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {selectedMethod === method.id && (
                <div className='w-full h-full bg-white rounded-full scale-50'></div>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Security Notice */}
      <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
        <div className='flex items-start space-x-2'>
          <svg className='w-4 h-4 text-green-600 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
              clipRule='evenodd'
            />
          </svg>
          <p className='text-xs text-gray-600'>
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
