
# CAIRN ZERO - STAGING ENVIRONMENT SETUP GUIDE
Article IV §4.1 Compliance: Comprehensive Sandbox Testing

## OVERVIEW

This guide establishes the complete staging environment for Cairn Zero per Article IV §4.1 of the Master Unified Protocol. The staging environment must mirror production while remaining completely isolated for safe testing.

---

## INFRASTRUCTURE REQUIREMENTS

### Hosting Platform: Netlify (Staging)

**Why Netlify for Staging:**
- Branch-based deployments
- Environment variable management
- Instant rollbacks
- Deploy previews for testing
- Free tier available for staging

### Database: Supabase (Separate Project)

**Create Staging Database:**

1. **New Supabase Project**
   - Navigate to: https://app.supabase.com
   - Click "New Project"
   - Name: `cairn-zero-staging`
   - Region: Same as production for consistency
   - Database Password: Generate strong password
   - Pricing tier: Free (sufficient for staging)

2. **Project Configuration**
   - Enable Row Level Security (RLS)
   - Configure connection pooling
   - Set up automatic backups (if available)

3. **API Keys**
   - Copy `anon` (public) key
   - Copy `service_role` key
   - Store securely in password manager

### Blockchain Network: Ethereum Sepolia Testnet

**Why Sepolia:**
- Maintained long-term testnet
- Free test ETH from faucets
- Stable and reliable
- Mirrors mainnet behavior

---

## STEP-BY-STEP SETUP

### Step 1: Database Initialization

**Run All Migrations:**

```bash
# Connect to staging Supabase project
cd supabase

# Execute migrations in order
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f migrations/20240427000001_create_profiles.sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f migrations/20240427000002_create_successors.sql
# ... (continue for all 13 migrations)
```

**Verify Tables Created:**

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Output:**
- cairns
- email_verifications
- guideposts
- onboarding_gates
- passkeys
- physical_keys
- profiles
- succession_rehearsals
- successors
- webauthn_challenges

### Step 2: Smart Contract Deployment (Sepolia)

**Install Dependencies:**

```bash
cd contracts
npm install
```

**Configure Environment:**

Create `contracts/.env`:

