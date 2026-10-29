const allowedPatchFields = new Set(['customer', 'product', 'status']);

export function isValidString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

export function isValidStatus(value) {
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Processing', 'Cancelled'];
    return validStatuses.includes(value);
}

export function isValidObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

export function isValidOrderId(value) {
    return typeof value === 'string' && /^ORD-\d{3}$/.test(value);
}

export function isValidPatchFields(updates) {
    return Object.keys(updates).every(field => allowedPatchFields.has(field));
}