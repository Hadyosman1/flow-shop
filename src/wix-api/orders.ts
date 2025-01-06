import { WixClient } from "@/lib/wix-client.base";

export const getOrder = async (wixClient: WixClient, orderId: string) => {
  try {
    return await wixClient.orders.getOrder(orderId);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).details.applicationError.code === "NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
};

export interface GetUserOrderFilters {
  limit?: number;
  cursor?: string | null;
}

export const getUserOrders = async (
  wixClient: WixClient,
  { cursor, limit }: GetUserOrderFilters,
) => {
  return wixClient.orders.searchOrders({
    search: {
      cursorPaging: {
        limit,
        cursor,
      },
    },
  });
};