```bash
INFURA_API_KEY=your_infura_project_id
DEPLOYER_PRIVATE_KEY=0x_your_private_key_for_sepolia_deployment
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Fund Deployer Wallet:**

1. Get Sepolia ETH from faucets:
   - https://sepoliafaucet.com
   - https://faucet.quicknode.com/ethereum/sepolia
   - Minimum: 0.1 ETH

2. Verify balance:
```bash
# Check balance
cast balance [YOUR_WALLET_ADDRESS] --rpc-url https://sepolia.infura.io/v3/[INFURA_KEY]
```

**Deploy Contract:**

```bash
npm run deploy:sepolia
```

**Verify on Etherscan:**

```bash
npm run verify:sepolia
```

**Save Contract Address:**

Copy the deployed forwarder address from output:
```
NEXT_PUBLIC_FORWARDER_ADDRESS_SEPOLIA=0x...
```

### Step 3: Relayer Wallet Setup

**Create Dedicated Wallet:**

```bash
# Generate new wallet
npx hardhat run scripts/generate-wallet.js
```

**Fund Relayer Wallet:**

- Send 0.5 ETH (Sepolia) to relayer address
- This wallet pays gas for all user transactions
- Monitor balance regularly

**Configure Relayer:**

Add to `.env.local`:

```bash
RELAYER_PRIVATE_KEY=0x_generated_private_key
```

### Step 4: External Services Configuration

**Resend Email (Staging Domain):**

1. Sign up: https://resend.com
2. Add staging domain: `staging.cairnzero.com`
3. Verify domain ownership (DNS records)
4. Get API key
5. Create "test mode" API key for staging

```bash
RESEND_API_KEY=re_test_your_api_key
RESEND_FROM_EMAIL=noreply@staging.cairnzero.com
```

**Stripe (Test Mode):**

1. Navigate to: https://dashboard.stripe.com/test/apikeys
2. Copy test keys (pk_test_ and sk_test_)
3. Configure test webhooks for staging URL

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Infura (Separate Project):**

1. Create new Infura project: "Cairn Zero Staging"
2. Enable Ethereum and Sepolia
3. Copy project ID

```bash
INFURA_API_KEY=your_staging_infura_project_id
```

### Step 5: Netlify Deployment

**Create Netlify Site:**

1. **Connect Repository**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Select staging branch: `staging`

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Environment Variables**

   Navigate to: Site settings → Environment variables

   Add all variables from staging `.env.local`:

   ```bash
   # Environment
   NEXT_PUBLIC_ENVIRONMENT_MODE=development
   NEXT_PUBLIC_APP_STATUS=staging
   NEXT_PUBLIC_APP_URL=https://staging-cairn-zero.netlify.app
   APP_URL=https://staging-cairn-zero.netlify.app
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_SIMULATION=true
   NEXT_PUBLIC_SHOW_TEST_UI=true
   
   # Supabase (Staging Project)
   NEXT_PUBLIC_SUPABASE_URL=https://[staging-project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   
   # Email (Resend Test Mode)
   RESEND_API_KEY=re_test_...
   RESEND_FROM_EMAIL=noreply@staging.cairnzero.com
   
   # WebAuthn
   NEXT_PUBLIC_RP_ID=staging-cairn-zero.netlify.app
   
   # Blockchain
   INFURA_API_KEY=your_staging_infura_id
   
   # Contracts (Sepolia)
   NEXT_PUBLIC_FORWARDER_ADDRESS_SEPOLIA=0x...
   
   # Relayer
   RELAYER_PRIVATE_KEY=0x...
   
   # Stripe (Test Mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   
   # Test Key Code (Article II §2.3)
   NEXT_PUBLIC_TEST_KEY_CODE=cz-2026
   
   # Security
   JWT_SECRET=staging_jwt_secret_min_32_chars_random
   ```

4. **Deploy Settings**
   - Auto-deploy: Enabled for `staging` branch
   - Deploy notifications: Enable via Slack/email
   - Deploy previews: Enabled for pull requests

5. **Custom Domain (Optional)**
   - Add custom subdomain: `staging.cairnzero.com`
   - Configure DNS: CNAME → Netlify
   - Enable HTTPS (auto via Let's Encrypt)

### Step 6: Database Seeding

**Create Test Data:**

Create `scripts/seed-staging.sql`:

```sql
-- Test Founder Account
INSERT INTO profiles (id, email, ethereum_address, sovereignty_confirmed)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'test-founder@cairnzero.com',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  true
);

-- Test Successor
INSERT INTO successors (id, founder_id, email, relationship, priority)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'test-successor@cairnzero.com',
  'Business Partner',
  1
);

-- Onboarding Gate (Complete)
INSERT INTO onboarding_gates (
  founder_id,
  email_verified,
  passkey_created,
  wallet_derived,
  sovereignty_confirmed,
  successor_designated,
  rehearsal_completed,
  onboarding_complete
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  true, true, true, true, true, true, true
);
```

**Execute Seeding:**

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f scripts/seed-staging.sql
```

### Step 7: Sandbox Reset Protocol (Article IV §4.4)

**Create Reset Script:**

Create `scripts/reset-sandbox.sh`:

