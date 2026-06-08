export default function SkeletonCards() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Loading analysis results">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass-card rounded-lg p-5">
          <span className="surface-line opacity-60" />
          <div className="skeleton animate-shimmer h-4 w-1/3 rounded-full" />
          <div className="skeleton-pulse mt-6" />
          <div className="mt-5 space-y-3">
            <div className="skeleton animate-shimmer h-3 rounded-full" />
            <div className="skeleton animate-shimmer h-3 w-4/5 rounded-full" />
            <div className="skeleton animate-shimmer h-3 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
