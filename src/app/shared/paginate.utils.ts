import { TableLazyLoadEvent } from 'primeng/table';

export type PaginateQueryParams = { page: number };
export const mapLazyLoadEvent = (
  event: TableLazyLoadEvent,
): PaginateQueryParams => {
  const { first, rows } = event;
  const page = (first + rows) / rows;
  return {
    page,
  };
};
