import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { cache, Suspense } from "react";
import { getWixServerClient } from "@/lib/wix-client.server";
// import { delay } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const getProduct = cache(async (slug: string) => {
  const wixClient = await getWixServerClient();

  const product = await getProductBySlug(wixClient, slug);

  if (!product?._id) notFound();

  return product;
});

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProduct(slug);
  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Get this product on Flow Shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product?._id) notFound();

  return (
    <main>
      <div className="container space-y-10 py-10">
        <ProductDetails product={product} />
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts productId={product._id} />
        </Suspense>
      </div>
    </main>
  );
};

export default ProductDetailsPage;

interface RelatedProductsProps {
  productId: string;
}

const RelatedProducts = async ({ productId }: RelatedProductsProps) => {
  // await delay(4000);

  const wixClient = await getWixServerClient();
  const relatedProducts = await getRelatedProducts(wixClient, productId);

  if (!relatedProducts.length) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold md:text-3xl">Related products</h2>
      <div className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

const RelatedProductsSkeleton = () => {
  return (
    <section className="space-y-5">
      <Skeleton className="h-9 w-52" />
      <div className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[450px] rounded-md" />
        ))}
      </div>
    </section>
  );
};
