'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterInput } from '@/lib/validation/schemas';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState('');
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setServerError('');
      const response = await api.post('/auth/register', data);
      
      if (response.data.success) {
        // Log them in immediately
        const user = response.data.data;
        login({ ...user, roles: ['CUSTOMER'] });
        router.push('/');
      }
    } catch (error: any) {
      if (error.response?.data?.error?.details) {
        // Could map validation errors to fields, but keeping simple for now
        setServerError('Please check all fields and try again.');
      } else {
        setServerError(
          error.response?.data?.error?.message || 'Failed to create account.'
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-surface-400">
          Join SAMVERA for exclusive drops and fast checkout
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          leftIcon={<Phone className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          className="mt-4 w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
