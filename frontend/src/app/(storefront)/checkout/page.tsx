'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCartStore } from '@/stores/cartStore';
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

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
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
    <main className="min-h-screen bg-surface-950 pb-24 pt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between border-b border-surface-800 pb-4">
          <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-brand-400">
            <ShieldCheck className="h-5 w-5" />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Info */}
              <section className="space-y-4 rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white">Contact Information</h2>
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
              <section className="space-y-4 rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-400" />
                  <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
                </div>
                <Input label="Street Address" {...register('address', { required: 'Required' })} error={errors.address?.message} />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City" className="col-span-1" {...register('city', { required: 'Required' })} error={errors.city?.message} />
                  <Input label="State" className="col-span-1" {...register('state', { required: 'Required' })} error={errors.state?.message} />
                  <Input label="PIN Code" className="col-span-1" {...register('pincode', { required: 'Required' })} error={errors.pincode?.message} />
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-4 rounded-3xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-400" />
                  <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div 
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'ONLINE' ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700 bg-surface-900 hover:border-surface-600'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="h-4 w-4 text-brand-500 accent-brand-500" />
                      <span className="font-medium text-white">Pay Online</span>
                    </label>
                    <p className="ml-7 mt-1 text-xs text-surface-400">UPI, Cards, Netbanking.</p>
                  </div>
                  
                  <div 
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-brand-500 bg-brand-500/10' : 'border-surface-700 bg-surface-900 hover:border-surface-600'}`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={paymentMethod === 'CASH_ON_DELIVERY'} onChange={() => setPaymentMethod('CASH_ON_DELIVERY')} className="h-4 w-4 text-brand-500 accent-brand-500" />
                      <span className="font-medium text-white">Cash on Delivery</span>
                    </label>
                    <p className="ml-7 mt-1 text-xs text-surface-400">Pay cash upon delivery.</p>
                  </div>
                </div>
              </section>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-surface-800 bg-surface-900/80 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white">Order Summary</h2>
              
              <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 rounded-lg border border-surface-700 bg-surface-800">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />}
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-700 text-[10px] font-bold text-white shadow">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                      <p className="mt-0.5 text-xs text-surface-400">{item.color} | {item.size}</p>
                      <p className="mt-1 text-sm font-bold text-white">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-surface-800 pt-6">
                <div className="flex justify-between text-sm text-surface-300">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-surface-300">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-brand-400">Free</span>
                  ) : (
                    <span className="text-white">{formatPrice(shipping)}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-surface-800 pt-6">
                <div>
                  <p className="text-sm text-surface-400">Total</p>
                  <p className="text-xs text-surface-500">Including ₹0.00 in taxes</p>
                </div>
                <p className="text-2xl font-bold text-white">{formatPrice(total)}</p>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                className="mt-8 w-full shadow-brand-500/25" 
                size="lg"
                isLoading={isProcessing}
              >
                Place Order
              </Button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
