# MLB Postseason Bracket Scoring System

## Overview

The playoff bracket scoring system allows users to make predictions for the 2025 MLB Postseason and earn points for correct picks. The system automatically scores brackets as series conclude and displays visual indicators (✓ or ✗) directly on user brackets.

## Database Architecture

### Tables

#### `playoff_results`
Stores actual playoff series outcomes for scoring.

| Column | Type | Description |
|--------|------|-------------|
| `series_id` | TEXT (PK) | Unique identifier (e.g., "2025-ALWC1", "2025-NLDS1") |
| `round` | TEXT | Round type: `wild_card`, `division`, `championship`, `world_series` |
| `winning_team_id` | INTEGER | MLB team ID of series winner |
| `losing_team_id` | INTEGER | MLB team ID of series loser |
| `series_end_date` | TIMESTAMPTZ | When series concluded |
| `games_won` | INTEGER | Games won by winner (optional) |
| `games_lost` | INTEGER | Games lost by winner (optional) |

**Series ID Format:**
- Wild Card: `2025-ALWC1`, `2025-ALWC2`, `2025-NLWC1`, `2025-NLWC2`
- Division: `2025-ALDS1`, `2025-ALDS2`, `2025-NLDS1`, `2025-NLDS2`
- Championship: `2025-ALCS`, `2025-NLCS`
- World Series: `2025-WS`

#### `playoff_brackets` (updated)
User brackets with new scoring columns.

| Column | Type | Description |
|--------|------|-------------|
| `points_earned` | INTEGER | Total points from correct predictions (default: 0) |
| `last_scored_at` | TIMESTAMPTZ | Last time bracket was scored |

## Point System

| Round | Points per Correct Pick |
|-------|------------------------|
| Wild Card | 10 points |
| Division Series | 20 points |
| Championship Series | 30 points |
| World Series | 40 points |

**Maximum Possible Points:** 200 points
- 4 Wild Card games × 10 = 40 points
- 4 Division Series × 20 = 80 points
- 2 Championship Series × 30 = 60 points
- 1 World Series × 40 = 40 points

## API Endpoints

### POST `/api/addPlayoffResult`
**Admin only** - Adds or updates a playoff series result.

**Request Body:**
```json
{
  "series_id": "2025-ALWC1",
  "round": "wild_card",
  "winning_team_id": 147,
  "losing_team_id": 111,
  "series_end_date": "2025-10-02T20:30:00Z",
  "games_won": 2,
  "games_lost": 1
}
```

**Behavior:**
- Upserts result to `playoff_results` table
- Automatically triggers `/api/scoreBrackets` after adding result
- Returns success message and result data

### GET `/api/scoreBrackets`
Scores all user brackets based on completed series results.

**Behavior:**
- Fetches all completed playoff results
- Compares each user's bracket picks against actual results
- Calculates total points earned
- Updates `playoff_brackets` table with new scores

**Returns:**
```json
{
  "success": true,
  "bracketsScored": 25,
  "resultsProcessed": 4,
  "updates": [
    { "user_id": "abc123", "points": 40 },
    { "user_id": "def456", "points": 30 }
  ]
}
```

## UI Features

### Visual Indicators on Brackets

Each team logo displays one of three states:

1. **✓ Green Check** - User correctly predicted this team to win
2. **✗ Red X** - User picked this team, but they lost
3. **No indicator** - User didn't pick this matchup yet, or series hasn't concluded

### Total Points Display

When playoff results exist, a blue banner shows:
- Total points earned
- Real-time updates after each series

### Admin Interface

Admin page at `/admin/playoff-results` allows:
- Adding/updating series results via form
- Viewing all existing results
- Automatic bracket scoring after submission

## Workflow

### 1. User Makes Predictions
- Users visit `/mlb/postseason` to fill out bracket
- Picks saved to `playoff_brackets` table
- Deadline: September 30, 2025, 1:08 PM EST

### 2. Admin Enters Results
- After each series concludes, admin visits `/admin/playoff-results`
- Selects round, series, winner, loser, and date
- Submits form → triggers scoring

### 3. Automatic Scoring
- API compares user picks to actual results
- Calculates points based on round
- Updates `points_earned` in database

### 4. Users View Scores
- Brackets display checkmarks/X marks on teams
- Total points shown in blue banner
- Can view other users' brackets to compare scores

## Migration

Run the migration to set up tables:

```bash
cd supabase
# Apply migration (if using Supabase CLI)
supabase db push

# Or manually run SQL in Supabase dashboard:
# File: supabase/migrations/20251002_add_playoff_scoring.sql
```

## Security

- `playoff_results` uses RLS (Row Level Security)
- Authenticated users can read results
- Only service role can modify results (via API)
- Admin endpoints check for hardcoded admin email

## Future Enhancements

Possible improvements:
- Leaderboard page showing all users ranked by points
- Email notifications when scores update
- Bonus points for perfect rounds
- Tiebreaker predictions (e.g., total runs in World Series)
- Historical bracket archive for past seasons
