"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { calculateAffordableLoanAmount, calculateDTI } from "@/lib/calculator-utils"
import { LineChart } from "@/components/ui/chart"
import { AlertCircle, DollarSign } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(2000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [loanTerm, setLoanTerm] = useState<number>(360) // 30 years in months
  const [downPayment, setDownPayment] = useState<number>(20000)
  const [results, setResults] = useState<{
    affordableAmount: number
    monthlyPayment: number
    dti: number
    totalPurchase: number
  } | null>(null)

  // Calculate affordability
  const calculateAffordability = () => {
    // Calculate available monthly payment (income - expenses)
    const availableMonthly = monthlyIncome - monthlyExpenses

    // Calculate affordable loan amount
    const affordableAmount = calculateAffordableLoanAmount(availableMonthly * 0.36, interestRate, loanTerm)

    // Calculate DTI ratio
    const dti = calculateDTI(availableMonthly * 0.36, monthlyIncome)

    setResults({
      affordableAmount,
      monthlyPayment: availableMonthly * 0.36,
      dti,
      totalPurchase: affordableAmount + downPayment,
    })
  }

  // Generate chart data for different interest rates
  const generateChartData = () => {
    if (!results) return []

    const rates = [interestRate - 2, interestRate - 1, interestRate, interestRate + 1, interestRate + 2].filter(
      (r) => r > 0,
    )

    return rates.map((rate) => {
      const affordableAmount = calculateAffordableLoanAmount(results.monthlyPayment, rate, loanTerm)
      return {
        rate: `${rate}%`,
        amount: affordableAmount + downPayment,
      }
    })
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="5000"
                className="pl-9"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="monthlyExpenses"
                type="number"
                placeholder="2000"
                className="pl-9"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="downPayment"
                type="number"
                placeholder="20000"
                className="pl-9"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interestRate">Interest Rate: {interestRate}%</Label>
            </div>
            <Slider
              id="interestRate"
              min={1}
              max={15}
              step={0.25}
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="loanTerm">Loan Term: {loanTerm / 12} years</Label>
            </div>
            <Slider
              id="loanTerm"
              min={60}
              max={360}
              step={12}
              value={[loanTerm]}
              onValueChange={(value) => setLoanTerm(value[0])}
            />
          </div>

          <Button className="w-full mt-6" onClick={calculateAffordability}>
            Calculate Affordability
          </Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Affordable Purchase</h3>
                  <p className="text-3xl font-bold">{formatCurrency(results.totalPurchase)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Loan: {formatCurrency(results.affordableAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Monthly Payment</h3>
                  <p className="text-3xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((results.monthlyPayment / monthlyIncome) * 100).toFixed(1)}% of income
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Debt-to-Income</h3>
                  <p className="text-3xl font-bold">{results.dti.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.dti <= 36 ? "Good" : results.dti <= 43 ? "Acceptable" : "High"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {results.dti > 43 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>High Debt-to-Income Ratio</AlertTitle>
              <AlertDescription>
                Your debt-to-income ratio is above 43%, which may make it difficult to qualify for a mortgage. Consider
                reducing your monthly expenses or increasing your income.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">How Interest Rates Affect Your Buying Power</h3>
              <div className="h-80">
                <LineChart
                  data={generateChartData()}
                  index="rate"
                  categories={["amount"]}
                  colors={["#3b82f6"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
