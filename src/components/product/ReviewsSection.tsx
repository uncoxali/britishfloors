'use client';

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  productId?: string;
  name: string;
  email?: string;
  date: string;
  rating: number;
  comment: string;
  isVerified: boolean;
}

const ReviewsSection: React.FC<{ productId: string }> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?productId=${productId}`);
        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews);
        } else {
          setError(data.error || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          name,
          email,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new review to the list
        setReviews((prev) => [...prev, data.review]);
        // Reset form
        setRating(0);
        setName('');
        setEmail('');
        setComment('');
      } else {
        console.error('Error submitting review:', data.error);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Custom Star Icon Component
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-5 h-5 ${filled ? 'text-amber-500' : 'text-gray-300'}`}
      fill='currentColor'
      viewBox='0 0 20 20'
    >
      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
    </svg>
  );

  // Large Star Icon for rating selection
  const LargeStarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-8 h-8 ${filled ? 'text-amber-500' : 'text-gray-300'}`}
      fill='currentColor'
      viewBox='0 0 20 20'
    >
      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
    </svg>
  );

  if (loading) {
    return (
      <div className='mt-16 -mx-4 sm:-mx-6 lg:-mx-8'>
        <div className='bg-[#FAF5EE] py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center py-8'>
              <p>Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-16 -mx-4 sm:-mx-6 lg:-mx-8'>
      <div className='bg-[#FAF5EE] py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Reviews List */}
            <div>
              <h2 className='text-2xl font-bold text-blue-900 mb-6'>Reviews</h2>

              {error && <div className='bg-red-50 text-red-700 p-4 rounded-lg mb-6'>{error}</div>}

              <div className='space-y-6'>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className='bg-white rounded-2xl p-6 shadow-sm'>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>{review.name}</h3>
                          <p className='text-sm text-gray-500'>{review.date}</p>
                        </div>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < review.rating} />
                          ))}
                        </div>
                      </div>
                      <p className='text-gray-700'>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500'>
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div>
              <h2 className='text-2xl font-bold text-blue-900 mb-6'>Write a Review</h2>

              <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-6 shadow-sm'>
                <div className='mb-6'>
                  <label className='block text-gray-700 mb-2'>Your Rating</label>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type='button'
                        className='text-2xl focus:outline-none'
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHover(i + 1)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <LargeStarIcon filled={i < (hover || rating)} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-gray-700 mb-2'>
                      Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 mb-2'>
                      Email <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                      required
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 mb-2'>
                    Your Review <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                    required
                  ></textarea>
                </div>

                <div className='mb-6'>
                  <label className='block text-gray-700 mb-2'>Upload Image (Optional)</label>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                    <p className='text-gray-500 text-sm mb-2'>Drop file here or click to upload</p>
                    <p className='text-gray-400 text-xs'>
                      Allowed formats: JPEG, JPG, PNG, GIF. Max size: 1 MB
                    </p>
                  </div>
                </div>

                <button
                  type='submit'
                  className='w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-lg transition-colors'
                  disabled={rating === 0}
                >
                  Submit review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
