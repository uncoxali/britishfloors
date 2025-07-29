import { NextRequest, NextResponse } from 'next/server';
import { SHOPIFY_ADMIN_API_URL, SHOPIFY_ADMIN_ACCESS_TOKEN } from '@/lib/shopify/config';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // For demo purposes, we'll use a simple validation
        // In a real app, you would validate against Shopify's customer API
        const mockUsers = [
            {
                id: '1',
                email: 'demo@example.com',
                password: 'password123',
                name: 'Demo User',
                firstName: 'Demo',
                lastName: 'User',
            },
            {
                id: '2',
                email: 'admin@britishfloors.com',
                password: 'admin123',
                name: 'Admin User',
                firstName: 'Admin',
                lastName: 'User',
            },
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Auth validation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 