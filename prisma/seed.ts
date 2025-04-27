import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
  })

  // Create sample loans
  const loan1 = await prisma.loan.create({
    data: {
      amount: 10000,
      interestRate: 5.5,
      term: 12,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000), // 12 months from now
      userId: user1.id,
    },
  })

  const loan2 = await prisma.loan.create({
    data: {
      amount: 15000,
      interestRate: 6.0,
      term: 24,
      status: 'PENDING',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000), // 24 months from now
      userId: user2.id,
    },
  })

  // Create sample payments
  await prisma.payment.create({
    data: {
      amount: 1000,
      date: new Date(),
      status: 'COMPLETED',
      loanId: loan1.id,
    },
  })

  await prisma.payment.create({
    data: {
      amount: 1500,
      date: new Date(),
      status: 'PENDING',
      loanId: loan2.id,
    },
  })

  console.log('Sample data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 