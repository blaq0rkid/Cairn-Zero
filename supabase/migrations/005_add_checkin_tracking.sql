
-- =============================================================================
-- CAIRN ZERO - FOUNDER CHECK-IN TRACKING
-- =============================================================================
-- Adds "Stay Alive" check-in system for founders
-- Migration: 005
-- Created: April 2026
-- =============================================================================

BEGIN;

-- Add check-in columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_check_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS check_in_frequency_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS sovereignty_warning_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sovereignty_warning_accepted_at TIMESTAMPTZ;

-- Create index for overdue check-ins
CREATE INDEX IF NOT EXISTS idx_profiles_last_checkin 
ON profiles(last_check_in) 
WHERE last_check_in IS NOT NULL;

-- Function to get overdue check-ins
CREATE OR REPLACE FUNCTION get_overdue_check_ins()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    last_check_in TIMESTAMPTZ,
    days_overdue INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.last_check_in,
        EXTRACT(DAY FROM NOW() - (p.last_check_in + (p.check_in_frequency_days || ' days')::INTERVAL))::INTEGER
    FROM profiles p
    WHERE p.last_check_in IS NOT NULL
      AND NOW() > (p.last_check_in + (p.check_in_frequency_days || ' days')::INTERVAL)
    ORDER BY p.last_check_in ASC;
END;
$$ LANGUAGE plpgsql;

NOTIFY pgrst, 'reload schema';

COMMIT;
