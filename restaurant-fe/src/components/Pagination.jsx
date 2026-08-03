import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Component Phân trang dùng chung cho toàn bộ hệ thống
 * Hiển thị chuẩn theo UI mẫu:
 * Left: Hiển thị <b>{displayedCount}</b> của {totalElements} kết quả
 * Right: <  [1]  2  3  4  5  6  7  >
 */
const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 10,
  itemsCount,
  onPageChange,
  itemLabel = 'kết quả'
}) => {
  if (totalPages <= 0) return null;

  // Tính số lượng bản ghi hiển thị ở trang hiện tại
  const displayedCount = itemsCount != null
    ? itemsCount
    : (totalElements === 0 ? 0 : Math.min(pageSize, totalElements - currentPage * pageSize));

  // Tạo danh sách các số trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(0);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages - 2, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(totalPages - 2, 4);
    } else if (currentPage >= totalPages - 4) {
      start = Math.max(1, totalPages - 5);
    }

    if (start > 1) {
      pages.push('...-left');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push('...-right');
    }

    pages.push(totalPages - 1);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-sm text-slate-600">
      {/* Left side */}
      <div className="text-slate-600 font-normal">
        Hiển thị <span className="font-bold text-slate-900">{displayedCount}</span> của {totalElements} {itemLabel}
      </div>

      {/* Right side: Navigation */}
      <div className="flex items-center gap-1.5">
        {/* Nút Trước */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>

        {/* Nút các số trang */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (typeof page === 'string' && page.startsWith('...')) {
              return (
                <span key={`dots-${idx}`} className="w-7 h-7 flex items-center justify-center text-slate-400 text-xs">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 flex items-center justify-center rounded transition-all text-sm font-medium ${
                  isActive
                    ? 'border border-red-500 text-red-500 bg-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {page + 1}
              </button>
            );
          })}
        </div>

        {/* Nút Sau */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
          title="Trang sau"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
