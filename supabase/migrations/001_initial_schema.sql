
-- =============================================================================
-- CAIRN ZERO - INITIAL SCHEMA
-- =============================================================================
-- Creates the base tables for the Cairn Zero application
-- Migration: 001
-- Created: April 2026
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- SUCCESSORS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS successors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    invitation_token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    slot_number INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'declined', 'revoked')),
    CONSTRAINT unique_founder_slot UNIQUE(founder_id, slot_number)
);

-- Create index on invitation_token for fast lookups
CREATE INDEX idx_successors_invitation_token ON successors(invitation_token);
CREATE INDEX idx_successors_founder_id ON successors(founder_id);

-- Enable RLS on successors
ALTER TABLE successors ENABLE ROW LEVEL SECURITY;

-- Successors policies
CREATE POLICY "Founders can manage own successors"
ON successors FOR ALL
USING (founder_id = auth.uid());

CREATE POLICY "Successors can view own record"
ON successors FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGER FUNCTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_successors_updated_at
    BEFORE UPDATE ON successors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Force PostgREST reload
NOTIFY pgrst, 'reload schema';

COMMIT;
