import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import { useQuickBuy } from "@/hooks/checkout";
import LoadingBtn from "./LoadingBtn";
import { CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyNowBtnProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

const BuyNowBtn = ({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowBtnProps) => {
  const { pending, startCheckoutFlow } = useQuickBuy();

  return (
    <LoadingBtn
      onClick={() =>
        startCheckoutFlow({
          product,
          quantity,
          selectedOptions,
        })
      }
      isLoading={pending}
      variant="secondary"
      className={cn(className)}
      {...props}
    >
      <CreditCardIcon />
      <span>Buy now</span>
    </LoadingBtn>
  );
};

export default BuyNowBtn;
