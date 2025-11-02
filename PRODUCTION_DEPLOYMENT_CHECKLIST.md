# Production Deployment Checklist for Authentication Fix

## Environment Variables (CRITICAL!)

Make sure these are set in your production environment (Vercel/your hosting platform):

### 1. Authentication URL

```bash
BETTER_AUTH_URL=https://your-production-domain.com
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

⚠️ **IMPORTANT**: Replace `https://your-production-domain.com` with your ACTUAL production domain!

### 2. Google OAuth Callback

- Go to Google Cloud Console
- Update your OAuth 2.0 Authorized redirect URIs to include:
  ```
  https://your-production-domain.com/api/auth/callback/google
  ```

### 3. Other Required Environment Variables

Make sure these are all set in production:

- `DATABASE_URL` - Your MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RESEND_API_KEY` - For sending emails
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `EMAIL_SENDER_NAME` - Email sender name
- `EMAIL_SENDER_ADDRESS` - Email sender address
- `NODE_ENV=production`

## Common Issues & Solutions

### Issue: Redirect loop after login

**Cause**: Session cookie not being set or read properly

**Solutions**:

1. ✅ Verify `BETTER_AUTH_URL` matches your production domain (HTTPS!)
2. ✅ Ensure `useSecureCookies` is enabled in production (we set this automatically)
3. ✅ Check that your hosting platform allows cookies
4. ✅ Make sure you're using HTTPS in production (not HTTP)

### Issue: "State not found" error with Google OAuth

**Cause**: Redirect URI mismatch

**Solutions**:

1. ✅ Update Google OAuth callback URL in Google Console
2. ✅ Ensure `BETTER_AUTH_URL` is correct in production env vars

### Issue: Pages not found after deployment

**Cause**: Build didn't include the pages

**Solutions**:

1. Clear build cache: Delete `.next` folder
2. Rebuild: `npm run build`
3. Check build output for any errors

## Testing Steps After Deployment

1. **Test Email/Password Login**:
   - Sign in with email/password
   - Check if you're redirected to dashboard (not stuck in loop)
   - Verify you can access dashboard pages

2. **Test Google OAuth**:
   - Click "Login with Google"
   - Select Google account
   - Verify redirect back to site works
   - Check if you're logged in and can access dashboard

3. **Test Session Persistence**:
   - Login successfully
   - Refresh the page
   - Verify you're still logged in (not redirected to sign-in)

4. **Test Role-Based Access**:
   - Login as patient → should redirect to `/patient`
   - Login as dentist → should redirect to `/dentist`
   - Login as admin → should redirect to `/admin`

## Debug Commands

If still having issues, check browser console and network tab:

1. Check if `better-auth.session_token` cookie is being set:
   - Open DevTools → Application → Cookies
   - Look for `better-auth.session_token`
   - Verify it has `Secure` flag in production
   - Verify it has `SameSite=Lax` or `SameSite=Strict`

2. Check API calls:
   - Open DevTools → Network
   - Look for `/api/auth/session` calls
   - Check if they return user data or 401

3. Check middleware logs:
   - Look at your production logs
   - Search for "[AUTH]" logs to see authentication flow

## Changes Made

1. Added explicit cookie configuration in `lib/auth-session/auth.ts`:
   - `session.cookieCache` enabled
   - `advanced.useSecureCookies` set to true in production
   - Added `trustedOrigins` for CORS

2. Verified dashboard pages exist at:
   - `/admin/page.tsx` ✅
   - `/dentist/page.tsx` ✅
   - `/patient/page.tsx` ✅

3. Auth flow:
   - Email/password: Uses `onSuccess` callback with direct redirect
   - Google OAuth: Uses `sessionStorage` flag + `AuthRedirectHandler` component
