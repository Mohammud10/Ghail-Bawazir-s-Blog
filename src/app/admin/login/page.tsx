'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to homepage</span>
        </Link>

        <div className="bg-surface border border-border p-6 md:p-8 rounded-xl shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-text tracking-tight">Admin Portal</h1>
            <p className="text-xs text-text-muted">Sign in to manage calculators and site settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-danger-light border border-danger/10 text-danger rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@smartcalculators.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-text-light" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-text-light" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-5 py-3 text-base font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="h-5 w-5" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
