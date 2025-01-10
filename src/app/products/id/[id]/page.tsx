import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<any>;
}

const ProductPage = async ({ params, searchParams }: ProductPageProps) => {
  const id = (await params).id;

  if (id === "someId") {
    redirect(
      `/products/i-m-a-product-11?${new URLSearchParams(await searchParams).toString()}`,
    );
  }

  const product = await getProductById(await getWixServerClient(), id);

  if (!product) notFound();

  redirect(
    `/products/${product.slug}?${new URLSearchParams(await searchParams).toString()}`,
  );
};

export default ProductPage;
