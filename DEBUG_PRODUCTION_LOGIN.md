# 🔍 DEBUGGING: Production Login Redirect Loop

## You're experiencing: "Login successful → Navigate to dashboard → Redirected back to sign-in"

This means the session cookie is **not being saved or sent** properly. Let's debug it step-by-step.

---

## 🚨 IMMEDIATE DEBUGGING STEPS

### Step 1: Check Cookie Setting (CRITICAL)

**After logging in, before navigating:**

1. Open **DevTools** (F12)
2. Go to **Application** tab → **Cookies** → your production domain
3. **Look for:** `better-auth.session_token`

**Expected:** ✅ Cookie is present with these attributes:

- Name: `better-auth.session_token`
- Value: long random string
- Path: `/`
- Secure: ✅ (checkmark)
- HttpOnly: ✅ (checkmark)
- SameSite: `Lax`
- Domain: your domain (with or without leading dot)

**If cookie is MISSING:** Cookie is not being set at all → Go to Step 2
**If cookie is PRESENT:** Cookie is not being sent on navigation → Go to Step 3

---

### Step 2: Check Sign-In Response (If cookie is missing)

**During login:**

1. Open **DevTools** (F12) → **Network** tab
2. Click **Sign In** button
3. Find the auth request (usually `/api/auth/sign-in/email` or similar)
4. Click on it → **Headers** tab → Scroll to **Response Headers**
5. **Look for:** `Set-Cookie: better-auth.session_token=...`

**Expected:** ✅ You see `Set-Cookie` header with the session token

**If Set-Cookie is MISSING:**

```
Problem: Server is NOT sending cookies
Causes:
- BETTER_AUTH_URL mismatch (http vs https, www vs non-www)
- Environment variables not set correctly
- CDN/proxy stripping headers
```

**If Set-Cookie is PRESENT but cookie still missing in Application tab:**

```
Problem: Browser is REJECTING the cookie
Causes:
- Domain mismatch (www vs non-www)
- Secure flag on HTTP (must be HTTPS)
- SameSite=Strict on cross-site redirect
- Browser blocking third-party cookies
```

**Check Chrome Issues tab:**

- In DevTools, look for **Issues** tab (⚠️ icon)
- It will tell you WHY the cookie was blocked

---

### Step 3: Check Cookie Being Sent (If cookie exists but still redirected)

**When navigating to dashboard:**

1. Open **DevTools** (F12) → **Network** tab
2. Click dashboard link (e.g., `/patient`)
3. Find the request to `/patient` (Type: `document`)
4. Click on it → **Headers** tab → **Request Headers**
5. **Look for:** `Cookie: better-auth.session_token=...`

**Expected:** ✅ Cookie is included in the request

**If Cookie is MISSING from request:**

```
Problem: Browser is NOT sending the cookie
Causes:
- Domain mismatch (cookie set on www.example.com, browsing example.com)
- Path issue (unlikely with Path=/)
- Cookie expired immediately
- Cross-subdomain issue
```

---

### Step 4: Use Debug Endpoint

I created a debug endpoint at `/api/debug-session`. Use it to check what the server sees:

**After logging in:**

1. Go to: `https://yourdomain.com/api/debug-session`
2. Copy the entire JSON response
3. Share it with me

**What to look for:**

```json
{
  "cookies": {
    "hasSessionToken": true,  // Should be true
    "names": ["better-auth.session_token", ...]  // Should include this
  },
  "session": {
    "userId": "...",  // Should have user data
    "userEmail": "..."
  },
  "environment": {
    "authUrl": "https://yourdomain.com",  // MUST match actual URL
    "appUrl": "https://yourdomain.com"    // MUST match actual URL
  }
}
```

**If `hasSessionToken: false`** → Cookie not being sent to server
**If `session: null`** → Cookie invalid or expired

---

## 🔧 MOST COMMON FIXES

### Fix 1: WWW vs Non-WWW Domain Mismatch

**Problem:** You login at `www.example.com` but navigate to `example.com` (or vice versa)

**Solution A - Force one domain (Recommended):**

Add to `next.config.ts`:

```typescript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'www.example.com',  // Change to your domain
        },
      ],
      destination: 'https://example.com/:path*',  // Choose ONE canonical domain
      permanent: true,
    },
  ];
},
```

**Solution B - Already applied (crossSubDomainCookies):**
I already added this to your `auth.ts`:

```typescript
advanced: {
  crossSubDomainCookies: {
    enabled: true,
  },
}
```

This sets cookies with `Domain=.example.com` to work on both www and apex.

---

### Fix 2: Environment Variable Mismatch

**Problem:** `BETTER_AUTH_URL` doesn't match your actual production URL

**Check production environment variables:**

```bash
# THESE MUST MATCH EXACTLY (including https:// and www or not)
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# NOT this:
❌ BETTER_AUTH_URL=http://yourdomain.com  (missing 's' in https)
❌ BETTER_AUTH_URL=https://www.yourdomain.com  (if browsing non-www)
```

**Test:** After updating, **rebuild and redeploy**

---

### Fix 3: CDN Caching Auth Responses

**Problem:** Your CDN is caching the login response WITHOUT cookies

**Already fixed in `next.config.ts`:**

```typescript
{
  source: "/api/auth/:path*",
  headers: [
    { key: "Cache-Control", value: "no-store" },
  ],
}
```

