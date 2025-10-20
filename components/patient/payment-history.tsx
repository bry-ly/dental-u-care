"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download } from "lucide-react"

type Payment = {
  id: string
  amount: number
  method: string
  status: string
  transactionId: string | null
  paidAt: Date | null
  createdAt: Date
  appointment: {
    date: Date
    timeSlot: string
    service: {
      name: string
    }
    dentist: {
      name: string
    }
  }
}

type PaymentHistoryProps = {
  payments: Payment[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    }

    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getMethodIcon = (method: string) => {
    return <CreditCard className="h-4 w-4" />
  }

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No payment history</p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getMethodIcon(payment.method)}
                    </div>
                    <div>
                      <p className="font-medium">{payment.appointment.service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {payment.appointment.dentist.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.appointment.date).toLocaleDateString()} at {payment.appointment.timeSlot}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {payment.paidAt 
                            ? `Paid on ${new Date(payment.paidAt).toLocaleDateString()}`
                            : `Created on ${new Date(payment.createdAt).toLocaleDateString()}`
                          }
                        </p>
                        {payment.transactionId && (
                          <p className="text-xs text-muted-foreground">
                            • ID: {payment.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold text-lg">₱{payment.amount.toFixed(2)}</p>
                    {getStatusBadge(payment.status)}
                    {payment.status === "pending" && (
                      <Button size="sm" className="w-full mt-2">
                        Pay Now
                      </Button>
                    )}
                    {payment.status === "paid" && (
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Download className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
