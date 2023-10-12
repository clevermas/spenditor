export interface PaginationDataResponseDTO<T> {
  data: T;
  offset: number;
  limit: number;
  totalPages: number;
  currentPage: number;
}

export function getPage(
  collection: any[],
  page: number | undefined,
  limit = 10
): PaginationDataResponseDTO<any> {
  const offset = page ? (page - 1) * limit : 0;
  return {
    data: collection.slice(offset, offset + limit),
    offset,
    limit,
    currentPage: page as number,
    totalPages: Math.ceil(collection.length / limit) || 1,
  };
}
