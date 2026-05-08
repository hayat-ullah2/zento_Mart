export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
    <div className="aspect-[4/5] shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 shimmer rounded" />
      <div className="h-4 w-3/4 shimmer rounded" />
      <div className="flex justify-between">
        <div className="h-4 w-1/4 shimmer rounded" />
        <div className="h-4 w-1/4 shimmer rounded" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div className="aspect-[4/5] shimmer rounded-3xl" />
    <div className="space-y-4">
      <div className="h-4 w-1/4 shimmer rounded" />
      <div className="h-8 w-3/4 shimmer rounded" />
      <div className="h-5 w-1/3 shimmer rounded" />
      <div className="h-24 shimmer rounded mt-6" />
      <div className="h-12 w-full shimmer rounded-full mt-6" />
    </div>
  </div>
);
