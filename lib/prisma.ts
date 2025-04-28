import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Test the connection
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to the database')
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw error
  }
}

// Only test connection in development
if (process.env.NODE_ENV !== "production") {
  testConnection()
} 