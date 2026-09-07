import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Footer } from '@/components/layout/footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </>
  );
}
