
-- =============================================================================
-- CAIRN ZERO - GUIDEPOST SUPPORT
-- =============================================================================
-- Adds guidepost instructions for successors
-- Migration: 004
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- OPTION 1: Add column to successors table (simpler approach)
-- -----------------------------------------------------------------------------
ALTER TABLE successors
ADD COLUMN IF NOT EXISTS guidepost_instructions TEXT;

-- -----------------------------------------------------------------------------
-- OPTION 2: Create separate guideposts table (optional, for better organization)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guideposts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    successor_slot INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(founder_id, successor_slot)
);

-- Enable RLS
ALTER TABLE guideposts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Founders can manage own guideposts"
ON guideposts FOR ALL
USING (founder_id = auth.uid());

CREATE POLICY "Successors can view assigned guideposts"
ON guideposts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM successors s
        WHERE s.founder_id = guideposts.founder_id
        AND s.slot_number = guideposts.successor_slot
        AND s.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND s.legal_accepted_at IS NOT NULL
    )
);

-- Updated_at trigger
CREATE TRIGGER update_guideposts_updated_at
    BEFORE UPDATE ON guideposts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

NOTIFY pgrst, 'reload schema';

COMMIT;
