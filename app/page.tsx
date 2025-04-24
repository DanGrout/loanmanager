import Link from "next/link"
import { getLoans } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const loans = await getLoans()

  // Calculate dashboard metrics
  const totalLoans = loans.length
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const activeLoans = loans.filter((loan) => loan.status === "active").length

  return (
    <div className="container animate-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your loan management dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoans}</div>
            <p className="text-xs text-muted-foreground">Across all loan types and statuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total value of all loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground">Currently active loans</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Loans</CardTitle>
            <CardDescription>View your most recently created loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loans.slice(0, 5).map((loan) => (
                <div key={loan.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{loan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {loan.borrowerName} • ${loan.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${
                        loan.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : loan.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : loan.status === "paid"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/loans/${loan.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View loan details</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button asChild>
                <Link href="/loans">
                  View All Loans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
