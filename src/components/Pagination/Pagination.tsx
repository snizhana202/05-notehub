import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  total: number;
  perPage: number;
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ total, perPage, page, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}