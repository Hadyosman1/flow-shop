import { ToggleThemeBtn } from "../ToggleThemeBtn";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { getCart } from "@/wix-api/cart";
import { Suspense } from "react";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartBtn from "../ShoppingCartBtn";
import UserBtn from "../UserBtn";
import { getLoggedInMember } from "@/wix-api/members";
import { getCollections } from "@/wix-api/collections";
import { Skeleton } from "../ui/skeleton";
import MainNavigation from "../MainNavigation";
import SearchField from "../SearchField";
import MobileMenu from "./MobileMenu";

const Header = async () => {
  const wixClient = await getWixServerClient();

  const [loggedInMember, collections] = await Promise.all([
    getLoggedInMember(wixClient),
    getCollections(wixClient),
  ]);

  return (
    <header className="bg-background shadow shadow-muted-foreground/10">
      <div className="container flex items-center justify-between gap-5 py-4">
        <Suspense>
          <MobileMenu
            collections={collections}
            loggedInMember={loggedInMember}
          />
        </Suspense>

        <div className="flex flex-wrap items-center gap-5">
          <Link className="flex items-center gap-2" href="/">
            <Image
              fetchPriority="high"
              src={logo}
              alt="logo"
              width={40}
              height={40}
            />
            <span className="font-bold lg:text-xl">Flow Shop</span>
          </Link>

          <MainNavigation
            collections={collections}
            className="hidden lg:flex"
          />
        </div>

        <SearchField className="hidden max-w-96 lg:inline" />

        <div className="flex items-center gap-1">
          <UserBtn
            className="hidden lg:inline-flex"
            loggedInMember={loggedInMember}
          />
          <ToggleThemeBtn />
          <Suspense fallback={<HeaderIconSkeleton />}>
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

  return <ShoppingCartBtn initialData={cart} />;
};

const HeaderIconSkeleton = () => {
  return <Skeleton className="size-9 rounded-md" />;
};
