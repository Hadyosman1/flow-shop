"use client";

import useAuth from "@/hooks/auth";
import { Button } from "./ui/button";
import { members } from "@wix/members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserBtnProps {
  loggedInMember: members.Member | null;
  className?: string;
  align?: "end" | "start" | "center";
}

const UserBtn = ({
  loggedInMember,
  className,
  align = "end",
}: UserBtnProps) => {
  const { login, logout } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn("[&_svg]:size-5", className)}
            variant={"ghost"}
            size={"icon"}
          >
            <UserIcon />
            <span className="sr-only">User options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-44 max-w-64">
          {loggedInMember && (
            <>
              <DropdownMenuLabel>
                Logged in as{" "}
                {loggedInMember.contact?.firstName || loggedInMember.loginEmail}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </>
          )}

          {loggedInMember ? (
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer"
            >
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => login()}
              className="cursor-pointer"
            >
              <LogInIcon />
              Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserBtn;
