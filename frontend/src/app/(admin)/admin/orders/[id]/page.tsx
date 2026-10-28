'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, User } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    params.then((resolvedParams) => setOrderId(resolvedParams.id));
  }, [params]);

  React.useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${orderId}`);
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
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (!orderId) return;
    try {
      setIsUpdating(true);
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrder({ ...order, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-800 border-t-brand-500"></div>
      </div>
    );
  }

  const shippingAddress = order.addresses?.find((a: any) => a.type === 'SHIPPING');
  const payment = order.payment?.[0] || order.payment;

  return (
    <div className="p-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Order {order.orderNumber}</h1>
            <p className="mt-1 text-sm text-surface-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={isUpdating}
              className={`rounded-lg border border-surface-700 bg-surface-900 px-4 py-2 text-sm font-bold uppercase tracking-widest outline-none focus:border-brand-500 ${
                order.status === 'DELIVERED' ? 'text-success' :
                order.status === 'PROCESSING' ? 'text-brand-400' :
                order.status === 'SHIPPED' ? 'text-info' :
                'text-warning'
              }`}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Main Content: Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Package className="h-5 w-5 text-brand-400" /> Order Items
            </h2>
            <div className="space-y-6">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 border-b border-surface-800 pb-6 last:border-0 last:pb-0">
                  <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-800 font-display text-xs text-surface-400">
                    IMG
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="font-medium text-white">{item.productName}</h4>
                    <p className="text-sm text-surface-400">SKU: {item.sku}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-surface-300">Qty: {item.quantity}</p>
                      <p className="font-medium text-white">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-3 border-t border-surface-800 pt-6">
              <div className="flex justify-between text-sm text-surface-300">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-surface-300">
                <span>Shipping</span>
                <span className="text-white">{Number(order.shippingCost) === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-surface-800 pt-4">
                <span className="font-bold text-white">Total</span>
                <span className="text-xl font-bold text-brand-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer & Shipping Details */}
        <div className="space-y-8">
          
          {/* Customer Info */}
          <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <User className="h-5 w-5 text-brand-400" /> Customer
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white">{order.user?.firstName} {order.user?.lastName}</p>
                <a href={`mailto:${order.user?.email}`} className="text-sm text-brand-400 hover:underline">{order.user?.email}</a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">Phone</p>
                <p className="mt-1 text-sm text-surface-300">{order.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Truck className="h-5 w-5 text-brand-400" /> Shipping Address
            </h2>
            {shippingAddress ? (
              <div className="space-y-2 text-sm text-surface-300">
                <p className="font-medium text-white">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p>{shippingAddress.addressLine1}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
                <p className="pt-2">Phone: {shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-surface-400">No shipping address provided.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <CreditCard className="h-5 w-5 text-brand-400" /> Payment Details
            </h2>
            {payment ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">Method</p>
                  <p className="mt-1 font-medium text-white">
                    {payment.method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">Status</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold tracking-wider ${
                    payment.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-surface-400">No payment details available.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
