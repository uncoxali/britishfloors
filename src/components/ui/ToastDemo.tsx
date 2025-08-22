'use client';

import React from 'react';
import Button from './Button';
import { showSuccess, showError, showWarning, showInfo } from '@/lib/utils/toast';

const ToastDemo: React.FC = () => {
  const handleShowSuccess = () => {
    showSuccess('This is a success message!');
  };

  const handleShowError = () => {
    showError('This is an error message!');
  };

  const handleShowWarning = () => {
    showWarning('This is a warning message!');
  };

  const handleShowInfo = () => {
    showInfo('This is an info message!');
  };

  const handleShowCustom = () => {
    showSuccess('Custom toast with longer duration!');
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-sm border'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Toast Notifications Demo</h3>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        <Button onClick={handleShowSuccess} variant='outline' size='sm'>
          Success Toast
        </Button>
        <Button onClick={handleShowError} variant='outline' size='sm'>
          Error Toast
        </Button>
        <Button onClick={handleShowWarning} variant='outline' size='sm'>
          Warning Toast
        </Button>
        <Button onClick={handleShowInfo} variant='outline' size='sm'>
          Info Toast
        </Button>
        <Button onClick={handleShowCustom} variant='outline' size='sm'>
          Custom Toast
        </Button>
      </div>
    </div>
  );
};

export default ToastDemo;
