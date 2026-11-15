const ALLOWED_SHIPMENT_FIELDS = new Set([ 'carrier', 'trackingNumber']);

const REQUIRED_SHIPMENT_FIELDS = new Set([ 'carrier', 'trackingNumber' ]);

const ALLOWED_CARRIERS = new Set(['DHL', 'FedEx', 'UPS' ]);

const ALLOWED_ORDER_FIELDS = new Set([
    'customer',
    'product',
    'status',
    'priority'
]);

const REQUIRED_ORDER_FIELDS = new Set([
    'customer',
    'product'
]);

const ALLOWED_ORDER_STATUSES = new Set([
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
]);

const ALLOWED_PRIORITIES = new Set([
    'low',
    'normal',
    'high'
]);

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
  return typeof value === 'string' && /^ORD-\d{3,}$/.test(value);
}

export function isValidPatchFields(updates) {
    return Object.keys(updates).every(field => ALLOWED_ORDER_FIELDS.has(field));
}

export function validatePriorityFilter(priority) {
    if (priority === undefined || priority === '') {
        return {
            isValid: true,
            error: null
        };
    }

    if (!ALLOWED_PRIORITIES.has(priority)) {
        return {
            isValid: false,
            error: 'Priority must be low, normal, or high'
        };
    }

    return {
        isValid: true,
        error: null
    };
}

export function validateNewOrder(orderData) {
    const errors = {};

    // Validate object
    if (
        !orderData ||
        typeof orderData !== 'object' ||
        Array.isArray(orderData)
    ) {
        return {
            isValid: false,
            errors: { body: 'Request body must be an object' },
            data: null
        };
    }

    // Check required fields
    for (const field of REQUIRED_ORDER_FIELDS) {
        if (
            typeof orderData[field] !== 'string' ||
            !orderData[field].trim()
        ) {
            errors[field] = `${field} is required`;
        }
    }

    // Check unknown fields
    for (const field of Object.keys(orderData)) {
        if (!ALLOWED_ORDER_FIELDS.has(field)) {
            errors[field] = `${field} is not allowed`;
        }
    }

    // Validate status
    if (
        orderData.status !== undefined &&
        'Pending' !== orderData.status
    ) {
        errors.status =
            'Status must be Pending, Processing, Shipped, Delivered, or Cancelled';
    }

    // Validate priority
    if (
        orderData.priority !== undefined &&
        !ALLOWED_PRIORITIES.has(orderData.priority)
    ) {
        errors.priority =
            'Priority must be low, normal, or high';
    }

    const isValid = Object.keys(errors).length === 0;

    return {
        isValid,
        errors: isValid
            ? null
            : {
                message: 'Validation error',
                fields: errors,
                details: Object.entries(errors)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')
            },
        data: isValid
            ? {
                customer: orderData.customer.trim(),
                product: orderData.product.trim(),
                status: orderData.status ?? 'Pending',
                priority: orderData.priority ?? 'normal'
            }
            : null
    };
}



// Pure function: validates shipment data without modifying it.
export function validateNewShipment(shipmentData) {
    const errors = {};

    // Validate object
    if (
        !shipmentData ||
        typeof shipmentData !== 'object' ||
        Array.isArray(shipmentData)
    ) {
        return {
            isValid: false,
            errors: { body: 'Request body must be an object' },
            data: null
        };
    }

    // Check required fields
    for (const field of REQUIRED_SHIPMENT_FIELDS) {
        if (
            typeof shipmentData[field] !== 'string' ||
            !shipmentData[field].trim()
        ) {
            errors[field] = `${field} is required`;
        }
    }

    // Check unknown fields
    for (const field of Object.keys(shipmentData)) {
        if (!ALLOWED_SHIPMENT_FIELDS.has(field)) {
            errors[field] = `${field} is not allowed`;
        }
    }

    // Validate carrier
    if (
        typeof shipmentData.carrier === 'string' &&
        !ALLOWED_CARRIERS.has(shipmentData.carrier.trim())
    ) {
        errors.carrier = 'Carrier must be DHL, FedEx, or UPS';
    }

    // Validate tracking number
    if (typeof shipmentData.trackingNumber === 'string') {
        const trackingNumber = shipmentData.trackingNumber.trim();

        if (trackingNumber.length < 5 || trackingNumber.length > 40) {
            errors.trackingNumber =
                'Tracking number must be between 5 and 40 characters';
        }
    }

    const isValid = Object.keys(errors).length === 0;

    return {
        isValid,
        errors: isValid ? null
            : {
                message: 'Validation error',
                fields: errors,
                details: Object.entries(errors)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')
            },
        data: isValid
            ? {
                carrier: shipmentData.carrier.trim(),
                trackingNumber: shipmentData.trackingNumber.trim()
            }
            : null
    };
}