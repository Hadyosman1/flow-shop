import ProductCard from "@/components/ProductCard";
import CreateProductReviewBtn from "@/components/reviews/CreateProductReviewBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { getProductReviews } from "@/wix-api/reviews";
import { products } from "@wix/stores";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import ProductDetails from "./ProductDetails";
import ProductReviews, { ProductReviewsSkeleton } from "./ProductReviews";

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
        <hr />
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts productId={product._id} />
        </Suspense>
        <hr />
        <div className="space-y-5">
          <h2 className="text-2xl font-bold">Buyer reviews</h2>
          <Suspense fallback={<ProductReviewsSkeleton />}>
            <ProductReviewsSection product={product} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;

interface RelatedProductsProps {
  productId: string;
}

const RelatedProducts = async ({ productId }: RelatedProductsProps) => {
  const wixClient = await getWixServerClient();
  const relatedProducts = await getRelatedProducts(wixClient, productId);

  if (!relatedProducts.length) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold">Related products</h2>
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

interface ProductReviewsSectionProps {
  product: products.Product;
}

const ProductReviewsSection = async ({
  product,
}: ProductReviewsSectionProps) => {
  if (!product._id) return null;

  const wixClient = await getWixServerClient();

  const loggedInMember = await getLoggedInMember(wixClient);

  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixClient, {
          contactId: loggedInMember.contactId,
          productId: product._id,
        })
      ).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewBtn
        product={product}
        loggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  );
};
