'use client';

import * as React from 'react';
import { HelpCircle, Reply, CheckCircle2, Search } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminQAPage() {
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [answeringId, setAnsweringId] = React.useState<string | null>(null);
  const [answerText, setAnswerText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/qa');
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch QA', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerSubmit = async (id: string) => {
    if (!answerText.trim()) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/qa/${id}/answer`, { answer: answerText });
      setAnsweringId(null);
      setAnswerText('');
      fetchQuestions(); // Refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <HelpCircle className="h-6 w-6" /> Q&A Management
        </h1>
        <p className="text-surface-400 mt-2">Answer customer questions about your products.</p>
      </div>

      <div className="grid gap-6">
        {questions.length === 0 ? (
          <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-8 text-center text-surface-500">
            No questions found.
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{q.question}</h3>
                  <div className="flex items-center gap-2 text-sm text-surface-400 mt-1">
                    <span>{q.userName || 'Guest'}</span>
                    <span>•</span>
                    <a href={`/products/${q.product?.slug}`} target="_blank" className="text-brand-400 hover:underline">{q.product?.name}</a>
                    <span>•</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  {q.status === 'ANSWERED' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      <CheckCircle2 className="h-4 w-4" /> Answered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {q.answer && (
                <div className="bg-surface-800/50 p-4 rounded-lg mt-2">
                  <p className="text-sm font-semibold text-brand-400 mb-1">Your Answer:</p>
                  <p className="text-sm text-surface-200 leading-relaxed">{q.answer}</p>
                </div>
              )}

              {answeringId === q.id ? (
                <div className="mt-4 flex flex-col gap-3 border-t border-surface-800 pt-4">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write your answer..."
                    className="w-full rounded-lg border border-surface-700 bg-surface-950 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setAnsweringId(null)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleAnswerSubmit(q.id)}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setAnsweringId(q.id);
                      setAnswerText(q.answer || '');
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300"
                  >
                    <Reply className="h-4 w-4" /> {q.answer ? 'Edit Answer' : 'Answer Question'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
