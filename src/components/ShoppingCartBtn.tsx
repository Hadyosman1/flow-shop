"use client";

import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/cart";
import { currentCart } from "@wix/ecom";
import { Loader2, ShoppingCartIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import Link from "next/link";
import WixImage from "./WixImage";

interface ShoppingCartBtnProps {
  initialData: currentCart.Cart | null;
}

const ShoppingCartBtn = ({ initialData }: ShoppingCartBtnProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery.data?.lineItems?.reduce(
      (acc, curr) => acc + (curr.quantity ?? 0),
      0,
    ) || 0;

  return (
    <>
      <div className="relative">
        <Button
          className="[&_svg]:size-5"
          size="icon"
          variant="ghost"
          onClick={() => setIsSheetOpen(true)}
        >
          <span className="sr-only">Show cart</span>
          <ShoppingCartIcon />
        </Button>
        <span className="pointer-events-none absolute -right-0.5 -top-1 grid aspect-square w-5 place-content-center rounded-full bg-primary text-xs text-white">
          {totalQuantity < 10 ? totalQuantity : "9+"}
        </span>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Your Cart{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">Your Cart</SheetDescription>
          </SheetHeader>
          <div className="flex max-w-full grow flex-col gap-3 overflow-y-auto">
            <ul className="space-y-5 py-4">
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem
                  onProductLinkClicked={() => setIsSheetOpen(false)}
                  item={item}
                  key={item._id}
                />
              ))}
            </ul>

            {cartQuery.isPending && (
              <Loader2 className="mx-auto animate-spin" />
            )}

            {cartQuery.error && (
              <p className="text-center text-destructive">
                {cartQuery.error.message}
              </p>
            )}

            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Your cart is empty.</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsSheetOpen(false)}
                    className="text-primary hover:underline"
                  >
                    Start Shopping now
                  </Link>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm">Subtotal amount</p>
              <p className="font-bold">
                {/* @ts-expect-error its a bug in the wix types */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-xs text-muted-foreground">
                Shipping and texas calculated at checkout
              </p>
            </div>
            <Button
              disabled={!totalQuantity || cartQuery.isFetching}
              size="lg"
              className="w-full sm:w-fit"
            >
              Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShoppingCartBtn;

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked: () => void;
}

export const ShoppingCartItem = ({
  item,
  onProductLinkClicked,
}: ShoppingCartItemProps) => {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeCartItemMutation = useRemoveCartItem();

  const productId = item._id;

  if (!productId) return null;

  const itemSlug = item.url?.slice(item.url.lastIndexOf("/") + 1);

  const isQuantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="flex flex-wrap items-center gap-3">
      <div className="relative flex-none">
        <Link onClick={onProductLinkClicked} href={`/products/${itemSlug}`}>
          <WixImage
            mediaIdentifier={item.image}
            width={110}
            height={110}
            alt={item.productName?.translated || "product"}
            className="rounded bg-secondary"
          />
        </Link>
        <button
          onClick={() => removeCartItemMutation.mutate(productId)}
          className="absolute right-0 top-0 grid aspect-square w-5 -translate-y-1/2 translate-x-1/2 place-content-center rounded-full border bg-foreground text-accent transition hover:brightness-75"
        >
          <XIcon size={16} />
        </button>
      </div>
      <div className="5 space-y-1.5 text-sm">
        <Link onClick={onProductLinkClicked} href={`/products/${itemSlug}`}>
          <p className="font-bold">{item.productName?.translated || "Item"}</p>
        </Link>

        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated || line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}

        <div className="flex items-center gap-2">
          {item.quantity} X {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice?.amount !== item.price?.amount && (
            <span className="text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            disabled={item.quantity === 1}
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity - 1,
              });
            }}
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            disabled={isQuantityLimitReached}
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
              });
            }}
          >
            +
          </Button>
          {isQuantityLimitReached && (
            <p className="text-xs">Quantity limit reached</p>
          )}
        </div>
      </div>
    </li>
  );
};
