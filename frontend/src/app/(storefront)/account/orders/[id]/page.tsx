'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CheckCircle2, CreditCard } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const { user } = useAuthStore();

  React.useEffect(() => {
    setMounted(true);
    params.then((resolvedParams) => setOrderId(resolvedParams.id));
  }, [params]);

  React.useEffect(() => {
    if (!orderId || !user) return;
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/my-orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user]);

  if (!mounted || isLoading || !order) {
    return (
      <main className="min-h-screen bg-white pb-24 pt-32">
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-black"></div>
        </div>
      </main>
    );
  }

  const shippingAddress = order.addresses?.find((a: any) => a.type === 'SHIPPING');
  const payment = order.payment?.[0] || order.payment;

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <Link href="/account/orders" className="mb-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-500 hover:text-black transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Orders
        </Link>

        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-black text-black">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">Order Confirmed</h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-surface-500">Order #{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          <div className="space-y-8">
            <div className="border border-surface-200 p-6 sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">
                <Package className="h-4 w-4" /> Order Status
              </h2>
              <p className="text-sm text-surface-600">
                Your order is currently <strong className="font-bold text-black">{order.status}</strong>.
              </p>
            </div>

            <div className="border border-surface-200 p-6 sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">
                <MapPin className="h-4 w-4" /> Shipping Details
              </h2>
              {shippingAddress ? (
                <div className="space-y-1 text-sm text-surface-600">
                  <p className="font-bold text-black">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-surface-500">No shipping address provided.</p>
              )}
            </div>

            <div className="border border-surface-200 p-6 sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">
                <CreditCard className="h-4 w-4" /> Payment Details
              </h2>
              {payment ? (
                <div className="space-y-2 text-sm text-surface-600">
                  <p><span className="font-bold text-black">Method:</span> {payment.method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  <p><span className="font-bold text-black">Status:</span> {payment.status}</p>
                </div>
              ) : (
                <p className="text-sm text-surface-500">No payment details available.</p>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-24 border border-surface-200 bg-surface-50 p-6 sm:p-8">
              <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">Order Summary</h2>
              
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-surface-200 bg-white text-[10px] font-bold text-surface-400">
                      IMG
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-black line-clamp-1">{item.productName}</h4>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-surface-500">Qty: {item.quantity}</p>
                      <p className="mt-2 text-xs font-bold text-black">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-surface-200 pt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-surface-500">
                  <span>Subtotal</span>
                  <span className="text-black">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-surface-500">
                  <span>Shipping</span>
                  <span className="text-black">{Number(order.shippingCost) === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-surface-200 pt-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-surface-500">Total</p>
                </div>
                <p className="text-xl font-black text-black">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
