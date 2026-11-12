// Pure function:  paginate result without modifying the original array.
export function paginate(items, page = 1, limit = 20) {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);

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