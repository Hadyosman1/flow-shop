import Banner from "@/components/home/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ProductCardsSkeleton from "@/components/ProductCardsSkeleton";

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
