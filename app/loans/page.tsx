import Link from "next/link"
import { getLoans } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ArrowUpRight } from "lucide-react"

export default async function LoansPage() {
  const loans = await getLoans()

  return (
    <div className="container animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your loans in one place.</p>
        </div>
        <Button asChild>
          <Link href="/loans/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Loan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {loans.map((loan) => (
          <Card key={loan.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{loan.name}</CardTitle>
              <CardDescription>{loan.borrowerName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest</p>
                  <p className="text-lg font-semibold">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Term</p>
                  <p className="text-lg font-semibold">{loan.term} months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/loans/${loan.id}`}>
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {loans.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-6">
            <PlusCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No loans found</h2>
          <p className="mt-2 text-muted-foreground">Get started by creating your first loan.</p>
          <Button className="mt-4" asChild>
            <Link href="/loans/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Loan
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
