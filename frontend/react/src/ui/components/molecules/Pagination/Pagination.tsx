import React from 'react';
import { Button } from '@ui/components/atoms';
import './Pagination.scss';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems?: number;
  loading?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems = 0,
  loading = false,
  className = '',
}) => {
  const itemsPerPageOptions = [5, 10, 25, 50];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination__info">
        <div className="pagination__page-info">
          Página {currentPage} de {totalPages}
          {totalItems > 0 && (
            <span className="pagination__total-items">
              ({totalItems} {totalItems === 1 ? 'item' : 'itens'} total)
            </span>
          )}
        </div>
        
        <div className="pagination__items-per-page">
          <label htmlFor="items-per-page" className="pagination__items-label">
            Itens por página:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="pagination__items-select"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pagination__controls">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading || totalPages <= 1}
          className="pagination__button pagination__button--prev"
        >
          <IoIosArrowDropleftCircle size={24}/>
        </Button>

        <div className="pagination__pages">
          {totalPages > 1 ? (
            visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="pagination__dots">...</span>
                ) : (
                  <button
                    type="button"
                    className={`pagination__page ${
                      page === currentPage ? 'pagination__page--active' : ''
                    }`}
                    onClick={() => onPageChange(page as number)}
                    disabled={loading}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))
          ) : (
            <button
              type="button"
              className="pagination__page pagination__page--active"
              disabled
            >
              1
            </button>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading || totalPages <= 1}
          className="pagination__button pagination__button--next"
        >
          <IoIosArrowDroprightCircle size={24}/>
        </Button>
      </div>
    </div>
  );
};