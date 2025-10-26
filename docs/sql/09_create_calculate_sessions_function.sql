-- Create function to calculate available sessions
CREATE OR REPLACE FUNCTION calculate_available_sessions(
  stock DECIMAL,
  usage_per_session DECIMAL
)
RETURNS INTEGER AS $$
BEGIN
  IF usage_per_session = 0 THEN
    RETURN 9999; -- Si no se usa, consideramos infinito
  END IF;
  RETURN FLOOR(stock / usage_per_session)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
