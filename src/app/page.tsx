import Banner from "@/components/home/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <div className="container space-y-10 py-10">
        <Banner />

        <Suspense fallback={<ProductCardsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </main>
  );
}

const ProductCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[450px] rounded-md" />
      ))}
    </div>
  );
};
