'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const ShopifyDebugPage: React.FC = () => {
  const [debugResults, setDebugResults] = useState<{
    environment?: {
      NODE_ENV: string;
      SHOPIFY_STORE_DOMAIN: string | undefined;
      HAS_ADMIN_TOKEN: boolean;
      ADMIN_TOKEN_LENGTH: number;
      ADMIN_TOKEN_PREFIX: string;
    };
    tests?: Record<
      string,
      {
        success: boolean;
        error?: string;
        status?: number;
        ok?: boolean;
        shopName?: string;
        shopDomain?: string;
        customerCount?: number;
        customerId?: number;
        details?: Record<string, unknown>;
      }
    >;
    summary?: {
      allTestsPassed: boolean;
      totalTests: number;
      passedTests: number;
    };
    error?: string;
    details?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testShopifyConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/debug-shopify');
      const data = await response.json();
      setDebugResults(data);
    } catch {
      setDebugResults({ error: 'Failed to test Shopify connection' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTestStatus = (test: {
    success: boolean;
    error?: string;
    status?: number;
    ok?: boolean;
    shopName?: string;
    shopDomain?: string;
    customerCount?: number;
    customerId?: number;
    details?: Record<string, unknown>;
  }) => {
    if (!test) return 'pending';
    return test.success ? 'success' : 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Shopify Debug Tool</h1>

        <div className='bg-white p-6 rounded-lg shadow-sm border mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Connection Test</h2>
          <Button
            onClick={testShopifyConnection}
            disabled={isLoading}
            variant='primary'
            className='mb-4'
          >
            {isLoading ? 'Testing...' : 'Test Shopify Connection'}
          </Button>

          {debugResults && (
            <div className='mt-6 space-y-6'>
              {/* Environment Info */}
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-lg font-medium text-gray-900 mb-3'>Environment</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='font-medium'>NODE_ENV:</span>{' '}
                    {debugResults.environment?.NODE_ENV}
                  </div>
                  <div>
                    <span className='font-medium'>Store Domain:</span>{' '}
                    {debugResults.environment?.SHOPIFY_STORE_DOMAIN || 'Not set'}
                  </div>
                  <div>
                    <span className='font-medium'>Admin Token:</span>{' '}
                    {debugResults.environment?.HAS_ADMIN_TOKEN ? 'Set' : 'Not set'}
                  </div>
                  <div>
                    <span className='font-medium'>Token Length:</span>{' '}
                    {debugResults.environment?.ADMIN_TOKEN_LENGTH || 0}
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-3'>Test Results</h3>
                <div className='space-y-3'>
                  {debugResults.tests &&
                    Object.entries(debugResults.tests).map(([testName, testData]) => (
                      <div
                        key={testName}
                        className={`p-4 rounded-lg border ${getStatusColor(
                          getTestStatus(testData),
                        )}`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <span>{getStatusIcon(getTestStatus(testData))}</span>
                            <span className='font-medium capitalize'>
                              {testName.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                          <span className='text-sm font-medium'>
                            {getTestStatus(testData) === 'success'
                              ? 'PASSED'
                              : getTestStatus(testData) === 'error'
                              ? 'FAILED'
                              : 'PENDING'}
                          </span>
                        </div>

                        {testData?.error && (
                          <div className='mt-2 text-sm'>
                            <strong>Error:</strong> {testData.error}
                          </div>
                        )}

                        {testData?.details && (
                          <div className='mt-2 text-sm'>
                            <strong>Details:</strong> {JSON.stringify(testData.details, null, 2)}
                          </div>
                        )}

                        {testData?.shopName && (
                          <div className='mt-2 text-sm'>
                            <strong>Shop:</strong> {testData.shopName} ({testData.shopDomain})
                          </div>
                        )}

                        {testData?.customerCount !== undefined && (
                          <div className='mt-2 text-sm'>
                            <strong>Total Customers:</strong> {testData.customerCount}
                          </div>
                        )}

                        {testData?.customerId && (
                          <div className='mt-2 text-sm'>
                            <strong>Test Customer ID:</strong> {testData.customerId} (deleted)
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Summary */}
              {debugResults.summary && (
                <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                  <h3 className='text-lg font-medium text-blue-900 mb-2'>Summary</h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                    <div>
                      <span className='font-medium'>Total Tests:</span>{' '}
                      {debugResults.summary.totalTests}
                    </div>
                    <div>
                      <span className='font-medium'>Passed:</span>{' '}
                      {debugResults.summary.passedTests}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{' '}
                      {debugResults.summary.allTestsPassed
                        ? '✅ All Tests Passed'
                        : '❌ Some Tests Failed'}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {debugResults.error && (
                <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
                  <h3 className='text-lg font-medium text-red-900 mb-2'>Error</h3>
                  <p className='text-red-700'>{debugResults.error}</p>
                  {debugResults.details && (
                    <p className='text-red-600 mt-2 text-sm'>{debugResults.details}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className='bg-yellow-50 p-6 rounded-lg border border-yellow-200'>
          <h2 className='text-xl font-semibold text-yellow-900 mb-4'>
            How to Fix Registration Issues
          </h2>
          <div className='space-y-3 text-sm text-yellow-800'>
            <div>
              <strong>1. Check Environment Variables:</strong>
              <p>Make sure your .env.local file contains:</p>
              <pre className='bg-yellow-100 p-2 rounded mt-1 text-xs'>
                {`NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-access-token`}
              </pre>
            </div>

            <div>
              <strong>2. Verify Shopify App Setup:</strong>
              <ul className='list-disc list-inside mt-1 space-y-1'>
                <li>Create a Shopify Partner account</li>
                <li>Create a development store</li>
                <li>Create a private app with Admin API access</li>
                <li>Grant customer read/write permissions</li>
              </ul>
            </div>

            <div>
              <strong>3. Check API Permissions:</strong>
              <ul className='list-disc list-inside mt-1 space-y-1'>
                <li>read_customers</li>
                <li>write_customers</li>
                <li>read_orders</li>
                <li>write_orders</li>
              </ul>
            </div>

            <div>
              <strong>4. Restart Development Server:</strong>
              <p>After updating environment variables, restart your Next.js server:</p>
              <pre className='bg-yellow-100 p-2 rounded mt-1 text-xs'>npm run dev</pre>
            </div>
          </div>
        </div>

        {/* Raw JSON */}
        {debugResults && (
          <div className='bg-gray-50 p-6 rounded-lg border'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Raw Debug Data</h2>
            <pre className='bg-white p-4 rounded border overflow-auto text-xs'>
              {JSON.stringify(debugResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopifyDebugPage;
