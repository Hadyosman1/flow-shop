import { ToggleThemeBtn } from "../ToggleThemeBtn";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { getCart } from "@/wix-api/cart";

const Header = () => {
  return (
    <header className="bg-background shadow-md shadow-muted-foreground/10">
      <div className="container flex items-center justify-between gap-5 py-4">
        <Link className="flex items-center gap-2" href="/">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-xl font-bold">Flow Shop</span>
        </Link>

        <Cart />
        <ToggleThemeBtn />
      </div>
    </header>
  );
};

export default Header;

const Cart = async () => {
  const cart = await getCart();
  const totalQuantity =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity ?? 0), 0) || 0;

  console.log(cart);
  return <>{totalQuantity}</>;
};
