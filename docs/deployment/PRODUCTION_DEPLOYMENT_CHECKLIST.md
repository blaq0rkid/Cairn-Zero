
# CAIRN ZERO - PRODUCTION DEPLOYMENT CHECKLIST
Version: 2.0 | Date: April 28, 2026

## PRE-DEPLOYMENT VERIFICATION

### Environment Configuration
- [ ] All `.env.local` variables copied to production environment (Netlify/Vercel)
- [ ] `NEXT_PUBLIC_ENVIRONMENT_MODE` set to `production`
- [ ] `NEXT_PUBLIC_APP_STATUS` set to `live`
- [ ] `NEXT_PUBLIC_ENABLE_SIMULATION` set to `false`
- [ ] `NEXT_PUBLIC_SHOW_TEST_UI` set to `false`
- [ ] `NEXT_PUBLIC_RP_ID` updated to production domain (e.g., `cairnzero.com`)
- [ ] Stripe keys updated to live keys (`pk_live_...` and `sk_live_...`)
- [ ] Relayer wallet funded with mainnet ETH
- [ ] Production Supabase project created and URLs updated
- [ ] Resend verified sender domain configured

### Database Setup
- [ ] Production Supabase project initialized
- [ ] All 13 migration files executed in order
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Service role key secured and added to environment variables
- [ ] Database backups configured (automatic daily)
- [ ] Connection pooling configured for high traffic

### Smart Contract Deployment
- [ ] CairnZeroForwarder.sol compiled and audited
- [ ] Forwarder contract deployed to Ethereum mainnet
- [ ] Forwarder address added to `NEXT_PUBLIC_FORWARDER_ADDRESS_MAINNET`
- [ ] Relayer wallet granted execution permissions
- [ ] Sarcophagus v2 contract addresses verified for mainnet
- [ ] Contract verification on Etherscan completed
- [ ] Gas price monitoring configured

### WebAuthn Configuration
- [ ] Production domain registered with FIDO Alliance
- [ ] RP ID matches production domain exactly
- [ ] HTTPS/SSL certificate active and valid
- [ ] Cross-origin policies configured correctly
- [ ] Passkey backup eligibility tested on multiple devices

### Security Hardening
- [ ] JWT_SECRET regenerated (minimum 64 characters)
- [ ] Rate limiting configured and tested
- [ ] CORS policies restricted to production domain
- [ ] Content Security Policy (CSP) headers configured
- [ ] SQL injection protection verified
- [ ] XSS protection headers enabled
- [ ] API route authentication middleware active
- [ ] Sensitive error messages disabled in production

### Infrastructure
- [ ] CDN configured for static assets
- [ ] Build optimization completed (`next build`)
- [ ] Bundle size analyzed and optimized
- [ ] Image optimization enabled
- [ ] Edge functions deployed (if using Vercel)
- [ ] Custom domain DNS configured
- [ ] SSL certificate auto-renewal verified

## DEPLOYMENT EXECUTION

### Pre-Deploy
- [ ] Create deployment branch from `main`
- [ ] Run full test suite locally
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Monitoring dashboards prepared

### Deploy
- [ ] Push to production branch
- [ ] Verify build logs for errors
- [ ] Monitor deployment progress
- [ ] Check build time (should be <5 minutes)
- [ ] Verify deployment completion

### Post-Deploy Verification
- [ ] Homepage loads correctly
- [ ] WebAuthn registration flow tested
- [ ] Email verification working
- [ ] Passkey creation successful on multiple devices
- [ ] Wallet derivation confirmed
- [ ] Succession rehearsal flow tested end-to-end
- [ ] Gasless transactions executing
- [ ] Database connections stable
- [ ] API response times <200ms
- [ ] Error tracking active (Sentry/similar)

## POST-DEPLOYMENT

### Monitoring Setup
- [ ] Uptime monitoring configured (99.9% SLA target)
- [ ] Performance monitoring active (Lighthouse CI)
- [ ] Error tracking configured
- [ ] Database query performance monitoring
- [ ] Smart contract event monitoring
- [ ] Relayer wallet balance alerts
- [ ] User analytics configured (privacy-compliant)

### Documentation
- [ ] Production URLs documented
- [ ] Emergency contacts list created
- [ ] Incident response plan finalized
- [ ] Backup restoration procedure tested
- [ ] Smart contract addresses recorded
- [ ] API documentation published

### Legal & Compliance
- [ ] Terms of Service live on site
- [ ] Privacy Policy accessible
- [ ] Zero-Knowledge Sovereignty Disclosure visible
- [ ] Master Unified Protocol available for download
- [ ] GDPR compliance verified (if applicable)
- [ ] Data retention policies enforced

### Communication
- [ ] Status page configured
- [ ] Support email active
- [ ] User onboarding emails tested
- [ ] Emergency notification system ready
- [ ] Team trained on support procedures

## ROLLBACK PROCEDURE

### If Critical Issues Arise
1. Immediately revert to previous stable deployment
2. Notify all team members
3. Investigate issue in staging environment
4. Document root cause
5. Implement fix and re-test
6. Schedule new deployment

### Rollback Checklist
- [ ] Previous deployment version identified
- [ ] Database state can be reverted (if needed)
- [ ] DNS changes can be reversed quickly
- [ ] Users notified of temporary issues
- [ ] Post-mortem scheduled

## SIGN-OFF

**Technical Lead:** _________________ Date: _______

**Security Officer:** _________________ Date: _______

**CEO (Kelley Crowell):** _________________ Date: _______

---

**Deployment Status:** [ ] Ready [ ] Blocked [ ] Complete

**Go-Live Date:** _______________________

**Next Review:** 24 hours post-deployment
