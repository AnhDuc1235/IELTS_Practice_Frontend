export function getVisiblePages(totalPages: number, currentPage: number, maxVisiblePages = 5): number[] {
  const visiblePageCount = Math.min(totalPages, maxVisiblePages);
  const halfRange = Math.floor(visiblePageCount / 2);
  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = startPage + visiblePageCount - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePageCount + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}
