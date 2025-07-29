'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/account');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Layout>
      <div className='max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white p-8 rounded-lg shadow-sm border'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>Sign In</h1>

          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your email'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your password'
              />
            </div>

            <Button type='submit' loading={isLoading} className='w-full' size='lg'>
              Sign In
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link href='/auth/register' className='text-blue-600 hover:text-blue-700'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
