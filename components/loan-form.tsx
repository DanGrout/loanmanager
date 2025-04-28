/**
 * @fileoverview A comprehensive loan management form component that handles both creation and editing of loans.
 * This component provides a user interface for managing loan details including basic information and risk assessment.
 */

"use client"

import { useRouter } from "next/navigation"
import { createLoanAction, updateLoanAction } from "@/lib/actions"
import type { Loan } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useState } from "react"

type LoanStatus = "pending" | "active" | "paid" | "defaulted"

/**
 * LoanForm Component
 * @component
 * @param {Object} props - Component props
 * @param {Loan} [props.loan] - Optional loan object for editing mode
 * @returns {JSX.Element} A form component for creating or editing loans
 * 
 * @description
 * This component renders a form for creating new loans or editing existing ones.
 * It includes all loan details including basic information and risk assessment
 * in a single, comprehensive interface.
 */
export default function LoanForm({ loan }: { loan?: Loan }) {
  const router = useRouter()
  const isEditing = !!loan
  const { pending } = useFormStatus()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<LoanStatus>(loan?.status as LoanStatus || "pending")

  const handleSubmit = async (formData: FormData) => {
    try {
      if (isEditing) {
        await updateLoanAction(loan.id, formData)
      } else {
        await createLoanAction(formData)
      }
      // The redirect will be handled by the server action
    } catch (err) {
      // Only set error if it's not a redirect
      if (!(err instanceof Error && err.message === "NEXT_REDIRECT")) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      }
    }
  }

  const handleCancel = () => {
    if (isEditing) {
      router.push(`/loans/${loan.id}`)
    } else {
      router.push("/loans")
    }
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="inline-block mr-2 h-4 w-4" />
          {error}
        </div>
      )}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Loan Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={loan?.name || ""}
                />
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
                  />
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
                  />
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
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LoanStatus)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="paid">Paid</option>
                    <option value="defaulted">Defaulted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={loan ? new Date(loan.startDate).toISOString().split("T")[0] : ""}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={loan ? new Date(loan.endDate).toISOString().split("T")[0] : ""}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input
                  id="borrowerName"
                  name="borrowerName"
                  defaultValue={loan?.borrowerName || ""}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="borrowerEmail">Borrower Email</Label>
                <Input
                  id="borrowerEmail"
                  name="borrowerEmail"
                  type="email"
                  defaultValue={loan?.borrowerEmail || ""}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <Input
                    id="creditScore"
                    name="creditScore"
                    type="number"
                    min="300"
                    max="850"
                    defaultValue={loan?.creditScore || ""}
                  />
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
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={loan?.description || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pending}>
            {isEditing ? (pending ? "Saving..." : "Save Changes") : (pending ? "Creating..." : "Create Loan")}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
