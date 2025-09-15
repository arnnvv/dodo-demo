BEGIN;
CREATE TYPE order_status AS ENUM (
  'pending',
  'succeeded',
  'failed'
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    customer_email TEXT,
    status order_status NOT NULL DEFAULT 'pending',
    dodo_order_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Stores customer order and payment status information.';
COMMENT ON COLUMN orders.id IS 'Primary key, unique internal order identifier.';
COMMENT ON COLUMN orders.status IS 'The current status of the payment (pending, succeeded, failed).';
COMMENT ON COLUMN orders.dodo_order_id IS 'The corresponding order ID from the Dodo Payments provider.';
COMMIT;
