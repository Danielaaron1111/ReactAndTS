// localClient.js — Singleton Prisma client for use in API routes
// In C#, this is like registering a DbContext as a singleton service in Startup.cs
// We do this because Next.js API routes can be called many times,
// and we don't want to create a new database connection every time.

import { PrismaClient } from '@prisma/client';

// globalThis persists across hot-reloads in development
// Without this, you'd get "too many connections" errors during dev
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