**Additional checks:**

- **Cloudflare:** Bypass cache on `/api/auth/*` in Page Rules
- **Vercel:** Should auto-handle, but check Edge Config
- **Other CDNs:** Add cache bypass rule for auth endpoints

---

### Fix 4: HTTP vs HTTPS

**Problem:** Secure cookies don't work on HTTP

**Your production MUST use HTTPS:**

- ✅ `https://yourdomain.com`
- ❌ `http://yourdomain.com`

**Check:**

1. Visit your site
2. Look at address bar - should show 🔒 (padlock)
3. Click padlock → "Connection is secure"

**If on HTTP:**

- Enable HTTPS in your hosting provider
- Force HTTPS redirect
- Update environment URLs to use `https://`

---

### Fix 5: Browser Private/Incognito Mode

**Test in normal browser first:**

- Private/Incognito mode has stricter cookie policies
- Some browsers block all third-party cookies in private mode
- Test in regular browser window first

---

## 📊 MIDDLEWARE ENHANCED LOGGING

I enhanced the middleware to log everything. **Check your production logs:**

**Vercel:** Dashboard → Functions → Logs  
**Railway:** Deployments → Logs  
**Other:** Your platform's logging

**Look for:**

```
[Middleware] Path: /patient
[Middleware] All cookies: [...cookie names...]
[Middleware] Session token: Found (or Missing)
[Middleware] Host: yourdomain.com
[Middleware] Origin: https://yourdomain.com
[Middleware] Referer: https://yourdomain.com/sign-in
```

**If logs show:**

- `All cookies: []` → No cookies sent AT ALL (browser issue)
- `Session token: Missing` → Session cookie specifically not sent
- `Host:` different from `Referer:` → Domain mismatch

---

## 🎯 STEP-BY-STEP TESTING PROTOCOL

**Complete this in order:**

### Test 1: Cookie Setting

- [ ] Login successfully
- [ ] Open DevTools → Application → Cookies
- [ ] See `better-auth.session_token`
- [ ] Cookie has `Secure: ✅` and `HttpOnly: ✅`
- [ ] **Result:** Cookie PRESENT or ABSENT?

### Test 2: Cookie Attributes

- [ ] Check `Domain` field
- [ ] **Is it:** `.yourdomain.com` (with dot) or `yourdomain.com` (without)?
- [ ] **Does it match URL?** If browsing `www.example.com`, does cookie work for it?
- [ ] **Result:** Domain MATCHES or MISMATCHES?

### Test 3: Navigation Request

- [ ] Keep DevTools open, Network tab
- [ ] Click dashboard link
- [ ] Find `/patient` request
- [ ] Check Request Headers → Cookie header
- [ ] **Result:** Cookie SENT or NOT SENT?

### Test 4: Debug Endpoint

- [ ] Visit `/api/debug-session`
- [ ] Copy entire JSON response
- [ ] Check `hasSessionToken` and `session` fields
- [ ] **Result:** Share the JSON output

### Test 5: Sign-In Network Request

- [ ] Clear cookies, logout
- [ ] Open Network tab
- [ ] Login again
- [ ] Find auth sign-in request
- [ ] Check Response Headers for `Set-Cookie`
- [ ] Check Chrome Issues tab for warnings
- [ ] **Result:** Set-Cookie PRESENT or ABSENT?

---

## 🆘 WHAT TO SHARE WITH ME

After running the tests above, share:

1. **Test 1 Result:**
   - Screenshot of Application → Cookies (showing cookie or empty)

2. **Test 4 Result:**
   - Full JSON from `/api/debug-session`

3. **Test 5 Result:**
   - Screenshot of Network tab showing Set-Cookie header (or lack of it)
   - Any warnings from Chrome Issues tab

4. **Production Details:**

   ```
   Production URL: https://___________
   Hosting platform: (Vercel/Railway/Other)
   Using CDN: Yes/No (which one?)
   Domain setup: www or non-www or both?
   ```

5. **Middleware Logs:**
   - Copy the middleware log output from your platform

---

## 🔄 CHANGES I MADE

### 1. Added Cross-Subdomain Cookie Support

**File:** `lib/auth-session/auth.ts`

```typescript
advanced: {
  crossSubDomainCookies: {
    enabled: true, // Now cookies work on both www and non-www
  },
}
```

### 2. Enhanced Middleware Logging

**File:** `middleware.ts`

- Now logs ALL cookies, not just session
- Shows host, origin, referer to detect domain issues
- Tries multiple cookie names just in case

### 3. Prevented CDN Caching

**File:** `next.config.ts`

- Added `Cache-Control: no-store` on `/api/auth/*`
- Added `Access-Control-Allow-Credentials: true`

### 4. Created Debug Endpoint

**File:** `app/api/debug-session/route.ts`

- Shows exactly what server sees
- Reveals environment variables (safely)
- Tests session validation

---

## 🚀 NEXT STEPS

1. **Deploy these changes** (commit + push)
2. **Run the 5 tests above**
3. **Check production logs** for middleware output
4. **Visit `/api/debug-session`** and copy JSON
5. **Share results with me**

I'll pinpoint the exact issue once I see the test results! 🎯

---

## ⚠️ REMOVE DEBUG ENDPOINT LATER

After fixing, delete: `app/api/debug-session/route.ts`
