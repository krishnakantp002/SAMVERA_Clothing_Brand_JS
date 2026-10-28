'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Save, Store, CreditCard, Bell, Shield, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: Store },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-surface-400">Manage your store preferences and configurations.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-brand-500/10 text-brand-400' 
                      : 'text-surface-400 hover:bg-surface-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-surface-800 bg-surface-900/50 p-6 sm:p-8"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Store Details</h2>
                  <p className="text-sm text-surface-400">Basic information about your store.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Store Name" defaultValue="SAMVERA" />
                  <Input label="Contact Email" type="email" defaultValue="samvera2116@gmail.com" />
                  <Input label="Phone Number" defaultValue="+91 8227929861" />
                  <Input label="Support Email" type="email" defaultValue="support@samvera.com" />
                </div>
                
                <hr className="border-surface-800" />
                
                <div>
                  <h2 className="text-lg font-semibold text-white">Store Address</h2>
                  <p className="text-sm text-surface-400">The physical location of your business.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Input label="Street Address" defaultValue="Naga road ward no 23, near Shankar thakur" />
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="City" defaultValue="Raxaul" />
                    <Input label="State / Province" defaultValue="Bihar" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="ZIP / Postal Code" defaultValue="845305" />
                    <Input label="Country" defaultValue="India" disabled />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Payment Providers</h2>
                  <p className="text-sm text-surface-400">Configure how you accept payments.</p>
                </div>
                
                <div className="rounded-xl border border-surface-700 bg-surface-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface-800 flex items-center justify-center font-bold text-white">RZP</div>
                    <div>
                      <h3 className="font-semibold text-white">Razorpay</h3>
                      <p className="text-sm text-surface-400">Accept UPI, Credit Cards, Netbanking</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="rounded-xl border border-surface-700 bg-surface-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface-800 flex items-center justify-center font-bold text-white text-xs text-center leading-tight">COD</div>
                    <div>
                      <h3 className="font-semibold text-white">Cash on Delivery</h3>
                      <p className="text-sm text-surface-400">Allow customers to pay upon receipt</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
                  <p className="text-sm text-surface-400">Choose what events trigger email notifications to you.</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: 'New Order', desc: 'Get notified when a customer places an order' },
                    { title: 'Order Cancelled', desc: 'Get notified when an order is cancelled' },
                    { title: 'Low Inventory', desc: 'Get notified when a product variant stock is below threshold' },
                    { title: 'New Customer', desc: 'Get notified when a new user registers' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-surface-800/50 transition-colors">
                      <div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="text-sm text-surface-400">{item.desc}</p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-900 bg-brand-500">
                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                  <p className="text-sm text-surface-400">Update your password and secure your account.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 max-w-md">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <Button className="w-full sm:w-auto mt-2">Update Password</Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
