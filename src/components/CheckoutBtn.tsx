import { useCartCheckout } from "@/hooks/checkout";
import LoadingBtn from "./LoadingBtn";
import { ButtonProps } from "./ui/button";

const CheckoutBtn = ({ ...props }: ButtonProps) => {
  const { pending, startCheckoutFlow } = useCartCheckout();

  return (
    <LoadingBtn
      size="lg"
      className="w-full sm:w-fit"
      isLoading={pending}
      onClick={startCheckoutFlow}
      {...props}
    >
      Checkout
    </LoadingBtn>
  );
};

export default CheckoutBtn;
