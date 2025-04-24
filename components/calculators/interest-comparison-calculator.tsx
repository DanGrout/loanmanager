"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { compareInterestRates, compareTerms } from "@/lib/calculator-utils"
import { BarChart } from "@/components/ui/chart"
import { DollarSign, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InterestComparisonCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(250000)
  const [interestRates, setInterestRates] = useState<number[]>([4.5, 5.0, 5.5])
  const [loanTerms, setLoanTerms] = useState<number[]>([180, 240, 360]) // 15, 20, 30 years in months
  const [newRate, setNewRate] = useState<number>(4.0)
  const [newTerm, setNewTerm] = useState<number>(240)
  const [results, setResults] = useState<{
    rateComparison: Array<{
      rate: number
      monthlyPayment: number
      totalInterest: number
      totalCost: number
    }>
    termComparison: Array<{
      term: number
      monthlyPayment: number
      totalInterest: number
      totalCost: number
    }>
  } | null>(null)

  // Add a new interest rate to compare
  const addInterestRate = () => {
    if (newRate > 0 && !interestRates.includes(newRate)) {
      setInterestRates([...interestRates, newRate].sort((a, b) => a - b))
    }
  }

  // Remove an interest rate
  const removeInterestRate = (rate: number) => {
    setInterestRates(interestRates.filter((r) => r !== rate))
  }

  // Add a new loan term to compare
  const addLoanTerm = () => {
    if (newTerm > 0 && !loanTerms.includes(newTerm)) {
      setLoanTerms([...loanTerms, newTerm].sort((a, b) => a - b))
    }
  }

  // Remove a loan term
  const removeLoanTerm = (term: number) => {
    setLoanTerms(loanTerms.filter((t) => t !== term))
  }

  // Calculate comparisons
  const calculateComparisons = () => {
    const rateComparison = compareInterestRates(loanAmount, loanTerms[0], interestRates)
    const termComparison = compareTerms(loanAmount, interestRates[0], loanTerms)

    setResults({
      rateComparison,
      termComparison,
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

  // Format years
  const formatYears = (months: number) => {
    return `${months / 12} years`
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
            <Label>Interest Rates to Compare</Label>
            <div className="flex flex-wrap gap-2">
              {interestRates.map((rate) => (
                <div key={rate} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{rate}%</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => removeInterestRate(rate)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="4.0"
                  className="w-20"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  step="0.125"
                />
                <span>%</span>
                <Button variant="outline" size="sm" onClick={addInterestRate}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Loan Terms to Compare</Label>
            <div className="flex flex-wrap gap-2">
              {loanTerms.map((term) => (
                <div key={term} className="flex items-center bg-muted rounded-md px-3 py-1">
                  <span>{term / 12} years</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => removeLoanTerm(term)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="240"
                  className="w-20"
                  value={newTerm}
                  onChange={(e) => setNewTerm(Number(e.target.value))}
                  step="12"
                />
                <span>months</span>
                <Button variant="outline" size="sm" onClick={addLoanTerm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6" onClick={calculateComparisons}>
            Compare Options
          </Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <Tabs defaultValue="rates">
            <TabsList className="mb-4">
              <TabsTrigger value="rates">Compare Interest Rates</TabsTrigger>
              <TabsTrigger value="terms">Compare Loan Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="rates">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Interest Rate Comparison ({formatYears(loanTerms[0])} term)
                  </h3>

                  <div className="rounded-md border mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Interest Rate</TableHead>
                          <TableHead>Monthly Payment</TableHead>
                          <TableHead>Total Interest</TableHead>
                          <TableHead>Total Cost</TableHead>
                          <TableHead>Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.rateComparison.map((item, index) => {
                          const lowestCost = results.rateComparison[0].totalCost
                          const difference = item.totalCost - lowestCost

                          return (
                            <TableRow key={item.rate}>
                              <TableCell>{item.rate}%</TableCell>
                              <TableCell>{formatCurrency(item.monthlyPayment)}</TableCell>
                              <TableCell>{formatCurrency(item.totalInterest)}</TableCell>
                              <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                              <TableCell>
                                {index === 0 ? (
                                  <span className="text-green-600 dark:text-green-400">Lowest</span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400">+{formatCurrency(difference)}</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="h-80">
                    <BarChart
                      data={results.rateComparison.map((item) => ({
                        rate: `${item.rate}%`,
                        payment: item.monthlyPayment,
                        interest: item.totalInterest,
                      }))}
                      index="rate"
                      categories={["payment", "interest"]}
                      colors={["#3b82f6", "#ef4444"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      className="h-full w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Loan Term Comparison ({interestRates[0]}% interest)</h3>

                  <div className="rounded-md border mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Loan Term</TableHead>
                          <TableHead>Monthly Payment</TableHead>
                          <TableHead>Total Interest</TableHead>
                          <TableHead>Total Cost</TableHead>
                          <TableHead>Comparison</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.termComparison.map((item) => {
                          const shortestTerm = results.termComparison[0]
                          const paymentDiff = shortestTerm.monthlyPayment - item.monthlyPayment
                          const interestDiff = item.totalInterest - shortestTerm.totalInterest

                          return (
                            <TableRow key={item.term}>
                              <TableCell>{formatYears(item.term)}</TableCell>
                              <TableCell>{formatCurrency(item.monthlyPayment)}</TableCell>
                              <TableCell>{formatCurrency(item.totalInterest)}</TableCell>
                              <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-xs">
                                    {paymentDiff > 0 ? (
                                      <span className="text-green-600 dark:text-green-400">
                                        Save {formatCurrency(paymentDiff)} monthly
                                      </span>
                                    ) : (
                                      <span className="text-red-600 dark:text-red-400">
                                        Pay {formatCurrency(Math.abs(paymentDiff))} more monthly
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs">
                                    {interestDiff > 0 ? (
                                      <span className="text-red-600 dark:text-red-400">
                                        Pay {formatCurrency(interestDiff)} more in interest
                                      </span>
                                    ) : (
                                      <span className="text-green-600 dark:text-green-400">
                                        Save {formatCurrency(Math.abs(interestDiff))} in interest
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="h-80">
                    <BarChart
                      data={results.termComparison.map((item) => ({
                        term: formatYears(item.term),
                        payment: item.monthlyPayment,
                        interest: item.totalInterest / 10, // Scale down to fit on chart with payments
                      }))}
                      index="term"
                      categories={["payment", "interest"]}
                      colors={["#3b82f6", "#ef4444"]}
                      valueFormatter={(value, category) =>
                        category === "interest" ? formatCurrency(value * 10) : formatCurrency(value)
                      }
                      className="h-full w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
