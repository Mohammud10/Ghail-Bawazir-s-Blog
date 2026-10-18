'use client';

import React, { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Mail, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function ContactPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(tCommon('required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.message || tCommon('tryAgain'));
      }
    } catch {
      setError(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [{ label: t('title') }];

  return (
    <div className="container-app py-8 max-w-2xl">
      <Breadcrumb items={breadcrumbItems} />

      <div className="card p-6 md:p-8 bg-surface space-y-6">
        <div className="space-y-2 border-b border-border pb-4">
          <h1 className="text-3xl font-extrabold text-text tracking-tight">{t('title')}</h1>
          <p className="text-sm text-text-muted">{t('description')}</p>
        </div>

        {success ? (
          <div className="p-6 bg-success-light border border-success/15 rounded-xl text-center space-y-4 animate-fadeIn">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <h2 className="text-xl font-bold text-success">{tCommon('success')}</h2>
            <p className="text-sm text-success">{tCommon('messageSent')}</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 bg-success text-white font-bold rounded-lg hover:bg-success/90 transition text-sm cursor-pointer"
            >
              {tCommon('close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-danger-light border border-danger/10 text-danger rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                {t('name')} <span className="text-danger">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={t('namePlaceholder')}
                  value={form.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-text-light pointer-events-none" />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                {t('email')} <span className="text-danger">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                  value={form.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-text-light pointer-events-none" />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                {t('message')} <span className="text-danger">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t('messagePlaceholder')}
                  value={form.message}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-3 text-text shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                />
                <MessageSquare className="absolute left-3.5 top-3.5 h-5 w-5 text-text-light pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-5 py-3 text-base font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-5 w-5" />
              <span>{loading ? tCommon('sending') : t('submit')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
