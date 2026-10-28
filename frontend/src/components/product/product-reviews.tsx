'use client';

import * as React from 'react';
import { Star, Upload, User, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export function ProductReviews({ productId }: { productId: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await api.get(`/reviews/${productId}`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to submit a review.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let images: string[] = [];
      
      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          images.push(uploadRes.data.data.url);
        }
      }

      const reviewRes = await api.post(`/reviews/${productId}`, {
        rating,
        title,
        comment,
        images
      });

      if (reviewRes.data.success) {
        alert("Review submitted successfully!");
        setTitle('');
        setComment('');
        setImageFile(null);
        setImagePreview('');
        fetchReviews(); // Reload reviews
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.error?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 border-t border-surface-200 pt-16">
      <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl" id="reviews">
        Customer Reviews
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Write a review form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`h-6 w-6 ${star <= rating ? 'fill-brand-500 text-brand-500' : 'text-surface-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-surface-200 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Brief summary of your review"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Review</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-surface-200 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="What did you like or dislike?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Add Photo</label>
                  <div className="mt-1 flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-surface-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black">×</button>
                      </div>
                    ) : (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100">
                        <Upload className="h-5 w-5 text-surface-500" />
                        <span className="mt-1 text-[10px] text-surface-500 font-medium">Upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-surface-600 mb-4">You must be logged in to write a review.</p>
                <Button variant="outline" onClick={() => window.location.href = '/login'}>Log In to Review</Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-surface-100 rounded-xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-surface-500 bg-surface-50 rounded-2xl border border-surface-200">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-surface-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100 text-sm font-bold">
                      {review.user?.firstName?.[0] || <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black flex items-center gap-2">
                        {review.user?.firstName} {review.user?.lastName}
                        {review.isVerified && (
                          <span className="text-[10px] bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Verified Buyer</span>
                        )}
                      </p>
                      <p className="text-xs text-surface-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-brand-500 text-brand-500' : 'text-surface-200'}`} />
                    ))}
                  </div>
                </div>
                
                <h4 className="font-bold text-sm text-black mb-2">{review.title}</h4>
                <p className="text-sm text-surface-600 mb-4 leading-relaxed">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img} alt="Review photo" className="h-24 w-24 rounded-lg object-cover border border-surface-200" />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}
