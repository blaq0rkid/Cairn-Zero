
# CAIRN ZERO - COMPREHENSIVE QA TESTING PROTOCOL
Article IV §4.1 Compliance | Version: 2.0

## STAGING ENVIRONMENT REQUIREMENTS

### Environment Setup
- **Staging URL:** staging.cairnzero.com
- **Test Database:** Isolated Supabase project
- **Test Network:** Ethereum Sepolia testnet
- **Test Key Code:** cz-2026 (authorized per Article II §2.3)

### Sandbox Reset Protocol (Article IV §4.4)
Before each major testing phase:
1. Drop all test data from database
2. Reset user accounts to zero state
3. Clear session storage and cookies
4. Refund relayer wallet with test ETH
5. Reset smart contract state (if applicable)
6. Verify clean slate with smoke test

## FUNCTIONAL TESTING

### Test Suite 1: WebAuthn Onboarding
**Priority:** Critical | **Article Reference:** Article III §3.3

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T1.1 | Email entry with valid format | Verification code sent | [ ] |
| T1.2 | Email entry with invalid format | Error: "Invalid email format" | [ ] |
| T1.3 | Email verification with correct code | Proceeds to passkey creation | [ ] |
| T1.4 | Email verification with wrong code | Error: "Invalid verification code" | [ ] |
| T1.5 | Email verification code expiration (>10 min) | Error: "Code expired" | [ ] |
| T1.6 | Passkey creation on iOS Safari | Successful with Face ID | [ ] |
| T1.7 | Passkey creation on Chrome desktop | Successful with fingerprint/PIN | [ ] |
| T1.8 | Passkey creation on Android Chrome | Successful with biometric | [ ] |
| T1.9 | User cancels passkey creation | Error handled gracefully | [ ] |
| T1.10 | Wallet derivation immediate after passkey | Ethereum address displayed | [ ] |
| T1.11 | Sovereignty confirmation required | Cannot proceed without acceptance | [ ] |
| T1.12 | Single-record policy enforcement | Duplicate email rejected | [ ] |

### Test Suite 2: Zero-Knowledge Encryption
**Priority:** Critical | **Article Reference:** Article VI §6.1

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T2.1 | Create Cairn with 100 characters | Encrypted and stored | [ ] |
| T2.2 | Create Cairn with 10,000 characters | Encrypted and stored | [ ] |
| T2.3 | Verify server stores only ciphertext | Database contains no plaintext | [ ] |
| T2.4 | AES-256-GCM encryption occurs client-side | No plaintext sent to server | [ ] |
| T2.5 | RSA-4096-OAEP key wrapping | Data key properly wrapped | [ ] |
| T2.6 | Successor public key storage | Only public key stored | [ ] |
| T2.7 | Successor private key isolation | Never transmitted to server | [ ] |
| T2.8 | Cairn unwrap with correct private key | Successfully decrypts | [ ] |
| T2.9 | Cairn unwrap with wrong private key | Decryption fails | [ ] |
| T2.10 | Multiple Cairns per founder | All encrypted independently | [ ] |

### Test Suite 3: Succession Rehearsal
**Priority:** Critical | **Article Reference:** Article IV §4.2

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T3.1 | Create test marker with cz-2026 code | Test marker created | [ ] |
| T3.2 | Successor receives email notification | Email delivered within 2 minutes | [ ] |
| T3.3 | Successor clicks unwrap link | Redirected to unwrap page | [ ] |
| T3.4 | Successor unwraps test marker | Successfully decrypts message | [ ] |
| T3.5 | Founder notification on success | Email sent within 1 minute | [ ] |
| T3.6 | Rehearsal completion updates onboarding gate | Gate marked complete | [ ] |
| T3.7 | Cannot proceed without rehearsal | Onboarding blocked appropriately | [ ] |
| T3.8 | Test marker different from real Cairn | No real data at risk | [ ] |

### Test Suite 4: Gasless Relayer
**Priority:** High | **Article Reference:** Article III §3.3

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T4.1 | User creates Sarcophagus | No gas prompt shown | [ ] |
| T4.2 | Meta-transaction signature | EIP-712 signature created | [ ] |
| T4.3 | Relayer submits transaction | Transaction confirmed on-chain | [ ] |
| T4.4 | Paymaster pays gas fees | User wallet balance unchanged | [ ] |
| T4.5 | Transaction confirmation | User notified of success | [ ] |
| T4.6 | Failed meta-transaction | Error handled, user notified | [ ] |
| T4.7 | Nonce tracking | Prevents replay attacks | [ ] |
| T4.8 | Multiple concurrent transactions | All process correctly | [ ] |

