"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createLoan, deleteLoan, updateLoan, updatePayment } from "@/lib/data"
import { z } from "zod"

// Validation schema for loan data
const LoanSchema = z.object({
  name: z.string().min(1, "Loan name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  interestRate: z.coerce
    .number()
    .min(0, "Interest rate cannot be negative")
    .max(100, "Interest rate cannot exceed 100%"),
  term: z.coerce.number().positive("Term must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["pending", "active", "paid", "defaulted"]),
  borrowerName: z.string().min(1, "Borrower name is required"),
  borrowerEmail: z.string().email("Invalid email address"),
  description: z.string().optional(),
  creditScore: z.coerce.number().min(300).max(850).optional(),
  collateral: z.coerce.number().min(0).optional(),
})

export type FormState = {
  errors?: {
    name?: string[]
    amount?: string[]
    interestRate?: string[]
    term?: string[]
    startDate?: string[]
    endDate?: string[]
    status?: string[]
    borrowerName?: string[]
    borrowerEmail?: string[]
    description?: string[]
    creditScore?: string[]
    collateral?: string[]
    _form?: string[]
  }
  message?: string
}

export async function createLoanAction(prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form data
  const validatedFields = LoanSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    interestRate: formData.get("interestRate"),
    term: formData.get("term"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    borrowerName: formData.get("borrowerName"),
    borrowerEmail: formData.get("borrowerEmail"),
    description: formData.get("description"),
    creditScore: formData.get("creditScore"),
    collateral: formData.get("collateral"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create loan.",
    }
  }

  try {
    // Create the loan
    await createLoan(validatedFields.data)

    // Revalidate the loans page and redirect
    revalidatePath("/loans")
    redirect("/loans")
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to create loan. Please try again."],
      },
    }
  }
}

export async function updateLoanAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form data
  const validatedFields = LoanSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    interestRate: formData.get("interestRate"),
    term: formData.get("term"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    borrowerName: formData.get("borrowerName"),
    borrowerEmail: formData.get("borrowerEmail"),
    description: formData.get("description"),
    creditScore: formData.get("creditScore"),
    collateral: formData.get("collateral"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update loan.",
    }
  }

  try {
    // Update the loan
    await updateLoan(id, validatedFields.data)

    // Revalidate the loans page and redirect
    revalidatePath(`/loans/${id}`)
    revalidatePath("/loans")
    redirect(`/loans/${id}`)
  } catch (error) {
    return {
      errors: {
        _form: ["Failed to update loan. Please try again."],
      },
    }
  }
}

export async function deleteLoanAction(id: string) {
  try {
    await deleteLoan(id)
    revalidatePath("/loans")
    redirect("/loans")
  } catch (error) {
    // Handle error
    console.error("Failed to delete loan:", error)
    throw new Error("Failed to delete loan")
  }
}

export async function updatePaymentAction(
  paymentId: string,
  status: "pending" | "paid" | "late" | "missed",
  loanId: string,
) {
  try {
    await updatePayment(paymentId, status)
    revalidatePath(`/loans/${loanId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update payment:", error)
    return { success: false, error: "Failed to update payment" }
  }
}
