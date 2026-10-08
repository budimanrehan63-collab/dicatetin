# Dicatetin Agent Guidelines

## Critical Architecture Principles
1. **Always Check Features on Server**: Features like `telegram`, `ai_scan`, `ai_voice`, `ai_insight`, etc. must be verified using `hasFeature(userId, featureCode)` on backend API routes, server actions, and bot webhooks, never solely on client UI.
2. **Indonesian Localization**: All UI strings, errors, date formats (`d MMMM yyyy`), and currency formats (`Rp1.250.000`) must follow standard Indonesian financial conventions.
3. **No Dummy Data in Real Dashboards**: Real queries to Supabase with proper empty states when no data is found. Interactive preview on landing page can use designated dummy state.
4. **Resilience**: AI parsing supports graceful fallbacks, confidence checks, and interactive clarification questions when ambiguous.
