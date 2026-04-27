
-- =============================================================================
-- CAIRN ZERO - FINAL PRODUCTION DATABASE CLEANUP
-- =============================================================================
-- Execute this script IMMEDIATELY BEFORE production launch
-- WARNING: This will DELETE ALL test/simulation data permanently
-- =============================================================================
-- Execution Date: _______________
-- Executed By: _______________
-- Backup Confirmed: [ ] YES  [ ] NO
-- Production Cutover Approved: [ ] YES  [ ] NO
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SAFETY CHECK: Verify this is NOT running on production with real customers
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    real_customer_count INTEGER;
    test_data_count INTEGER;
BEGIN
    -- Check if there are any non-test customers
    SELECT COUNT(*) INTO real_customer_count
    FROM profiles
    WHERE email NOT LIKE '%@test.com'
      AND email NOT LIKE '%+test@%'
      AND email NOT LIKE '%@example.com'
      AND email NOT IN ('kelley@bosssllc.com', 'ynvy0u@gmail.com');
    
    -- Check if there is test data
    SELECT COUNT(*) INTO test_data_count
    FROM successors
    WHERE invitation_token IN ('CZ-2026', 'CZ-TEST', 'CZ-0000')
       OR email LIKE '%@test.com';
    
    IF real_customer_count > 0 AND test_data_count = 0 THEN
        RAISE EXCEPTION 'SAFETY CHECK: Real customers detected but no test data found. Already cleaned?';
    END IF;
    
    RAISE NOTICE 'Safety check passed. Real customers: %, Test data records: %', 
        real_customer_count, test_data_count;
END $$;

-- -----------------------------------------------------------------------------
-- 1. DELETE TEST SUCCESSOR RECORDS
-- -----------------------------------------------------------------------------
DELETE FROM successors
WHERE 
    -- Test invitation tokens
    invitation_token IN ('CZ-2026', 'CZ-TEST', 'CZ-0000')
    OR invitation_token LIKE 'TEST-%'
    OR invitation_token LIKE 'CZ-TEST%'
    -- Test emails
    OR email LIKE '%@test.com'
    OR email LIKE '%+test@%'
    OR email LIKE '%@example.com'
    -- Specific test accounts
    OR email = 'ynvy0u@gmail.com'
    OR email = 'eva@test.com'
    -- Simulation status
    OR status = 'simulation'
    OR status = 'test';

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % test successor records', deleted_count;
END $$;

-- -----------------------------------------------------------------------------
-- 2. DELETE TEST PHYSICAL KEYS
-- -----------------------------------------------------------------------------
DELETE FROM physical_keys
WHERE 
    code LIKE 'CZ-TEST%'
    OR code LIKE 'TEST-%'
    OR code = 'CZ-2026'
    OR code = 'CZ-0000'
    OR status = 'test'
    OR status = 'simulation';

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % test physical key records', deleted_count;
END $$;

-- -----------------------------------------------------------------------------
-- 3. DELETE TEST GUIDEPOSTS
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guideposts') THEN
        DELETE FROM guideposts
        WHERE founder_id IN (
            SELECT id FROM profiles 
            WHERE email LIKE '%@test.com'
               OR email LIKE '%+test@%'
               OR email IN ('kelley@bosssllc.com', 'ynvy0u@gmail.com')
        );
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE '✓ Deleted % test guidepost records', deleted_count;
    ELSE
        RAISE NOTICE '⚠ Guideposts table does not exist, skipping';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. DELETE TEST PROFILES
-- -----------------------------------------------------------------------------
DELETE FROM profiles
WHERE 
    email LIKE '%@test.com'
    OR email LIKE '%+test@%'
    OR email LIKE '%@example.com'
    OR email = 'kelley@bosssllc.com'
    OR email = 'ynvy0u@gmail.com';

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % test profile records', deleted_count;
END $$;

-- -----------------------------------------------------------------------------
-- 5. CLEAN ORPHANED AUTH USERS (if accessible)
-- -----------------------------------------------------------------------------
-- Note: This requires service_role permissions and may need to be run separately
-- Uncomment only if you have the necessary permissions

