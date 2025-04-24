"use client"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { createLoanAction, updateLoanAction, type FormState } from "@/lib/actions"
import type { Loan } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const initialState: FormState = {
  errors: {},
  message: "",
}

export default function LoanForm({ loan }: { loan?: Loan }) {
  const router = useRouter()
  const isEditing = !!loan

  // Create form action based on whether we're editing or creating
  const formAction = isEditing ? updateLoanAction.bind(null, loan.id) : createLoanAction

  const [state, dispatch] = useFormState(formAction, initialState)

  // Format dates for input fields
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Handle cancel button
  const handleCancel = () => {
    if (isEditing) {
      router.push(`/loans/${loan.id}`)
    } else {
      router.push("/loans")
    }
  }

  return (
    <form action={dispatch}>
      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Loan Name</Label>
                  <Input id="name" name="name" defaultValue={loan?.name || ""} aria-describedby="name-error" />
                  {state.errors?.name && (
                    <p id="name-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="amount">Loan Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={loan?.amount || ""}
                      aria-describedby="amount-error"
                    />
                    {state.errors?.amount && (
                      <p id="amount-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.amount}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      defaultValue={loan?.interestRate || ""}
                      aria-describedby="interestRate-error"
                    />
                    {state.errors?.interestRate && (
                      <p id="interestRate-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.interestRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="term">Term (months)</Label>
                    <Input
                      id="term"
                      name="term"
                      type="number"
                      min="1"
                      defaultValue={loan?.term || ""}
                      aria-describedby="term-error"
                    />
                    {state.errors?.term && (
                      <p id="term-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.term}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={loan?.status || "pending"}>
                      <SelectTrigger id="status" aria-describedby="status-error">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="defaulted">Defaulted</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.status && (
                      <p id="status-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.status}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={loan ? formatDateForInput(loan.startDate) : ""}
                      aria-describedby="startDate-error"
                    />
                    {state.errors?.startDate && (
                      <p id="startDate-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      defaultValue={loan ? formatDateForInput(loan.endDate) : ""}
                      aria-describedby="endDate-error"
                    />
                    {state.errors?.endDate && (
                      <p id="endDate-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="borrowerName">Borrower Name</Label>
                  <Input
                    id="borrowerName"
                    name="borrowerName"
                    defaultValue={loan?.borrowerName || ""}
                    aria-describedby="borrowerName-error"
                  />
                  {state.errors?.borrowerName && (
                    <p id="borrowerName-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.borrowerName}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="borrowerEmail">Borrower Email</Label>
                  <Input
                    id="borrowerEmail"
                    name="borrowerEmail"
                    type="email"
                    defaultValue={loan?.borrowerEmail || ""}
                    aria-describedby="borrowerEmail-error"
                  />
                  {state.errors?.borrowerEmail && (
                    <p id="borrowerEmail-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.borrowerEmail}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={loan?.description || ""}
                    aria-describedby="description-error"
                  />
                  {state.errors?.description && (
                    <p id="description-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="creditScore">Borrower Credit Score (300-850)</Label>
                  <Input
                    id="creditScore"
                    name="creditScore"
                    type="number"
                    min="300"
                    max="850"
                    defaultValue={loan?.creditScore || ""}
                    aria-describedby="creditScore-error"
                  />
                  {state.errors?.creditScore && (
                    <p id="creditScore-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.creditScore}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Credit score affects risk assessment. Higher scores indicate lower risk.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="collateral">Collateral Value ($)</Label>
                  <Input
                    id="collateral"
                    name="collateral"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={loan?.collateral || ""}
                    aria-describedby="collateral-error"
                  />
                  {state.errors?.collateral && (
                    <p id="collateral-error" className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {state.errors.collateral}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    The value of assets securing the loan. Higher collateral reduces risk.
                  </p>
                </div>

                {loan && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Current Risk Assessment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Risk Score</p>
                        <p className="text-2xl font-bold">{loan.riskScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Risk Level</p>
                        <div
                          className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            loan.riskLevel === "low"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : loan.riskLevel === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : loan.riskLevel === "high"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1).replace("-", " ")}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Risk assessment will be recalculated when you update loan information.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {state.errors?._form && (
        <div className="rounded-md bg-destructive/15 p-3 text-destructive mt-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">{state.errors._form}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end mt-6">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update Loan" : "Create Loan"}</Button>
      </div>
    </form>
  )
}
