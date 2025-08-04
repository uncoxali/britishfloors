'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';
import { useAuthStore } from '@/store/auth';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile, isLoading } = useAuthStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [shopifyStatus, setShopifyStatus] = useState<{
    configured: {
      storeDomain: boolean;
      adminToken: boolean;
      storefrontToken: boolean;
    };
    ready: boolean;
    environment: string;
  } | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const checkShopifyStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const status = await response.json();
          setShopifyStatus(status);
        }
      } catch (error) {
        console.error('Failed to check Shopify status:', error);
      }
    };

    checkShopifyStatus();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsRedirecting(true);
      if (isAuthenticated === false) {
        router.push('/');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsRedirecting(true);
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user || isRedirecting) {
    return (
      <Layout>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Loading...</h3>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = async () => {
    try {
      updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>My Account</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Account Menu</h2>
              <nav className='space-y-2'>
                <Link
                  href='/account'
                  className='block px-3 py-2 text-blue-600 bg-blue-50 rounded-md'
                >
                  Profile
                </Link>
                <Link
                  href='/account/orders'
                  className='block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md'
                >
                  Order History
                </Link>
                <Link
                  href='/wishlist'
                  className='block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md'
                >
                  Wishlist
                </Link>
                <Link
                  href='/account/addresses'
                  className='block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md'
                >
                  Addresses
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Shopify Status */}
            {shopifyStatus && (
              <div className='bg-white p-6 rounded-lg shadow-sm border'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  Shopify Connection Status
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div
                    className={`p-3 rounded-lg ${
                      shopifyStatus.configured.storeDomain
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          shopifyStatus.configured.storeDomain ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <span className='text-sm font-medium'>Store Domain</span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      shopifyStatus.configured.adminToken
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          shopifyStatus.configured.adminToken ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <span className='text-sm font-medium'>Admin API</span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      shopifyStatus.configured.storefrontToken
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className='flex items-center'>
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          shopifyStatus.configured.storefrontToken ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <span className='text-sm font-medium'>Storefront API</span>
                    </div>
                  </div>
                </div>
                <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600'>
                    <strong>Status:</strong>{' '}
                    {shopifyStatus.ready ? '✅ Ready for production' : '❌ Configuration required'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <strong>Environment:</strong> {shopifyStatus.environment}
                  </p>
                </div>
              </div>
            )}

            {/* Profile Information */}
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Profile Information</h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant='outline' size='sm'>
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        First Name
                      </label>
                      <input
                        type='text'
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Last Name
                      </label>
                      <input
                        type='text'
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Phone Number
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => setFormData({ ...formData, phone: value })}
                      placeholder='+44 123 456 7890'
                    />
                  </div>

                  <div className='flex space-x-2 pt-4'>
                    <Button onClick={handleSaveProfile} loading={isLoading}>
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} variant='outline'>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        First Name
                      </label>
                      <p className='text-gray-900'>{user.firstName}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Last Name
                      </label>
                      <p className='text-gray-900'>{user.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email Address
                    </label>
                    <p className='text-gray-900'>{user.email}</p>
                  </div>

                  {user.phone && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone Number
                      </label>
                      <p className='text-gray-900'>{user.phone}</p>
                    </div>
                  )}
                </div>
              )}

              <div className='mt-8 pt-6 border-t'>
                <Button
                  onClick={handleLogout}
                  variant='outline'
                  className='text-red-600 border-red-300 hover:bg-red-50'
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
