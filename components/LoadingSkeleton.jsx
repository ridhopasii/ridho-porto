'use client';

export function SkeletonCard() {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
      <div className="h-3 bg-white/10 rounded w-full mb-3" />
      <div className="h-3 bg-white/10 rounded w-5/6" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonImage() {
  return <div className="w-full aspect-video bg-white/10 rounded-2xl animate-pulse" />;
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 bg-white/10 rounded w-1/4 mb-3 animate-pulse" />
          <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}
