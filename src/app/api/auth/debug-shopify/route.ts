import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
        const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

        const debugInfo: {
            environment: {
                NODE_ENV: string | undefined;
                SHOPIFY_STORE_DOMAIN: string | undefined;
                HAS_ADMIN_TOKEN: boolean;
                ADMIN_TOKEN_LENGTH: number;
                ADMIN_TOKEN_PREFIX: string;
            };
            tests: Record<string, {
                success: boolean;
                error?: string;
                status?: number;
                ok?: boolean;
                shopName?: string;
                shopDomain?: string;
                customerCount?: number;
                customerId?: number;
                details?: Record<string, unknown>;
            }>;
            summary?: {
                allTestsPassed: boolean;
                totalTests: number;
                passedTests: number;
            };
        } = {
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN,
                HAS_ADMIN_TOKEN: !!SHOPIFY_ADMIN_ACCESS_TOKEN,
                ADMIN_TOKEN_LENGTH: SHOPIFY_ADMIN_ACCESS_TOKEN?.length || 0,
                ADMIN_TOKEN_PREFIX: SHOPIFY_ADMIN_ACCESS_TOKEN?.substring(0, 10) + '...' || 'N/A',
            },
            tests: {},
        };

        // Test 1: Check if credentials are set
        if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
            debugInfo.tests.credentials = {
                success: false,
                error: 'Missing Shopify credentials',
                details: {
                    storeDomain: !SHOPIFY_STORE_DOMAIN ? 'Missing' : 'Set',
                    adminToken: !SHOPIFY_ADMIN_ACCESS_TOKEN ? 'Missing' : 'Set',
                }
            };
            return NextResponse.json(debugInfo);
        }

        // Test 2: Test Admin API connection
        try {
            const adminResponse = await fetch(
                `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/shop.json`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
                    },
                }
            );

            debugInfo.tests.adminApi = {
                status: adminResponse.status,
                ok: adminResponse.ok,
                success: adminResponse.ok,
            };

            if (adminResponse.ok) {
                const shopData = await adminResponse.json();
                debugInfo.tests.adminApi.shopName = shopData.shop?.name;
                debugInfo.tests.adminApi.shopDomain = shopData.shop?.domain;
            } else {
                const errorText = await adminResponse.text();
                debugInfo.tests.adminApi.error = `HTTP ${adminResponse.status}: ${errorText}`;
            }
        } catch (error) {
            debugInfo.tests.adminApi = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }

        // Test 3: Test customer creation capability
        if (debugInfo.tests.adminApi?.success) {
            try {
                const customerTestResponse = await fetch(
                    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers/count.json`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
                        },
                    }
                );

                debugInfo.tests.customerApi = {
                    status: customerTestResponse.status,
                    ok: customerTestResponse.ok,
                    success: customerTestResponse.ok,
                };

                if (customerTestResponse.ok) {
                    const customerData = await customerTestResponse.json();
                    debugInfo.tests.customerApi.customerCount = customerData.count;
                } else {
                    const errorText = await customerTestResponse.text();
                    debugInfo.tests.customerApi.error = `HTTP ${customerTestResponse.status}: ${errorText}`;
                }
            } catch (error) {
                debugInfo.tests.customerApi = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        } else {
            debugInfo.tests.customerApi = {
                success: false,
                error: 'Admin API not available',
            };
        }

        // Test 4: Test customer creation with dummy data
        if (debugInfo.tests.customerApi?.success) {
            try {
                const testCustomerData = {
                    customer: {
                        first_name: 'Test',
                        last_name: 'User',
                        email: `test-${Date.now()}@example.com`,
                        phone: '',
                        password: 'testpassword123',
                        password_confirmation: 'testpassword123',
                        accepts_marketing: false,
                        send_email_welcome: false,
                    },
                };

                const createTestResponse = await fetch(
                    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers.json`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
                        },
                        body: JSON.stringify(testCustomerData),
                    }
                );

                debugInfo.tests.customerCreation = {
                    status: createTestResponse.status,
                    ok: createTestResponse.ok,
                    success: createTestResponse.ok,
                };

                if (createTestResponse.ok) {
                    const customerResponse = await createTestResponse.json();
                    debugInfo.tests.customerCreation.customerId = customerResponse.customer?.id;

                    // Clean up: Delete the test customer
                    if (customerResponse.customer?.id) {
                        await fetch(
                            `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers/${customerResponse.customer.id}.json`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
                                },
                            }
                        );
                    }
                } else {
                    const errorData = await createTestResponse.json();
                    debugInfo.tests.customerCreation.error = `HTTP ${createTestResponse.status}: ${JSON.stringify(errorData)}`;
                }
            } catch (error) {
                debugInfo.tests.customerCreation = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        } else {
            debugInfo.tests.customerCreation = {
                success: false,
                error: 'Customer API not available',
            };
        }

        // Summary
        const allTestsPassed = Object.values(debugInfo.tests).every((test) => test.success);
        debugInfo.summary = {
            allTestsPassed,
            totalTests: Object.keys(debugInfo.tests).length,
            passedTests: Object.values(debugInfo.tests).filter((test) => test.success).length,
        };

        return NextResponse.json(debugInfo);

    } catch (error) {
        console.error('Shopify debug error:', error);
        return NextResponse.json(
            {
                error: 'Failed to debug Shopify connection',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
} 