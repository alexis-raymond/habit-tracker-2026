-- ============================================================================
-- ATOMS HABIT TRACKER - SUPABASE SCHEMA
-- ============================================================================
-- Run this in your Supabase SQL Editor to create the habits table
-- ============================================================================

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    action TEXT,
    time_location TEXT,
    identity TEXT,
    days TEXT NOT NULL,  -- JSON array of day numbers (0-6)
    goal_amount INTEGER DEFAULT 1,
    goal_unit TEXT DEFAULT 'time',
    habit_time TEXT,
    send_reminder BOOLEAN DEFAULT false,
    completions TEXT DEFAULT '{}',  -- JSON object of {date: boolean}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint: one habit per user with this ID
    PRIMARY KEY (user_id, id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can only see their own habits
CREATE POLICY "Users can view own habits"
ON habits FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own habits
CREATE POLICY "Users can insert own habits"
ON habits FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Users can update own habits"
ON habits FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Users can delete own habits"
ON habits FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_habits_timestamp
BEFORE UPDATE ON habits
FOR EACH ROW
EXECUTE FUNCTION update_habits_updated_at();
