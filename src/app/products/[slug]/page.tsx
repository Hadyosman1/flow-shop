import { getProductBySlug } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { cache } from "react";
import { getWixServerClient } from "@/lib/wix-client.server";

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

  return (
    <main>
      <div className="container space-y-10 py-10">
        <ProductDetails product={product} />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
