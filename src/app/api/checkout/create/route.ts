import { NextRequest, NextResponse } from 'next/server';

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
            discountAmount,
        } = requestData;

        // Validate required data
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        if (!customer?.email) {
            return NextResponse.json(
                { error: 'Customer email is required' },
                { status: 400 }
            );
        }

        if (!shippingAddress) {
            return NextResponse.json(
                { error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Validate each cart item has required fields
        for (const item of items) {
            if (!item.variantId || !item.quantity || !item.price?.amount) {
                return NextResponse.json(
                    { error: `Invalid item data: ${JSON.stringify(item)}` },
                    { status: 400 }
                );
            }
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: { price: { amount: string }; quantity: number }) => {
            return sum + (parseFloat(item.price.amount) * item.quantity);
        }, 0);

        const shipping = subtotal >= 100 ? 0 : 10;
        const tax = subtotal * 0.20; // 20% VAT for UK
        const total = subtotal + shipping + tax - (discountAmount || 0);

        console.log('Checkout calculation:', {
            itemsCount: items.length,
            subtotal,
            shipping,
            tax,
            discountAmount,
            total
        });

        // Get Shopify credentials from environment variables
        const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
        const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

        // Check if we're in development mode or if Shopify credentials are missing
        const isDevelopment = process.env.NODE_ENV === 'development';
        const hasShopifyCredentials = SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
            SHOPIFY_STORE_DOMAIN !== 'your-store.myshopify.com' &&
            SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your-storefront-access-token';

        console.log('Shopify credentials check:', {
            isDevelopment,
            hasShopifyCredentials,
            storeDomain: SHOPIFY_STORE_DOMAIN,
            hasToken: !!SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            hasAdminToken: !!SHOPIFY_ADMIN_ACCESS_TOKEN
        });

        // Only use mock checkout if Shopify credentials are completely missing
        if (!hasShopifyCredentials) {
            console.log('No Shopify credentials available, using mock checkout mode');

            // Generate a mock order ID
            const orderId = `BRF-${Date.now().toString().slice(-8)}`;

            // Create mock checkout response - redirect to cart with success message
            const mockCheckoutUrl = `/cart?success=true&orderId=${orderId}`;

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

        // Create cart using Shopify Storefront API
        const createCartMutation = `
            mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        checkoutUrl
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                            subtotalAmount {
                                amount
                                currencyCode
                            }
                            totalTaxAmount {
                                amount
                                currencyCode
                            }
                        }
                        lines(first: 250) {
                            edges {
                                node {
                                    id
                                    quantity
                                    merchandise {
                                        ... on ProductVariant {
                                            id
                                            title
                                            price {
                                                amount
                                                currencyCode
                                            }
                                            product {
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    userErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        // Prepare cart line items with correct format
        const cartLineItems = items.map((item: {
            variantId: string;
            quantity: number;
            title: string;
            variantTitle: string;
            price: { amount: string; currencyCode: string };
        }) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity
        }));

        console.log('Creating Shopify cart with:', {
            storeDomain: SHOPIFY_STORE_DOMAIN,
            lineItemsCount: cartLineItems.length,
            customerEmail: customer?.email
        });

        const cartInput = {
            lines: cartLineItems,
            buyerIdentity: {
                email: customer.email,
                countryCode: shippingAddress.country || 'GB'
            }
        };

        const cartResponse = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: createCartMutation,
                variables: {
                    input: cartInput,
                },
            }),
        });

        if (!cartResponse.ok) {
            console.error('Shopify cart API response not ok:', cartResponse.status, cartResponse.statusText);
            const errorText = await cartResponse.text();
            console.error('Shopify cart API error response:', errorText);
            return NextResponse.json(
                { error: `Shopify cart API error: ${cartResponse.status} ${cartResponse.statusText}` },
                { status: 500 }
            );
        }

        const cartData = await cartResponse.json();
        console.log('Shopify cart API response:', cartData);

        if (cartData.errors) {
            console.error('Shopify cart creation error:', cartData.errors);
            return NextResponse.json(
                { error: 'Failed to create cart: ' + cartData.errors[0]?.message },
                { status: 500 }
            );
        }

        if (cartData.data?.cartCreate?.userErrors?.length > 0) {
            const errors = cartData.data.cartCreate.userErrors;
            console.error('Cart user errors:', errors);
            return NextResponse.json(
                { error: errors[0].message },
                { status: 400 }
            );
        }

        const cart = cartData.data?.cartCreate?.cart;

        if (!cart?.checkoutUrl) {
            console.error('No checkout URL in cart response:', cartData);
            return NextResponse.json(
                { error: 'Failed to create checkout URL' },
                { status: 500 }
            );
        }

        console.log('Cart created successfully:', {
            cartId: cart.id,
            checkoutUrl: cart.checkoutUrl,
            totalAmount: cart.cost?.totalAmount,
            lineItemsCount: cart.lines?.edges?.length || 0
        });

        return NextResponse.json({
            checkoutUrl: cart.checkoutUrl,
            checkoutId: cart.id,
            total: cart.cost?.totalAmount,
            subtotal: cart.cost?.subtotalAmount,
            tax: cart.cost?.totalTaxAmount,
            lineItems: cart.lines?.edges?.map((edge: { node: { id: string; quantity: number; merchandise: { id: string; title: string; price: { amount: string; currencyCode: string } } } }) => edge.node) || [],
            isMock: false,
            clearCart: true // Signal to frontend to clear the cart
        });

    } catch (error) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
} 