import test from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../libs/pagination.js';
import { validateNewShipment } from '../libs/validation.js';


// for pagination fn
test('should return correct paginated data', () => {
    const items = [1, 2, 3, 4, 5];

    const result = paginate(items, 2, 2);

    assert.deepEqual(result.data, [3, 4]);
    assert.equal(result.page, 2);
    assert.equal(result.limit, 2);
    assert.equal(result.total, 5);
    assert.equal(result.totalPages, 3);
});


// for shipment data validations
test('should return valid shipment data', () => {
    const shipmentData = {
        carrier: 'DHL',
        trackingNumber: '123456789'
    };

    const result = validateNewShipment(shipmentData);

    assert.equal(result.isValid, true);
    assert.equal(result.errors, null);
    assert.deepEqual(result.data, {
        carrier: 'DHL',
        trackingNumber: '123456789'
    });
});

test('should reject invalid request body', () => {
    const invalidBodies = [null, undefined, [], 'shipment', 123];

    for (const body of invalidBodies) {
        const result = validateNewShipment(body);

        assert.equal(result.isValid, false);
        assert.equal(result.data, null);
        assert.ok(result.errors.fields === undefined);
        assert.ok(result.errors.body);
    }
});

test('should reject missing required fields', () => {
    const result = validateNewShipment({});

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.carrier);
    assert.ok(result.errors.fields.trackingNumber);
    assert.equal(result.data, null);
});

test('should reject empty required fields', () => {
    const result = validateNewShipment({
        carrier: '   ',
        trackingNumber: ''
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.carrier);
    assert.ok(result.errors.fields.trackingNumber);
});

test('should reject unsupported carrier', () => {
    const result = validateNewShipment({
        carrier: 'FedEx Express',
        trackingNumber: '123456789'
    });

    assert.equal(result.isValid, false);
    assert.equal(
        result.errors.fields.carrier,
        'Carrier must be DHL, FedEx, or UPS'
    );
});

test('should reject tracking number shorter than 5 characters', () => {
    const result = validateNewShipment({
        carrier: 'DHL',
        trackingNumber: '1234'
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.trackingNumber);
});

test('should reject tracking number longer than 40 characters', () => {
    const result = validateNewShipment({
        carrier: 'DHL',
        trackingNumber: '1'.repeat(41)
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.trackingNumber);
});

test('should reject unknown fields', () => {
    const result = validateNewShipment({
        carrier: 'DHL',
        trackingNumber: '123456789',
        extraField: 'unexpected'
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.extraField);
    assert.equal(result.data, null);
});