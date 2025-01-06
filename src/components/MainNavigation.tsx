import { cn } from "@/lib/utils";
import { collections } from "@wix/stores";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

interface MainNavigationProps {
  collections: collections.Collection[];
  className?: string;
}

const MainNavigation = ({ className, collections }: MainNavigationProps) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link className={navigationMenuTriggerStyle()} href="/shop">
            Shop
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="p-2">
              {collections.map((collection) => (
                <li key={collection._id}>
                  <Link
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "w-full justify-start text-ellipsis whitespace-nowrap",
                    )}
                    href={`/collections/${collection.slug}`}
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
