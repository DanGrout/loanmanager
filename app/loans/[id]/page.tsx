import Link from "next/link"
import { notFound } from "next/navigation"
import { getLoan, getLoanPayments } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, ArrowLeft, Calendar, DollarSign, Percent, Clock, AlertTriangle } from "lucide-react"
import DeleteLoanButton from "@/components/delete-loan-button"
import RiskIndicator from "@/components/risk-indicator"
import RepaymentSchedule from "@/components/repayment-schedule"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params object before accessing its properties
  const { id } = await params

  if (!id) {
    notFound()
  }

  try {
    const [loan, payments] = await Promise.all([
      getLoan(id),
      getLoanPayments(id)
    ])

    if (!loan) {
      notFound()
    }

    // Format dates for display
    const startDate = new Date(loan.startDate).toLocaleDateString()
    const endDate = new Date(loan.endDate).toLocaleDateString()

    return (
      <div className="container animate-in">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/loans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loans
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{loan.name}</h1>
              <p className="text-muted-foreground mt-1">Loan details and information</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/loans/${loan.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <DeleteLoanButton id={loan.id} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repayments">Repayment Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Information</CardTitle>
                  <CardDescription>Basic details about this loan</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Loan ID</p>
                      <p>{loan.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Amount</p>
                        <p className="text-sm text-muted-foreground">${loan.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Interest Rate</p>
                        <p className="text-sm text-muted-foreground">{loan.interestRate}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Term</p>
                        <p className="text-sm text-muted-foreground">{loan.term} months</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Date Range</p>
                        <p className="text-sm text-muted-foreground">
                          {startDate} - {endDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {loan.description && (
                    <div className="space-y-1 pt-2">
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">{loan.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Risk profile for this loan</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <RiskIndicator score={loan.riskScore} level={loan.riskLevel} />

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Credit Score</p>
                      <p className="text-sm">{loan.creditScore ? loan.creditScore : "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Collateral</p>
                      <p className="text-sm">{loan.collateral ? `$${loan.collateral.toLocaleString()}` : "None"}</p>
                    </div>
                  </div>

                  {loan.collateral && loan.amount > 0 && (
                    <div className="space-y-1 mt-2">
                      <p className="text-sm font-medium">Loan-to-Value Ratio</p>
                      <p className="text-sm">{Math.round((loan.amount / loan.collateral) * 100)}%</p>
                    </div>
                  )}

                  {loan.riskLevel === "high" || loan.riskLevel === "very-high" ? (
                    <div className="flex items-start gap-2 p-3 mt-2 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-md">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">High Risk Alert</p>
                        <p className="text-sm">
                          This loan has been identified as {loan.riskLevel.replace("-", " ")} risk. Consider additional
                          verification or collateral.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Borrower Information</CardTitle>
                  <CardDescription>Details about the borrower</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <p>{loan.borrowerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p>{loan.borrowerEmail}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(loan.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">{new Date(loan.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Overview of payment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Calculate payment stats */}
                    {(() => {
                      const totalPayments = payments.length
                      const paidPayments = payments.filter((p) => p.status === "paid").length
                      const latePayments = payments.filter((p) => p.status === "late").length
                      const missedPayments = payments.filter((p) => p.status === "missed").length
                      const pendingPayments = payments.filter((p) => p.status === "pending").length

                      // Calculate monthly payment amount (first payment amount)
                      const monthlyPayment = payments.length > 0 ? payments[0].amount : 0

                      // Calculate total paid amount
                      const totalPaid = payments
                        .filter((p) => p.status === "paid" || p.status === "late")
                        .reduce((sum, p) => sum + p.amount, 0)

                      // Calculate remaining balance
                      const remainingBalance =
                        loan.amount -
                        payments
                          .filter((p) => p.status === "paid" || p.status === "late")
                          .reduce((sum, p) => sum + p.principal, 0)

                      return (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Monthly Payment</p>
                              <p className="text-xl font-semibold">${monthlyPayment.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Remaining Balance</p>
                              <p className="text-xl font-semibold">${Math.max(0, remainingBalance).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Total Paid</p>
                              <p className="text-sm">${totalPaid.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Next Payment</p>
                              <p className="text-sm">
                                {(() => {
                                  const nextPayment = payments.find((p) => p.status === "pending")
                                  return nextPayment
                                    ? new Date(nextPayment.dueDate).toLocaleDateString()
                                    : "No pending payments"
                                })()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Payment Status</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {paidPayments}
                                </div>
                                <div className="text-xs text-muted-foreground">Paid</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                  {latePayments}
                                </div>
                                <div className="text-xs text-muted-foreground">Late</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                  {missedPayments}
                                </div>
                                <div className="text-xs text-muted-foreground">Missed</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                  {pendingPayments}
                                </div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="repayments">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Schedule</CardTitle>
                <CardDescription>Track and manage loan repayments</CardDescription>
              </CardHeader>
              <CardContent>
                <RepaymentSchedule payments={payments} loanId={loan.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error('Error loading loan details:', error)
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading loan details. Please try again later.
        </div>
      </div>
    )
  }
}
