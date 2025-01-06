"use client";

import { members } from "@wix/members";
import { collections } from "@wix/stores";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import SearchField from "../SearchField";
import Link from "next/link";
import UserBtn from "../UserBtn";
import { usePathname, useSearchParams } from "next/navigation";
import { twConfig } from "@/lib/utils";

interface MobileMenuProps {
  collections: collections.Collection[];
  loggedInMember: members.Member | null;
}

const MobileMenu = ({ collections, loggedInMember }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > parseInt(twConfig.theme.screens.lg)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="lg:hidden [&_svg]:size-5"
        size="icon"
        variant="ghost"
      >
        <MenuIcon />
        <span className="sr-only">open menu</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full" side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            Navigation menu
          </SheetDescription>
          <div className="flex flex-col space-y-6 py-10">
            <UserBtn align="start" loggedInMember={loggedInMember} />

            <SearchField className="w-full" />

            <ul className="space-y-2 overflow-y-auto text-lg font-semibold">
              <li>
                <Link href="/shop" className="hover:underline">
                  Shop
                </Link>
              </li>

              {collections.map((coll) => (
                <li key={coll._id}>
                  <Link
                    className="hover:underline"
                    href={`/collections/${coll.slug}`}
                  >
                    {coll.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileMenu;
