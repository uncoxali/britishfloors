import { NextRequest, NextResponse } from 'next/server';

// Mock order data
const mockOrders = [
    {
        id: 'BRF-2024-001',
        orderNumber: 'BRF-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        total: { amount: '299.99', currencyCode: 'GBP' },
        items: [
            {
                id: '1',
                title: 'Premium Oak Hardwood Flooring',
                variantTitle: 'Natural Oak, 20mm thickness',
                quantity: 2,
                price: { amount: '149.99', currencyCode: 'GBP' },
                image: { url: '/placeholder.jpg', altText: 'Oak Flooring' }
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            city: 'London',
            province: 'England',
            zip: 'SW1A 1AA',
            country: 'United Kingdom'
        },
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-20'
    },
    {
        id: 'BRF-2024-002',
        orderNumber: 'BRF-2024-002',
        date: '2024-01-10',
        status: 'processing',
        total: { amount: '599.98', currencyCode: 'GBP' },
        items: [
            {
                id: '2',
                title: 'Engineered Maple Flooring',
                variantTitle: 'Light Maple, 15mm thickness',
                quantity: 3,
                price: { amount: '199.99', currencyCode: 'GBP' },
                image: { url: '/placeholder.jpg', altText: 'Maple Flooring' }
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            city: 'London',
            province: 'England',
            zip: 'SW1A 1AA',
            country: 'United Kingdom'
        },
        trackingNumber: null,
        estimatedDelivery: '2024-01-25'
    },
    {
        id: 'BRF-2024-003',
        orderNumber: 'BRF-2024-003',
        date: '2024-01-05',
        status: 'cancelled',
        total: { amount: '149.99', currencyCode: 'GBP' },
        items: [
            {
                id: '3',
                title: 'Bamboo Flooring',
                variantTitle: 'Natural Bamboo, 12mm thickness',
                quantity: 1,
                price: { amount: '149.99', currencyCode: 'GBP' },
                image: { url: '/placeholder.jpg', altText: 'Bamboo Flooring' }
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main Street',
            city: 'London',
            province: 'England',
            zip: 'SW1A 1AA',
            country: 'United Kingdom'
        },
        trackingNumber: null,
        estimatedDelivery: null,
        cancellationReason: 'Customer requested cancellation'
    }
];

export async function GET(request: NextRequest) {
    try {
        // In a real application, you would:
        // 1. Get the user ID from the session/token
        // 2. Query the database for orders belonging to that user
        // 3. Return the orders

        // For now, we'll return mock data
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');

        let filteredOrders = mockOrders;

        // Filter by status if provided
        if (status) {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        return NextResponse.json({
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredOrders.length / limit),
                totalOrders: filteredOrders.length,
                hasNextPage: endIndex < filteredOrders.length,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        // In a real application, you would:
        // 1. Validate the order ID belongs to the current user
        // 2. Update the order status or perform the requested action
        // 3. Return the updated order

        const order = mockOrders.find(o => o.id === orderId);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Order action completed successfully',
            order
        });

    } catch (error) {
        console.error('Error processing order action:', error);
        return NextResponse.json(
            { error: 'Failed to process order action' },
            { status: 500 }
        );
    }
} 