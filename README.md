# Cairn Zero - Business Continuity Platform

Zero-knowledge sovereignty for closing the succession gap.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and add your keys
4. Run development server: `npm run dev`

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment

This site is configured for Netlify deployment. Push to main branch to trigger automatic deployment.

## Database

Run the SQL schema in your Supabase project's SQL Editor to set up the database.

// File: next.config.js (CORRECTED)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.marblism.com'],
  },
}

module.exports = nextConfig
