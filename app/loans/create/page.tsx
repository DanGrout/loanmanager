import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import LoanForm from "@/components/loan-form"

export default function CreateLoanPage() {
  return (
    <div className="container max-w-3xl animate-in">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/loans">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Loans
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Loan</h1>
        <p className="text-muted-foreground mt-1">Add a new loan to your portfolio</p>
      </div>

      <LoanForm />
    </div>
  )
}
