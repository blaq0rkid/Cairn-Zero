
-- =============================================================================
-- CAIRN ZERO - PRODUCTION INDEXES
-- =============================================================================
-- Adds performance indexes for production workload
-- Migration: 010
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SUCCESSORS TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_successors_status ON successors(status);

-- Index for email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_successors_email_lower ON successors(LOWER(email));

-- Composite index for founder dashboard queries
CREATE INDEX IF NOT EXISTS idx_successors_founder_status 
ON successors(founder_id, status);

-- Index for legal acceptance queries
CREATE INDEX IF NOT EXISTS idx_successors_legal_version 
ON successors(legal_version) 
WHERE legal_accepted_at IS NOT NULL;

-- -----------------------------------------------------------------------------
-- PROFILES TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Index for email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON profiles(LOWER(email));

-- Index for created_at ordering
CREATE INDEX IF NOT EXISTS idx_profiles_created ON profiles(created_at DESC);

-- -----------------------------------------------------------------------------
-- PHYSICAL_KEYS TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Composite index for founder's active keys
CREATE INDEX IF NOT EXISTS idx_physical_keys_founder_status 
ON physical_keys(founder_id, status);

-- Index for activation timestamp
CREATE INDEX IF NOT EXISTS idx_physical_keys_activated 
ON physical_keys(activated_at DESC) 
WHERE activated_at IS NOT NULL;

-- -----------------------------------------------------------------------------
-- GUIDEPOSTS TABLE INDEXES
-- -----------------------------------------------------------------------------

-- Composite index for founder's guideposts
CREATE INDEX IF NOT EXISTS idx_guideposts_founder_slot 
ON guideposts(founder_id, successor_slot);

NOTIFY pgrst, 'reload schema';

COMMIT;