-- DELETE FROM auth.users
-- WHERE email LIKE '%@test.com'
--    OR email LIKE '%+test@%'
--    OR email IN ('kelley@bosssllc.com', 'ynvy0u@gmail.com');

-- -----------------------------------------------------------------------------
-- 6. RESET SEQUENCES (Optional - for clean start)
-- -----------------------------------------------------------------------------
-- Only reset if you want production to start from ID 1
-- Uncomment if desired:

-- ALTER SEQUENCE IF EXISTS successors_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS physical_keys_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;

-- -----------------------------------------------------------------------------
-- 7. VERIFY CLEAN STATE
-- -----------------------------------------------------------------------------
SELECT 
    'successors' AS table_name, 
    COUNT(*) AS remaining_records,
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CLEAN' 
        ELSE '✗ REVIEW NEEDED' 
    END AS status
FROM successors
UNION ALL
SELECT 
    'physical_keys', 
    COUNT(*),
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CLEAN' 
        ELSE '✗ REVIEW NEEDED' 
    END
FROM physical_keys
UNION ALL
SELECT 
    'profiles', 
    COUNT(*),
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CLEAN' 
        WHEN COUNT(*) <= 2 THEN '⚠ MINIMAL DATA' 
        ELSE '✗ REVIEW NEEDED' 
    END
FROM profiles
UNION ALL
SELECT 
    'guideposts', 
    COALESCE(COUNT(*), 0),
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CLEAN' 
        ELSE 'N/A' 
    END
FROM guideposts
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guideposts');

-- -----------------------------------------------------------------------------
-- 8. DETAILED VERIFICATION - CHECK FOR REMAINING TEST PATTERNS
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    test_successors INTEGER;
    test_keys INTEGER;
    test_profiles INTEGER;
    test_emails TEXT[];
BEGIN
    -- Check successors
    SELECT COUNT(*), array_agg(DISTINCT email) INTO test_successors, test_emails
    FROM successors 
    WHERE email LIKE '%@test.com' 
       OR email LIKE '%+test%'
       OR invitation_token LIKE 'CZ-TEST%';
    
    -- Check physical keys
    SELECT COUNT(*) INTO test_keys 
    FROM physical_keys 
    WHERE code LIKE 'CZ-TEST%' OR status = 'test';
    
    -- Check profiles
    SELECT COUNT(*) INTO test_profiles 
    FROM profiles 
    WHERE email LIKE '%@test.com';
    
    IF test_successors > 0 OR test_keys > 0 OR test_profiles > 0 THEN
        RAISE WARNING 'Test data still detected! Successors: %, Keys: %, Profiles: %', 
            test_successors, test_keys, test_profiles;
        IF test_emails IS NOT NULL THEN
            RAISE WARNING 'Test emails found: %', array_to_string(test_emails, ', ');
        END IF;
    ELSE
        RAISE NOTICE '✓ All test data successfully removed';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 9. FORCE POSTGREST SCHEMA RELOAD
-- -----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- -----------------------------------------------------------------------------
-- 10. PRODUCTION READINESS SUMMARY
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'PRODUCTION CLEANUP COMPLETE';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Review the verification results above.';
    RAISE NOTICE 'If all tables show "✓ CLEAN" status, you may COMMIT.';
    RAISE NOTICE 'If any show "✗ REVIEW NEEDED", investigate before committing.';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE '';
END $$;

-- -----------------------------------------------------------------------------
-- FINAL DECISION: COMMIT OR ROLLBACK
-- -----------------------------------------------------------------------------
-- Review all output above. If everything is correct:
-- Change ROLLBACK to COMMIT below and re-run

ROLLBACK;  -- Change to COMMIT when ready

-- COMMIT;

-- =============================================================================
-- POST-CLEANUP VERIFICATION (Run after COMMIT)
-- =============================================================================
/*
-- Run these queries AFTER committing to double-check:

-- Should return 0 rows:
SELECT * FROM successors WHERE invitation_token LIKE 'CZ-TEST%' OR email LIKE '%@test.com';
SELECT * FROM physical_keys WHERE code LIKE 'CZ-TEST%';
SELECT * FROM profiles WHERE email LIKE '%@test.com';

-- Should show only route_metadata for staging:
SELECT * FROM route_metadata WHERE noindex = true;
*/
