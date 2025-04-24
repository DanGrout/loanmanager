"use client"
import { useState } from "react"
import { updatePaymentAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Clock, AlertTriangle, X, CalendarClock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Payment } from "@/lib/data"

interface RepaymentScheduleProps {
  payments: Payment[]
  loanId: string
}

export default function RepaymentSchedule({ payments, loanId }: RepaymentScheduleProps) {
  const { toast } = useToast()
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null)

  // Sort payments by payment number
  const sortedPayments = [...payments].sort((a, b) => a.paymentNumber - b.paymentNumber)

  // Function to handle payment status update
  const handleStatusChange = async (paymentId: string, newStatus: "pending" | "paid" | "late" | "missed") => {
    setUpdatingPaymentId(paymentId)

    try {
      const result = await updatePaymentAction(paymentId, newStatus, loanId)

      if (result.success) {
        toast({
          title: "Payment updated",
          description: `Payment status changed to ${newStatus}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setUpdatingPaymentId(null)
    }
  }

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case "late":
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case "missed":
        return <X className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm">Paid</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm">Late</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm">Missed</span>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                <TableCell>{formatDate(payment.dueDate)}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>${payment.principal.toLocaleString()}</TableCell>
                <TableCell>${payment.interest.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status}</span>
                  </div>
                </TableCell>
                <TableCell>{payment.paidDate ? formatDate(payment.paidDate) : "-"}</TableCell>
                <TableCell className="text-right">
                  {updatingPaymentId === payment.id ? (
                    <Button variant="ghost" size="sm" disabled>
                      <CalendarClock className="h-4 w-4 mr-1 animate-spin" />
                      Updating...
                    </Button>
                  ) : (
                    <Select
                      defaultValue={payment.status}
                      onValueChange={(value) =>
                        handleStatusChange(payment.id, value as "pending" | "paid" | "late" | "missed")
                      }
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="missed">Missed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
