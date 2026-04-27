
# Cairn Zero - Environment Setup Guide

## Overview

Cairn Zero uses separate environments for production, staging, and development. Each environment is completely isolated with its own database, API keys, and configuration.

---

## Production Environment

### Required Environment Variables

```bash
# =============================================================================
# ENVIRONMENT STATUS
# =============================================================================
NEXT_PUBLIC_ENVIRONMENT_MODE=production
NEXT_PUBLIC_APP_STATUS=live

# CRITICAL: All testing features DISABLED
NEXT_PUBLIC_SHOW_TEST_UI=false
NEXT_PUBLIC_ENABLE_SIMULATION=false
NEXT_PUBLIC_ALLOW_TEST_KEYS=false
NEXT_PUBLIC_SHOW_SANDBOX_BANNER=false

# =============================================================================
# SUPABASE - PRODUCTION PROJECT
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://[your-production-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-production-service-role-key]

# =============================================================================
# STRIPE - LIVE MODE ONLY
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-live-key]
STRIPE_SECRET_KEY=sk_live_[your-live-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-live-webhook-secret]

# =============================================================================
# APPLICATION URLS
# =============================================================================
NEXT_PUBLIC_APP_URL=https://mycairnzero.com
NEXT_PUBLIC_API_URL=https://mycairnzero.com/api

# =============================================================================
# EMAIL / SMTP CONFIGURATION
# =============================================================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=[your-sendgrid-api-key]
SMTP_FROM_EMAIL=noreply@cairnzero.com
SMTP_FROM_NAME=Cairn Zero

# =============================================================================
# SECURITY
# =============================================================================
JWT_SECRET=[generate-strong-random-string-here]
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_WINDOW_MS=60000

# =============================================================================
# FEATURE FLAGS
# =============================================================================
NEXT_PUBLIC_ENABLE_PHYSICAL_KEYS=true
NEXT_PUBLIC_ENABLE_GUIDEPOSTS=true
NEXT_PUBLIC_ENABLE_EMAIL_INVITES=true
NEXT_PUBLIC_ENABLE_CONTACT_FORM=true

# =============================================================================
# ANALYTICS & MONITORING
# =============================================================================
NEXT_PUBLIC_ANALYTICS_ID=[your-analytics-id]
SENTRY_DSN=[your-sentry-dsn]
SENTRY_ENVIRONMENT=production

# =============================================================================
# ZERO-KNOWLEDGE SOVEREIGNTY
# =============================================================================
ENABLE_BLIND_LINK_PROTOCOL=true
ENABLE_JIT_FULFILLMENT=true
ENGRAVER_TOOL_PASSWORD=[secure-password-for-engraver-only]
```

---

## Staging Environment

### Required Environment Variables

```bash
# =============================================================================
# ENVIRONMENT STATUS
# =============================================================================
NEXT_PUBLIC_ENVIRONMENT_MODE=staging
NEXT_PUBLIC_APP_STATUS=staging

# Testing features ENABLED in staging
NEXT_PUBLIC_SHOW_TEST_UI=true
NEXT_PUBLIC_ENABLE_SIMULATION=true
NEXT_PUBLIC_ALLOW_TEST_KEYS=true
NEXT_PUBLIC_SHOW_SANDBOX_BANNER=true

# =============================================================================
# SUPABASE - STAGING PROJECT (SEPARATE DATABASE)
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://[your-staging-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-staging-service-role-key]

# =============================================================================
# STRIPE - TEST MODE
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-test-key]
STRIPE_SECRET_KEY=sk_test_[your-test-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-test-webhook]

# =============================================================================
# APPLICATION URLS
# =============================================================================
NEXT_PUBLIC_APP_URL=https://staging.mycairnzero.com
NEXT_PUBLIC_API_URL=https://staging.mycairnzero.com/api

# =============================================================================
# STAGING ACCESS CONTROL
# =============================================================================
STAGING_ACCESS_PASSWORD=[your-secure-staging-password]
STAGING_COOKIE_DURATION=86400

# =============================================================================
# EMAIL (MAILTRAP OR SIMILAR)
# =============================================================================
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=[mailtrap-user]
SMTP_PASSWORD=[mailtrap-password]
SMTP_FROM_EMAIL=staging@cairnzero.com
SMTP_FROM_NAME=Cairn Zero Staging
```

---

## Local Development Environment

### Required Environment Variables

```bash
# =============================================================================
# ENVIRONMENT STATUS
# =============================================================================
NEXT_PUBLIC_ENVIRONMENT_MODE=development
NEXT_PUBLIC_APP_STATUS=development

# All testing features enabled
NEXT_PUBLIC_SHOW_TEST_UI=true
NEXT_PUBLIC_ENABLE_SIMULATION=true
NEXT_PUBLIC_ALLOW_TEST_KEYS=true

# =============================================================================
# SUPABASE - LOCAL OR DEV PROJECT
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-local-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-local-service-role-key]

# =============================================================================
# STRIPE - TEST MODE
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-test-key]
STRIPE_SECRET_KEY=sk_test_[your-test-key]

# =============================================================================
# APPLICATION URLS
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Environment Setup Instructions

### 1. Production Setup

1. Create a new Supabase project for production
2. Copy `.env.example` to `.env.production`
3. Update all production values
4. Set environment variables in Netlify/Vercel dashboard
5. Never commit `.env.production` to version control

### 2. Staging Setup

1. Create a separate Supabase project for staging
2. Copy `.env.example` to `.env.staging`
3. Update all staging values
4. Deploy to staging subdomain
5. Test all features in isolation

### 3. Local Development Setup

1. Copy `.env.example` to `.env.local`
2. Run Supabase locally: `supabase start`
3. Update local connection details
4. Run development server: `npm run dev`

---

## Security Best Practices

### Environment Variable Management

1. **Never commit** `.env.production`, `.env.staging`, or `.env.local`
2. **Always use** `.env.example` as a template (with dummy values)
3. **Rotate keys** regularly (quarterly recommended)
4. **Use different keys** for each environment
5. **Limit access** to production credentials

### Production Checklist

- [ ] All `_TEST_` keys removed
- [ ] All `localhost` URLs removed
- [ ] All debug flags set to `false`
- [ ] SMTP configured with production credentials
- [ ] Stripe in live mode
- [ ] Analytics tracking production events
- [ ] Error monitoring active

---

## Environment Verification

### Run This Command to Verify Environment

```bash
# Check which environment is active
echo $NEXT_PUBLIC_ENVIRONMENT_MODE

# Verify no test keys in production
grep -r "CZ-TEST" . --exclude-dir=node_modules --exclude-dir=.next

# Verify no console.log in production
grep -r "console.log" src app components --exclude-dir=node_modules
```

### Expected Output (Production)

```
NEXT_PUBLIC_ENVIRONMENT_MODE=production
NEXT_PUBLIC_SHOW_TEST_UI=false
NEXT_PUBLIC_ENABLE_SIMULATION=false
```

---

## Troubleshooting

### Common Issues

**Issue:** Environment variables not loading  
**Solution:** Restart the development server or rebuild production

**Issue:** Wrong Supabase database  
**Solution:** Verify `NEXT_PUBLIC_SUPABASE_URL` matches intended environment

**Issue:** Stripe test mode in production  
**Solution:** Check that keys start with `pk_live_` and `sk_live_`

**Issue:** Staging data appearing in production  
**Solution:** Verify completely separate Supabase projects

---

## Contact

For environment setup issues, contact the technical team or refer to the main deployment documentation.
