
-- =============================================================================
-- CAIRN ZERO - FINAL SCHEMA VERIFICATION
-- =============================================================================
-- Execute this to verify production database is ready
-- Last Updated: April 26, 2026
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. VERIFY ALL REQUIRED COLUMNS EXIST IN SUCCESSORS
-- -----------------------------------------------------------------------------
SELECT 
    'successors' AS table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'successors'
AND column_name IN (
    'id',
    'founder_id',
    'email',
    'full_name',
    'invitation_token',
    'status',
    'slot_number',
    'sequence_order',
    'legal_accepted_at',
    'legal_version',
    'invitation_token_used',
    'digital_attestation_signed_at',
    'guidepost_instructions',
    'created_at',
    'updated_at'
)
ORDER BY column_name;

-- Expected: 15 rows

-- -----------------------------------------------------------------------------
-- 2. VERIFY PHYSICAL_KEYS TABLE
-- -----------------------------------------------------------------------------
SELECT 
    'physical_keys' AS table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'physical_keys'
ORDER BY ordinal_position;

-- Expected: 7+ columns

-- -----------------------------------------------------------------------------
-- 3. VERIFY PROFILES TABLE (CHECK-IN COLUMNS)
-- -----------------------------------------------------------------------------
SELECT 
    'profiles' AS table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('last_check_in', 'check_in_frequency_days', 'sovereignty_warning_accepted')
ORDER BY column_name;

-- Expected: 3 rows

-- -----------------------------------------------------------------------------
-- 4. CHECK RLS (ROW LEVEL SECURITY) IS ENABLED
-- -----------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename IN ('successors', 'physical_keys', 'profiles', 'guideposts')
ORDER BY tablename;

-- All should show rls_enabled = true

-- -----------------------------------------------------------------------------
-- 5. VERIFY RLS POLICIES EXIST
-- -----------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual IS NOT NULL AS has_using_clause,
    with_check IS NOT NULL AS has_with_check
FROM pg_policies
WHERE tablename IN ('successors', 'physical_keys', 'profiles', 'guideposts')
ORDER BY tablename, policyname;

-- Should show policies for each table

-- -----------------------------------------------------------------------------
-- 6. CHECK CONSTRAINTS
-- -----------------------------------------------------------------------------
SELECT
    conrelid::regclass AS table_name,
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid IN (
    'successors'::regclass,
    'physical_keys'::regclass,
    'profiles'::regclass
)
ORDER BY table_name, constraint_name;

-- -----------------------------------------------------------------------------
-- 7. VERIFY INDEXES
-- -----------------------------------------------------------------------------
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('successors', 'physical_keys', 'profiles', 'guideposts')
ORDER BY tablename, indexname;

-- -----------------------------------------------------------------------------
-- 8. CHECK FOR MISSING COLUMNS
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    missing_columns TEXT[];
BEGIN
    -- Check successors table
    missing_columns := ARRAY(
        SELECT unnest(ARRAY[
            'legal_accepted_at',
            'legal_version',
            'invitation_token_used',
            'digital_attestation_signed_at',
            'guidepost_instructions'
        ])
        EXCEPT
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'successors'
    );
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE WARNING 'Missing columns in successors table: %', array_to_string(missing_columns, ', ');
    ELSE
        RAISE NOTICE '✓ All required columns exist in successors table';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 9. VERIFY NO BLOCKING CONSTRAINTS ON STATUS TRANSITIONS
-- -----------------------------------------------------------------------------
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'successors'::regclass
  AND contype = 'c'  -- CHECK constraints
  AND conname LIKE '%status%';

-- Should allow: pending → active transition

-- -----------------------------------------------------------------------------
-- 10. CHECK DATABASE FUNCTIONS/TRIGGERS
-- -----------------------------------------------------------------------------
SELECT 
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (p.proname LIKE '%successor%' OR p.proname LIKE '%physical%' OR p.proname LIKE '%check_in%')
ORDER BY function_name;

-- -----------------------------------------------------------------------------
-- 11. VERIFY PII AUTO-DELETION TRIGGER
-- -----------------------------------------------------------------------------
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'auto_delete_shipping_pii';

-- Should return 1 row

-- -----------------------------------------------------------------------------
-- 12. VERIFY ROUTE METADATA TABLE
-- -----------------------------------------------------------------------------
SELECT * FROM route_metadata ORDER BY route_path;

-- Should show staging routes with noindex=true

-- -----------------------------------------------------------------------------
-- 13. VERIFY POSTGREST IS RESPONSIVE
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- Wait 2 seconds, then check:
SELECT NOW() AS schema_reload_timestamp;

-- -----------------------------------------------------------------------------
-- 14. DATA INTEGRITY CHECKS
-- -----------------------------------------------------------------------------

-- Check for orphaned successors (founder doesn't exist)
SELECT COUNT(*) AS orphaned_successors
FROM successors s
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = s.founder_id);

-- Should return 0

-- Check for duplicate invitation tokens
SELECT invitation_token, COUNT(*) AS duplicates
FROM successors
GROUP BY invitation_token
HAVING COUNT(*) > 1;

-- Should return 0 rows

-- Check for invalid status values
SELECT DISTINCT status FROM successors;

-- Should only show: pending, active, declined, revoked

-- -----------------------------------------------------------------------------
-- 15. PRODUCTION READINESS CHECKLIST
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'PRODUCTION READINESS VERIFICATION';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Schema Checks:';
    RAISE NOTICE '  [ ] All required columns exist in successors table';
    RAISE NOTICE '  [ ] physical_keys table exists and is properly configured';
    RAISE NOTICE '  [ ] RLS is enabled on all tables';
    RAISE NOTICE '  [ ] RLS policies are in place';
    RAISE NOTICE '  [ ] No blocking constraints on status field';
    RAISE NOTICE '  [ ] Indexes are created for performance';
    RAISE NOTICE '  [ ] PII auto-deletion trigger is active';
    RAISE NOTICE '';
    RAISE NOTICE 'Data Checks:';
    RAISE NOTICE '  [ ] All test data removed (run cleanup script)';
    RAISE NOTICE '  [ ] No CZ-TEST codes remaining';
    RAISE NOTICE '  [ ] No @test.com emails remaining';
    RAISE NOTICE '  [ ] No orphaned records';
    RAISE NOTICE '  [ ] No duplicate tokens';
    RAISE NOTICE '';
    RAISE NOTICE 'Service Checks:';
    RAISE NOTICE '  [ ] PostgREST schema cache reloaded';
    RAISE NOTICE '  [ ] Production environment variables set';
    RAISE NOTICE '  [ ] Staging environment isolated';
    RAISE NOTICE '';
    RAISE NOTICE '=================================================================';
END $$;
