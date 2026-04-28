'use client';

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  const CardSkeleton = () => (
    <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] animate-pulse">
      <div className="aspect-[16/10] bg-white/5 rounded-3xl mb-6" />
      <div className="h-8 bg-white/5 rounded-xl w-3/4 mb-4" />
      <div className="h-4 bg-white/5 rounded-lg w-full mb-2" />
      <div className="h-4 bg-white/5 rounded-lg w-2/3 mb-8" />
      <div className="flex gap-2">
        <div className="h-10 bg-white/5 rounded-2xl w-full" />
        <div className="h-10 bg-white/5 rounded-2xl w-14" />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl animate-pulse flex items-center gap-4 mb-4">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0" />
      <div className="flex-1">
        <div className="h-5 bg-white/5 rounded-lg w-1/3 mb-2" />
        <div className="h-3 bg-white/5 rounded-md w-1/4" />
      </div>
    </div>
  );

  return (
    <div className={type === 'card' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-4'}>
      {[...Array(count)].map((_, i) =>
        type === 'card' ? <CardSkeleton key={i} /> : <ListSkeleton key={i} />
      )}
    </div>
  );
}
