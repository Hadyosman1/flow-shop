import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import ProductCardsSkeleton from "@/components/ProductCardsSkeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const slug = (await params).slug;

  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );

  const banner = collection?.media?.mainMedia?.image;

  if (!collection?._id) notFound();

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner
        ? [
            {
              url: banner.url,
              alt: banner.altText ?? "Banner",
              width: banner.width,
              height: banner.height,
            },
          ]
        : [],
    },
  };
}

const CollectionPage = async ({
  params,
  searchParams,
}: CollectionPageProps) => {
  const slug = (await params).slug;

  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );

  if (!collection?._id) notFound();

  const currentPage = parseInt((await searchParams).page ?? "1");

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense key={currentPage} fallback={<ProductCardsSkeleton />}>
        <Products
          page={currentPage <= 0 ? 1 : currentPage}
          collectionId={collection._id}
        />
      </Suspense>
    </div>
  );
};

export default CollectionPage;

interface ProductsProps {
  collectionId: string;
  page: number;
}

const Products = async ({ collectionId, page }: ProductsProps) => {
  const PAGE_SIZE = 8;

  const products = await queryProducts(await getWixServerClient(), {
    collectionIds: collectionId,
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  if (!products.length) notFound();

  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
      <PaginationBar totalPages={products.totalPages ?? 1} currentPage={page} />
    </div>
  );
};
