
# Cairn Zero - Final Production Testing Checklist

## Pre-Deployment Testing (Staging)

### 1. Authentication Flow
- [ ] Signup creates new account successfully
- [ ] Email verification works (if enabled)
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials fails appropriately
- [ ] Logout clears session
- [ ] Password requirements enforced

### 2. Sovereignty Warning Modal
- [ ] Modal appears on first login
- [ ] Cannot be dismissed without scrolling
- [ ] Scroll-to-read requirement works
- [ ] Checkbox must be checked to proceed
- [ ] Accept updates database (`sovereignty_warning_accepted = true`)
- [ ] Decline prevents access
- [ ] Modal doesn't reappear after acceptance

### 3. Founder Dashboard
- [ ] Dashboard loads after login
- [ ] System Health Indicator displays
- [ ] "Cairn Active / Monitoring Live" shows green status
- [ ] Founder Check-In widget visible
- [ ] Check-in button functional
- [ ] Last check-in timestamp updates
- [ ] Frequency selector (30/60/90/180 days) works

### 4. Successor Management
- [ ] "Add Successor" button opens modal
- [ ] Form validation works (email, name required)
- [ ] Successor added to database
- [ ] Invitation token generated (CZ-XXXX format)
- [ ] Successor card displays correctly
- [ ] Status badge shows "Pending"
- [ ] Email displays correctly
- [ ] Slot number assigned sequentially

### 5. Guidepost Instructions
- [ ] "Edit" button opens textarea
- [ ] Instructions can be typed
- [ ] "Save" button updates database
- [ ] "Cancel" button discards changes
- [ ] Instructions display after save
- [ ] Empty state shows "No instructions set yet"

### 6. Successor Deletion
- [ ] Delete button shows confirmation dialog
- [ ] Canceling confirmation keeps successor
- [ ] Confirming deletes from database
- [ ] UI updates after deletion
- [ ] Slot numbers remain consistent

### 7. Real-time Updates
- [ ] Dashboard updates when successor added (in another tab)
- [ ] Status changes reflect immediately
- [ ] Legal acceptance updates real-time

---

## Post-Deployment Testing (Production)

### 8. Successor Portal Access

#### Entry Point Testing
- [ ] Navigate to `/claim`
- [ ] Redirects to `/successor/access`
- [ ] Page loads without errors
- [ ] Input field for invitation token visible

#### Token Validation
- [ ] Enter valid CZ-XXXX code
- [ ] Invalid code shows error
- [ ] Empty submission prevented
- [ ] Case-insensitive matching works

#### Legal Gateway
- [ ] Valid token redirects to `/successor/legal-gateway`
- [ ] Terms of Service displayed
- [ ] Privacy Policy displayed
- [ ] Accept checkbox required
- [ ] Cannot proceed without accepting

#### Atomic Legal Acceptance
- [ ] Accepting terms updates ALL fields atomically:
  - `status` → 'active'
  - `legal_accepted_at` → timestamp
  - `legal_version` → recorded
  - `digital_attestation_signed_at` → timestamp
  - `invitation_token_used` → true
- [ ] Single database transaction (no partial updates)

#### Thank You Page
- [ ] Redirects to `/successor/thank-you`
- [ ] Confirmation message displays
- [ ] "Continue to Dashboard" button present
- [ ] Button navigates to successor dashboard

#### Successor Dashboard
- [ ] Dashboard loads with successor data
- [ ] Founder's guidepost instructions visible
- [ ] Status shows "Active"
- [ ] Legal acceptance date displayed
- [ ] Founder name/email shown
- [ ] No access to add/edit features

---

### 9. Data Integrity Testing

#### Test Data Cleanup
- [ ] No CZ-TEST codes in database
- [ ] No CZ-2026 codes in database
- [ ] No @test.com emails in production
- [ ] No test profiles remain
- [ ] No simulation log entries

#### Database Verification
- [ ] Run `docs/sql/final-schema-verification.sql`
- [ ] All required columns exist
- [ ] RLS policies active on all tables
- [ ] Triggers functioning (PII deletion)
- [ ] Indexes created
- [ ] No orphaned records

---

### 10. PII Auto-Deletion Testing

