'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getCartTotal } = useCartStore();
  
  // Prevent scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
              <h2 className="font-display text-xl font-bold uppercase tracking-widest text-black">Your Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-surface-600 hover:bg-surface-100 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-surface-100 p-6">
                    <ShoppingBag className="h-8 w-8 text-surface-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black">Your cart is empty</h3>
                    <p className="mt-1 text-xs text-surface-600">Looks like you haven't added anything yet.</p>
                  </div>
                  <Button 
                    className="mt-4 rounded-none bg-black text-white hover:bg-surface-800 uppercase text-xs font-bold tracking-widest px-8" 
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/shop');
                    }}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Item Image */}
                      <div className="h-24 w-20 shrink-0 overflow-hidden bg-surface-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center opacity-20">👕</div>
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-black uppercase tracking-wider line-clamp-1">{item.name}</h4>
                            <p className="mt-1 text-xs text-surface-500 uppercase tracking-widest">
                              {item.color} {item.color && item.size && '|'} {item.size}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-black">{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="mt-auto flex items-end justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-surface-200">
                            <button 
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                              className="px-2.5 py-1 text-surface-600 hover:text-black hover:bg-surface-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-black">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-surface-600 hover:text-black hover:bg-surface-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-surface-400 hover:text-black underline-offset-4 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-surface-200 bg-surface-50 p-6">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-black">
                  <p>Subtotal</p>
                  <p>{formatPrice(getCartTotal())}</p>
                </div>
                <p className="mt-2 text-xs text-surface-500">Shipping and taxes calculated at checkout.</p>
                
                <Button className="mt-6 w-full rounded-none bg-black text-white hover:bg-surface-800 uppercase text-xs font-bold tracking-widest py-6" onClick={handleCheckout}>
                  Checkout
                </Button>
                
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-surface-500 hover:text-black"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
