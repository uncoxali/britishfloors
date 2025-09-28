'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import PhoneInput from '@/components/ui/PhoneInput';
import { useAuthStore } from '@/store/auth';
import { showSuccess, showError } from '@/lib/utils/toast';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile, isLoading, setUserEmail } = useAuthStore();
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

  // Update form data when user data becomes available
  useEffect(() => {
    console.log('Account page - User data changed:', user);
    console.log('Current auth state:', { user, isAuthenticated, isLoading });

    if (user) {
      console.log('Setting form data with user:', user);

      // Check if email is missing and try to restore it
      if (!user.email && typeof window !== 'undefined') {
        const emailBackup = localStorage.getItem('user-email-backup');
        console.log('Account page - User email missing, checking backup:', emailBackup);
        if (emailBackup) {
          console.log('Account page - Restoring email from backup:', emailBackup);
          setUserEmail(emailBackup);
        }
      }

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } else {
      console.log('No user data available');
      // Try to get user data from store if available
      if (isAuthenticated) {
        console.log('User is authenticated but no user data, checking store...');
      }
    }
  }, [user, isAuthenticated, isLoading, setUserEmail]);

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

  if (isLoading || (!isAuthenticated && !user) || isRedirecting) {
    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Loading...</h3>
          </div>
        </div>
      </Layout>
    );
  }

  // If authenticated but no user data, show error
  if (!user && isAuthenticated) {
    // Debug localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-storage');
      console.log('Account page - localStorage auth-storage:', stored);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('Account page - Parsed auth data:', parsed);
        } catch (e) {
          console.error('Account page - Error parsing stored auth data:', e);
        }
      }
    }

    return (
      <Layout>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-12'>
            <h3 className='text-lg font-medium text-red-600'>Error loading user data</h3>
            <p className='text-gray-600 mt-2'>Please try logging in again.</p>
            <Button onClick={() => router.push('/auth/login')} className='mt-4'>
              Go to Login
            </Button>
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
      showSuccess('Profile updated successfully!');
    } catch {
      showError('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className='mb-6 text-sm text-gray-600'>Home / Profile</nav>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='lg:w-1/4'>
            <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
              {/* User Profile Header */}
              <div className='bg-[#1A4685] p-6 text-white'>
                <div className='flex items-center space-x-4'>
                  <div className='bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16' />
                  <div>
                    <h2 className='text-xl font-bold'>Hello</h2>
                    <p className='text-blue-200'>
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className='py-4'>
                <ul className='space-y-1'>
                  <li>
                    <Link
                      href='/account'
                      className='flex items-center px-6 py-3 text-base font-medium text-[#1A4685] bg-blue-50 border-r-2 border-[#1A4685]'
                    >
                      <span className='mr-3'>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/account/downloads'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Downloads</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/wishlist'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Favorites</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/account/addresses'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Addresses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/account/payment-methods'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Payment methods</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/account'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Account details</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/account/affiliate'
                      className='flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Affiliate Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='flex items-center w-full px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50'
                    >
                      <span className='mr-3'>Log out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:w-3/4 space-y-8'>
            {/* Order Status Cards */}
            <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6'>
              <h2 className='text-xl font-bold text-[#1A4685] mb-6 text-center'>Order Status</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {[
                  { status: 'Pending', count: 0, color: '#15386A' },
                  { status: 'Processing', count: 0, color: '#3F659C' },
                  { status: 'Completed', count: 0, color: '#88A2C9' },
                  { status: 'Cancelled', count: 0, color: '#BF004A' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='border border-[#1A4685] rounded-xl p-4 text-center shadow-sm'
                    style={{ boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.15)' }}
                  >
                    <div
                      className='w-6 h-6 rounded-sm mx-auto mb-2'
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <h3 className='font-medium text-gray-700'>{item.status}</h3>
                    <p className='text-2xl font-bold text-gray-900 mt-1'>{item.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Information */}
            <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-[#1A4685]'>Account details</h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant='outline'
                    size='sm'
                    className='border-[#1A4685] text-[#1A4685] hover:bg-[#1A4685] hover:text-white'
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        First Name
                      </label>
                      <input
                        type='text'
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4685] focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Last Name
                      </label>
                      <input
                        type='text'
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4685] focus:border-transparent'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4685] focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone Number
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => setFormData({ ...formData, phone: value })}
                      placeholder='+44 123 456 7890'
                      className='w-full'
                    />
                  </div>

                  <div className='flex space-x-4 pt-4'>
                    <Button
                      onClick={handleSaveProfile}
                      loading={isLoading}
                      className='bg-[#1A4685] hover:bg-[#15386A]'
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant='outline'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>
                        First Name
                      </label>
                      <p className='text-gray-900 font-medium'>
                        {user?.firstName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>
                        Last Name
                      </label>
                      <p className='text-gray-900 font-medium'>
                        {user?.lastName || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Email Address
                    </label>
                    <p className='text-gray-900 font-medium'>
                      {user?.email ||
                        (() => {
                          // Try to get email from backup if user email is missing
                          if (typeof window !== 'undefined') {
                            const emailBackup = localStorage.getItem('user-email-backup');
                            return emailBackup || 'Not provided';
                          }
                          return 'Not provided';
                        })()}
                    </p>
                    {!user?.email &&
                      typeof window !== 'undefined' &&
                      localStorage.getItem('user-email-backup') && (
                        <button
                          onClick={() => {
                            const emailBackup = localStorage.getItem('user-email-backup');
                            if (emailBackup) {
                              setUserEmail(emailBackup);
                            }
                          }}
                          className='text-sm text-blue-600 hover:text-blue-800 mt-1'
                        >
                          Restore email from backup
                        </button>
                      )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                      Phone Number
                    </label>
                    <p className='text-gray-900 font-medium'>{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
