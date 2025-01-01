import { Tokens } from "@wix/sdk";
import Cookies from "js-cookie";
import { WIX_SESSION_COOKIE_NAME } from "./constants";
import { getWixClient } from "./wix-client.base";

const tokens: Tokens = JSON.parse(Cookies.get(WIX_SESSION_COOKIE_NAME) || "{}");

export const wixBrowserClient = getWixClient(tokens);
