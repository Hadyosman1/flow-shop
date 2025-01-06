"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface PaginationBarProps {
  totalPages: number;
  currentPage: number;
}

const PaginationBar = ({ totalPages, currentPage }: PaginationBarProps) => {
  const searchParams = useSearchParams();

  function getLink(page: number) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("page", page.toString());

    return `?${newSearchParams.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage === 1 && "pointer-events-none text-muted-foreground",
            )}
            href={getLink(currentPage - 1)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;

          const isEdgePage = page === 1 || page === totalPages;
          const isNearCurrentPage = Math.abs(page - currentPage) <= 2;

          if (!isEdgePage && !isNearCurrentPage) {
            if (i === 1 || i === totalPages) {
              return (
                <PaginationItem className="hidden sm:block" key={page}>
                  <PaginationEllipsis className="text-muted-foreground" />
                </PaginationItem>
              );
            }
            return null;
          }

          return (
            <PaginationItem
              className={cn(
                currentPage !== page
                  ? "hidden sm:block"
                  : "pointer-events-none",
              )}
              key={page}
            >
              <PaginationLink
                isActive={page === currentPage}
                href={getLink(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages &&
                "pointer-events-none text-muted-foreground",
            )}
            href={getLink(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
