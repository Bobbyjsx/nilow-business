import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { renderPageNumbers } from "./utils";

export type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
};

/**
 * Pagination component for displaying pagination controls.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @param {function} onPageChange - Callback function to handle page change.
 * @param {number | undefined} itemsPerPage - The number of items per page.
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 0,
  totalItems = 0,
}: PaginationProps) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };
  const visibleRangeStart =
    itemsPerPage === 0 ? 1 : itemsPerPage * (currentPage - 1) + 1;
  const visibleRangeEnd =
    currentPage === totalPages
      ? totalItems
      : Math.min(visibleRangeStart + itemsPerPage - 1, totalItems);
  return (
    <div className="flex items-center justify-between border-t border-gray-200  px-4 py-3 sm:px-6 w-full flex-wrap gap-y-10 sm:gap-y-0">
      {totalItems && (
        <section className="text-[#717171] text-[12px]">
          <p className="">
            Showing {visibleRangeStart} - {visibleRangeEnd} of {totalItems}
          </p>
        </section>
      )}
      <div className="flex items-center justify-center sm:justify-end ">
        <nav className=" inline-flex  gap-x-1 sm:gap-x-[10px] items-center">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs text-[#222222] hover:bg-primary-main/10 disabled:text-[#D9D9D9] disabled:cursor-not-allowed sm:flex hidden"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          {renderPageNumbers({ currentPage, totalPages, handlePageClick })}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-xs text-[#222222] hover:bg-primary-main/10 disabled:text-[#D9D9D9] disabled:cursor-not-allowed sm:flex hidden"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};
