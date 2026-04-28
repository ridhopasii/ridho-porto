'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({ children, fallback = null }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
    };

    const handleUnhandledRejection = (event) => {
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full p-8 bg-red-500/10 border border-red-500/30 rounded-3xl text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tight">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {error?.message || 'Sesuatu yang tidak terduga terjadi. Silakan coba lagi.'}
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setError(null);
                window.location.reload();
              }}
              className="w-full py-3 bg-red-500 text-foreground font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Muat Ulang
            </button>
          </div>
        </div>
      )
    );
  }

  return children;
}
