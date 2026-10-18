'use client';

import { useEffect, useState } from 'react';

interface AdSlotProps {
  position: 'header' | 'between-sections' | 'before-calculator' | 'after-result' | 'in-content' | 'sidebar' | 'footer';
  className?: string;
}

export default function AdSlot({ position, className }: AdSlotProps) {
  const [adsEnabled, setAdsEnabled] = useState(false);
  const [adClientId, setAdClientId] = useState('');

  useEffect(() => {
    // Only load ads if explicitly enabled, in production environment, and configurations exist
    const isProd = process.env.NODE_ENV === 'production';
    const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

    setAdsEnabled(isProd && isEnabled && !!clientId);
    setAdClientId(clientId);
  }, []);

  // Try to load the google ad script window context if ads are enabled
  useEffect(() => {
    if (adsEnabled) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense display error:', err);
      }
    }
  }, [adsEnabled]);

  // Mock sizes for placeholders to match typical ad dimensions
  const getSlotSize = () => {
    switch (position) {
      case 'header':
        return 'w-full min-h-[90px] max-h-[120px]';
      case 'sidebar':
        return 'w-[300px] min-h-[250px] max-h-[600px] hidden lg:block';
      case 'after-result':
        return 'w-full min-h-[200px] max-h-[250px]';
      default:
        return 'w-full min-h-[90px] max-h-[250px]';
    }
  };

  // If ads are not enabled, display a clean layout placeholder ONLY in development mode (to keep code clean in prod)
  if (!adsEnabled) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          className={`ad-slot p-4 text-xs font-mono text-text-light flex flex-col justify-center items-center gap-1 border-dashed border border-border bg-background/50 rounded-lg ${getSlotSize()} ${className}`}
        >
          <span className="font-semibold uppercase tracking-wider text-[10px]">Ad Placeholder</span>
          <span>Position: {position}</span>
        </div>
      );
    }
    return null; // Empty in prod when disabled
  }

  return (
    <div className={`ad-slot--active my-6 mx-auto flex justify-center ${className}`}>
      {/* Google AdSense code structure */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={adClientId}
        data-ad-slot={position}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
