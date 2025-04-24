"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calculateMonthlyPayment, calculateTotalInterest, generateAmortizationSchedule } from "@/lib/calculator-utils"
import { PieChart, LineChart } from "@/components/ui/chart"
import { DollarSign } from "lucide-react"

export default function RepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(250000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [loanTerm, setLoanTerm] = useState<number>(360) // 30 years in months
  const [results, setResults] = useState<{
    monthlyPayment: number
    totalInterest: number
    totalCost: number
    schedule: Array<{
      month: number
      payment: number
      principal: number
      interest: number
      balance: number
    }>
  } | null>(null)

  // Calculate repayment
  const calculateRepayment = () => {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
    const totalInterest = calculateTotalInterest(loanAmount, monthlyPayment, loanTerm)
    const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTerm)

    setResults({
      monthlyPayment,
      totalInterest,
      totalCost: loanAmount + totalInterest,
      schedule,
    })
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Generate pie chart data
  const generatePieChartData = () => {
    if (!results) return []

    return [
      { name: "Principal", value: loanAmount },
      { name: "Interest", value: results.totalInterest },
    ]
  }

  // Generate balance over time chart data
  const generateBalanceChartData = () => {
    if (!results) return []

    // Take every 12th month (yearly) to keep chart readable
    return results.schedule
      .filter((_, index) => index % 12 === 0 || index === results.schedule.length - 1)
      .map((item) => ({
        year: Math.floor(item.month / 12),
        balance: item.balance,
      }))
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="loanAmount"
                type="number"
                placeholder="250000"
                className="pl-9"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interestRate">Interest Rate: {interestRate}%</Label>
            </div>
            <Slider
              id="interestRate"
              min={1}
              max={15}
              step={0.125}
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

          <Button className="w-full mt-6" onClick={calculateRepayment}>
            Calculate Repayment
          </Button>
        </div>

        {results && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Monthly Payment</h3>
                  <p className="text-3xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Principal</h4>
                    <p className="text-lg font-semibold">{formatCurrency(loanAmount)}</p>
                  </div>

                  <div className="text-center">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Interest</h4>
                    <p className="text-lg font-semibold">{formatCurrency(results.totalInterest)}</p>
                  </div>
                </div>

                <div className="text-center pt-2 border-t mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Cost of Loan</h4>
                  <p className="text-xl font-bold">{formatCurrency(results.totalCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
                <div className="h-64">
                  <PieChart
                    data={generatePieChartData()}
                    index="name"
                    categories={["value"]}
                    colors={["#3b82f6", "#ef4444"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    className="h-full w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Balance Over Time</h3>
                <div className="h-64">
                  <LineChart
                    data={generateBalanceChartData()}
                    index="year"
                    categories={["balance"]}
                    colors={["#3b82f6"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    className="h-full w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="schedule">
                <TabsList className="mb-4">
                  <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                  <div className="rounded-md border max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.schedule.map((item) => (
                          <TableRow key={item.month}>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>{formatCurrency(item.payment)}</TableCell>
                            <TableCell>{formatCurrency(item.principal)}</TableCell>
                            <TableCell>{formatCurrency(item.interest)}</TableCell>
                            <TableCell>{formatCurrency(item.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="yearly">
                  <div className="rounded-md border max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Total Payments</TableHead>
                          <TableHead>Principal Paid</TableHead>
                          <TableHead>Interest Paid</TableHead>
                          <TableHead>Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.schedule
                          .filter((item) => item.month % 12 === 0 || item.month === results.schedule.length)
                          .map((item) => {
                            const year = Math.ceil(item.month / 12)
                            const yearlyPayments = results.schedule.filter((s) => Math.ceil(s.month / 12) === year)
                            const totalPayment = yearlyPayments.reduce((sum, s) => sum + s.payment, 0)
                            const principalPaid = yearlyPayments.reduce((sum, s) => sum + s.principal, 0)
                            const interestPaid = yearlyPayments.reduce((sum, s) => sum + s.interest, 0)

                            return (
                              <TableRow key={year}>
                                <TableCell>{year}</TableCell>
                                <TableCell>{formatCurrency(totalPayment)}</TableCell>
                                <TableCell>{formatCurrency(principalPaid)}</TableCell>
                                <TableCell>{formatCurrency(interestPaid)}</TableCell>
                                <TableCell>{formatCurrency(item.balance)}</TableCell>
                              </TableRow>
                            )
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