```bash
#!/bin/bash

echo "🔄 Resetting Staging Sandbox to Zero State..."

# Database reset
echo "Clearing all test data..."
psql $SUPABASE_CONNECTION_STRING << EOF
  TRUNCATE TABLE succession_rehearsals CASCADE;
  TRUNCATE TABLE cairns CASCADE;
  TRUNCATE TABLE onboarding_gates CASCADE;
  TRUNCATE TABLE passkeys CASCADE;
  TRUNCATE TABLE webauthn_challenges CASCADE;
  TRUNCATE TABLE email_verifications CASCADE;
  TRUNCATE TABLE successors CASCADE;
  TRUNCATE TABLE physical_keys CASCADE;
  TRUNCATE TABLE guideposts CASCADE;
  TRUNCATE TABLE profiles CASCADE;
  
  -- Reset sequences
  ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;
EOF

echo "✅ Database cleared"

# Clear session storage (manual step for users)
echo "⚠️  Manual steps required:"
echo "1. Clear browser cache and cookies"
echo "2. Clear IndexedDB for staging domain"
echo "3. Remove any stored passkeys for staging domain"

# Verify reset
echo ""
echo "Verifying zero state..."
PROFILE_COUNT=$(psql $SUPABASE_CONNECTION_STRING -t -c "SELECT COUNT(*) FROM profiles;")

if [ "$PROFILE_COUNT" -eq 0 ]; then
  echo "✅ Sandbox reset complete - Zero State confirmed"
else
  echo "❌ Reset failed - profiles still exist"
  exit 1
fi
```

**Make Executable:**

```bash
chmod +x scripts/reset-sandbox.sh
```

**Run Reset:**

```bash
SUPABASE_CONNECTION_STRING="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  ./scripts/reset-sandbox.sh
```

### Step 8: Monitoring & Logging

**Netlify Analytics:**

1. Enable in Netlify dashboard
2. Monitor:
   - Page views
   - API response times
   - Error rates
   - Build performance

**Supabase Logs:**

1. Navigate to: Logs & Monitoring
2. Enable real-time logs
3. Set up alerts for:
   - Failed queries
   - Connection issues
   - RLS policy violations

**Blockchain Monitoring:**

1. **Sepolia Testnet Explorer**
   - Etherscan Sepolia: https://sepolia.etherscan.io
   - Monitor forwarder contract
   - Track relayer transactions

2. **Relayer Wallet Balance Alert**

Create `scripts/check-relayer-balance.js`:

```javascript
const { ethers } = require('ethers');

async function checkBalance() {
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );
  
  const balance = await provider.getBalance(process.env.RELAYER_ADDRESS);
  const balanceETH = ethers.formatEther(balance);
  
  console.log(`Relayer Balance: ${balanceETH} ETH`);
  
  if (parseFloat(balanceETH) < 0.1) {
    console.error('⚠️  WARNING: Relayer balance low! Refill needed.');
    // Send alert email/Slack notification
  }
}

checkBalance();
```

**Run Daily via Cron:**

```bash
# Add to crontab
0 9 * * * cd /path/to/project && node scripts/check-relayer-balance.js
```

### Step 9: Access Control

**Staging Authentication:**

1. **Basic Auth (Optional)**
   - Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/auth"
  status = 200
  force = true
  conditions = {Role = ["visitor"]}
```

2. **IP Whitelist (Enterprise)**
   - Restrict access to team IPs only
   - Configure in Netlify dashboard

**Test Accounts:**

Create documented test credentials:

```
STAGING TEST ACCOUNTS
====================

Founder Account:
Email: test-founder@cairnzero.com
Passkey: Device-based (use your test device)

Successor Account:
Email: test-successor@cairnzero.com
Passkey: Device-based (use different test device)

