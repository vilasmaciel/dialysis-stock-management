-- Create indexes for better performance
CREATE INDEX idx_inventory_logs_material_id ON inventory_logs(material_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
