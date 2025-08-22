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
            billingAddress,
            paymentMethod,
            discountCode,
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

        // Check if we're in development mode or if Shopify credentials are missing
        const isDevelopment = process.env.NODE_ENV === 'development';
        const hasShopifyCredentials = SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
            SHOPIFY_STORE_DOMAIN !== 'your-store.myshopify.com' &&
            SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your-storefront-access-token';

        console.log('Shopify credentials check:', {
            isDevelopment,
            hasShopifyCredentials,
            storeDomain: SHOPIFY_STORE_DOMAIN,
            hasToken: !!SHOPIFY_STOREFRONT_ACCESS_TOKEN
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

        // Create Shopify checkout line items with enhanced product information
        const lineItems = items.map((item: {
            variantId: string;
            quantity: number;
            title: string;
            variantTitle: string;
            price: { amount: string; currencyCode: string };
        }) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            // Include additional product information for better Shopify integration
            customAttributes: [
                { key: 'product_title', value: item.title },
                { key: 'variant_title', value: item.variantTitle },
                { key: 'price_per_unit', value: item.price.amount },
                { key: 'currency', value: item.price.currencyCode }
            ]
        }));

        console.log('Creating Shopify checkout with:', {
            storeDomain: SHOPIFY_STORE_DOMAIN,
            lineItemsCount: lineItems.length,
            customerEmail: customer?.email,
            lineItems: lineItems.map((item: { variantId: string; quantity: number; customAttributes: any[] }) => ({
                variantId: item.variantId,
                quantity: item.quantity,
                customAttributes: item.customAttributes
            }))
        });

        // Create checkout session using Shopify Storefront API with enhanced mutation
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
                        subtotalPrice {
                            amount
                            currencyCode
                        }
                        totalTax {
                            amount
                            currencyCode
                        }
                        shippingLine {
                            price {
                                amount
                                currencyCode
                            }
                        }
                        lineItems(first: 250) {
                            edges {
                                node {
                                    id
                                    title
                                    variant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    quantity
                                }
                            }
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

        // Prepare shipping address for Shopify
        const shopifyShippingAddress = {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            address1: shippingAddress.address1,
            address2: shippingAddress.address2 || '',
            city: shippingAddress.city,
            province: shippingAddress.state,
            zip: shippingAddress.zipCode,
            country: shippingAddress.country || 'GB',
            phone: shippingAddress.phone,
        };

        // Prepare billing address for Shopify
        const shopifyBillingAddress = {
            firstName: billingAddress.firstName,
            lastName: billingAddress.lastName,
            address1: billingAddress.address1,
            address2: billingAddress.address2 || '',
            city: billingAddress.city,
            province: billingAddress.state,
            zip: billingAddress.zipCode,
            country: billingAddress.country || 'GB',
            phone: billingAddress.phone,
        };

        // Create note with order details
        const orderNote = [
            `Payment Method: ${paymentMethod}`,
            `Items: ${items.map((item: { title: string; variantTitle: string; quantity: number }) => `${item.title} (${item.variantTitle}) x${item.quantity}`).join(', ')}`,
            discountCode ? `Discount Code: ${discountCode}` : '',
            `Subtotal: £${subtotal.toFixed(2)}`,
            `Shipping: £${shipping.toFixed(2)}`,
            `Tax: £${tax.toFixed(2)}`,
            `Total: £${total.toFixed(2)}`
        ].filter(Boolean).join(' | ');

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
                        email: customer.email,
                        shippingAddress: shopifyShippingAddress,
                        billingAddress: shopifyBillingAddress,
                        note: orderNote,
                        // Include additional checkout options
                        presentmentCurrencyCode: 'GBP',
                        // Add shipping rate if available
                        shippingRateHandle: shipping === 0 ? 'free_shipping' : 'standard_shipping',
                    },
                },
            }),
        });

        if (!response.ok) {
            console.error('Shopify API response not ok:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Shopify API error response:', errorText);
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

        console.log('Checkout created successfully:', {
            checkoutId: checkout.id,
            checkoutUrl: checkout.webUrl,
            totalPrice: checkout.totalPrice,
            lineItemsCount: checkout.lineItems?.edges?.length || 0
        });

        return NextResponse.json({
            checkoutUrl: checkout.webUrl,
            checkoutId: checkout.id,
            total: checkout.totalPrice,
            subtotal: checkout.subtotalPrice,
            tax: checkout.totalTax,
            shipping: checkout.shippingLine?.price,
            lineItems: checkout.lineItems?.edges?.map((edge: any) => edge.node) || [],
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