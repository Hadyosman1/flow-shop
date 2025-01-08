import { WIX_ٍSTORES_APP_ID } from "@/lib/constants";
import { WixClient } from "@/lib/wix-client.base";

export type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface queryProductsFilter {
  q?: string;
  collectionIds?: string[] | string;
  sort?: ProductsSort;
  limit?: number;
  skip?: number;
  priceMin?: number;
  priceMax?: number;
}

export async function queryProducts(
  wixClient: WixClient,
  {
    collectionIds,
    sort = "last_updated",
    limit,
    skip,
    q,
    priceMax,
    priceMin,
  }: queryProductsFilter,
) {
  let query = wixClient.products.queryProducts();

  if (q) query = query.startsWith("name", q);

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
      query = query.descending("price");
      break;
    case "price_asc":
      query = query.ascending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }

  if (priceMin) query = query.ge("priceData.price", priceMin);
  if (priceMax) query = query.le("priceData.price", priceMax);

  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);

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

export async function getRelatedProducts(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.recommendations.getRecommendation(
    [
      {
        _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", // From the same categories
        appId: WIX_ٍSTORES_APP_ID,
      },
      {
        _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", // Frequently bought together
        appId: WIX_ٍSTORES_APP_ID,
      },
    ],
    {
      items: [
        {
          appId: WIX_ٍSTORES_APP_ID,
          catalogItemId: productId,
        },
      ],
      minimumRecommendedItems: 3,
    },
  );

  const productsIds = result.recommendation?.items
    .map((item) => item.catalogItemId)
    .filter((id) => id !== undefined);

  if (!productsIds || !productsIds.length) return [];

  const productsResults = await wixClient.products
    .queryProducts()
    .in("_id", productsIds)
    .limit(4)
    .find();

  return productsResults.items;
}