#### Physical Keys (If Implemented)
- [ ] Create test physical key with shipping data
- [ ] Activate key (status → 'active')
- [ ] Verify PII deleted immediately:
  - `shipping_name` → NULL
  - `shipping_address` → NULL
  - `shipping_city` → NULL
  - `shipping_state` → NULL
  - `shipping_zip` → NULL
  - `shipping_country` → NULL
  - `shipping_deleted_at` → timestamp

---

### 11. Security Testing

#### RLS Policy Verification
- [ ] Founders can only see own successors
- [ ] Successors can only see own record
- [ ] No cross-tenant data leakage
- [ ] Service role access works
- [ ] Unauthorized access blocked

#### Session Security
- [ ] Successor sessions expire after 24 hours
- [ ] SessionStorage cleared on logout
- [ ] Cannot bypass legal gateway
- [ ] Cannot access dashboard before acceptance

#### Middleware Protection
- [ ] `/staging-login` blocked in production
- [ ] `/internal/sandbox` blocked in production
- [ ] Test routes return 404
- [ ] Simulation features disabled

---

### 12. UI/UX Testing

#### Responsive Design
- [ ] Mobile view (320px - 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (1024px+)
- [ ] Touch interactions work on mobile

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Form labels present
- [ ] Error messages clear
- [ ] Color contrast sufficient

#### Error Handling
- [ ] Network errors handled gracefully
- [ ] Database errors show user-friendly messages
- [ ] Form validation errors specific
- [ ] Loading states present

---

### 13. Email Testing (If Configured)

- [ ] Invitation emails sent
- [ ] Invitation includes CZ-XXXX code
- [ ] Invitation includes access link
- [ ] Email from correct sender (noreply@cairnzero.com)
- [ ] Email formatting correct
- [ ] Links in email work

---

### 14. Performance Testing

#### Load Times
- [ ] Homepage loads < 2 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] Successor portal loads < 2 seconds

#### Database Queries
- [ ] Dashboard query < 500ms
- [ ] Successor lookup < 200ms
- [ ] Real-time updates < 100ms latency

---

### 15. SEO & Indexing

- [ ] `/staging-login` has noindex meta tag
- [ ] `/internal/*` has noindex meta tag
- [ ] Dashboard routes not indexed
- [ ] Public pages indexed correctly
- [ ] robots.txt configured

---

### 16. Integration Testing

#### Netlify Forms
- [ ] Contact form submits successfully
- [ ] Submissions appear in Netlify dashboard
- [ ] Honeypot field prevents spam
- [ ] Email notifications sent (if configured)

#### Stripe (If Enabled)
- [ ] Checkout page loads
- [ ] Live keys active (pk_live_, sk_live_)
- [ ] Test mode disabled
- [ ] Webhooks configured

---

### 17. Monitoring & Logging

- [ ] Error tracking active (Sentry)
- [ ] No console.log in production
- [ ] Critical errors logged
- [ ] No PII in logs
- [ ] Analytics tracking events

---

## Production Smoke Test (30-Minute Test)

### Founder Flow (15 minutes)
1. Sign up with real email
2. Accept sovereignty warning
3. Confirm presence (check-in)
4. Add one real successor
5. Set guidepost instructions
6. Verify status updates
7. Log out and back in
8. Verify data persists

### Successor Flow (15 minutes)
1. Use real invitation code
2. Access via `/claim`
3. Accept legal terms
4. View thank you page
5. Access successor dashboard
6. Verify guidepost instructions visible
7. Verify status shows "Active"
8. Log out

---

## Go/No-Go Decision Criteria

### ✅ GO (Deploy to Production)
- All critical tests pass
- No data integrity issues
- Security tests pass
- No test data in production
- Environment variables correct
- Performance acceptable

### ⛔ NO-GO (Fix Before Deploy)
- Any security vulnerability
- Data loss/corruption
- Test data in production
- Critical feature broken
- Environment misconfigured
- RLS policies not working

---

## Post-Launch Monitoring (First 48 Hours)

### Hour 1
- [ ] Monitor error rates
- [ ] Check first real signup
- [ ] Verify email delivery
- [ ] Monitor database performance

### Hour 24
- [ ] Review error logs
- [ ] Check user feedback
- [ ] Verify all flows working
- [ ] Monitor server load

### Hour 48
- [ ] Full system health check
- [ ] Review analytics
- [ ] Check for anomalies
- [ ] Prepare status report for CEO

---

**Testing Completed By:** ________________  
**Date:** ________________  
**Production Status:** [ ] GO  [ ] NO-GO  
**Notes:**
