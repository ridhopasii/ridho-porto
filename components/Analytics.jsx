'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Analytics Component
 * Track page views dan user interactions
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Track page view
      trackPageView(pathname);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Track page view
 */
function trackPageView(path) {
  // Google Analytics (jika ada)
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: path,
    });
  }

  // Custom analytics
  console.log('[Analytics] Page view:', path);
}

/**
 * Track custom event
 */
export function trackEvent(eventName, eventData = {}) {
  // Google Analytics
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventData);
  }

  // Custom analytics
  console.log('[Analytics] Event:', eventName, eventData);
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName) {
  trackEvent('form_submit', {
    form_name: formName,
  });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName) {
  trackEvent('button_click', {
    button_name: buttonName,
  });
}

/**
 * Track download
 */
export function trackDownload(fileName) {
  trackEvent('file_download', {
    file_name: fileName,
  });
}

/**
 * Track external link click
 */
export function trackExternalLink(url) {
  trackEvent('external_link', {
    url: url,
  });
}
