
# Cairn Zero

Zero-Knowledge Digital Continuity Platform

## Overview

Cairn Zero is a digital succession planning platform built on the principle of Zero-Knowledge Sovereignty. We provide total certainty for digital continuity while maintaining absolute privacy - Cairn Zero has zero access to your data.

## Key Features

- **Zero-Knowledge Architecture** - We cannot access, recover, or decrypt your data
- **Succession Planning** - Designate trusted successors for digital continuity
- **Physical Key Support** - Optional hardware authentication (CZ-XXXX codes)
- **Guidepost Instructions** - Leave encrypted messages for your successors
- **Founder Check-In System** - Prevent accidental succession triggers
- **Legal Attestation** - Atomic acceptance tracking for compliance

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + SessionStorage for successors
- **Styling:** Tailwind CSS
- **Deployment:** Netlify
- **Email:** SendGrid / Resend

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cairn-zero.git
cd cairn-zero
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials

5. Run database migrations
```bash
# In Supabase SQL Editor, run migrations in order:
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_add_legal_columns.sql
# ... etc
```

6. Start development server
```bash
npm run dev
```

## Project Structure

```
cairn-zero/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Founder dashboard
│   ├── successor/         # Successor portal
│   ├── contact/           # Contact form
│   └── api/               # API routes
├── components/            # React components
├── docs/                  # Documentation
│   ├── deployment/        # Deployment guides
│   └── sql/              # SQL scripts
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
└── middleware.ts         # Next.js middleware
```

## Database Migrations

All database schema changes are tracked in `supabase/migrations/`. Run them in numerical order:

1. `001_initial_schema.sql` - Base tables
2. `002_add_legal_columns.sql` - Legal tracking
3. `003_create_physical_keys.sql` - Hardware support
4. `004_add_guideposts.sql` - Instructions system
5. `005_add_checkin_tracking.sql` - Stay alive system
6. `006_add_pii_deletion.sql` - Privacy compliance
7. `007_create_simulation_log.sql` - Testing support
8. `008_add_route_metadata.sql` - SEO control
9. `009_add_rls_policies.sql` - Security policies
10. `010_production_indexes.sql` - Performance

## Environment Variables

See `.env.example` for required variables. Key variables:

- `NEXT_PUBLIC_ENVIRONMENT_MODE` - production/staging/development
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key

## Deployment

See `docs/deployment/production-deployment-checklist.md` for complete deployment instructions.

Quick steps:
1. Run production cleanup: `docs/sql/final-production-cleanup.sql`
2. Update environment variables in Netlify
3. Deploy to production
4. Verify all features working

## Documentation

- [Production Launch Checklist](docs/deployment/production-launch-checklist.md)
- [Production Deployment Guide](docs/deployment/production-deployment-checklist.md)
- [Environment Setup](docs/deployment/environment-setup.md)

## Security

- All tables use Row Level Security (RLS)
- Zero-knowledge architecture - no password recovery
- PII auto-deletion on hardware activation
- Session-based successor authentication
- Atomic legal acceptance tracking

## Contributing

This is a private project. For internal development:

1. Create a feature branch
2. Make changes
3. Test thoroughly in staging
4. Submit PR for review

## License

Proprietary - All Rights Reserved

## Contact

For questions or support, use the contact form at `/contact` or email support@cairnzero.com

---

**Built with Zero-Knowledge Sovereignty**
