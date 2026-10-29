## Task 2: Frontend Interface

## Order Details

The `OrderDetails` component contains a status filter and fetches the orders from the API.

## Order List

Each order card displays a status badge and a **Mark as Shipped** button. The button is disabled for orders that are already `Shipped`, `Delivered`, or `Cancelled`.

## Event Handling

`OrderDetails` uses a single delegated click listener, `handleContainerClick`, to handle the **Mark as Shipped** button:

- It uses `closest()` to find the clicked button and reads the order ID from its `data-id` attribute.
- It calls the API to update the order status.
- It inserts the API values into the page using `textContent`.

## API and Error Handling

- `http/client.ts` checks `response.ok` and throws an error for failed requests.
- The order API functions return `{ data, error }` to `OrderDetails`.
- `OrderDetails` renders the orders, or the error message, based on that result.

Clone the repository:
```bash
git clone [https://github.com/iknoul/Plugin-hive-training-Day-2.git](https://github.com/iknoul/Plugin-hive-training-Day-2.git)
cd PluginHive-Training-Day-1
```