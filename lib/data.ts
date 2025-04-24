export type LoanStatus = "pending" | "active" | "paid" | "defaulted"
export type RiskLevel = "low" | "medium" | "high" | "very-high"

export type Loan = {
  id: string
  name: string
  amount: number
  interestRate: number
  term: number // in months
  startDate: string
  endDate: string
  status: LoanStatus
  borrowerName: string
  borrowerEmail: string
  description?: string
  createdAt: string
  updatedAt: string
  // Risk profiling fields
  riskScore: number // 0-100
  riskLevel: RiskLevel
  creditScore?: number
  collateral?: number
}

export type Payment = {
  id: string
  loanId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "late" | "missed"
  paymentNumber: number
  principal: number
  interest: number
  createdAt: string
  updatedAt: string
}

// Sample data for development
let loans: Loan[] = [
  {
    id: "1",
    name: "Home Mortgage",
    amount: 250000,
    interestRate: 4.5,
    term: 360, // 30 years
    startDate: "2023-01-15",
    endDate: "2053-01-15",
    status: "active",
    borrowerName: "John Smith",
    borrowerEmail: "john.smith@example.com",
    description: "30-year fixed rate mortgage for primary residence",
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2023-01-15T14:30:00Z",
    riskScore: 25,
    riskLevel: "low",
    creditScore: 780,
    collateral: 300000,
  },
  {
    id: "2",
    name: "Auto Loan",
    amount: 35000,
    interestRate: 3.2,
    term: 60, // 5 years
    startDate: "2023-02-01",
    endDate: "2028-02-01",
    status: "active",
    borrowerName: "Sarah Johnson",
    borrowerEmail: "sarah.j@example.com",
    description: "New vehicle financing",
    createdAt: "2023-01-25T09:15:00Z",
    updatedAt: "2023-02-01T11:45:00Z",
    riskScore: 35,
    riskLevel: "low",
    creditScore: 750,
    collateral: 40000,
  },
  {
    id: "3",
    name: "Business Expansion",
    amount: 150000,
    interestRate: 6.75,
    term: 120, // 10 years
    startDate: "2022-11-01",
    endDate: "2032-11-01",
    status: "active",
    borrowerName: "Acme Corporation",
    borrowerEmail: "finance@acmecorp.com",
    description: "Funding for new equipment and facility expansion",
    createdAt: "2022-10-15T13:20:00Z",
    updatedAt: "2022-11-01T10:00:00Z",
    riskScore: 55,
    riskLevel: "medium",
    creditScore: 680,
    collateral: 100000,
  },
  {
    id: "4",
    name: "Personal Loan",
    amount: 15000,
    interestRate: 8.5,
    term: 36, // 3 years
    startDate: "2023-03-15",
    endDate: "2026-03-15",
    status: "pending",
    borrowerName: "Michael Chen",
    borrowerEmail: "m.chen@example.com",
    description: "Debt consolidation",
    createdAt: "2023-03-10T16:45:00Z",
    updatedAt: "2023-03-10T16:45:00Z",
    riskScore: 70,
    riskLevel: "high",
    creditScore: 620,
    collateral: 0,
  },
  {
    id: "5",
    name: "Student Loan Refinance",
    amount: 45000,
    interestRate: 5.25,
    term: 120, // 10 years
    startDate: "2022-09-01",
    endDate: "2032-09-01",
    status: "active",
    borrowerName: "Emily Rodriguez",
    borrowerEmail: "e.rodriguez@example.com",
    description: "Consolidation of federal and private student loans",
    createdAt: "2022-08-20T11:30:00Z",
    updatedAt: "2022-09-01T09:15:00Z",
    riskScore: 40,
    riskLevel: "medium",
    creditScore: 710,
    collateral: 0,
  },
  {
    id: "6",
    name: "Small Business Startup",
    amount: 75000,
    interestRate: 9.5,
    term: 84, // 7 years
    startDate: "2023-04-01",
    endDate: "2030-04-01",
    status: "active",
    borrowerName: "Tech Innovators LLC",
    borrowerEmail: "finance@techinnovators.com",
    description: "Initial funding for tech startup",
    createdAt: "2023-03-15T14:20:00Z",
    updatedAt: "2023-04-01T10:30:00Z",
    riskScore: 85,
    riskLevel: "very-high",
    creditScore: 650,
    collateral: 25000,
  },
  {
    id: "7",
    name: "Home Renovation",
    amount: 50000,
    interestRate: 5.75,
    term: 60, // 5 years
    startDate: "2023-05-15",
    endDate: "2028-05-15",
    status: "active",
    borrowerName: "David Wilson",
    borrowerEmail: "d.wilson@example.com",
    description: "Kitchen and bathroom remodeling",
    createdAt: "2023-05-01T09:45:00Z",
    updatedAt: "2023-05-15T13:20:00Z",
    riskScore: 30,
    riskLevel: "low",
    creditScore: 760,
    collateral: 250000,
  },
  {
    id: "8",
    name: "Commercial Property",
    amount: 500000,
    interestRate: 5.25,
    term: 240, // 20 years
    startDate: "2022-12-01",
    endDate: "2042-12-01",
    status: "active",
    borrowerName: "Retail Solutions Inc",
    borrowerEmail: "property@retailsolutions.com",
    description: "Purchase of retail space in downtown area",
    createdAt: "2022-11-10T11:15:00Z",
    updatedAt: "2022-12-01T14:30:00Z",
    riskScore: 45,
    riskLevel: "medium",
    creditScore: 720,
    collateral: 650000,
  },
]

