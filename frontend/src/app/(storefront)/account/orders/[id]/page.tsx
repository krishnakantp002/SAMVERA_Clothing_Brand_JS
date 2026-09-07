'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  // In a real app we would fetch the order details using the orderId here.
  
  return (
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-surface-800 bg-surface-900/50 p-8 text-center sm:p-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          
          <h1 className="mt-6 font-display text-3xl font-bold text-white">Order Confirmed!</h1>
          <p className="mt-2 text-surface-400">
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
          
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-surface-700 bg-surface-800 px-4 py-2 text-sm text-white">
            <span className="text-surface-400">Order ID:</span>
            <span className="font-mono font-medium">{orderId}</span>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">
            <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6">
              <div className="flex items-center gap-3 text-brand-400">
                <Package className="h-5 w-5" />
                <h3 className="font-semibold text-white">Order Status</h3>
              </div>
              <p className="mt-3 text-sm text-surface-300">
                Your order is currently <strong className="text-brand-400">Processing</strong>. We will send you an email with tracking details once it ships.
              </p>
            </div>
            
            <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6">
              <div className="flex items-center gap-3 text-brand-400">
                <MapPin className="h-5 w-5" />
                <h3 className="font-semibold text-white">Shipping Details</h3>
              </div>
              <p className="mt-3 text-sm text-surface-300">
                Will be delivered to the address provided during checkout within 3-5 business days.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </Button>
            <Button size="lg" variant="outline">
              View Order Details
            </Button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
