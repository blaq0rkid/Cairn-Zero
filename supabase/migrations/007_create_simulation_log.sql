
-- =============================================================================
-- CAIRN ZERO - SIMULATION LOG
-- =============================================================================
-- Creates table for tracking simulation/testing activities
-- Migration: 007
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SIMULATION_LOG TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS simulation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_type TEXT NOT NULL,
    test_key TEXT,
    email TEXT,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_simulation_type CHECK (simulation_type IN ('test_key', 'staging', 'development'))
);

-- Create indexes
CREATE INDEX idx_simulation_log_created ON simulation_log(created_at DESC);
CREATE INDEX idx_simulation_log_test_key ON simulation_log(test_key);
CREATE INDEX idx_simulation_log_email ON simulation_log(email);

-- Enable RLS
ALTER TABLE simulation_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access simulation logs
CREATE POLICY "Service role can manage simulation logs"
ON simulation_log FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

NOTIFY pgrst, 'reload schema';

COMMIT;
