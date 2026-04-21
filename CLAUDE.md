# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint with ESLint
npm run lint
```

## Project Architecture

**Spotify Stats Universe** - A Next.js 16 application for visualizing Spotify listening statistics with rich analytics and shareable visuals.

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 with custom theme tokens
- **State Management**: Zustand (auth, dashboard, visual stores)
- **Data Fetching**: TanStack Query (React Query) for Spotify API
- **Animation**: Framer Motion
- **Internationalization**: next-intl (English, Russian, Uzbek)
- **3D Visuals**: React Three Fiber + Three.js
- **Charts**: Recharts

### Authentication Flow

OAuth 2.0 with Spotify:
1. User clicks login → redirects to Spotify authorization
2. Callback handled at `/api/auth/callback`
3. Tokens stored in HTTP-only cookies (`spotify_access_token`, `spotify_refresh_token`)
4. User data stored in non-HTTP cookie (`spotify_user`) for client access
5. Zustand auth store hydrates from cookies on mount

Required env vars (see `.env.local.example`):
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL`

### Data Flow Pattern

API Layer (`lib/services/spotify-api.ts`) → React Query Hooks (`lib/hooks/use-spotify-data.ts`) → Components

- API class manages Axios instance and token injection
- Hooks abstract caching (5 min stale time for top tracks/artists)
- Genre stats computed client-side from top tracks

### Store Architecture

Three Zustand stores with persistence:
- **auth-store**: User session, tokens, login/logout
- **dashboard-store**: UI preferences (locale, view mode)
- **visual-store**: 3D visualization settings

### Key Conventions

1. **Path Aliases**: Use `@/` prefix for all imports (configured in tsconfig.json)
2. **Server Components**: Default to Server Components; "use client" only when needed
3. **Type Safety**: Strict TypeScript - all API responses typed in `lib/types/`
4. **Styling**: Use `cn()` utility from `lib/utils/cn` for conditional Tailwind classes
5. **Time Ranges**: Spotify API uses `'short_term' | 'medium_term' | 'long_term'`

### Project Structure

```
app/
├── (auth)/login/page.tsx       # Login page
├── api/auth/callback/route.ts  # OAuth callback handler
├── dashboard/page.tsx          # Main stats dashboard
├── layout.tsx                  # Root layout with providers
lib/
├── services/spotify-api.ts     # API client singleton
├── hooks/use-spotify-data.ts   # TanStack Query hooks
├── types/                      # TypeScript definitions
stores/                         # Zustand stores
components/
├── providers/                  # Context providers
├── layout/                     # Layout components
messages/                       # i18n translation files
```

### Multi-Agent System

This project uses FrontierForge multi-agent system (defined in `AGENTS.md`). Key agents:
- **Frontend-Lead**: Architecture decisions, code review
- **Frontend-Designer**: UI/UX with Tailwind + shadcn/ui
- **Architecture-System-Designer**: Auth, caching, deployment
- **Debugger**: Bug hunting, performance profiling
- **Tester**: QA and test coverage

Refer to `AGENTS.md` for agent communication format and collaboration workflow.
