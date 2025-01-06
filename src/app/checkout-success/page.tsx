import Order from "@/components/Order";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { getOrder } from "@/wix-api/orders";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Checkout success",
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId: string }>;
}

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const orderId = (await searchParams).orderId;
  const wixClient = await getWixServerClient();

  const [order, loggedInMember] = await Promise.all([
    getOrder(wixClient, orderId),
    getLoggedInMember(wixClient),
  ]);

  if (!order) notFound();

  const orderCreatedDate = order._createdDate
    ? new Date(order._createdDate)
    : null;

  return (
    <main className="container flex flex-col items-center space-y-5 py-10">
      <h1 className="text-3xl font-bold">We received your order! </h1>
      <p>A summary of your order was sent to your email address.</p>
      <h2 className="text-2xl font-bold">Order details</h2>
      <Order order={order} />
      {loggedInMember && (
        <Link className="block text-primary hover:underline" href="/profile">
          View all your orders
        </Link>
      )}
      {orderCreatedDate &&
        orderCreatedDate.getTime() > Date.now() - 60_000 * 5 && <ClearCart />}
    </main>
  );
};

export default CheckoutSuccessPage;