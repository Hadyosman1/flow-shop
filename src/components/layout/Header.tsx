import { ToggleThemeBtn } from "../ToggleThemeBtn";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { getCart } from "@/wix-api/cart";
import { Suspense } from "react";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartBtn from "../ShoppingCartBtn";

const Header = () => {
  return (
    <header className="bg-background shadow shadow-muted-foreground/10">
      <div className="container flex items-center justify-between gap-5 py-4">
        <Link className="flex items-center gap-2" href="/">
          <Image src={logo} alt="logo" width={40} height={40} />
          <span className="text-xl font-bold">Flow Shop</span>
        </Link>

        <div className="flex items-center gap-2">
          <ToggleThemeBtn />
          <Suspense fallback={"Loading..."}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;

const Cart = async () => {
  const wixClient = await getWixServerClient();
  const cart = await getCart(wixClient);

  return (
    <>
      <ShoppingCartBtn initialData={cart} />
    </>
  );
};