Test Key Code: cz-2026
```

### Step 10: Verification Checklist

**Pre-Testing Verification:**

- [ ] All database migrations executed
- [ ] Forwarder contract deployed and verified on Sepolia
- [ ] Relayer wallet funded (>0.5 ETH)
- [ ] All environment variables set in Netlify
- [ ] Custom domain SSL active
- [ ] Email sending functional (test email)
- [ ] Stripe test mode configured
- [ ] WebAuthn working on test devices
- [ ] Monitoring enabled (Netlify + Supabase)
- [ ] Reset script tested successfully

**Functional Testing:**

- [ ] Complete onboarding flow (email → passkey → wallet)
- [ ] Create test Cairn (encrypt data)
- [ ] Designate successor
- [ ] Send test marker (rehearsal)
- [ ] Successor unwraps test marker
- [ ] Check-in system functional
- [ ] Gasless transaction executes
- [ ] All emails delivered
- [ ] Error handling works
- [ ] Mobile responsive

---

## MAINTENANCE PROCEDURES

### Weekly Tasks

**Monday Morning:**
- Check relayer wallet balance
- Review error logs (Netlify + Supabase)
- Verify SSL certificate status
- Check API response times

**Thursday Afternoon:**
- Run test onboarding flow end-to-end
- Verify email delivery
- Check database size/performance
- Review feature flags

### Monthly Tasks

**First of Month:**
- Reset sandbox to zero state
- Re-seed with fresh test data
- Update dependencies (npm audit)
- Review and rotate API keys if needed
- Backup staging database
- Test disaster recovery procedure

### Before Major Updates

**Pre-Deployment Checklist:**
1. Reset sandbox to zero state
2. Deploy update to staging
3. Run full QA testing protocol
4. Document any issues found
5. Fix issues before production deploy

---

## TROUBLESHOOTING GUIDE

### Issue: Passkey Creation Fails

**Symptoms:** Browser doesn't prompt for biometric

**Solutions:**
1. Verify HTTPS is active (required for WebAuthn)
2. Check `NEXT_PUBLIC_RP_ID` matches domain exactly
3. Clear browser cache and cookies
4. Try different browser
5. Check browser console for errors

### Issue: Gasless Transaction Fails

**Symptoms:** "Failed to submit meta-transaction"

**Solutions:**
1. Check relayer wallet balance
2. Verify forwarder contract address correct
3. Check Infura API key limits
4. Review transaction nonce
5. Check Sepolia network status

### Issue: Email Not Sending

**Symptoms:** Verification code not received

**Solutions:**
1. Check Resend dashboard for delivery status
2. Verify domain DNS records
3. Check spam folder
4. Verify RESEND_API_KEY is test mode key
5. Check rate limits

### Issue: Database Connection Fails

**Symptoms:** "Could not connect to Supabase"

**Solutions:**
1. Verify Supabase project is active
2. Check connection string format
3. Verify RLS policies allow access
4. Check service role key (not anon key for backend)
5. Review Supabase dashboard for outages

---

## STAGING-TO-PRODUCTION PROMOTION

### Pre-Promotion Checklist

- [ ] All QA tests passed (100% pass rate required)
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Staging deployed for minimum 1 week
- [ ] No critical issues in logs
- [ ] Succession rehearsal tested successfully
- [ ] Stakeholder approval obtained

### Promotion Steps

1. **Tag Release**
```bash
git tag -a v2.0.0-production -m "Production release v2.0.0"
git push origin v2.0.0-production
```

2. **Deploy Mainnet Contracts**
```bash
npm run deploy:mainnet
npm run verify:mainnet
```

3. **Update Production Environment Variables**
   - Copy from staging
   - Change to production values:
     - `NEXT_PUBLIC_ENVIRONMENT_MODE=production`
     - Mainnet contract addresses
     - Production Supabase project
     - Live Stripe keys
     - Production domain

4. **Deploy to Production**
   - Merge `staging` → `main`
   - Netlify auto-deploys from `main` branch
   - Monitor deployment logs

5. **Post-Deployment Verification**
   - Run smoke tests
   - Verify all critical paths
   - Monitor error rates for 24 hours
   - Check relayer wallet balance

---

## DOCUMENTATION FILES

**File Name:** `docs/environment/STAGING_SETUP_GUIDE.md`

**Related Files:**
- `scripts/seed-staging.sql` - Test data seeding
- `scripts/reset-sandbox.sh` - Sandbox reset script
- `scripts/check-relayer-balance.js` - Balance monitoring
- `contracts/.env.example` - Contract environment template
- `.env.staging.example` - Application environment template

---

## SUPPORT CONTACTS

**Technical Issues:**
- Email: devops@cairnzero.com
- Slack: #staging-environment

**Emergency (Critical Failures):**
- On-call: +1-555-CAIRN-DEV
- Available: 24/7

**Weekly Sync:**
- When: Thursdays 2 PM EST
- Where: Zoom (link in team calendar)
- Purpose: Review staging status, plan updates

---

**Document Version:** 2.0  
**Last Updated:** April 28, 2026  
**Next Review:** May 28, 2026  
**Owner:** DevOps Team
