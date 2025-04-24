// Calculate monthly payment for a loan
export function calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  // Handle edge cases
  if (principal <= 0 || termMonths <= 0) return 0
  if (annualRate <= 0) return principal / termMonths

  const monthlyRate = annualRate / 100 / 12
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
}

// Calculate total interest paid over the life of the loan
export function calculateTotalInterest(principal: number, monthlyPayment: number, termMonths: number): number {
  return monthlyPayment * termMonths - principal
}

// Calculate maximum affordable loan amount
export function calculateAffordableLoanAmount(monthlyPayment: number, annualRate: number, termMonths: number): number {
  // Handle edge cases
  if (monthlyPayment <= 0 || termMonths <= 0) return 0
  if (annualRate <= 0) return monthlyPayment * termMonths

  const monthlyRate = annualRate / 100 / 12
  return (
    (monthlyPayment * (Math.pow(1 + monthlyRate, termMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths))
  )
}

// Calculate debt-to-income ratio
export function calculateDTI(monthlyDebt: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0
  return (monthlyDebt / monthlyIncome) * 100
}

// Generate amortization schedule
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
): Array<{
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}> {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths)

  let balance = principal
  const schedule = []

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate
    const principalPaid = monthlyPayment - interest
    balance -= principalPaid

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance: Math.max(0, balance), // Ensure balance doesn't go below 0 due to rounding
    })

    if (balance <= 0) break
  }

  return schedule
}

// Calculate how different interest rates affect monthly payments
export function compareInterestRates(
  principal: number,
  termMonths: number,
  rates: number[],
): Array<{
  rate: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}> {
  return rates.map((rate) => {
    const monthlyPayment = calculateMonthlyPayment(principal, rate, termMonths)
    const totalInterest = calculateTotalInterest(principal, monthlyPayment, termMonths)

    return {
      rate,
      monthlyPayment,
      totalInterest,
      totalCost: principal + totalInterest,
    }
  })
}

// Calculate how different loan terms affect monthly payments
export function compareTerms(
  principal: number,
  annualRate: number,
  terms: number[],
): Array<{
  term: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}> {
  return terms.map((term) => {
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, term)
    const totalInterest = calculateTotalInterest(principal, monthlyPayment, term)

    return {
      term,
      monthlyPayment,
      totalInterest,
      totalCost: principal + totalInterest,
    }
  })
}
