export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="h-[min(50vh,420px)] animate-pulse bg-charcoal-900/90" />
      <div className="container-luxury py-12">
        <div className="mb-8 h-24 animate-pulse rounded-2xl bg-ivory-200/80" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-[1.25rem] bg-ivory-200/80" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-ivory-200/80" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-ivory-200/80" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
