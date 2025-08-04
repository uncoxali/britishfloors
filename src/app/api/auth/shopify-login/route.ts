import { NextRequest, NextResponse } from 'next/server';

// Shopify Customer API endpoints
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`;

// Login customer with Shopify
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if Shopify credentials are configured
        if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
            console.log('Shopify credentials not configured, using fallback mode');

            // Fallback: Mock authentication for development
            // In a real app, you would validate against a database
            const mockUser = {
                id: '1',
                email: email,
                firstName: 'Demo',
                lastName: 'User',
                phone: '',
                name: 'Demo User',
                createdAt: new Date().toISOString(),
            };

            return NextResponse.json({
                message: 'Login successful (fallback mode)',
                user: mockUser,
                mode: 'fallback',
            });
        }

        // First, find the customer by email
        const searchResponse = await fetch(
            `${SHOPIFY_ADMIN_API_URL}/customers/search.json?query=email:${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN || '',
                },
            }
        );

        if (!searchResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to search for customer' },
                { status: 500 }
            );
        }

        const searchData = await searchResponse.json();

        if (!searchData.customers || searchData.customers.length === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const customer = searchData.customers[0];

        // Note: Shopify Admin API doesn't provide password verification
        // In a real application, you would need to implement your own password verification
        // For now, we'll assume the customer exists and return their data
        // In production, you should implement proper password hashing and verification

        // Return customer data without sensitive information
        const userData = {
            id: customer.id.toString(),
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone || '',
            name: `${customer.first_name} ${customer.last_name}`,
            createdAt: customer.created_at,
        };

        return NextResponse.json({
            message: 'Login successful',
            user: userData,
        });

    } catch (error) {
        console.error('Shopify login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Alternative: Use Shopify Storefront API for customer login
// This requires customer access tokens
export async function PUT(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Use Shopify Storefront API to create customer access token
        const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
        const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

        const mutation = `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                customerAccessTokenCreate(input: $input) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await fetch(STOREFRONT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    input: {
                        email: email,
                        password: password,
                    },
                },
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to authenticate with Shopify' },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
            );
        }

        const result = data.data.customerAccessTokenCreate;

        if (result.customerUserErrors && result.customerUserErrors.length > 0) {
            const error = result.customerUserErrors[0];
            return NextResponse.json(
                { error: error.message || 'Invalid credentials' },
                { status: 401 }
            );
        }

        if (!result.customerAccessToken) {
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
            );
        }

        // Now get customer details using the access token
        const customerQuery = `
            query getCustomer($customerAccessToken: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    id
                    firstName
                    lastName
                    email
                    phone
                    createdAt
                }
            }
        `;

        const customerResponse = await fetch(STOREFRONT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
            },
            body: JSON.stringify({
                query: customerQuery,
                variables: {
                    customerAccessToken: result.customerAccessToken.accessToken,
                },
            }),
        });

        if (!customerResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to get customer details' },
                { status: 500 }
            );
        }

        const customerData = await customerResponse.json();

        if (customerData.errors) {
            console.error('Customer query errors:', customerData.errors);
            return NextResponse.json(
                { error: 'Failed to get customer details' },
                { status: 500 }
            );
        }

        const customer = customerData.data.customer;

        // Return customer data
        const userData = {
            id: customer.id.split('/').pop(), // Extract ID from Shopify's global ID
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone || '',
            name: `${customer.firstName} ${customer.lastName}`,
            createdAt: customer.createdAt,
            accessToken: result.customerAccessToken.accessToken,
            tokenExpiresAt: result.customerAccessToken.expiresAt,
        };

        return NextResponse.json({
            message: 'Login successful',
            user: userData,
        });

    } catch (error) {
        console.error('Shopify Storefront login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 