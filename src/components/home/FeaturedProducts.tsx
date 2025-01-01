import { delay } from "@/lib/utils";
import ProductCard from "../ProductCard";
import { getCollectionBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { getWixServerClient } from "@/lib/wix-client.server";

const FeaturedProducts = async () => {
  await delay(1000);
  const wixClient = await getWixServerClient();

  const collection = await getCollectionBySlug(wixClient, "featured-products");

  if (!collection?._id) return null;

  const featuredProducts = await queryProducts(wixClient, {
    collectionIds: collection._id,
    sort: "last_updated",
  });

  if (!featuredProducts.items.length) return null;

  return (
    <>
      <h2 className="mb-5 text-2xl font-bold">Featured Products</h2>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </>
  );
};

export default FeaturedProducts;
