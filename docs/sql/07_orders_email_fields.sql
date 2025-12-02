-- Add email-related columns to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_error TEXT;

-- Update status column comment to reflect new values
COMMENT ON COLUMN orders.status IS 'Order status: draft, sent, failed (legacy: pending, completed)';

-- Index for filtering by email status
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Comments
COMMENT ON COLUMN orders.email_sent IS 'Whether email was sent successfully via Gmail API';
COMMENT ON COLUMN orders.email_sent_at IS 'Timestamp when email was sent';
COMMENT ON COLUMN orders.email_error IS 'Error message if email send failed';
