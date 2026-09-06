export default function ProductLoading() {
  return (
    <div className="container-luxury py-24">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-ivory-200/80" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-ivory-200/80" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-ivory-200/80" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-ivory-200/80" />
          <div className="h-24 w-full animate-pulse rounded bg-ivory-200/80" />
          <div className="h-12 w-full animate-pulse rounded-full bg-ivory-200/80" />
        </div>
      </div>
    </div>
  );
}
