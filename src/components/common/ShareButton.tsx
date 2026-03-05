import React, { useState } from 'react';

interface Props {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url = window.location.href }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button className="share-button" onClick={handleShare} aria-label="Поделиться">
      {copied ? '✓' : '🔗'}
    </button>
  );
}