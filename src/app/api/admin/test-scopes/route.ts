import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Simple test query to check available scopes
const TEST_SCOPES_QUERY = `
  query testScopes {
    shop {
      id
      name
    }
  }
`;

export async function GET() {
    try {
        if (!ADMIN_API_URL || !ADMIN_ACCESS_TOKEN) {
            return NextResponse.json({
                error: 'Missing Admin API configuration',
                hasUrl: !!ADMIN_API_URL,
                hasToken: !!ADMIN_ACCESS_TOKEN,
            }, { status: 500 });
        }

        console.log('Testing Admin API scopes...');
        console.log('URL:', ADMIN_API_URL);
        console.log('Token starts with:', ADMIN_ACCESS_TOKEN.substring(0, 10) + '...');

        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: TEST_SCOPES_QUERY,
            }),
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);

        if (!response.ok) {
            return NextResponse.json({
                error: 'HTTP Error',
                status: response.status,
                statusText: response.statusText,
                response: responseText,
            }, { status: response.status });
        }

        const data = JSON.parse(responseText);

        return NextResponse.json({
            success: !data.errors,
            shop: data.data?.shop,
            errors: data.errors,
            message: data.errors
                ? 'Admin API has errors - check scopes'
                : 'Admin API working - scopes are valid',
        });
    } catch (error) {
        console.error('Test scopes error:', error);
        return NextResponse.json({
            error: 'Test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}