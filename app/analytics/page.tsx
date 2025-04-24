import { getAnalyticsData, getLoans } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, DollarSign, Percent, PieChartIcon, BarChart3 } from "lucide-react"

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData()
  const loans = await getLoans()

  // Calculate month-over-month growth
  const totalAmount = analyticsData.totalAmount
  const previousMonthAmount = totalAmount * 0.92 // Simulated previous month data
  const growthRate = ((totalAmount - previousMonthAmount) / previousMonthAmount) * 100

  // Format large numbers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

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

  const paymentStatusData = [
    { name: "Paid", value: analyticsData.paymentStatusDistribution.paid },
    { name: "Pending", value: analyticsData.paymentStatusDistribution.pending },
    { name: "Late", value: analyticsData.paymentStatusDistribution.late },
    { name: "Missed", value: analyticsData.paymentStatusDistribution.missed },
  ]

  // Colors for charts
  const statusColors = ["#22c55e", "#eab308", "#3b82f6", "#ef4444"]
  const riskColors = ["#22c55e", "#eab308", "#f97316", "#ef4444"]

  return (
    <div className="container animate-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive overview of your loan portfolio performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalAmount)}</div>
            <div className="flex items-center pt-1 text-xs">
              {growthRate >= 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{growthRate.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(growthRate).toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.statusDistribution.active}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {((analyticsData.statusDistribution.active / analyticsData.totalLoans) * 100).toFixed(1)}% of total loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Interest</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageInterestRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground pt-1">Across all loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.riskDistribution.low + analyticsData.riskDistribution.medium} / {analyticsData.totalLoans}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {(
                ((analyticsData.riskDistribution.low + analyticsData.riskDistribution.medium) /
                  analyticsData.totalLoans) *
                100
              ).toFixed(1)}
              % low/medium risk
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Distribution</CardTitle>
                <CardDescription>Breakdown of loans by current status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={statusData}
                  index="name"
                  categories={["value"]}
                  colors={statusColors}
                  valueFormatter={(value) => `${value} loans`}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment Forecast</CardTitle>
                <CardDescription>Expected vs. received payments over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart
                  data={analyticsData.monthlyPayments}
                  index="month"
                  categories={["expected", "received"]}
                  colors={["#94a3b8", "#3b82f6"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loan Amount Distribution</CardTitle>
              <CardDescription>Breakdown of loan amounts by category</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart
                data={loans.map((loan) => ({
                  name: loan.name,
                  amount: loan.amount,
                  status: loan.status.charAt(0).toUpperCase() + loan.status.slice(1),
                }))}
                index="name"
                categories={["amount"]}
                colors={["#3b82f6"]}
                valueFormatter={(value) => formatCurrency(value)}
                className="h-full w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
                <CardDescription>Number of loans by risk level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={riskData}
                  index="name"
                  categories={["value"]}
                  colors={riskColors}
                  valueFormatter={(value) => `${value} loans`}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value by Risk</CardTitle>
                <CardDescription>Total loan amount by risk level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={amountByRiskData}
                  index="name"
                  categories={["value"]}
                  colors={riskColors}
                  valueFormatter={(value) => formatCurrency(value)}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Score Distribution</CardTitle>
              <CardDescription>Breakdown of loans by risk score</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart
                data={loans.map((loan) => ({
                  name: loan.name,
                  score: loan.riskScore,
                  level: loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1).replace("-", " "),
                }))}
                index="name"
                categories={["score"]}
                colors={["#f97316"]}
                valueFormatter={(value) => `${value} points`}
                className="h-full w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status Distribution</CardTitle>
                <CardDescription>Breakdown of payments by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  data={paymentStatusData}
                  index="name"
                  categories={["value"]}
                  colors={["#22c55e", "#3b82f6", "#eab308", "#ef4444"]}
                  valueFormatter={(value) => `${value} payments`}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment Trends</CardTitle>
                <CardDescription>Payment collection performance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  data={analyticsData.monthlyPayments}
                  index="month"
                  categories={["expected", "received"]}
                  colors={["#94a3b8", "#3b82f6"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  className="h-full w-full"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Collection Rate</CardTitle>
              <CardDescription>Percentage of expected payments collected by loan</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart
                data={loans.map((loan) => {
                  // Calculate a simulated collection rate for each loan
                  const collectionRate =
                    loan.status === "defaulted"
                      ? Math.floor(Math.random() * 40) + 30
                      : loan.status === "active"
                        ? Math.floor(Math.random() * 20) + 80
                        : 100

                  return {
                    name: loan.name,
                    rate: collectionRate,
                    status: loan.status.charAt(0).toUpperCase() + loan.status.slice(1),
                  }
                })}
                index="name"
                categories={["rate"]}
                colors={["#22c55e"]}
                valueFormatter={(value) => `${value}%`}
                className="h-full w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
