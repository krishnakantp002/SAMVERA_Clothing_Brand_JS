import * as React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-surface-950 to-surface-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-surface-800/50 bg-surface-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <Link
            href="/"
            className="inline-block font-display text-3xl font-bold tracking-tight text-white hover:text-surface-200"
          >
            SAMVERA
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
