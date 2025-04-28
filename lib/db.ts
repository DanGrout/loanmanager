import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Ensure we're not storing anything in memory by disconnecting after each operation
export async function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
  try {
    return await operation(prisma)
  } finally {
    await prisma.$disconnect()
  }
}

// User operations
export const userOperations = {
  async createUser(data: { email: string; name: string }) {
    return withPrisma(async (prisma) => {
      return prisma.user.create({ data })
    })
  },

  async getUserById(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.user.findUnique({
        where: { id },
        include: { loans: true }
      })
    })
  },

  async updateUser(id: string, data: { email?: string; name?: string }) {
    return withPrisma(async (prisma) => {
      return prisma.user.update({
        where: { id },
        data
      })
    })
  },

  async deleteUser(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.user.delete({
        where: { id }
      })
    })
  }
}

// Loan operations
export const loanOperations = {
  async createLoan(data: {
    amount: number
    interestRate: number
    term: number
    status: 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'
    startDate: Date
    endDate: Date
    userId: string
  }) {
    return withPrisma(async (prisma) => {
      return prisma.loan.create({ data })
    })
  },

  async getLoanById(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.loan.findUnique({
        where: { id },
        include: {
          user: true,
          payments: true
        }
      })
    })
  },

  async updateLoan(id: string, data: {
    amount?: number
    interestRate?: number
    term?: number
    status?: 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'
    startDate?: Date
    endDate?: Date
  }) {
    return withPrisma(async (prisma) => {
      return prisma.loan.update({
        where: { id },
        data
      })
    })
  },

  async deleteLoan(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.loan.delete({
        where: { id }
      })
    })
  },

  async getLoansByUserId(userId: string) {
    return withPrisma(async (prisma) => {
      return prisma.loan.findMany({
        where: { userId },
        include: {
          payments: true
        }
      })
    })
  }
}

// Payment operations
export const paymentOperations = {
  async createPayment(data: {
    amount: number
    date: Date
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
    loanId: string
  }) {
    return withPrisma(async (prisma) => {
      return prisma.payment.create({ data })
    })
  },

  async getPaymentById(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.payment.findUnique({
        where: { id },
        include: { loan: true }
      })
    })
  },

  async updatePayment(id: string, data: {
    amount?: number
    date?: Date
    status?: 'PENDING' | 'COMPLETED' | 'FAILED'
  }) {
    return withPrisma(async (prisma) => {
      return prisma.payment.update({
        where: { id },
        data
      })
    })
  },

  async deletePayment(id: string) {
    return withPrisma(async (prisma) => {
      return prisma.payment.delete({
        where: { id }
      })
    })
  },

  async getPaymentsByLoanId(loanId: string) {
    return withPrisma(async (prisma) => {
      return prisma.payment.findMany({
        where: { loanId },
        include: { loan: true }
      })
    })
  }
}

export default {
  userOperations,
  loanOperations,
  paymentOperations
} 