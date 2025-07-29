import { NextRequest, NextResponse } from 'next/server';
import { SHOPIFY_ADMIN_API_URL, SHOPIFY_ADMIN_ACCESS_TOKEN } from '@/lib/shopify/config';

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName } = await request.json();

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // In a real app, you would create a customer in Shopify
        // For now, we'll simulate registration
        const newUser = {
            id: Date.now().toString(),
            email,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            phone: '',
        };

        // Here you would typically:
        // 1. Create customer in Shopify using Admin API
        // 2. Hash the password
        // 3. Store user data in your database

        return NextResponse.json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 