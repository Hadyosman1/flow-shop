import { NextRequest, NextResponse } from "next/server";
import env from "./env";
import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { WIX_SESSION_COOKIE_NAME } from "./lib/constants";

const wixClient = createClient({
  auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID }),
});

export default async function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const sessionCookie = cookies.get(WIX_SESSION_COOKIE_NAME);

  let sessionTokens = sessionCookie
    ? (JSON.parse(sessionCookie.value) as Tokens)
    : await wixClient.auth.generateVisitorTokens();

  if (sessionTokens.accessToken.expiresAt < Math.floor(Date.now() / 1000)) {
    try {
      sessionTokens = await wixClient.auth.renewToken(
        sessionTokens.refreshToken,
      );
    } catch {
      sessionTokens = await wixClient.auth.generateVisitorTokens();
    }
  }

  req.cookies.set(WIX_SESSION_COOKIE_NAME, JSON.stringify(sessionTokens));

  const res = NextResponse.next({ request: req });

  res.cookies.set(WIX_SESSION_COOKIE_NAME, JSON.stringify(sessionTokens), {
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
