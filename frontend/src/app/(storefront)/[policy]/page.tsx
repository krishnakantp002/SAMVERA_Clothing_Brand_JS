import * as React from 'react';
import { notFound } from 'next/navigation';

const POLICIES: Record<string, { title: string; content: string }> = {
  faq: {
    title: 'Frequently Asked Questions',
    content: 'We are currently updating our FAQ. Please contact support at samvera2116@gmail.com for any queries.'
  },
  shipping: {
    title: 'Shipping & Returns',
    content: 'All orders are processed within 1-2 business days. Free shipping on orders over ₹999. We accept returns within 7 days of delivery.'
  },
  'size-guide': {
    title: 'Size Guide',
    content: 'Our T-Shirts are true to size. For oversized fits, we recommend buying your regular size as the garment is already constructed with a dropped shoulder and wider body.'
  },
  privacy: {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. We do not sell your personal data to third parties. All payment information is securely processed via Razorpay.'
  },
  terms: {
    title: 'Terms of Service',
    content: 'By using the SAMVERA platform, you agree to our terms of service.'
  }
};

export default function PolicyPage({ params }: { params: { policy: string } }) {
  const data = POLICIES[params.policy.toLowerCase()];

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl font-bold text-white">{data.title}</h1>
        <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-8 shadow-xl">
          <p className="text-lg leading-relaxed text-surface-300">
            {data.content}
          </p>
        </div>
      </div>
    </main>
  );
}
