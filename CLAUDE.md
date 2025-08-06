# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CinemaMatch is a Next.js 15 application using TypeScript and Tailwind CSS v4. This is a fresh project bootstrapped with `create-next-app` using the App Router architecture.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build` 
- **Production start**: `npm start`
- **Linting**: `npm run lint`

## Architecture & Structure

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **TypeScript**: Strict mode enabled with absolute imports via `@/*` paths

### Key Files

- `src/app/layout.tsx`: Root layout with font configuration and metadata
- `src/app/page.tsx`: Home page component
- `src/app/globals.css`: Global styles with CSS custom properties and dark mode support
- `eslint.config.mjs`: ESLint configuration using Next.js core web vitals rules
- `next.config.ts`: Next.js configuration (currently minimal)

### Styling System

- Uses Tailwind CSS v4 with custom theme configuration in globals.css
- Built-in dark mode support via CSS custom properties
- CSS variables for consistent theming: `--background`, `--foreground`
- Font variables integrated with Tailwind theme

The project follows Next.js App Router conventions with TypeScript and includes automatic dark mode detection.