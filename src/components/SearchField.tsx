import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import Form from "next/form";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchFieldProps {
  className?: string;
}

const SearchField = ({ className }: SearchFieldProps) => {
  return (
    <Form className={cn("grow", className)} action="/shop">
      <div className="relative">
        <Input
          name="q"
          placeholder="Search..."
          className="search-input peer w-full pe-10"
        />

        <SearchIcon
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-100 transition duration-300 peer-focus:pointer-events-none peer-focus:invisible peer-focus:opacity-0"
        />

        <button
          type="reset"
          className="pointer-events-none invisible absolute right-3 top-1/2 h-full w-5 -translate-y-1/2 opacity-0 transition duration-300 active:pointer-events-auto active:visible active:opacity-100 peer-focus:pointer-events-auto peer-focus:visible peer-focus:opacity-100"
        >
          <XIcon size={20} />
        </button>
      </div>
    </Form>
  );
};

export default SearchField;
