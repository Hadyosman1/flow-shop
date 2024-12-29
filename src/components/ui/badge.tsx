import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ className, children }: BadgeProps) => {
  return (
    <div
      className={cn(
        "w-fit bg-primary px-2 py-1 rounded text-xs text-primary-foreground drop-shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
