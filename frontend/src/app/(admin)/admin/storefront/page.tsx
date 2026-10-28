'use client';

import * as React from 'react';
import { Upload, Save, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { api } from '@/lib/api';

export default function StorefrontManagerPage() {
  const [heroImage, setHeroImage] = React.useState<File | null>(null);
  const [heroPreview, setHeroPreview] = React.useState<string>('');
  
  const [promoImage, setPromoImage] = React.useState<File | null>(null);
  const [promoPreview, setPromoPreview] = React.useState<string>('');

  const [categories, setCategories] = React.useState<any[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, catsRes] = await Promise.all([
          api.get('/banners').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/products/categories').catch(() => ({ data: { success: false, data: [] } }))
        ]);

        if (bannersRes.data.success) {
          const banners = bannersRes.data.data;
          const hero = banners.find((b: any) => b.position === 'HERO');
          const promo = banners.find((b: any) => b.position === 'PROMOTIONAL');
          if (hero) setHeroPreview(hero.imageUrl);
          if (promo) setPromoPreview(promo.imageUrl);
        }

        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch storefront data', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const renderMedia = (url: string, alt: string) => {
    if (!url) return null;
    // Check if it's a blob video or a cloud video URL
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || (url.startsWith('blob:') && fileIsVideo(url));
    
    if (isVideo) {
      return (
        <video src={url} autoPlay loop muted playsInline className="h-full w-full object-cover" />
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} className="h-full w-full object-cover" />;
  };

  // Helper to determine if a blob url is a video based on the current state files
  const fileIsVideo = (blobUrl: string) => {
    if (heroPreview === blobUrl && heroImage?.type.startsWith('video/')) return true;
    if (promoPreview === blobUrl && promoImage?.type.startsWith('video/')) return true;
    return false;
  };

  const handleSave = async (position: string, file: File | null, existingPreview: string) => {
    setIsSaving(true);
    try {
      let imageUrl = existingPreview;
      
      // Upload new file if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.url;
        }
      }
      
      // Save banner config
      await api.post('/banners', {
        position,
        imageUrl,
        title: position === 'HERO' ? 'Hero Banner' : 'Promotional Banner'
      });
      
      alert(`${position} banner saved successfully!`);
    } catch (e) {
      console.error(e);
      alert('Failed to save banner');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading Storefront Config...</div>;

  return (
    <div className="space-y-8 p-8">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <LayoutTemplate className="h-6 w-6" /> Storefront Media
        </h1>
        <p className="text-surface-400 mt-2">Manage the landing page hero images, videos, and promotional banners.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* HERO SECTION CONFIG */}
        <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-400" /> Hero Section Background
          </h2>
          
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-surface-700 bg-surface-950 flex items-center justify-center group">
              {heroPreview ? (
                renderMedia(heroPreview, "Hero Preview")
              ) : (
                <div className="text-surface-500 flex flex-col items-center">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                  <span>No image uploaded</span>
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold text-sm">
                  <Upload className="h-4 w-4" /> Upload Photo / Video
                </div>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, setHeroImage, setHeroPreview)}
                />
              </label>
            </div>
            
            <button 
              onClick={() => handleSave('HERO', heroImage, heroPreview)}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Hero Section
            </button>
          </div>
        </div>

        {/* PROMO SECTION CONFIG */}
        <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-400" /> Promotional Banner
          </h2>
          
          <div className="space-y-6">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border-2 border-dashed border-surface-700 bg-surface-950 flex items-center justify-center group">
              {promoPreview ? (
                renderMedia(promoPreview, "Promo Preview")
              ) : (
                <div className="text-surface-500 flex flex-col items-center">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                  <span>No image uploaded</span>
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold text-sm">
                  <Upload className="h-4 w-4" /> Upload Photo / Video
                </div>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, setPromoImage, setPromoPreview)}
                />
              </label>
            </div>
            
            <button 
              onClick={() => handleSave('PROMOTIONAL', promoImage, promoPreview)}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Promo Banner
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION CONFIG */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-12 mb-6">Category Images</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: any }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>(category.image || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = preview;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.url;
        }
      }

      await api.patch(`/products/categories/${category.id}`, {
        image: imageUrl
      });
      alert(`${category.name} updated successfully!`);
    } catch (e) {
      console.error(e);
      alert('Failed to update category');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 flex flex-col items-center">
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{category.name}</h3>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-dashed border-surface-700 bg-surface-950 flex items-center justify-center group mb-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-surface-500 flex flex-col items-center">
            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-xs">No image</span>
          </div>
        )}
        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <div className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-full font-semibold text-xs">
            <Upload className="h-3 w-3" /> Upload
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>
      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-800 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-surface-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" /> Save Category
      </button>
    </div>
  );
}
