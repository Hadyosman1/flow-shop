import ProductCardsSkeleton from "@/components/ProductCardsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  return (
    <Suspense fallback={<LayoutSkelton />}>
      <CollectionLayout params={params}>{children}</CollectionLayout>
    </Suspense>
  );
};

export default Layout;

const CollectionLayout = async ({ children, params }: LayoutProps) => {
  const slug = (await params).slug;

  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );
  const banner = collection?.media?.mainMedia?.image;

  if (!collection?._id) notFound();

  return (
    <main>
      <div className="container space-y-10 py-10">
        {banner && (
          <div className="relative h-80 overflow-hidden rounded">
            <WixImage
              mediaIdentifier={banner?.url}
              alt={banner?.altText}
              width={1280}
              height={400}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
            <h1 className="absolute bottom-0 left-1/2 -translate-x-1/2 py-12 text-center text-3xl font-bold text-background md:text-5xl">
              {collection.name}
            </h1>
          </div>
        )}
        <h1
          className={cn(
            "py-12 text-center text-3xl font-bold md:text-5xl",
            banner && "hidden",
          )}
        >
          {collection.name}
        </h1>

        {children}
      </div>
    </main>
  );
};

const LayoutSkelton = () => {
  return (
    <main>
      <div className="container space-y-10 py-10">
        <Skeleton className="aspect-[1280/400] h-80 w-full rounded" />

        <div className="space-y-5">
          <Skeleton className="h-14 w-24 rounded" />
          <ProductCardsSkeleton />
        </div>
      </div>
    </main>
  );
};