### Test Suite 5: Sarcophagus Integration
**Priority:** High | **Article Reference:** Article VII §7.1

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T5.1 | Create Sarcophagus on onboarding | Sarco ID returned | [ ] |
| T5.2 | Set resurrection time (30 days) | Time recorded correctly | [ ] |
| T5.3 | Founder check-in (rewrap) | Resurrection time extended | [ ] |
| T5.4 | Archaeologist assignment (3 nodes) | All nodes accept assignment | [ ] |
| T5.5 | Simulate trigger event | Unwrap process initiates | [ ] |
| T5.6 | Successor receives decryption key | Key delivered via protocol | [ ] |
| T5.7 | Clean Sarcophagus before trigger | Successfully cancelled | [ ] |

## SECURITY TESTING

### Test Suite 6: Authentication & Authorization
**Priority:** Critical

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T6.1 | Access dashboard without authentication | Redirected to login | [ ] |
| T6.2 | Access another user's Cairn | 403 Forbidden | [ ] |
| T6.3 | SQL injection attempt in email field | Input sanitized, rejected | [ ] |
| T6.4 | XSS attempt in Cairn data | Escaped and rendered safely | [ ] |
| T6.5 | CSRF token validation | Invalid requests blocked | [ ] |
| T6.6 | Rate limiting on API endpoints | >100 req/15min blocked | [ ] |
| T6.7 | JWT token expiration | Session expires after timeout | [ ] |
| T6.8 | Session hijacking attempt | Fails, user logged out | [ ] |

### Test Suite 7: Data Privacy (Zero-Knowledge Compliance)
**Priority:** Critical | **Article Reference:** Article I §1.3

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T7.1 | Inspect database for plaintext secrets | None found | [ ] |
| T7.2 | Admin cannot view user Cairn data | No decryption capability | [ ] |
| T7.3 | Server logs contain no sensitive data | Logs properly sanitized | [ ] |
| T7.4 | Network traffic inspection | Only ciphertext transmitted | [ ] |
| T7.5 | Encryption keys stored client-side only | Verified via browser DevTools | [ ] |

## PERFORMANCE TESTING

### Test Suite 8: Load & Stress Testing

| Test ID | Test Case | Target | Status |
|---------|-----------|--------|--------|
| T8.1 | Homepage load time | <2 seconds | [ ] |
| T8.2 | Passkey creation time | <5 seconds | [ ] |
| T8.3 | Cairn encryption (1000 chars) | <1 second | [ ] |
| T8.4 | API response time (avg) | <200ms | [ ] |
| T8.5 | Database query time (95th percentile) | <100ms | [ ] |
| T8.6 | Concurrent user simulation (100 users) | No degradation | [ ] |
| T8.7 | Relayer transaction throughput | >50 tx/min | [ ] |

## COMPATIBILITY TESTING

### Test Suite 9: Cross-Browser & Cross-Device

| Platform | Browser | WebAuthn Support | Status |
|----------|---------|------------------|--------|
| iOS 16+ | Safari | Platform authenticator | [ ] |
| Android 12+ | Chrome | Platform authenticator | [ ] |
| Windows 11 | Chrome | Windows Hello | [ ] |
| Windows 11 | Edge | Windows Hello | [ ] |
| macOS 13+ | Safari | Touch ID | [ ] |
| macOS 13+ | Chrome | Touch ID | [ ] |
| Linux | Firefox | Security key | [ ] |

## REGRESSION TESTING

### Test Suite 10: Core Functionality Regression

| Test ID | Feature | Regression Check | Status |
|---------|---------|------------------|--------|
| T10.1 | User signup flow | End-to-end works | [ ] |
| T10.2 | Successor invitation | Email delivery functional | [ ] |
| T10.3 | Check-in system | Updates resurrection time | [ ] |
| T10.4 | Physical key activation | PII deleted after 60s | [ ] |
| T10.5 | Guidepost instructions | Saved and retrieved | [ ] |

## REDIRECT INTEGRITY TESTING (Article IV §4.3)

### Test Suite 11: URL Navigation Validation

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T11.1 | Onboarding flow progression | No unexpected redirects | [ ] |
| T11.2 | Post-authentication redirect | Returns to intended page | [ ] |
| T11.3 | Successor invitation link | Redirects to correct unwrap page | [ ] |
| T11.4 | Unauthorized access attempt | Redirects to appropriate error page | [ ] |
| T11.5 | Deep link with authentication | Preserves deep link after login | [ ] |

## TEST EXECUTION LOG

**Test Cycle:** _______  
**Tester:** _______  
**Date:** _______  
**Environment:** [ ] Staging [ ] Production

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___
- Pass Rate: ___%

### Critical Issues
1. _______
2. _______
3. _______

### Sign-Off
**QA Lead:** _________________ Date: _______  
**Technical Lead:** _________________ Date: _______

---

**Next Test Cycle:** _______
