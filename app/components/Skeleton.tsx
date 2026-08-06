export function SkeletonLine({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <div
      className="rounded bg-gradient-to-r from-text-secondary/20 via-text-secondary/40 to-text-secondary/20 animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded border border-border-soft bg-bg-secondary p-4">
      <SkeletonLine width="60%" height="1.5rem" />
      <div className="mt-3 space-y-2">
        <SkeletonLine height="0.875rem" />
        <SkeletonLine width="80%" height="0.875rem" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
}
