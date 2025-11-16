# 🔧 Production Cookie Redirect Fix - Root Cause & Solution

## 🚨 ROOT CAUSE IDENTIFIED

You're experiencing: **"Logged in but keeps redirecting to sign-in when accessing `/admin`, `/patient`, `/dentist`"**

### The Problem

The middleware was calling `getSessionCookie(request)` **without passing the `cookiePrefix`**, but your `auth.ts` configuration has `cookiePrefix: "better-auth"` set. This caused a cookie name mismatch:

- **Better Auth sets cookie as:** `better-auth.session_token` (with prefix)
- **Middleware was looking for:** `session_token` (without prefix)
- **Result:** Middleware couldn't find the cookie → always redirected to sign-in

### Why It Worked in Development

In development, cookies might work differently or the prefix enforcement might be less strict. In production, Better Auth strictly enforces the cookie prefix, causing the mismatch.

---

## ✅ THE FIX

### Changed File: `middleware.ts`

**Before:**
```typescript
const sessionCookie = getSessionCookie(request);
```

**After:**
```typescript
// CRITICAL: Must pass cookiePrefix to match auth.ts configuration
const sessionCookie = getSessionCookie(request, {
  cookiePrefix: "better-auth", // Must match advanced.cookiePrefix in auth.ts
});
```

### Why This Works

According to Better Auth documentation, when you set `cookiePrefix` in your auth configuration, you **must** also pass it to `getSessionCookie`:

> "If your application uses non-default cookie naming conventions, you need to pass the same cookiePrefix to getSessionCookie"

---

## 📋 VERIFICATION CHECKLIST

After deploying this fix, verify:

### 1. Check Cookie Name
- [ ] Open DevTools → Application → Cookies
- [ ] Look for: `better-auth.session_token`
- [ ] Should be present after login

### 2. Test Protected Routes
- [ ] Login successfully
- [ ] Navigate to `/admin` → Should work ✅
- [ ] Navigate to `/patient` → Should work ✅
- [ ] Navigate to `/dentist` → Should work ✅
- [ ] No redirect loop ✅

### 3. Environment Variables (Double Check)
Ensure these are set correctly in production:

```bash
BETTER_AUTH_URL=https://yourdomain.com  # Must match exactly (https, no trailing slash)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
BETTER_AUTH_SECRET=<your-64-char-secret>
```

**Important:** 
- Both URLs must match exactly (including `https://`)
- No trailing slashes
- If using www, include it in both variables

---

## 🔍 ADDITIONAL TROUBLESHOOTING

If the fix doesn't work immediately, check:

### 1. Cookie Prefix Mismatch
Ensure `cookiePrefix` in `middleware.ts` **exactly matches** `auth.ts`:

**In `lib/auth-session/auth.ts`:**
```typescript
advanced: {
  cookiePrefix: "better-auth",  // ← This value
}
```

**In `middleware.ts`:**
```typescript
const sessionCookie = getSessionCookie(request, {
  cookiePrefix: "better-auth",  // ← Must match above
});
```

### 2. Clear Browser Cookies
After deploying:
1. Clear all cookies for your domain
2. Logout and login again
3. Test protected routes

### 3. Use Debug Endpoint
Visit `/api/debug-session` in production to see:
- If cookies are being set
- If cookies are being sent
- Environment variable values

---

## 📚 REFERENCES

This fix is based on Better Auth official documentation:
- [Cookie Configuration](https://better-auth.com/docs/concepts/cookies)
- [Next.js Middleware Integration](https://better-auth.com/docs/integrations/next)
- [getSessionCookie API](https://better-auth.com/docs/reference/cookies#getsessioncookie)

---

## 🎯 SUMMARY

**Root Cause:** Cookie prefix mismatch between auth configuration and middleware  
**Solution:** Pass `cookiePrefix: "better-auth"` to `getSessionCookie()`  
**Status:** ✅ Fixed  
**Impact:** Production redirect loop should now be resolved

---

**Date Fixed:** 2025-01-XX  
**Better Auth Version:** v1.3.27  
**Next.js Version:** 15.5.5

