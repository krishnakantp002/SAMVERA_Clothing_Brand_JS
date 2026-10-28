'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatPrice } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

import Script from 'next/script';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'CASH_ON_DELIVERY' | 'ONLINE'>('CASH_ON_DELIVERY');

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  React.useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/shop');
    }
  }, [items.length, router, isProcessing]);

  const handleRazorpayPayment = async (orderId: string, razorpayOrderId: string, amount: number) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'mock_key',
      amount: amount,
      currency: 'INR',
      name: 'SAMVERA',
      description: 'Test Transaction',
      order_id: razorpayOrderId,
      handler: async function (response: any) {
        try {
          const verifyRes = await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId
          });
          
          if (verifyRes.data.success) {
            clearCart();
            router.push(`/account/orders/${orderId}`);
          }
        } catch (error) {
          console.error('Verification failed', error);
          alert('Payment verification failed. Please contact support.');
          setIsProcessing(false);
        }
      },
      prefill: {
        name: 'SAMVERA Customer',
        email: 'customer@samvera.com',
        contact: '9999999999'
      },
      theme: {
        color: '#D97706' // brand-500
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any){
      alert('Payment Failed: ' + response.error.description);
      setIsProcessing(false);
    });
    rzp.open();
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsProcessing(true);
      
      const payload = {
        items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
        shippingAddress: data,
        paymentMethod
      };

      const response = await api.post('/checkout', payload);
      
      if (response.data.success) {
        const orderId = response.data.data.orderId;

        if (paymentMethod === 'ONLINE') {
          // Initialize Razorpay
          const rpRes = await api.post('/payments/create-order', { orderId });
          if (rpRes.data.success) {
            handleRazorpayPayment(orderId, rpRes.data.data.id, rpRes.data.data.amount);
          } else {
            throw new Error('Failed to create Razorpay order');
          }
        } else {
          // COD Flow
          clearCart();
          router.push(`/account/orders/${orderId}`);
        }
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) return null;

  return (
    <main className="min-h-screen bg-white pb-24 pt-16 border-t border-surface-200">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex items-center justify-between border-b border-surface-200 pb-4">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black md:text-5xl">Checkout</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-500">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Contact Info */}
              <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">1. Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" {...register('firstName', { required: 'Required' })} error={errors.firstName?.message} />
                  <Input label="Last Name" {...register('lastName', { required: 'Required' })} error={errors.lastName?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" type="email" {...register('email', { required: 'Required' })} error={errors.email?.message} />
                  <Input label="Phone Number" type="tel" {...register('phone', { required: 'Required' })} error={errors.phone?.message} />
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2 flex items-center gap-2">
                  2. Shipping Address
                </h2>
                <Input label="Street Address" {...register('address', { required: 'Required' })} error={errors.address?.message} />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City" className="col-span-1" {...register('city', { required: 'Required' })} error={errors.city?.message} />
                  <Input label="State" className="col-span-1" {...register('state', { required: 'Required' })} error={errors.state?.message} />
                  <Input label="PIN Code" className="col-span-1" {...register('pincode', { required: 'Required' })} error={errors.pincode?.message} />
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-2">
                  3. Payment Method
                </h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div 
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`cursor-pointer border p-6 transition-all ${paymentMethod === 'ONLINE' ? 'border-black bg-surface-50' : 'border-surface-200 hover:border-black'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="h-4 w-4 accent-black" />
                      <span className="text-xs font-bold uppercase tracking-widest text-black">Pay Online</span>
                    </label>
                    <p className="ml-7 mt-2 text-[10px] font-bold uppercase tracking-widest text-surface-500">UPI, Cards, Netbanking.</p>
                  </div>
                  
                  <div 
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`cursor-pointer border p-6 transition-all ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-black bg-surface-50' : 'border-surface-200 hover:border-black'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={paymentMethod === 'CASH_ON_DELIVERY'} onChange={() => setPaymentMethod('CASH_ON_DELIVERY')} className="h-4 w-4 accent-black" />
                      <span className="text-xs font-bold uppercase tracking-widest text-black">Cash on Delivery</span>
                    </label>
                    <p className="ml-7 mt-2 text-[10px] font-bold uppercase tracking-widest text-surface-500">Pay cash upon delivery.</p>
                  </div>
                </div>
              </section>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 border border-surface-200 bg-surface-50 p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-black border-b border-surface-200 pb-4">Order Summary</h2>
              
              <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 border border-surface-200 bg-white">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-black line-clamp-1">{item.name}</h4>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-surface-500">{item.color} | {item.size}</p>
                      <p className="mt-2 text-xs font-bold text-black">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-surface-200 pt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-surface-500">
                  <span>Subtotal</span>
                  <span className="text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-surface-500">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-black">Free</span>
                  ) : (
                    <span className="text-black">{formatPrice(shipping)}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-surface-200 pt-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-surface-500">Total</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-surface-400">Including ₹0.00 in taxes</p>
                </div>
                <p className="text-2xl font-black text-black">{formatPrice(total)}</p>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="mt-8 flex w-full items-center justify-center border border-black bg-black px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50" 
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
