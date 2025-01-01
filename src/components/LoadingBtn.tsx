import { Loader2Icon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingBtnProps extends ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

const LoadingBtn = ({
  className,
  children,
  isLoading = false,
  disabled,
  ...props
}: LoadingBtnProps) => {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn(isLoading && "opacity-60", className)}
      {...props}
    >
      {children}
      {isLoading && <Loader2Icon className="animate-spin" />}
    </Button>
  );
};

export default LoadingBtn;
