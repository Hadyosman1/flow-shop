import { usePathname } from "next/navigation";
import { useToast } from "./use-toast";
import { generateOAuthData, getLoginUrl, getLogoutUrl } from "@/wix-api/auth";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import Cookies from "js-cookie";
import {
  WIX_OAUTH_DATA_COOKIE,
  WIX_SESSION_COOKIE_NAME,
} from "@/lib/constants";

const useAuth = () => {
  const pathname = usePathname();
  const { toast } = useToast();

  async function login() {
    try {
      const oAuthData = await generateOAuthData(wixBrowserClient, pathname);

      Cookies.set(WIX_OAUTH_DATA_COOKIE, JSON.stringify(oAuthData), {
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 60 * 10 * 1000),
      });

      const redirectUrl = await getLoginUrl(wixBrowserClient, oAuthData);

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error during login ===> ", error);
      toast({
        title: "Error",
        description: "Failed to log in, please try again.",
        variant: "destructive",
      });
    }
  }

  async function logout() {
    try {
      const logoutUrl = await getLogoutUrl(wixBrowserClient);

      Cookies.remove(WIX_SESSION_COOKIE_NAME);

      window.location.href = logoutUrl;
    } catch (error) {
      console.error("error during logout", error);
      toast({
        title: "Error",
        description: "Failed to log out, please try again.",
        variant: "destructive",
      });
    }
  }

  return { login, logout };
};

export default useAuth;
