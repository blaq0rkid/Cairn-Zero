
-- =============================================================================
-- CAIRN ZERO - PII AUTO-DELETION
-- =============================================================================
-- Adds shipping PII columns and auto-deletion trigger
-- Migration: 006
-- Created: April 2026
-- =============================================================================

BEGIN;

-- Add PII columns to physical_keys
ALTER TABLE physical_keys
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_zip TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT,
ADD COLUMN IF NOT EXISTS shipping_deleted_at TIMESTAMPTZ;

-- Create index for PII cleanup queries
CREATE INDEX IF NOT EXISTS idx_physical_keys_shipping_deleted 
ON physical_keys(shipping_deleted_at) 
WHERE shipping_deleted_at IS NULL;

-- Function to auto-delete PII upon activation
CREATE OR REPLACE FUNCTION delete_shipping_pii()
RETURNS TRIGGER AS $$
BEGIN
    -- When a key transitions to 'active' status, immediately delete all shipping PII
    IF NEW.status = 'active' AND OLD.status = 'manufactured' THEN
        NEW.shipping_name := NULL;
        NEW.shipping_address := NULL;
        NEW.shipping_city := NULL;
        NEW.shipping_state := NULL;
        NEW.shipping_zip := NULL;
        NEW.shipping_country := NULL;
        NEW.shipping_deleted_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for PII auto-deletion
DROP TRIGGER IF EXISTS auto_delete_shipping_pii ON physical_keys;
CREATE TRIGGER auto_delete_shipping_pii
    BEFORE UPDATE ON physical_keys
    FOR EACH ROW
    EXECUTE FUNCTION delete_shipping_pii();

NOTIFY pgrst, 'reload schema';

COMMIT;
