# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in natural language, and Claude generates React + Tailwind CSS code rendered in a live preview. All generated files exist in a virtual in-memory filesystem — nothing is written to disk.

## Commands

```bash
# First-time setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (Turbopack, localhost:3000)
npm run dev

# Build for production
npm run build

# Run tests (Vitest + jsdom)
npm run test

# Lint
npm run lint

# Reset database
npm run db:reset
```

## Environment

Copy `.env` and set `ANTHROPIC_API_KEY` to use Claude. Without it, the app falls back to a MockLanguageModel that returns hardcoded demo components (Counter, Form, Card).

## Architecture

### Data Flow
1. User sends a chat message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Chat API streams responses from Claude (via `src/lib/provider.ts`) with tool calls
3. Claude uses two AI tools to write files:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — string replacement in files
   - `file_manager` (`src/lib/tools/file-manager.ts`) — create/read/list/delete files
4. File changes update the virtual filesystem in `FileSystemContext`
5. `PreviewFrame` transforms `/App.jsx` via Babel (`src/lib/transform/jsx-transformer.ts`) and renders it live

### Key Abstractions

**Virtual File System** (`src/lib/file-system.ts`): In-memory file/directory store. All component code lives here. Serialized as JSON and stored in the `Project.data` DB column for authenticated users.

**Provider** (`src/lib/provider.ts`): Returns either the real Anthropic Claude Haiku 4.5 model or a mock. The model used is `claude-haiku-4-5-20251001`.

**System Prompt** (`src/lib/prompts/generation.tsx`): Instructs Claude to write React components using Tailwind CSS with `/App.jsx` as the required entry point.

**Authentication**: JWT-based with bcrypt, stored in HTTP-only cookies (7-day expiry). Server actions in `src/actions/` handle auth. `src/middleware.ts` protects API routes.

### Layout

Three-panel resizable layout in `src/app/main-content.tsx`:
- Left (35%): Chat interface
- Right (65%): Toggleable Preview / Code Editor tabs

### Database Schema (SQLite via Prisma)

- `User`: email (unique), hashed password
- `Project`: optional userId (supports anonymous), name, messages (JSON), data (JSON for virtual FS)

### Path Alias

`@/*` → `src/*` (configured in `tsconfig.json`)
