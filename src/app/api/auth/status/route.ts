import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check if Shopify credentials are configured
        const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
        const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

        const status = {
            configured: {
                storeDomain: !!SHOPIFY_STORE_DOMAIN,
                adminToken: !!SHOPIFY_ADMIN_ACCESS_TOKEN,
                storefrontToken: !!SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            ready: !!(SHOPIFY_STORE_DOMAIN && SHOPIFY_ADMIN_ACCESS_TOKEN && SHOPIFY_STOREFRONT_ACCESS_TOKEN),
            environment: process.env.NODE_ENV,
        };

        return NextResponse.json(status);
    } catch (error) {
        console.error('Auth status error:', error);
        return NextResponse.json(
            { error: 'Failed to check authentication status' },
            { status: 500 }
        );
    }
} 