// Generate payments for each loan
let payments: Payment[] = []

// Helper function to generate payments for a loan
function generatePaymentsForLoan(loan: Loan) {
  const monthlyRate = loan.interestRate / 100 / 12
  const monthlyPayment =
    (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.term)) / (Math.pow(1 + monthlyRate, loan.term) - 1)

  let balance = loan.amount
  const startDate = new Date(loan.startDate)

  for (let i = 1; i <= loan.term; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(startDate.getMonth() + i - 1)

    const interest = balance * monthlyRate
    const principal = monthlyPayment - interest
    balance -= principal

    // For active loans, generate some payment history
    const isPaid = loan.status === "active" && i <= 5 // First 5 payments are paid for active loans
    const isLate = loan.status === "active" && i === 6 // 6th payment is late for active loans

    let status: "pending" | "paid" | "late" | "missed" = "pending"
    let paidDate: string | undefined = undefined

    if (isPaid) {
      status = "paid"
      const paymentDate = new Date(dueDate)
      paymentDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 5)) // Paid 0-5 days before due date
      paidDate = paymentDate.toISOString()
    } else if (isLate) {
      status = "late"
      const paymentDate = new Date(dueDate)
      paymentDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 10) + 1) // Paid 1-10 days after due date
      paidDate = paymentDate.toISOString()
    } else if (loan.status === "defaulted" && i <= 3) {
      status = "paid"
      const paymentDate = new Date(dueDate)
      paymentDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 5))
      paidDate = paymentDate.toISOString()
    } else if (loan.status === "defaulted" && i > 3 && i <= 5) {
      status = "late"
      const paymentDate = new Date(dueDate)
      paymentDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 15) + 5)
      paidDate = paymentDate.toISOString()
    } else if (loan.status === "defaulted" && i > 5 && i <= 7) {
      status = "missed"
    }

    payments.push({
      id: `${loan.id}-${i}`,
      loanId: loan.id,
      amount: Math.round(monthlyPayment * 100) / 100,
      dueDate: dueDate.toISOString(),
      paidDate,
      status,
      paymentNumber: i,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      createdAt: loan.createdAt,
      updatedAt: paidDate || loan.updatedAt,
    })
  }
}

// Generate payments for all loans
loans.forEach((loan) => {
  generatePaymentsForLoan(loan)
})

// Helper functions to work with the data
export async function getLoans() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...loans]
}

export async function getLoan(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return loans.find((loan) => loan.id === id)
}

export async function createLoan(loanData: Omit<Loan, "id" | "createdAt" | "updatedAt" | "riskScore" | "riskLevel">) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Calculate risk score based on various factors
  const riskScore = calculateRiskScore(loanData)
  const riskLevel = getRiskLevel(riskScore)

  const newLoan: Loan = {
    ...loanData,
    id: String(loans.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    riskScore,
    riskLevel,
  }

  loans.push(newLoan)

  // Generate payments for the new loan
  generatePaymentsForLoan(newLoan)

  return newLoan
}

export async function updateLoan(
  id: string,
  loanData: Partial<Omit<Loan, "id" | "createdAt" | "updatedAt" | "riskScore" | "riskLevel">>,
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = loans.findIndex((loan) => loan.id === id)
  if (index === -1) {
    throw new Error(`Loan with ID ${id} not found`)
  }

  // If critical factors changed, recalculate risk
  let riskScore = loans[index].riskScore
  let riskLevel = loans[index].riskLevel

  if (
    loanData.amount !== undefined ||
    loanData.interestRate !== undefined ||
    loanData.term !== undefined ||
    loanData.creditScore !== undefined ||
    loanData.collateral !== undefined
  ) {
    const updatedLoanData = {
      ...loans[index],
      ...loanData,
    }
    riskScore = calculateRiskScore(updatedLoanData)
    riskLevel = getRiskLevel(riskScore)
  }

  loans[index] = {
    ...loans[index],
    ...loanData,
    riskScore,
    riskLevel,
    updatedAt: new Date().toISOString(),
  }

  // If loan terms changed significantly, regenerate payment schedule
  if (
    loanData.amount !== undefined ||
    loanData.interestRate !== undefined ||
    loanData.term !== undefined ||
    loanData.startDate !== undefined
  ) {
    // Remove old payments
    payments = payments.filter((payment) => payment.loanId !== id)
    // Generate new payments
    generatePaymentsForLoan(loans[index])
  }

  return loans[index]
}

