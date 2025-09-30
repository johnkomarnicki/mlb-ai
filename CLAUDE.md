# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MLB AI prediction application built with Nuxt 3, Vue 3, and TypeScript. The application generates daily MLB game predictions using external ML models and provides a web interface for viewing predictions with confidence grades and analysis. It also features an interactive MLB postseason bracket predictor.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate types (runs automatically after install)
npm run postinstall
```

## Architecture Overview

### Core Technology Stack

- **Nuxt 3** (v3.17.5) with Vue 3 and TypeScript
- **Supabase** for PostgreSQL database, authentication, and real-time subscriptions
- **Nuxt UI 3** (v3.3.2) with Tailwind CSS v4 for styling
- **Nuxt Cron** for scheduled task automation
- **Luxon** for backend date/time, **Moment.js** for frontend display

### Key Directories

- `app/` - Main application code (components, pages, layouts)
- `server/api/` - Server-side API endpoints for MLB data and ML workflows
- `server/cron/` - Automated daily ML model execution (10:35 AM EST)
- `database.types.ts` - Generated TypeScript types from Supabase schema

### Database Schema

Key tables:

- `gamePredictions` - AI predictions with scores, confidence, and analysis
- `gamePredictionsBeta` - Beta testing predictions
- `games` - Core game information
- `todaysGames` - Daily matchups with starting pitchers
- `teamStats` - Per-game team statistics
- `pitcherStats` - Starting pitcher performance
- `recentTeamPerformance` - Aggregated recent stats
- `environment` - Weather and stadium conditions
- `playoff_brackets` - User postseason predictions

## ML Workflow Architecture

The application orchestrates an automated daily workflow:

1. **Daily Cron Job** (10:35 AM EST) triggers `server/cron/mlb-model.ts`
2. **API Orchestrator** (`server/api/runMLBmodel.ts`) coordinates data collection:
   - Fetches daily MLB matchups via `getMLBDailyMatchUps.ts`
   - Gathers team statistics via `getMLBStats.ts`
   - Collects recent performance data via `getMLBRecentPerformance.ts`
   - Retrieves weather conditions via `fetchAndStoreWeather.ts`
3. **External ML Model** triggered via n8n.cloud webhook
4. **Results Storage** in Supabase with real-time updates to UI

## Authentication & Data Access

- Uses Supabase Auth with email/password (magic links) and Google OAuth
- Admin access hardcoded to email: `johnkomarnickicontact@gmail.com`
- Server operations use `serverSupabaseServiceRole` to bypass RLS
- Client operations use `useSupabaseClient()` with RLS enforcement
- Real-time data updates via Supabase subscriptions

## Environment Variables

Required environment variables:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `OPENWEATHER_API_KEY` - Weather data API key
- `NUXT_PUBLIC_SITE_URL` - Public site URL for production

## Key Features & Pages

### Main Features
- **/mlb** - Interactive predictions table with sortable columns, date picker, and detailed analysis modals
- **/mlb/postseason/[userId]** - Playoff bracket builder with countdown timer (locks Sept 30, 2025 1:08 PM EST)
- **/dashboard/mlb** - User dashboard showing top games by AI grade and historical accuracy
- **/admin/dashboard** - Manual ML workflow triggering (admin only)
- **/game/[gameId]** - Individual game details and analysis

### Component Patterns
- Uses Nuxt UI 3 components extensively (UTable, UButton, UModal, UCalendar, UAvatar)
- Page-based architecture with file routing
- Composition API with `<script setup>` syntax
- No state management library - uses Nuxt composables (`useSupabaseClient`, `useAsyncData`)

## Development Notes

- Uses Nuxt compatibility version 4 for future-ready features
- Generated database types ensure type-safe operations
- No formal testing framework currently implemented
- Real-time features depend on Supabase connection
- When creating components, use Nuxt UI 3 documentation: https://ui.nuxt.com/components
- Tailwind v4 configured with custom theme (blue-ribbon primary, scooter secondary, lynch neutral)

## API Endpoints

- `/api/runMLBModel` - Orchestrates entire ML workflow
- `/api/getMLBDailyMatchUps` - Fetches today's games and weather
- `/api/getMLBStats` - Fetches yesterday's game results
- `/api/getMLBRecentPerformance` - Aggregates recent team/pitcher stats
- `/api/evaluatePredictions` - Updates predictions with actual outcomes

## Data Processing Details

### Weather Data
- Wind direction converts to stadium-oriented descriptions ("Out to CF", "In from LF", "To 1B Line")
- Detects indoor stadiums automatically (dome in venue name)

### MLB Stats Processing
- Innings pitched conversion: "6.1" → 6.33 (6 innings + 1 out = 6⅓)
- Team stats aggregated for last 14 games
- Pitcher stats aggregated for last 5 starts
- Bullpen performance calculated separately (IP, ERA, WHIP, SO9)

### Prediction Data
- AI confidence grades use letter format (A+, A, B, C, D, F)
- Predictions include HTML-formatted analysis summaries
- Vegas odds integration for comparison
- Daily evaluation compares predictions vs actual results