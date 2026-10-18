'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareCopyButtonsProps {
  textToCopy: string;
}

export default function ShareCopyButtons({ textToCopy }: ShareCopyButtonsProps) {
  const t = useTranslations('common');
  const tCalc = useTranslations('calculator');
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getShareLinks = () => {
    if (typeof window === 'undefined') return { wa: '', fb: '', tw: '', tg: '' };
    const currentUrl = window.location.href;
    const shareText = `${textToCopy}\n${currentUrl}`;

    return {
      wa: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      tw: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToCopy)}&url=${encodeURIComponent(currentUrl)}`,
      tg: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(textToCopy)}`,
    };
  };

  const links = getShareLinks();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Copy Result */}
        <button
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface hover:bg-background px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:text-primary hover:border-primary/30 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-success" />
              <span className="text-success font-bold">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-text-muted" />
              <span>{tCalc('copyResult')}</span>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-sm transition cursor-pointer ${
            showShareOptions ? 'bg-primary text-white border-primary' : 'border-border bg-surface text-text hover:bg-background hover:text-primary hover:border-primary/30'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>{tCalc('shareResult')}</span>
        </button>
      </div>

      {/* Social Share Drawer */}
      {showShareOptions && (
        <div className="p-4 bg-slate-50 border border-border rounded-lg flex flex-wrap items-center justify-center gap-4">
          <span className="text-xs font-bold text-text-muted w-full text-center sm:w-auto sm:text-start">
            {tCalc('shareResult')}:
          </span>
          <div className="flex gap-3">
            {/* WhatsApp */}
            <a
              href={links.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center w-10 h-10"
              title="Share on WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.989-1.874-1.875-4.351-2.903-6.985-2.903-5.438 0-9.865 4.421-9.869 9.863-.002 1.702.447 3.366 1.301 4.808L1.87 21.05l4.777-1.896zm12.31-5.473c-.362-.18-.2.83-.553-1.082l-1.92-1.012c-.135-.078-.29-.092-.43-.033L14.7 12.18c-.1.08-.24.11-.36.07a8.4 8.4 0 0 1-3.66-2.28 8.4 8.4 0 0 1-2.28-3.66c-.04-.12-.01-.26.07-.36l.57-.57c.06-.14.05-.295-.03-.43L8.01 4.03c-.22-.42-1-.62-1.4-.41-.53.28-.86.72-.94 1.13-.1.5.09 1.37.91 2.5 1.63 2.25 3.86 4.48 6.11 6.11 1.13.82 2 1.01 2.5.91.41-.08.85-.41 1.13-.94.21-.4.01-1.18-.41-1.4z"/>
              </svg>
            </a>

            {/* Telegram */}
            <a
              href={links.tg}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#0088cc] text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center w-10 h-10"
              title="Share on Telegram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.384-1.362 5.611-.17.522-.5.717-.797.717-.65 0-1.185-.438-1.785-.828-.962-.624-1.503-1.011-2.441-1.63-1.082-.712-.381-1.106.236-1.75.161-.17 2.966-2.721 3.02-2.95.007-.03.013-.13-.048-.184-.06-.054-.15-.036-.215-.021-.092.021-1.562.99-4.414 2.91-.418.287-.797.43-1.136.43-.374 0-1.096-.203-1.632-.377-.658-.214-1.181-.328-1.136-.692.023-.19.285-.385.786-.583 3.08-1.34 6.16-2.22 9.24-2.65.234-.03.468-.01.7.01.218.02.434.09.434.33a.85.85 0 0 1-.06.29z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={links.fb}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#1877F2] text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center w-10 h-10"
              title="Share on Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href={links.tw}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black text-white rounded-full hover:scale-110 transition shadow flex items-center justify-center w-10 h-10"
              title="Share on X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
