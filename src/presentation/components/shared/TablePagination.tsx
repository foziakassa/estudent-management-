import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  page,
  totalPages,
  totalItems,
  itemLabel = "items",
  isLoading = false,
  onPageChange,
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} · {totalItems} total {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-xl px-3 py-2 text-sm"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[4rem] text-center">
          {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-xl px-3 py-2 text-sm"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}