const ALLOWED_PATCH_FIELDS = new Set(['customer', 'product', 'status']);

const ALLOWED_SHIPMENT_FIELDS = new Set([ 'carrier', 'trackingNumber']);

const REQUIRED_SHIPMENT_FIELDS = new Set([ 'carrier', 'trackingNumber' ]);

const ALLOWED_CARRIERS = new Set(['DHL', 'FedEx', 'UPS' ]);

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
    return Object.keys(updates).every(field => ALLOWED_PATCH_FIELDS.has(field));
}

function isValidIdempotencyKey(key) {
    const length = key.trim().length;
    return length > 5 && length <= 40;
}

export function isValidShipmentData(shipmentData) {
    const errors = {};

    // Check required fields
    for (const field of REQUIRED_SHIPMENT_FIELDS) {
        if (!isValidString(shipmentData[field])) {
            errors[field] = `${field} is required!`;
        }
    }

    // Validate supplied fields
    for (const [field, value] of Object.entries(shipmentData)) {
        if (!ALLOWED_SHIPMENT_FIELDS.has(field)) {
            errors[field] = `${field} is not allowed!`;
            continue;
        }

        if (!isValidString(value)) {
            errors[field] = `Invalid ${field}!`;
        }

        if (field === 'Idempotency-Key' && !isValidIdempotencyKey(value)) {
            errors[field] = 'Invalid Idempotency-Key!';
        }
    }

    const isValid = Object.keys(errors).length === 0;

    return { errors: isValid ? null : errors, isValid };
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