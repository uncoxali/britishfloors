'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class CheckoutErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Checkout error boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoToCart = () => {
    window.location.href = '/cart';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center py-12'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4'>
                <svg
                  className='h-6 w-6 text-red-600'
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
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Checkout Error</h3>
              <p className='text-gray-600 mb-6'>
                Something went wrong while loading the checkout page. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='mb-6 text-left'>
                  <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                    Error Details (Development)
                  </summary>
                  <pre className='mt-2 text-xs text-red-600 bg-red-50 p-3 rounded border overflow-auto'>
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button onClick={this.handleRetry} variant='primary'>
                  Try Again
                </Button>
                <Button onClick={this.handleGoToCart} variant='outline'>
                  Go to Cart
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    return this.props.children;
  }
}

export default CheckoutErrorBoundary;
