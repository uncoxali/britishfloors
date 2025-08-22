'use client';

import React, { useState } from 'react';


interface SampleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleOrderModal: React.FC<SampleOrderModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    quantity: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    onClose();
    // Here you would typically send the sample order to your backend
    alert('Sample order submitted successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-900'>Order a Sample</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='mb-4 text-center text-gray-600 text-sm'>
          Free sample delivery • 2-3 business days
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>First Name *</label>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name *</label>
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Address *</label>
            <textarea
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={2}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your full address'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sample Quantity</label>
            <select
              name='quantity'
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: parseInt(e.target.value) }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value={1}>1 Sample</option>
              <option value={2}>2 Samples</option>
              <option value={3}>3 Samples</option>
            </select>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
            >
              {isSubmitting ? 'Submitting...' : 'Order Sample'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleOrderModal;
