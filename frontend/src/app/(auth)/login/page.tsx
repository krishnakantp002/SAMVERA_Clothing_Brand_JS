'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginInput } from '@/lib/validation/schemas';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const [serverError, setServerError] = React.useState('');
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerError('');
      const response = await api.post('/auth/login', data);
      
      if (response.data.success) {
        login(response.data.data);
        if (response.data.data.roles?.includes('ADMIN')) {
          router.push('/admin');
        } else {
          router.push(returnUrl);
        }
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.error?.message || 'Failed to sign in. Please try again.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-surface-400">
          Enter your credentials to access your account
        </p>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-xl border border-error/50 bg-error/10 p-4 text-sm text-error"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-400 hover:text-brand-300"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-surface-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-black"></div></div>}>
      <LoginForm />
    </React.Suspense>
  );
}
