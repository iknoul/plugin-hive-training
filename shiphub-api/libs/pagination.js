// Pure function:  paginate result without modifying the original array.
export function paginateArrayItems(items, page = 1, limit = 20) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total/limit))

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
        data: items.slice(startIndex, endIndex),
        page,
        limit,
        total,
        totalPages
    };
}

export function buildPaginatedResponse({data, total, page, limit}) {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pageInfo: {
      page,
      total,
      totalPages,
      limit
    }
  }
}