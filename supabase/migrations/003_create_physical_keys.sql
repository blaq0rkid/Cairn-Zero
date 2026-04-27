
-- =============================================================================
-- CAIRN ZERO - PHYSICAL KEYS TABLE
-- =============================================================================
-- Creates table for tracking physical hardware keys (CZ-XXXX codes)
-- Migration: 003
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- PHYSICAL_KEYS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS physical_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'manufactured',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    manufactured_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    founder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    successor_slot INTEGER,
    
    CONSTRAINT valid_key_status CHECK (status IN ('manufactured', 'active', 'claimed', 'revoked')),
    CONSTRAINT code_format CHECK (code ~ '^CZ-[0-9]{4}$')
);

-- Create indexes
CREATE INDEX idx_physical_keys_code ON physical_keys(code);
CREATE INDEX idx_physical_keys_status ON physical_keys(status);
CREATE INDEX idx_physical_keys_founder ON physical_keys(founder_id);

-- Enable RLS
ALTER TABLE physical_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Founders can view own keys"
ON physical_keys FOR SELECT
USING (founder_id = auth.uid());

CREATE POLICY "Founders can update own keys"
ON physical_keys FOR UPDATE
USING (founder_id = auth.uid());

-- Service role can manage all keys (for engraver tool)
CREATE POLICY "Service role can manage all keys"
ON physical_keys FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

NOTIFY pgrst, 'reload schema';

COMMIT;
