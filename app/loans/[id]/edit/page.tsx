import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getLoan } from "@/lib/data"
import LoanForm from "@/components/loan-form"

export default async function EditLoanPage({ params }: { params: { id: string } }) {
  const loan = await getLoan(params.id)

  if (!loan) {
    notFound()
  }

  return (
    <div className="container max-w-3xl animate-in">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/loans/${loan.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Loan Details
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Loan</h1>
        <p className="text-muted-foreground mt-1">Update loan information</p>
      </div>

      <LoanForm loan={loan} />
    </div>
  )
}
