import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailsLoading = () => {
  return (
    <main>
      <div className="container space-y-10 py-10">
        <div className="flex min-h-[60svh] flex-col gap-10 md:flex-row">
          <div className="basis-2/5">
            <Skeleton className="sticky top-2 aspect-square w-full" />
          </div>

          <div className="basis-3/5 space-y-5">
            <Skeleton className="h-14 w-56" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsLoading;