"use client"

import { useEffect, useState } from "react"
import { getAnalyticsData, getLoans } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, DollarSign, Percent, PieChartIcon, BarChart3 } from "lucide-react"

// Simple currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [analytics, loanData] = await Promise.all([getAnalyticsData(), getLoans()])
      setAnalyticsData(analytics)
      setLoans(loanData)
    }
    fetchData()
  }, [])

  if (!analyticsData) {
    return <div>Loading...</div>
  }

  // Calculate month-over-month growth
  const totalAmount = analyticsData.totalAmount
  const previousMonthAmount = totalAmount * 0.92 // Simulated previous month data
  const growthRate = ((totalAmount - previousMonthAmount) / previousMonthAmount) * 100

  // Prepare data for charts
  const statusData = [
    { name: "Active", value: analyticsData.statusDistribution.active },
    { name: "Pending", value: analyticsData.statusDistribution.pending },
    { name: "Paid", value: analyticsData.statusDistribution.paid },
    { name: "Defaulted", value: analyticsData.statusDistribution.defaulted },
  ]

  const riskData = [
    { name: "Low", value: analyticsData.riskDistribution.low },
    { name: "Medium", value: analyticsData.riskDistribution.medium },
    { name: "High", value: analyticsData.riskDistribution.high },
    { name: "Very High", value: analyticsData.riskDistribution.veryHigh },
  ]

  const amountByRiskData = [
    { name: "Low", value: analyticsData.amountByRisk.low },
    { name: "Medium", value: analyticsData.amountByRisk.medium },
    { name: "High", value: analyticsData.amountByRisk.high },
    { name: "Very High", value: analyticsData.amountByRisk.veryHigh },
  ]

  // Prepare monthly payment forecast data
  const monthlyPaymentData = analyticsData.monthlyPayments.map((payment: any) => ({
    month: payment.month,
    expected: payment.expected,
    received: payment.received,
  }))

  return (
    <div className="container animate-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View key metrics and insights about your loan portfolio.
        </p>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {growthRate > 0 ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {growthRate.toFixed(1)}% from last month
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(growthRate).toFixed(1)}% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.statusDistribution.active}</div>
            <p className="text-xs text-muted-foreground">
              {((analyticsData.statusDistribution.active / analyticsData.totalLoans) * 100).toFixed(1)}% of total loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageInterestRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Across all active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((analyticsData.riskDistribution.low / analyticsData.totalLoans) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Low risk loans</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="status">
          <TabsList>
            <TabsTrigger value="status">Loan Status</TabsTrigger>
            <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
            <TabsTrigger value="amount">Amount by Risk</TabsTrigger>
            <TabsTrigger value="payments">Monthly Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Distribution</CardTitle>
                <CardDescription>Breakdown of loans by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={statusData}
                  index="name"
                  categories={["value"]}
                  colors={["#3b82f6", "#f59e0b", "#10b981", "#ef4444"]}
                  valueFormatter={formatCurrency}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Breakdown of loans by risk level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={riskData}
                  index="name"
                  categories={["value"]}
                  colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]}
                  valueFormatter={formatCurrency}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amount">
            <Card>
              <CardHeader>
                <CardTitle>Loan Amount Distribution</CardTitle>
                <CardDescription>Breakdown of loan amounts by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={loans.map((loan) => ({
                    name: loan.name,
                    amount: loan.amount,
                    status: loan.status.charAt(0).toUpperCase() + loan.status.slice(1),
                  }))}
                  index="name"
                  categories={["amount"]}
                  colors={["#3b82f6"]}
                  valueFormatter={formatCurrency}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Payment Forecast</CardTitle>
                  <CardDescription>Expected vs. received payments over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart
                    data={monthlyPaymentData}
                    index="month"
                    categories={["expected", "received"]}
                    colors={["#3b82f6", "#10b981"]}
                    valueFormatter={formatCurrency}
                    className="h-full w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Payment Distribution</CardTitle>
                  <CardDescription>Breakdown of expected vs. received payments</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={monthlyPaymentData}
                    index="month"
                    categories={["expected", "received"]}
                    colors={["#3b82f6", "#10b981"]}
                    valueFormatter={formatCurrency}
                    className="h-full w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
