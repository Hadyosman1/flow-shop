import { WixClient } from "@/lib/wix-client.base";

type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface queryProductsFilter {
  collectionIds?: string[] | string;
  sort?: ProductsSort;
}

export async function queryProducts(
  wixClient: WixClient,
  { collectionIds, sort = "last_updated" }: queryProductsFilter,
) {
  let query = wixClient.products.queryProducts();

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
  }

  switch (sort) {
    case "price_desc":
      query.descending("price");
      break;
    case "price_asc":
      query.ascending("price");
      break;
    case "last_updated":
      query.descending("lastUpdated");
      break;
  }

  return query.find();
}

export async function getProductBySlug(wixClient: WixClient, slug: string) {
  const { items } = await wixClient.products
    .queryProducts()
    .eq("slug", slug)
    .limit(1)
    .find();

  const product = items[0];

  if (!product || !product.visible) return null;

  return product;
}
