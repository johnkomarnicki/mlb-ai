# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MLB AI prediction application built with Nuxt 3, Vue 3, and TypeScript. The application generates daily MLB game predictions using external ML models and provides a web interface for viewing predictions with confidence grades and analysis.

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

- **Nuxt 3** with Vue 3 and TypeScript
- **Supabase** for PostgreSQL database, authentication, and real-time subscriptions
- **Nuxt UI** with Tailwind CSS for styling
- **Nuxt Cron** for scheduled task automation

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
- `environment` - Weather and stadium conditions

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

## Authentication & Data Flow

- Uses Supabase Auth with email/password authentication
- Protected routes with middleware for admin access
- Real-time data updates via Supabase subscriptions
- Client-side reactivity with Vue Composition API

## Environment Variables

Required environment variables:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `OPENWEATHER_API_KEY` - Weather data API key
- `NUXT_PUBLIC_SITE_URL` - Public site URL for production

## Development Notes

- Uses Nuxt compatibility version 4 for future-ready features
- File-based routing in `app/pages/` directory
- Generated database types ensure type-safe operations
- No formal testing framework currently implemented
- Real-time features depend on Supabase connection
- when creating components in my project, let's ensure we are using the documentation for Nuxt UI 3 that also uses tailwind v4

- When building out new features, let's ensure were using Nuxt UI. Here is a link for all the components https://ui.nuxt.com/components