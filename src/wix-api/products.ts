import { getWixClient } from "@/lib/wix-client.base";

type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface queryProductsFilter {
  collectionIds?: string[] | string;
  sort?: ProductsSort;
}

export async function queryProducts({
  collectionIds,
  sort = "last_updated",
}: queryProductsFilter) {
  const wixClient = getWixClient();
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
