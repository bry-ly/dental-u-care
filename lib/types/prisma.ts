import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client Configuration
 * 
 * Important for MongoDB:
 * - No connection pooling needed (MongoDB handles it)
 * - Ensure DATABASE_URL uses mongodb:// or mongodb+srv:// protocol
 * - Disable Prisma Accelerate (not compatible with MongoDB)
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
