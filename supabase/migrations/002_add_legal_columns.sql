
-- =============================================================================
-- CAIRN ZERO - LEGAL ACCEPTANCE TRACKING
-- =============================================================================
-- Adds columns for legal acceptance and digital attestation
-- Migration: 002
-- Created: April 2026
-- =============================================================================

BEGIN;

-- Add legal acceptance columns to successors table
ALTER TABLE successors
ADD COLUMN IF NOT EXISTS legal_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS legal_version TEXT,
ADD COLUMN IF NOT EXISTS invitation_token_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS digital_attestation_signed_at TIMESTAMPTZ;

-- Create index for legal acceptance queries
CREATE INDEX IF NOT EXISTS idx_successors_legal_accepted 
ON successors(legal_accepted_at) 
WHERE legal_accepted_at IS NOT NULL;

NOTIFY pgrst, 'reload schema';

COMMIT;
