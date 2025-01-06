"use client";

import * as React from "react";
import { CheckIcon, MonitorIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeIcons = {
  light: <Sun />,
  dark: <Moon />,
  system: <MonitorIcon />,
};

export function ToggleThemeBtn() {
  const { setTheme, themes, theme: currentTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="[&_svg]:size-5" variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => {
          const icon = themeIcons[theme as keyof typeof themeIcons];

          return (
            <DropdownMenuItem
              key={theme}
              className="cursor-pointer"
              onClick={() => setTheme(theme)}
            >
              {icon}
              <span className="capitalize">{theme}</span>
              {currentTheme === theme && <CheckIcon />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
