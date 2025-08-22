-- SQL to create the dailyParlayPicks table in Supabase

CREATE TABLE "dailyParlayPicks" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "parlayDate" TEXT NOT NULL,
  "gameIds" TEXT[] NOT NULL,
  games JSONB NOT NULL,
  odds TEXT,
  "totalGames" INTEGER,
  "fanDuelLink" TEXT,
  "createdBy" UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("parlayDate")
);

-- Add RLS policies
ALTER TABLE "dailyParlayPicks" ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to create/update parlays
CREATE POLICY "Allow admin access to dailyParlayPicks" ON "dailyParlayPicks"
FOR ALL USING (auth.jwt() ->> 'email' = 'johnkomarnickicontact@gmail.com');

-- Policy to allow all users to read parlays (for the public dashboard)
CREATE POLICY "Allow public read access to dailyParlayPicks" ON "dailyParlayPicks"
FOR SELECT USING (true);

-- Add indexes for better performance
CREATE INDEX idx_daily_parlay_picks_date ON "dailyParlayPicks"("parlayDate");
CREATE INDEX idx_daily_parlay_picks_created_at ON "dailyParlayPicks"(created_at DESC);