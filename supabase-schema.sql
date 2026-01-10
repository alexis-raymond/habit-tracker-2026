-- ============================================================================
-- SUPABASE DATABASE SCHEMA
-- ============================================================================
--
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute the schema
--
-- ============================================================================

-- Create completions table
CREATE TABLE IF NOT EXISTS completions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id TEXT NOT NULL,
    date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint: one completion record per user, habit, and date
    UNIQUE(user_id, habit_id, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(date);
CREATE INDEX IF NOT EXISTS idx_completions_user_habit ON completions(user_id, habit_id);

-- Enable Row Level Security
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can only see their own completions
CREATE POLICY "Users can view own completions"
ON completions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions"
ON completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own completions
CREATE POLICY "Users can update own completions"
ON completions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own completions
CREATE POLICY "Users can delete own completions"
ON completions FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_completions_updated_at
BEFORE UPDATE ON completions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES (optional - run these to verify setup)
-- ============================================================================
-- Run these one at a time after creating the schema to verify it worked:

-- Check if table exists
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'completions';

-- Check if policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'completions';

-- Check if indexes exist
-- SELECT indexname FROM pg_indexes WHERE tablename = 'completions';
