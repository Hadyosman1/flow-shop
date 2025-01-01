import { cookies } from "next/headers";
import { getWixClient } from "./wix-client.base";
import { Tokens } from "@wix/sdk";
import { cache } from "react";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse((await cookies()).get("wix_session")?.value || "{}");
  } catch {}

  return getWixClient(tokens);
});
