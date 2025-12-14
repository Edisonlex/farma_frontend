"use client";

import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PagerProps {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSummary?: boolean;
  className?: string;
}

export function Pager({
  total,
  page,
  pageSize,
  onChange,
  showSummary = true,
  className,
}: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const output: (number | "ellipsis")[] = [1];
    const showLeftEllipsis = page > 4;
    const showRightEllipsis = page < totalPages - 3;
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);
    if (showLeftEllipsis) output.push("ellipsis");
    for (let p = startPage; p <= endPage; p++) output.push(p);
    if (showRightEllipsis) output.push("ellipsis");
    output.push(totalPages);
    return output;
  }, [page, totalPages]);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className ?? ""}`}>
      {showSummary && (
        <div className="text-sm text-muted-foreground">
          Mostrando {total === 0 ? 0 : startItem}–{endItem} de {total}
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={page <= 1}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onChange(page - 1);
              }}
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            p === "ellipsis" ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p as number}>
                <PaginationLink
                  href="#"
                  isActive={page === (p as number)}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(p as number);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={page >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}