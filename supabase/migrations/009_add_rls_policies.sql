
-- =============================================================================
-- CAIRN ZERO - COMPREHENSIVE RLS POLICIES
-- =============================================================================
-- Adds additional Row Level Security policies for data protection
-- Migration: 009
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- ENHANCED SUCCESSORS POLICIES
-- -----------------------------------------------------------------------------

-- Allow successors to update their own status after legal acceptance
CREATE POLICY "Successors can update own status"
ON successors FOR UPDATE
USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'pending'
)
WITH CHECK (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status IN ('active', 'declined')
);

-- -----------------------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------------------

-- Allow users to insert their own profile on signup
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- PHYSICAL KEYS POLICIES
-- -----------------------------------------------------------------------------

-- Allow founders to claim unassigned keys
CREATE POLICY "Founders can claim unassigned keys"
ON physical_keys FOR UPDATE
USING (
    status = 'manufactured'
    AND founder_id IS NULL
)
WITH CHECK (
    founder_id = auth.uid()
    AND status = 'active'
);

NOTIFY pgrst, 'reload schema';

COMMIT;
