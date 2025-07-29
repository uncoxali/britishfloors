import { NextRequest, NextResponse } from 'next/server';

// Import Shopify config with error handling
let SHOPIFY_STORE_DOMAIN = '';
let SHOPIFY_STOREFRONT_ACCESS_TOKEN = '';

try {
    const config = await import('@/lib/shopify/config');
    SHOPIFY_STORE_DOMAIN = config.SHOPIFY_STORE_DOMAIN;
    SHOPIFY_STOREFRONT_ACCESS_TOKEN = config.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
} catch {
    console.log('Shopify config not available, using development mode');
}

export async function POST(request: NextRequest) {
    try {
        console.log('Checkout API called');

        // Parse request body with error handling
        let requestData;
        try {
            requestData = await request.json();
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const {
            items,
            customer,
            shippingAddress,
            billingAddress,
            paymentMethod,
            discountCode,
            discountAmount,
        } = requestData;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: { price: { amount: string }; quantity: number }) => {
            return sum + (parseFloat(item.price.amount) * item.quantity);
        }, 0);

        const shipping = subtotal >= 100 ? 0 : 10;
        const tax = subtotal * 0.20; // 20% VAT for UK
        const total = subtotal + shipping + tax - (discountAmount || 0);

        // Check if we're in development mode or if Shopify credentials are missing
        const isDevelopment = process.env.NODE_ENV === 'development';
        const hasShopifyCredentials = SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
            SHOPIFY_STORE_DOMAIN !== 'your-store.myshopify.com' &&
            SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your-storefront-access-token';

        // If in development mode or missing credentials, use mock checkout
        if (isDevelopment || !hasShopifyCredentials) {
            console.log('Using development/mock checkout mode');

            // Generate a mock order ID
            const orderId = `BRF-${Date.now().toString().slice(-8)}`;

            // Create mock checkout response
            const mockCheckoutUrl = `/checkout/success?orderId=${orderId}`;

            return NextResponse.json({
                checkoutUrl: mockCheckoutUrl,
                checkoutId: orderId,
                total: {
                    amount: total.toFixed(2),
                    currencyCode: 'GBP'
                },
                isMock: true
            });
        }

        // Create Shopify checkout line items
        const lineItems = items.map((item: { variantId: string; quantity: number }) => ({
            variantId: item.variantId,
            quantity: item.quantity,
        }));

        console.log('Creating Shopify checkout with:', {
            storeDomain: SHOPIFY_STORE_DOMAIN,
            lineItemsCount: lineItems.length,
            customerEmail: customer?.email
        });

        // Create checkout session using Shopify Storefront API
        const checkoutMutation = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        totalPrice {
                            amount
                            currencyCode
                        }
                    }
                    checkoutUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: checkoutMutation,
                variables: {
                    input: {
                        lineItems,
                        email: customer?.email,
                        shippingAddress: {
                            firstName: shippingAddress.firstName,
                            lastName: shippingAddress.lastName,
                            address1: shippingAddress.address1,
                            address2: shippingAddress.address2,
                            city: shippingAddress.city,
                            province: shippingAddress.state,
                            zip: shippingAddress.zipCode,
                            country: shippingAddress.country,
                            phone: shippingAddress.phone,
                        },
                        billingAddress: {
                            firstName: billingAddress.firstName,
                            lastName: billingAddress.lastName,
                            address1: billingAddress.address1,
                            address2: billingAddress.address2,
                            city: billingAddress.city,
                            province: billingAddress.state,
                            zip: billingAddress.zipCode,
                            country: billingAddress.country,
                            phone: billingAddress.phone,
                        },
                        note: `Payment Method: ${paymentMethod}${discountCode ? ` | Discount: ${discountCode}` : ''}`,
                    },
                },
            }),
        });

        if (!response.ok) {
            console.error('Shopify API response not ok:', response.status, response.statusText);
            return NextResponse.json(
                { error: `Shopify API error: ${response.status} ${response.statusText}` },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log('Shopify API response:', data);

        if (data.errors) {
            console.error('Shopify checkout error:', data.errors);
            return NextResponse.json(
                { error: 'Failed to create checkout session: ' + data.errors[0]?.message },
                { status: 500 }
            );
        }

        if (data.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
            const errors = data.data.checkoutCreate.checkoutUserErrors;
            console.error('Checkout user errors:', errors);
            return NextResponse.json(
                { error: errors[0].message },
                { status: 400 }
            );
        }

        const checkout = data.data?.checkoutCreate?.checkout;

        if (!checkout?.webUrl) {
            console.error('No checkout URL in response:', data);
            return NextResponse.json(
                { error: 'Failed to create checkout URL' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            checkoutUrl: checkout.webUrl,
            checkoutId: checkout.id,
            total: checkout.totalPrice,
            isMock: false
        });

    } catch (error) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
} 