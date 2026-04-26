
# Cairn Zero - Production Deployment Checklist

## Pre-Deployment (Staging Environment)

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env.production`
- [ ] Set `NEXT_PUBLIC_ENVIRONMENT_MODE=production`
- [ ] Set `NEXT_PUBLIC_SHOW_TEST_UI=false`
- [ ] Set `NEXT_PUBLIC_ENABLE_SIMULATION=false`
- [ ] Update Supabase URLs to production project
- [ ] Update Stripe keys to live mode (pk_live_, sk_live_)
- [ ] Verify `NEXT_PUBLIC_APP_URL` is set to production domain

### 2. Database Preparation
- [ ] Create production Supabase project (separate from staging)
- [ ] Run all schema migration scripts
- [ ] Execute `production-data-cleanup.sql` to remove test data
- [ ] Verify RLS policies are enabled on all tables
- [ ] Run `NOTIFY pgrst, 'reload schema';`
- [ ] Test database connection with production credentials

### 3. Code Review
- [ ] Remove or comment out all `console.log` debugging statements
- [ ] Verify no hardcoded test keys (CZ-2026) in production code
- [ ] Check that simulation routes return 404 in production
- [ ] Confirm staging routes are blocked by middleware
- [ ] Review all error messages for production appropriateness

### 4. Feature Testing (End-to-End)

#### Founder Flow
- [ ] Signup → Email verification → Dashboard
- [ ] Add successor → Generate invitation code
- [ ] Edit guidepost instructions
- [ ] Delete successor slot
- [ ] Activate physical kit (if applicable)
- [ ] Real-time updates work correctly

#### Successor Flow
- [ ] Access via `/claim` or `/successor/access`
- [ ] Enter valid invitation code
- [ ] Legal gateway displays correctly
- [ ] Accept terms → Atomic database update confirmed
- [ ] Redirect to `/successor/thank-you`
- [ ] Dashboard loads with guidepost content
- [ ] Logout and re-access works

### 5. Security Audit
- [ ] All API endpoints require proper authentication
- [ ] RLS policies tested and working
- [ ] No exposed service role keys in client code
- [ ] CORS settings configured correctly
- [ ] Rate limiting enabled on sensitive endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection confirmed

## Deployment Day

### 6. DNS & Infrastructure
- [ ] Point domain to production server
- [ ] SSL certificate installed and valid
- [ ] CDN configured (if using)
- [ ] Email DNS records (SPF, DKIM, DMARC) configured
- [ ] Verify email sending works (test invitation)

### 7. Deploy Application
- [ ] Build production bundle (`npm run build`)
- [ ] Run production bundle locally first
- [ ] Deploy to hosting platform (Vercel/Netlify/etc)
- [ ] Verify environment variables loaded correctly
- [ ] Check build logs for warnings/errors

### 8. Post-Deployment Verification
- [ ] Homepage loads correctly
- [ ] All routes return expected responses
- [ ] No console errors in browser
- [ ] Database connections working
- [ ] Stripe webhooks receiving events
- [ ] Email invitations being sent
- [ ] Real-time updates functioning

### 9. Monitoring Setup
- [ ] Error tracking enabled (Sentry/similar)
- [ ] Analytics configured
- [ ] Uptime monitoring active
- [ ] Database backup schedule confirmed
- [ ] Alert thresholds configured

## Staging Environment Setup (Parallel)

### 10. Staging Isolation
- [ ] Create separate staging Supabase project
- [ ] Configure staging environment variables
- [ ] Deploy to `staging.mycairnzero.com`
- [ ] Set `STAGING_ACCESS_PASSWORD` in environment
- [ ] Test staging login protection
- [ ] Verify staging doesn't touch production data
- [ ] Configure test Stripe keys for staging

### 11. Final Verification
- [ ] Production has NO test data
- [ ] Production has NO simulation UI elements
- [ ] Staging is password-protected
- [ ] Staging uses separate database
- [ ] Both environments tested independently

## Rollback Plan

### If Issues Arise
- [ ] Document the specific issue
- [ ] Revert DNS if necessary
- [ ] Roll back to previous build
- [ ] Check error logs and monitoring
- [ ] Communicate with stakeholders

## Success Criteria
- [ ] First real customer can sign up
- [ ] Founder can add real successor
- [ ] Successor can accept with real code
- [ ] All flows work without test artifacts
- [ ] Zero errors in production logs
- [ ] Staging remains accessible for testing

---

**Deployment Authorization:**
- [ ] CEO approval obtained
- [ ] Technical lead sign-off
- [ ] All checklist items completed

**Deployed By:** ________________  
**Date:** ________________  
**Time:** ________________
