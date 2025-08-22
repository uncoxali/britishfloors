import { NextRequest, NextResponse } from 'next/server';

// Shopify Customer API endpoints
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`;

// Create a new customer in Shopify
export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();

        const { email, password, firstName, lastName, phone } = requestBody;

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Email, password, first name, and last name are required' },
                { status: 400 }
            );
        }

        // Check if Shopify credentials are configured
        if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
            // Fallback: Create a mock customer for development
            const mockCustomer = {
                id: Date.now().toString(),
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone || '',
                name: `${firstName} ${lastName}`,
                createdAt: new Date().toISOString(),
            };

            // Ensure email field is properly set
            mockCustomer.email = email;

            const response = {
                message: 'Customer created successfully (fallback mode)',
                user: {
                    id: mockCustomer.id,
                    email: mockCustomer.email,
                    firstName: mockCustomer.firstName,
                    lastName: mockCustomer.lastName,
                    phone: mockCustomer.phone,
                    name: mockCustomer.name,
                    createdAt: mockCustomer.createdAt,
                },
                mode: 'fallback',
            };

            return NextResponse.json(response);
        }

        // Check if customer already exists
        const existingCustomerResponse = await fetch(
            `${SHOPIFY_ADMIN_API_URL}/customers/search.json?query=email:${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN || '',
                },
            }
        );

        if (existingCustomerResponse.ok) {
            const existingData = await existingCustomerResponse.json();
            if (existingData.customers && existingData.customers.length > 0) {
                return NextResponse.json(
                    { error: 'Customer with this email already exists' },
                    { status: 409 }
                );
            }
        }

        // Create new customer in Shopify
        const customerData = {
            customer: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone || '',
                password: password,
                password_confirmation: password,
                accepts_marketing: false,
                send_email_welcome: true,
            },
        };

        const createCustomerResponse = await fetch(
            `${SHOPIFY_ADMIN_API_URL}/customers.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN || '',
                },
                body: JSON.stringify(customerData),
            }
        );

        if (!createCustomerResponse.ok) {
            const errorData = await createCustomerResponse.json();
            return NextResponse.json(
                { error: 'Failed to create customer in Shopify' },
                { status: 500 }
            );
        }

        const customerResponse = await createCustomerResponse.json();
        const customer = customerResponse.customer;

        // Return customer data without sensitive information
        // If Shopify doesn't return first_name/last_name, use the input data
        const userData = {
            id: customer.id.toString(),
            email: customer.email,
            firstName: customer.first_name || firstName,
            lastName: customer.last_name || lastName,
            phone: customer.phone || phone || '',
            name: `${customer.first_name || firstName} ${customer.last_name || lastName}`.trim(),
            createdAt: customer.created_at,
        };

        const response = {
            message: 'Customer created successfully',
            user: userData,
        };

        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get customer by email
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${SHOPIFY_ADMIN_API_URL}/customers/search.json?query=email:${email}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN || '',
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch customer from Shopify' },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (!data.customers || data.customers.length === 0) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        const customer = data.customers[0];

        // Return customer data without sensitive information
        // Handle missing first_name/last_name from Shopify response
        const firstName = customer.first_name || customer.display_name?.split(' ')[0] || '';
        const lastName = customer.last_name || customer.display_name?.split(' ').slice(1).join(' ') || '';

        const userData = {
            id: customer.id.toString(),
            email: customer.email,
            firstName: firstName,
            lastName: lastName,
            phone: customer.phone || '',
            name: `${firstName} ${lastName}`.trim() || customer.display_name || customer.email,
            createdAt: customer.created_at,
        };

        return NextResponse.json({ user: userData });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 