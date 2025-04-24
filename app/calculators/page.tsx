import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AffordabilityCalculator from "@/components/calculators/affordability-calculator"
import RepaymentCalculator from "@/components/calculators/repayment-calculator"
import InterestComparisonCalculator from "@/components/calculators/interest-comparison-calculator"
import { DollarSign, Percent, Calendar } from "lucide-react"

export default function CalculatorsPage() {
  return (
    <div className="container animate-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Loan Calculators</h1>
        <p className="text-muted-foreground">
          Use these financial calculators to help with loan planning and decision making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Affordability
            </CardTitle>
            <CardDescription>Calculate how much you can afford to borrow</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Repayment
            </CardTitle>
            <CardDescription>Calculate monthly payments and total costs</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Interest Comparison
            </CardTitle>
            <CardDescription>Compare different interest rates and terms</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="affordability" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="affordability">Affordability Calculator</TabsTrigger>
          <TabsTrigger value="repayment">Repayment Calculator</TabsTrigger>
          <TabsTrigger value="interest">Interest Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="affordability">
          <Card>
            <CardHeader>
              <CardTitle>Affordability Calculator</CardTitle>
              <CardDescription>
                Calculate how much you can afford to borrow based on your income and expenses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AffordabilityCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="repayment">
          <Card>
            <CardHeader>
              <CardTitle>Loan Repayment Calculator</CardTitle>
              <CardDescription>Calculate monthly payments, total interest, and amortization schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <RepaymentCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interest">
          <Card>
            <CardHeader>
              <CardTitle>Interest Rate Comparison</CardTitle>
              <CardDescription>
                Compare different interest rates and see how they affect your loan payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InterestComparisonCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
