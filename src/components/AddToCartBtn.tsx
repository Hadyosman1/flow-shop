"use client";

import { useAddItemToCart } from "@/hooks/cart";
import { products } from "@wix/stores";
import { ShoppingCartIcon } from "lucide-react";
import LoadingBtn from "./LoadingBtn";
import { ButtonProps } from "./ui/button";

interface AddToCartBtnProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

const AddToCartBtn = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: AddToCartBtnProps) => {
  const mutation = useAddItemToCart();

  return (
    <LoadingBtn
      onClick={() =>
        mutation.mutate({
          product,
          quantity,
          selectedOptions,
        })
      }
      isLoading={mutation.isPending}
      className={className}
      {...props}
    >
      <ShoppingCartIcon className="size-5" />
      Add to cart
    </LoadingBtn>
  );
};

export default AddToCartBtn;
