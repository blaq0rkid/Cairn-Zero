
-- =============================================================================
-- CAIRN ZERO - ROUTE METADATA
-- =============================================================================
-- Creates table for SEO blocking of staging routes
-- Migration: 008
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- ROUTE_METADATA TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS route_metadata (
    route_path TEXT PRIMARY KEY,
    noindex BOOLEAN DEFAULT false,
    nofollow BOOLEAN DEFAULT false,
    environment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert staging routes
INSERT INTO route_metadata (route_path, noindex, nofollow, environment)
VALUES 
    ('/staging-login', true, true, 'staging'),
    ('/internal/sandbox', true, true, 'staging'),
    ('/internal/sandbox/*', true, true, 'staging')
ON CONFLICT (route_path) DO UPDATE 
SET noindex = true, nofollow = true;

-- Enable RLS
ALTER TABLE route_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read route metadata"
ON route_metadata FOR SELECT
USING (true);

-- Only service role can modify
CREATE POLICY "Service role can manage route metadata"
ON route_metadata FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

NOTIFY pgrst, 'reload schema';

COMMIT;
