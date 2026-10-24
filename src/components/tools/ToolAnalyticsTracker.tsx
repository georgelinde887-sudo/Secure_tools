'use client';

import { useEffect } from 'react';

interface ToolAnalyticsTrackerProps {
  toolSlug: string;
  listingId?: string;
}

export function ToolAnalyticsTracker({ toolSlug, listingId }: ToolAnalyticsTrackerProps) {
  useEffect(() => {
    if (!toolSlug || typeof window === 'undefined') return;

    // 1. Client-side deduplication check per browser tab session
    const sessionKey = `st_view_${toolSlug}`;
    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (!alreadyTracked) {
      try {
        const payload = JSON.stringify({
          toolSlug,
          listingId: listingId || toolSlug,
          eventType: 'view',
          referrer: document.referrer || '',
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }

        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // Silent failure for analytics
      }
    }

    // 2. Outbound Link Click Interceptor
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target || !target.href) return;

      const href = target.href;
      const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://');

      if (isExternal && !href.includes(window.location.hostname)) {
        try {
          const payload = JSON.stringify({
            toolSlug,
            listingId: listingId || toolSlug,
            eventType: 'click',
            referrer: window.location.href,
          });

          if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics/track', blob);
          } else {
            fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: payload,
              keepalive: true,
            }).catch(() => {});
          }
        } catch {
          // Silent
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [toolSlug, listingId]);

  return null;
}
