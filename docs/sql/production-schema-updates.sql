
-- =============================================================================
-- CAIRN ZERO - PRODUCTION SCHEMA UPDATES
-- =============================================================================
-- Execute these updates before production deployment
-- Last Updated: April 26, 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. ADD CHECK-IN TRACKING TO PROFILES TABLE
-- -----------------------------------------------------------------------------
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_check_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS check_in_frequency_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS sovereignty_warning_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sovereignty_warning_accepted_at TIMESTAMPTZ;

RAISE NOTICE '✓ Check-in columns added to profiles table';

-- -----------------------------------------------------------------------------
-- 2. ADD PII TRACKING FOR AUTO-DELETION TO PHYSICAL_KEYS
-- -----------------------------------------------------------------------------
ALTER TABLE physical_keys
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_zip TEXT,
ADD COLUMN IF NOT EXISTS shipping_country TEXT,
ADD COLUMN IF NOT EXISTS shipping_deleted_at TIMESTAMPTZ;

-- Create index for shipping data cleanup queries
CREATE INDEX IF NOT EXISTS idx_physical_keys_shipping_deleted 
ON physical_keys(shipping_deleted_at) 
WHERE shipping_deleted_at IS NULL;

RAISE NOTICE '✓ Shipping PII columns added to physical_keys table';

-- -----------------------------------------------------------------------------
-- 3. CREATE FUNCTION TO AUTO-DELETE PII UPON ACTIVATION
-- -----------------------------------------------------------------------------
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
        
        RAISE NOTICE 'PII auto-deleted for physical key: %', NEW.code;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

RAISE NOTICE '✓ PII auto-deletion function created';

-- -----------------------------------------------------------------------------
-- 4. CREATE TRIGGER FOR PII AUTO-DELETION
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS auto_delete_shipping_pii ON physical_keys;
CREATE TRIGGER auto_delete_shipping_pii
    BEFORE UPDATE ON physical_keys
    FOR EACH ROW
    EXECUTE FUNCTION delete_shipping_pii();

RAISE NOTICE '✓ PII auto-deletion trigger activated';

-- -----------------------------------------------------------------------------
-- 5. CREATE ROUTE METADATA TABLE FOR SEO BLOCKING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS route_metadata (
    route_path TEXT PRIMARY KEY,
    noindex BOOLEAN DEFAULT false,
    nofollow BOOLEAN DEFAULT false,
    environment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mark staging routes to prevent indexing
INSERT INTO route_metadata (route_path, noindex, nofollow, environment)
VALUES 
    ('/staging-login', true, true, 'staging'),
    ('/internal/sandbox', true, true, 'staging'),
    ('/internal/sandbox/*', true, true, 'staging')
ON CONFLICT (route_path) DO UPDATE 
SET noindex = true, nofollow = true;

RAISE NOTICE '✓ Route metadata table created and populated';

-- -----------------------------------------------------------------------------
-- 6. ADD CHECK-IN REMINDER LOGIC
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_overdue_check_ins()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    last_check_in TIMESTAMPTZ,
    days_overdue INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.last_check_in,
        EXTRACT(DAY FROM NOW() - (p.last_check_in + (p.check_in_frequency_days || ' days')::INTERVAL))::INTEGER
    FROM profiles p
    WHERE p.last_check_in IS NOT NULL
      AND NOW() > (p.last_check_in + (p.check_in_frequency_days || ' days')::INTERVAL)
    ORDER BY p.last_check_in ASC;
END;
$$ LANGUAGE plpgsql;

RAISE NOTICE '✓ Overdue check-in function created';

-- -----------------------------------------------------------------------------
-- 7. VERIFY ALL REQUIRED COLUMNS EXIST
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    missing_cols TEXT[];
BEGIN
    -- Check profiles table
    SELECT array_agg(col) INTO missing_cols
    FROM unnest(ARRAY[
        'last_check_in',
        'check_in_frequency_days',
        'sovereignty_warning_accepted',
        'sovereignty_warning_accepted_at'
    ]) AS col
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = col
    );
    
    IF missing_cols IS NOT NULL THEN
        RAISE WARNING 'Missing columns in profiles: %', array_to_string(missing_cols, ', ');
    ELSE
        RAISE NOTICE '✓ All check-in columns exist in profiles table';
    END IF;
    
    -- Check physical_keys table
    SELECT array_agg(col) INTO missing_cols
    FROM unnest(ARRAY[
        'shipping_name',
        'shipping_address',
        'shipping_deleted_at'
    ]) AS col
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'physical_keys' AND column_name = col
    );
    
    IF missing_cols IS NOT NULL THEN
        RAISE WARNING 'Missing columns in physical_keys: %', array_to_string(missing_cols, ', ');
    ELSE
        RAISE NOTICE '✓ All shipping columns exist in physical_keys table';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 8. FORCE POSTGREST SCHEMA RELOAD
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

RAISE NOTICE '✓ PostgREST schema cache reloaded';

COMMIT;

RAISE NOTICE '';
RAISE NOTICE '=================================================================';
RAISE NOTICE 'PRODUCTION SCHEMA UPDATE COMPLETE';
RAISE NOTICE '=================================================================';
RAISE NOTICE 'All schema updates have been applied successfully.';
RAISE NOTICE 'Run the verification queries below to confirm.';
RAISE NOTICE '=================================================================';

-- =============================================================================
-- VERIFICATION QUERIES (Run these after COMMIT)
-- =============================================================================

-- Check profiles columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('last_check_in', 'check_in_frequency_days', 'sovereignty_warning_accepted')
ORDER BY column_name;

-- Check physical_keys columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'physical_keys' 
  AND column_name LIKE 'shipping%'
ORDER BY column_name;

-- Check trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'auto_delete_shipping_pii';

-- Check route_metadata
SELECT * FROM route_metadata;
