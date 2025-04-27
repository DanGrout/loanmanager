"use client"
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
import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

const initialState: FormState = {
  errors: {},
  message: "",
}

export default function LoanForm({ loan }: { loan?: Loan }) {
  const router = useRouter()
  const isEditing = !!loan

  // Create form action based on whether we're editing or creating
  const submitAction = isEditing ? updateLoanAction.bind(null, loan.id) : createLoanAction

  const [state, dispatch] = useFormState(submitAction, initialState)
  const [formData, setFormData] = useState({
    name: loan?.name || "",
    amount: loan?.amount || "",
    interestRate: loan?.interestRate || "",
    term: loan?.term || "",
    status: loan?.status || "pending",
    startDate: loan ? new Date(loan.startDate).toISOString().split("T")[0] : "",
    endDate: loan ? new Date(loan.endDate).toISOString().split("T")[0] : "",
    borrowerName: loan?.borrowerName || "",
    borrowerEmail: loan?.borrowerEmail || "",
    description: loan?.description || "",
    creditScore: loan?.creditScore || "",
    collateral: loan?.collateral || "",
  })

  const { pending } = useFormStatus()

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    dispatch(formData)
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
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
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
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      aria-describedby="name-error"
                    />
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
                        value={formData.amount}
                        onChange={handleInputChange}
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
                        value={formData.interestRate}
                        onChange={handleInputChange}
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
                        value={formData.term}
                        onChange={handleInputChange}
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
                      <Select
                        name="status"
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
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
                        value={formData.startDate}
                        onChange={handleInputChange}
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
                        value={formData.endDate}
                        onChange={handleInputChange}
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
                      value={formData.borrowerName}
                      onChange={handleInputChange}
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
                      value={formData.borrowerEmail}
                      onChange={handleInputChange}
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
                      value={formData.description}
                      onChange={handleInputChange}
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
                      value={formData.creditScore}
                      onChange={handleInputChange}
                      aria-describedby="creditScore-error"
                    />
                    {state.errors?.creditScore && (
                      <p id="creditScore-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.creditScore}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="collateral">Collateral Value ($)</Label>
                    <Input
                      id="collateral"
                      name="collateral"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.collateral}
                      onChange={handleInputChange}
                      aria-describedby="collateral-error"
                    />
                    {state.errors?.collateral && (
                      <p id="collateral-error" className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.errors.collateral}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Loan" : "Create Loan"}</Button>
        </div>
      </div>
    </form>
  )
}
