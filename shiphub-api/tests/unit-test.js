import test from 'node:test';
import assert from 'node:assert/strict';
import { validateNewOrder } from '../libs/validation';

test('should return valid order data with defaults', () => {
    const result = validateNewOrder({
        customer: ' Alice Johnson ',
        product: ' Smartphone '
    });

    assert.equal(result.isValid, true);
    assert.equal(result.errors, null);

    assert.deepEqual(result.data, {
        customer: 'Alice Johnson',
        product: 'Smartphone',
        status: 'Pending',
        priority: 'normal'
    });
});

test('should accept high priority order', () => {
    const result = validateNewOrder({
        customer: 'Alice',
        product: 'Laptop',
        priority: 'high'
    });

    assert.equal(result.isValid, true);
    assert.equal(result.data.priority, 'high');
});

test('should reject invalid priority', () => {
    const result = validateNewOrder({
        customer: 'Alice',
        product: 'Laptop',
        priority: 'urgent'
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields.priority);
});

test('should reject unknown fields', () => {
    const result = validateNewOrder({
        customer: 'Alice',
        product: 'Laptop',
        _id: '123'
    });

    assert.equal(result.isValid, false);
    assert.ok(result.errors.fields._id);
});