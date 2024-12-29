import { createClient, OAuthStrategy } from "@wix/sdk";
import env from "@/env";
import { products, collections } from "@wix/stores";
import { reviews } from "@wix/reviews";
import { files } from "@wix/media";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import {
  backInStockNotifications,
  checkout,
  orders,
  currentCart,
  recommendations,
} from "@wix/ecom";

export function getWixClient() {
  return createClient({
    modules: {
      products,
      collections,
      backInStockNotifications,
      checkout,
      orders,
      currentCart,
      recommendations,
      reviews,
      files,
      members,
      redirects,
    },
    auth: OAuthStrategy({
      clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
    }),
  });
}
