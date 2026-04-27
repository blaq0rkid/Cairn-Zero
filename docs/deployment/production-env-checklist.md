
# Production Environment Variables Checklist

## Netlify Dashboard Configuration

### Navigate to: Site Settings → Environment Variables

---

## 1. Environment Status Variables

```bash
NEXT_PUBLIC_ENVIRONMENT_MODE=production
NEXT_PUBLIC_APP_STATUS=live
```

**Critical:** These must be set to `production` and `live`

---

## 2. Testing Features (ALL DISABLED)

```bash
NEXT_PUBLIC_SHOW_TEST_UI=false
NEXT_PUBLIC_ENABLE_SIMULATION=false
NEXT_PUBLIC_ALLOW_TEST_KEYS=false
NEXT_PUBLIC_SHOW_SANDBOX_BANNER=false
```

**Verify:** All are explicitly set to `false`

---

## 3. Supabase Production Project

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[production-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]
```

**Action Required:**
1. Create NEW Supabase project for production (separate from staging)
2. Copy URL and keys from production project
3. Paste into Netlify environment variables

---

## 4. Stripe Live Keys

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-live-key]
STRIPE_SECRET_KEY=sk_live_[your-live-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-live-webhook-secret]
```

**Action Required:**
1. Log into Stripe Dashboard
2. Switch to "Live Mode" (toggle in top-right)
3. Navigate to Developers → API Keys
4. Copy live keys (NOT test keys)

**Verification:** Keys MUST start with `pk_live_` and `sk_live_`

---

## 5. Application URLs

```bash
NEXT_PUBLIC_APP_URL=https://mycairnzero.com
NEXT_PUBLIC_API_URL=https://mycairnzero.com/api
APP_URL=https://mycairnzero.com
```

**Replace with your actual production domain**

---

## 6. Email / SMTP Configuration

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=[your-sendgrid-api-key]
SMTP_FROM_EMAIL=noreply@cairnzero.com
SMTP_FROM_NAME=Cairn Zero
RESEND_API_KEY=[your-resend-key]
RESEND_FROM_EMAIL=noreply@cairnzero.com
```

**Action Required:**
1. Choose SendGrid OR Resend (not both)
2. Create production API key
3. Verify sender domain

---

## 7. Security & Auth

```bash
JWT_SECRET=[generate-strong-random-string]
NEXTAUTH_SECRET=[generate-strong-random-string]
NEXTAUTH_URL=https://mycairnzero.com
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

---

## 8. Feature Flags (Production Enabled)

```bash
NEXT_PUBLIC_ENABLE_PHYSICAL_KEYS=true
NEXT_PUBLIC_ENABLE_GUIDEPOSTS=true
NEXT_PUBLIC_ENABLE_EMAIL_INVITES=true
NEXT_PUBLIC_ENABLE_CONTACT_FORM=true
ENABLE_BLIND_LINK_PROTOCOL=true
ENABLE_JIT_FULFILLMENT=true
```

---

## 9. Analytics & Monitoring (Optional)

```bash
NEXT_PUBLIC_ANALYTICS_ID=[your-analytics-id]
SENTRY_DSN=[your-sentry-dsn]
SENTRY_ENVIRONMENT=production
```

---

## 10. Engraver Tool Access

```bash
ENGRAVER_TOOL_PASSWORD=[secure-password]
```

**Generate strong password for engraver-only access**

---

## Verification Steps

### Step 1: Check Environment Mode
```bash
# In Netlify Functions log or browser console, verify:
process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production'
```

### Step 2: Verify Supabase Connection
```bash
# Should point to production project
echo $NEXT_PUBLIC_SUPABASE_URL
# Should NOT contain "staging" or "test"
```

### Step 3: Verify Stripe Keys
```bash
# Keys MUST start with "live"
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | grep "pk_live_"
echo $STRIPE_SECRET_KEY | grep "sk_live_"
```

### Step 4: Verify Test Features Disabled
```bash
# ALL should return "false"
echo $NEXT_PUBLIC_SHOW_TEST_UI
echo $NEXT_PUBLIC_ENABLE_SIMULATION
echo $NEXT_PUBLIC_ALLOW_TEST_KEYS
```

---

## Common Mistakes to Avoid

❌ Using staging Supabase URL in production  
❌ Using Stripe test keys (pk_test_, sk_test_)  
❌ Leaving ENABLE_SIMULATION=true  
❌ Forgetting to set NEXT_PUBLIC_ENVIRONMENT_MODE  
❌ Using localhost URLs  

---

## Final Checklist

- [ ] All environment variables set in Netlify
- [ ] Production Supabase project created and connected
- [ ] Stripe live keys configured
- [ ] Test features explicitly disabled
- [ ] SMTP configured and tested
- [ ] JWT secrets generated
- [ ] Domain URLs updated
- [ ] Analytics configured (optional)
- [ ] Environment variables saved
- [ ] Site redeployed after changes

---

## After Setting Variables

1. Trigger manual deploy in Netlify
2. Check build logs for environment verification
3. Test login flow
4. Verify no test UI elements visible
5. Confirm database connection works

---

**Last Updated:** April 26, 2026  
**Status:** Ready for Production Deployment
