'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductFormData {
  name: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice?: number;
  description: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  primaryImage: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      isNewArrival: false,
      isBestSeller: false
    }
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure numeric types
      const payload = {
        ...data,
        basePrice: Number(data.basePrice),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      };

      const res = await api.post('/products', payload);
      if (res.data.success) {
        router.push('/admin/products');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Make sure you are logged in as an ADMIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="rounded-full p-2 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Add New Product</h1>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
          <Save className="mr-2 h-4 w-4" /> Save Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Basic Information</h2>
            <div className="space-y-4">
              <Input 
                label="Product Name" 
                {...register('name', { required: 'Name is required' })} 
                error={errors.name?.message} 
              />
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-300">Description</label>
                <textarea 
                  {...register('description', { required: 'Description is required' })}
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-3 text-white focus:border-brand-500 focus:outline-none min-h-[150px]"
                  placeholder="Enter detailed product description..."
                />
                {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Pricing & Organization</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input 
                label="Base Price (₹)" 
                type="number" 
                {...register('basePrice', { required: 'Price is required', min: 1 })} 
                error={errors.basePrice?.message} 
              />
              <Input 
                label="Compare at Price (₹) - Optional" 
                type="number" 
                {...register('compareAtPrice')} 
              />
              
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-surface-300">Category</label>
                <select 
                  {...register('categoryId', { required: 'Category is required' })}
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-3 text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-error">{errors.categoryId.message}</p>}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-8">
          <section className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Media</h2>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-700 p-8 text-center bg-surface-900">
                <div className="rounded-full bg-surface-800 p-3 text-brand-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-white">Provide Image URL</p>
                <p className="mt-1 text-xs text-surface-400">In a real app, this would be an S3 upload dropzone.</p>
              </div>
              <Input 
                label="Primary Image URL" 
                placeholder="https://images.unsplash.com/..."
                {...register('primaryImage', { required: 'Image is required' })} 
                error={errors.primaryImage?.message} 
              />
            </div>
          </section>

          <section className="rounded-3xl border border-surface-800 bg-surface-900/50 p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Status</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isNewArrival')} className="h-4 w-4 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm font-medium text-white">Mark as New Arrival</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isBestSeller')} className="h-4 w-4 rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm font-medium text-white">Mark as Best Seller</span>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
