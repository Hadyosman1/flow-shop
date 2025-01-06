import { cookies } from "next/headers";
import { getWixClient } from "./wix-client.base";
import { Tokens } from "@wix/sdk";
import { cache } from "react";
import { WIX_SESSION_COOKIE_NAME } from "./constants";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse(
      (await cookies()).get(WIX_SESSION_COOKIE_NAME)?.value || "{}",
    );
  } catch {}

  return getWixClient(tokens);
});