export async function deleteLoan(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = loans.findIndex((loan) => loan.id === id)
  if (index === -1) {
    throw new Error(`Loan with ID ${id} not found`)
  }

  const deletedLoan = loans[index]
  loans = loans.filter((loan) => loan.id !== id)

  // Delete associated payments
  payments = payments.filter((payment) => payment.loanId !== id)

  return deletedLoan
}

// Get payments for a specific loan
export async function getLoanPayments(loanId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return payments.filter((payment) => payment.loanId === loanId).sort((a, b) => a.paymentNumber - b.paymentNumber)
}

// Update payment status
export async function updatePayment(
  paymentId: string,
  status: "pending" | "paid" | "late" | "missed",
  paidDate?: string,
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = payments.findIndex((payment) => payment.id === paymentId)
  if (index === -1) {
    throw new Error(`Payment with ID ${paymentId} not found`)
  }

  payments[index] = {
    ...payments[index],
    status,
    paidDate: status === "paid" || status === "late" ? paidDate || new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  }

  return payments[index]
}

// Get analytics data
export async function getAnalyticsData() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Status distribution
  const statusDistribution = {
    active: loans.filter((loan) => loan.status === "active").length,
    pending: loans.filter((loan) => loan.status === "pending").length,
    paid: loans.filter((loan) => loan.status === "paid").length,
    defaulted: loans.filter((loan) => loan.status === "defaulted").length,
  }

  // Risk level distribution
  const riskDistribution = {
    low: loans.filter((loan) => loan.riskLevel === "low").length,
    medium: loans.filter((loan) => loan.riskLevel === "medium").length,
    high: loans.filter((loan) => loan.riskLevel === "high").length,
    veryHigh: loans.filter((loan) => loan.riskLevel === "very-high").length,
  }

  // Amount by risk level
  const amountByRisk = {
    low: loans.filter((loan) => loan.riskLevel === "low").reduce((sum, loan) => sum + loan.amount, 0),
    medium: loans.filter((loan) => loan.riskLevel === "medium").reduce((sum, loan) => sum + loan.amount, 0),
    high: loans.filter((loan) => loan.riskLevel === "high").reduce((sum, loan) => sum + loan.amount, 0),
    veryHigh: loans.filter((loan) => loan.riskLevel === "very-high").reduce((sum, loan) => sum + loan.amount, 0),
  }

  // Monthly payment data (for the next 12 months)
  const today = new Date()
  const nextYear = new Date(today)
  nextYear.setFullYear(today.getFullYear() + 1)

  const monthlyPayments = []
  for (let i = 0; i < 12; i++) {
    const month = new Date(today)
    month.setMonth(today.getMonth() + i)

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const monthPayments = payments.filter((payment) => {
      const dueDate = new Date(payment.dueDate)
      return dueDate >= startOfMonth && dueDate <= endOfMonth
    })

    const expected = monthPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const received = monthPayments
      .filter((payment) => payment.status === "paid" || payment.status === "late")
      .reduce((sum, payment) => sum + payment.amount, 0)

    monthlyPayments.push({
      month: month.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      expected,
      received,
    })
  }

  // Payment status distribution
  const paymentStatusDistribution = {
    paid: payments.filter((payment) => payment.status === "paid").length,
    pending: payments.filter((payment) => payment.status === "pending").length,
    late: payments.filter((payment) => payment.status === "late").length,
    missed: payments.filter((payment) => payment.status === "missed").length,
  }

  return {
    totalLoans: loans.length,
    totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
    averageInterestRate: loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length,
    statusDistribution,
    riskDistribution,
    amountByRisk,
    monthlyPayments,
    paymentStatusDistribution,
  }
}

// Helper function to calculate risk score (0-100)
function calculateRiskScore(loan: any): number {
  let score = 50 // Base score

  // Credit score factor (higher is better)
  if (loan.creditScore) {
    if (loan.creditScore >= 750) score -= 20
    else if (loan.creditScore >= 700) score -= 15
    else if (loan.creditScore >= 650) score -= 5
    else if (loan.creditScore < 600) score += 20
  }

  // Loan-to-value ratio (lower is better)
  const ltv = loan.collateral ? (loan.amount / loan.collateral) * 100 : 100
  if (ltv < 50) score -= 15
  else if (ltv < 80) score -= 5
  else if (ltv > 90) score += 15

  // Interest rate factor (higher rate often means higher risk)
  if (loan.interestRate > 8) score += 10
  else if (loan.interestRate < 4) score -= 10

  // Loan term factor (longer terms have more uncertainty)
  if (loan.term > 180)
    score += 5 // > 15 years
  else if (loan.term < 36) score -= 5 // < 3 years

  // Ensure score is within 0-100 range
  return Math.max(0, Math.min(100, score))
}

// Helper function to determine risk level from score
function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return "low"
  if (score < 60) return "medium"
  if (score < 80) return "high"
  return "very-high"
}
