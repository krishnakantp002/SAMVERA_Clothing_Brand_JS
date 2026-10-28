'use client';

import * as React from 'react';
import { HelpCircle, MessageCircle, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export function ProductQA({ productId }: { productId: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [question, setQuestion] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchQuestions = React.useCallback(async () => {
    try {
      const res = await api.get(`/qa/product/${productId}`);
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch Q&A', e);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        question,
        userName: isAuthenticated ? `${user?.firstName} ${user?.lastName}` : 'Guest User',
        userEmail: isAuthenticated ? user?.email : 'guest@example.com'
      };

      const res = await api.post(`/qa/product/${productId}`, payload);

      if (res.data.success) {
        alert("Your question has been submitted! It will appear once answered by our team.");
        setQuestion('');
      }
    } catch (e: any) {
      console.error(e);
      alert("Failed to submit question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-surface-200 pt-16">
      <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-brand-500" /> Questions & Answers
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Ask a question form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
            <h3 className="font-bold text-lg mb-4">Have a question about this product?</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-surface-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. Does this shrink after washing?"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" /> {isSubmitting ? "Submitting..." : "Ask Question"}
              </Button>
              {!isAuthenticated && (
                <p className="text-xs text-surface-500 text-center mt-2">
                  You are asking as a Guest.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Questions List */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-surface-100 rounded-xl" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-surface-500 bg-surface-50 rounded-2xl border border-surface-200">
              No questions yet. Be the first to ask!
            </div>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-surface-200">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                    Q
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black leading-relaxed">{q.question}</h4>
                    <p className="text-xs text-surface-500 mt-1">Asked by {q.userName || 'Anonymous'} on {new Date(q.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {q.answer && (
                  <div className="flex gap-4 mt-4 bg-surface-50 p-4 rounded-xl">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-bold">
                      A
                    </div>
                    <div>
                      <p className="text-sm text-surface-800 leading-relaxed font-medium">{q.answer}</p>
                      <p className="text-xs text-brand-600 mt-1 font-semibold uppercase tracking-widest">Samvera Team</p>
                    </div>
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
