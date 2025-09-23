import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// GraphQL query to get inventory item cost
const GET_INVENTORY_COST_QUERY = `
  query getProductInventory($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 1) {
        edges {
          node {
            id
            title
            inventoryItem {
              id
              unitCost {
                amount
                currencyCode
              }
              tracked
            }
          }
        }
      }
    }
  }
`;

// Fallback query without inventory cost if permissions are insufficient
const GET_PRODUCT_SIMPLE_QUERY = `
  query getProductSimple($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 1) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
    try {
        // Check environment variables
        if (!ADMIN_API_URL || !ADMIN_ACCESS_TOKEN) {
            console.error('Missing environment variables:', {
                ADMIN_API_URL: !!ADMIN_API_URL,
                ADMIN_ACCESS_TOKEN: !!ADMIN_ACCESS_TOKEN
            });
            return NextResponse.json(
                { error: 'Server configuration error: Missing Admin API credentials' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Format product ID for GraphQL
        const gqlProductId = productId.startsWith('gid://shopify/Product/')
            ? productId
            : `gid://shopify/Product/${productId}`;

        console.log('Fetching inventory cost for:', gqlProductId);

        // First try the inventory cost query
        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
            },
            body: JSON.stringify({
                query: GET_INVENTORY_COST_QUERY,
                variables: {
                    id: gqlProductId,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Admin API HTTP Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return NextResponse.json(
                {
                    error: `Admin API request failed: ${response.status}`,
                    details: errorText
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Admin API Response:', JSON.stringify(data, null, 2));

        // Check for GraphQL errors - if permission error, try fallback
        if (data.errors && data.errors.length > 0) {
            console.error('GraphQL Errors:', JSON.stringify(data.errors, null, 2));

            // Check for read_products scope error
            const hasReadProductsError = data.errors.some((error: { message?: string; extensions?: { code?: string; requiredAccess?: string } }) =>
                error.extensions?.code === 'ACCESS_DENIED' &&
                error.extensions?.requiredAccess?.includes('read_products')
            );

            if (hasReadProductsError) {
                return NextResponse.json(
                    {
                        error: 'Missing read_products scope',
                        details: 'Your Admin API access token does not have the read_products scope',
                        solution: 'Please update your Shopify Admin API access token to include the read_products scope',
                        requiredScopes: ['read_products', 'read_inventory'],
                        currentError: data.errors[0]
                    },
                    { status: 403 }
                );
            }

            // Check if it's a permission error for inventory
            const hasInventoryPermissionError = data.errors.some((error: { message?: string }) =>
                error.message && (
                    error.message.includes('inventoryItem') ||
                    error.message.includes('inventory') ||
                    error.message.includes('unitCost')
                )
            );

            if (hasInventoryPermissionError) {
                return NextResponse.json(
                    {
                        error: 'Missing read_inventory scope',
                        details: 'Admin API token does not have inventory read permissions',
                        solution: 'Add read_inventory scope to your Admin API access token',
                        requiredScopes: ['read_products', 'read_inventory']
                    },
                    { status: 403 }
                );
            }

            // Other GraphQL errors
            const hasPermissionError = data.errors.some((error: { message?: string }) =>
                error.message && (
                    error.message.includes('access') ||
                    error.message.includes('permission') ||
                    error.message.includes('scope') ||
                    error.message.includes('unauthorized')
                )
            );

            if (hasPermissionError) {
                return NextResponse.json(
                    {
                        error: 'Admin API permission error',
                        details: data.errors,
                        solution: 'Check your Admin API access token scopes'
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                {
                    error: 'GraphQL query failed',
                    details: data.errors
                },
                { status: 400 }
            );
        }

        // Extract data
        const product = data.data?.product;
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const variant = product.variants?.edges?.[0]?.node;
        if (!variant) {
            return NextResponse.json(
                { error: 'No variants found for this product' },
                { status: 404 }
            );
        }

        const inventoryItem = variant.inventoryItem;
        const unitCost = inventoryItem?.unitCost;

        if (!unitCost || !unitCost.amount) {
            return NextResponse.json(
                {
                    error: 'Unit cost not set for this product',
                    productTitle: product.title,
                    variantId: variant.id
                },
                { status: 404 }
            );
        }

        // Return successful response
        return NextResponse.json({
            success: true,
            productId: product.id,
            productTitle: product.title,
            variantId: variant.id,
            unitCost: {
                amount: parseFloat(unitCost.amount),
                currencyCode: unitCost.currencyCode,
            },
        });

    } catch (error) {
        console.error('Inventory cost API error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}