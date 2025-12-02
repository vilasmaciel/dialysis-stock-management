-- Insert email configuration settings
INSERT INTO settings (key, value, description)
VALUES
  (
    'order_recipient_email',
    '"hemodialisisencasa@palex.es"'::jsonb,
    'Default recipient email for orders'
  ),
  (
    'order_cc_emails',
    '["vilasmaciel@gmail.com"]'::jsonb,
    'CC email addresses for order copies (array)'
  )
ON CONFLICT (key) DO NOTHING;

-- Comments
COMMENT ON TABLE settings IS 'Application-wide configuration settings';
