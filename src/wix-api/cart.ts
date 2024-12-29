import { getWixClient } from "@/lib/wix-client.base";

export const getCart = async () => {
  const wixClient = getWixClient();

  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
};
