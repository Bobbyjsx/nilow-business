type RenderPageNumbersProps = {
  totalPages: number;
  currentPage: number;
  handlePageClick: (page: number) => void;
};

const PageButton = ({
  page,
  currentPage,
  onClick,
}: {
  page: number | string;
  currentPage: number;
  onClick?: () => void;
}) => {
  if (typeof page === "string") {
    return (
      <span className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-500">
        {page}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`p-1 w-8 h-8 text-xs sm:text-sm  rounded-full ${
        page === currentPage
          ? "bg-primary-main text-white"
          : "text-[#717171] hover:bg-primary-main/10"
      }`}
    >
      {page}
    </button>
  );
};

export const renderPageNumbers = ({
  totalPages,
  currentPage,
  handlePageClick,
}: RenderPageNumbersProps) => {
  const maxVisiblePages = 3;

  const getWindowBounds = () => {
    const halfWindow = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end > totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
      end = totalPages;
    }

    return { start, end };
  };

  const { start, end } = getWindowBounds();
  const pages: (number | string)[] = [];

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");
  pages.push(...Array.from({ length: end - start + 1 }, (_, i) => start + i));
  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return pages.map((page, idx) => (
    <PageButton
      key={idx}
      page={page}
      currentPage={currentPage}
      onClick={
        typeof page === "number" ? () => handlePageClick(page) : undefined
      }
    />
  ));
};
