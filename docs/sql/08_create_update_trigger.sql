-- Create trigger to auto-update updated_at
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
