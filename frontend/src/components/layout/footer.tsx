import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-3xl font-black tracking-tighter text-black uppercase">
              SAMVERA
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-surface-600">
              Premium men's fashion and lifestyle essentials. Designed for the modern man who values quality, comfort, and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/shop?filter=new-arrivals" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?filter=best-sellers" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop?category=t-shirts" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">T-Shirts</Link></li>
              <li><Link href="/shop?category=oversized-t-shirts" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Oversized Tees</Link></li>
              <li><Link href="/shop?category=hoodies" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Hoodies</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/faq" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-surface-600 hover:text-black transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">Contact Us</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm font-medium text-surface-600">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <a href="mailto:samvera2116@gmail.com" className="hover:text-black transition-colors">
                  samvera2116@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium text-surface-600">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <a href="tel:8227929861" className="hover:text-black transition-colors">
                  +91 8227929861
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium text-surface-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <span>
                  Naga road ward no 23<br />
                  near Shankar thakur<br />
                  Raxaul, Bihar 845305
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-surface-200 pt-8 sm:flex-row">
          <p className="text-sm font-medium text-surface-500">
            &copy; {new Date().getFullYear()} SAMVERA. All rights reserved.
          </p>
          <div className="mt-4 flex items-center gap-4 sm:mt-0">
            <div className="text-xs font-bold text-black tracking-widest uppercase">
              100% SECURE CHECKOUT
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
