import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for reviews (in a real application, this would be a database)
// This is just for demonstration purposes
const reviews: {
    [productId: string]: {
        id: string;
        productId: string;
        name: string;
        email: string;
        date: string;
        rating: number;
        comment: string;
        isVerified: boolean;
        likes: number;
        dislikes: number;
    }[];
} = {};

// Get reviews for a product
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const productReviews = reviews[productId] || [];

        return NextResponse.json({
            reviews: productReviews,
            count: productReviews.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// Add a review for a product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, name, email, rating, comment } = body;

        if (!productId || !name || !email || !rating || !comment) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Initialize reviews array for this product if it doesn't exist
        if (!reviews[productId]) {
            reviews[productId] = [];
        }

        // Create new review
        const newReview = {
            id: Date.now().toString(),
            productId,
            name,
            email,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            rating,
            comment,
            isVerified: true, // In a real app, this would depend on whether the user purchased the product
            likes: 0,
            dislikes: 0
        };

        // Add to reviews array
        reviews[productId].push(newReview);

        return NextResponse.json({
            message: 'Review added successfully',
            review: newReview
        });
    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json(
            { error: 'Failed to add review' },
            { status: 500 }
        );
    }
}

// Update a review (like/dislike)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, reviewId, action } = body;

        if (!productId || !reviewId || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!reviews[productId]) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const reviewIndex = reviews[productId].findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // Update like/dislike counts
        if (action === 'like') {
            reviews[productId][reviewIndex].likes += 1;
        } else if (action === 'dislike') {
            reviews[productId][reviewIndex].dislikes += 1;
        } else {
            return NextResponse.json(
                { error: 'Invalid action. Use "like" or "dislike"' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'Review updated successfully',
            review: reviews[productId][reviewIndex]
        });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        );
    }
}