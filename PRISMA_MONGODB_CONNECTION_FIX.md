# 🔧 Prisma MongoDB Connection Fix - Error P6001

## 🚨 ROOT CAUSE

**Error:** `PrismaClientKnownRequestError: Error validating datasource 'db': the URL must start with the protocol 'prisma://' or 'prisma+postgres://'`

**Error Code:** P6001

**Root Cause:** In production, your `DATABASE_URL` environment variable is either:
1. **Not set** - Prisma falls back to expecting Prisma Accelerate
2. **Set incorrectly** - Using Prisma Accelerate format instead of MongoDB format
3. **Using wrong protocol** - Should be `mongodb://` or `mongodb+srv://`

**Important:** Prisma Accelerate is NOT compatible with MongoDB. MongoDB uses `mongodb://` or `mongodb+srv://` protocols.

---

## ✅ THE FIX

### **CRITICAL: Check Your Production Environment Variables**

#### 1. Verify DATABASE_URL Format

**In your production environment (Vercel, Railway, etc.), ensure:**

```bash
# ✅ CORRECT - MongoDB Atlas (Cloud)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"

# ✅ CORRECT - MongoDB Self-Hosted
DATABASE_URL="mongodb://username:password@host:27017/database?authSource=admin"

# ❌ WRONG - Prisma Accelerate (not for MongoDB)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."

# ❌ WRONG - PostgreSQL (wrong database)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# ❌ WRONG - Missing/Empty
DATABASE_URL=""  # or not set at all
```

#### 2. Remove Prisma Accelerate Variables

**Check if any of these are set in production (REMOVE if present):**
```bash
❌ PRISMA_ACCELERATE_URL
❌ PRISMA_PULSE_URL
❌ PRISMA_GENERATE_DATAPROXY=true
```

#### 3. Verify Prisma Schema

**Your `prisma/schema.prisma` should have:**
```prisma
datasource db {
  provider = "mongodb"  // ✅ Must be "mongodb"
  url      = env("DATABASE_URL")
}
```

---

## 🔍 VERIFICATION STEPS

### Step 1: Check Production Environment Variables

**Log into your hosting platform (Vercel, Railway, etc.) and verify:**

1. **`DATABASE_URL` exists and is set correctly:**
   - Should start with: `mongodb://` or `mongodb+srv://`
   - Should NOT start with: `prisma://`, `prisma+postgres://`, `postgresql://`

2. **No conflicting variables:**
   - Remove `PRISMA_ACCELERATE_URL` if present
   - Remove `PRISMA_PULSE_URL` if present

### Step 2: Test Connection String Format

**MongoDB Atlas (Cloud) Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**MongoDB Self-Hosted Format:**
```
mongodb://<username>:<password>@<host>:<port>/<database>?authSource=admin
```

### Step 3: Regenerate Prisma Client

**After fixing environment variables:**
```bash
# Regenerate Prisma client
npx prisma generate

# Push schema to database (if needed)
npx prisma db push
```

---

## 🛠️ FILES MODIFIED

### `lib/types/prisma.ts` ✅
- Added explicit PrismaClient configuration
- Added logging configuration
- Added documentation comments about MongoDB

**Changes:**
```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
```

---

## ⚠️ COMMON MISTAKES

### Mistake 1: DATABASE_URL Not Set in Production
**Symptom:** Error P6001
**Fix:** Set `DATABASE_URL` with MongoDB connection string

### Mistake 2: Wrong Connection String Format
**Problem:** Using PostgreSQL connection string
```bash
❌ DATABASE_URL="postgresql://user:pass@host:5432/db"
```
**Fix:** Use MongoDB connection string
```bash
✅ DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/db"
```

### Mistake 3: Prisma Accelerate Variables Set
**Problem:** Accelerate environment variables conflict with MongoDB
**Fix:** Remove all Prisma Accelerate variables

---

## 🚀 ACTION REQUIRED

### **IMMEDIATE STEPS:**

1. **Log into your production hosting platform**
2. **Check Environment Variables:**
   - Find `DATABASE_URL`
   - Verify it starts with `mongodb://` or `mongodb+srv://`
   - If missing or wrong, update it

3. **Remove Conflicting Variables:**
   - Delete `PRISMA_ACCELERATE_URL` if present
   - Delete `PRISMA_PULSE_URL` if present

4. **Redeploy:**
   - After updating environment variables
   - Redeploy your application
   - Test authentication flows

---

## 📋 ENVIRONMENT VARIABLE CHECKLIST

**Required in Production:**
- [x] `DATABASE_URL` - MongoDB connection string (`mongodb://` or `mongodb+srv://`)
- [x] `BETTER_AUTH_SECRET` - 64-character secret
- [x] `BETTER_AUTH_URL` - Your production URL (https://)
- [x] `NODE_ENV=production`

**Must NOT be set:**
- [ ] `PRISMA_ACCELERATE_URL` - Remove if present
- [ ] `PRISMA_PULSE_URL` - Remove if present
- [ ] `PRISMA_GENERATE_DATAPROXY` - Remove if present

---

## 🔗 REFERENCE

- **Prisma MongoDB Docs:** https://www.prisma.io/docs/concepts/database-connectors/mongodb
- **Prisma Accelerate:** Not compatible with MongoDB
- **Better Auth MongoDB:** Uses `prismaAdapter(prisma, { provider: "mongodb" })`

---

## ✅ SUMMARY

**Root Cause:** `DATABASE_URL` in production is missing, wrong format, or Prisma Accelerate is enabled  
**Solution:** Set correct MongoDB connection string and remove Accelerate variables  
**Status:** ⚠️ **REQUIRES PRODUCTION ENVIRONMENT VARIABLE UPDATE**

---

**Error Code:** P6001  
**Prisma Version:** 6.18.0  
**Better Auth Version:** 1.3.27  
**Database:** MongoDB
