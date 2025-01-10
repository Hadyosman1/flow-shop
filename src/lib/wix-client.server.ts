import { cookies } from "next/headers";
import { getWixClient } from "./wix-client.base";
import { ApiKeyStrategy, createClient, Tokens } from "@wix/sdk";
import { cache } from "react";
import { WIX_SESSION_COOKIE_NAME } from "./constants";
import env from "@/env";
import { files } from "@wix/media";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse(
      (await cookies()).get(WIX_SESSION_COOKIE_NAME)?.value || "{}",
    );
  } catch {}

  return getWixClient(tokens);
});

export const getWixAdminClient = cache(() => {
  const wixClient = createClient({
    modules: { files },
    auth: ApiKeyStrategy({
      apiKey: env.WIX_API_KEY,
      siteId: env.NEXT_PUBLIC_WIX_SITE_ID,
    }),
  });

  return wixClient;
});
