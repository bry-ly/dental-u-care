"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, DollarSign } from "lucide-react"
import { toast } from "sonner"

type Appointment = {
  id: string
  date: Date
  timeSlot: string
  status: string
  notes: string | null
  dentist: {
    name: string
    image: string | null
  }
  service: {
    name: string
    price: number
  }
  payment: {
    status: string
    amount: number
  } | null
}

type AppointmentsListProps = {
  appointments: Appointment[]
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled"
  )
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date() || apt.status === "cancelled"
  )

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    setIsLoading(appointmentId)

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancelReason: "Cancelled by patient",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      toast.success("Appointment cancelled successfully")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to cancel appointment")
    } finally {
      setIsLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
      completed: "outline",
      rescheduled: "secondary",
    }

    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
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

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{appointment.service.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <User className="h-3 w-3" />
              Dr. {appointment.dentist.name}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(appointment.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>₱{appointment.service.price}</span>
          </div>
          {appointment.payment && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Payment:</span>
              {getPaymentBadge(appointment.payment.status)}
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="text-sm">
            <p className="font-medium">Notes:</p>
            <p className="text-muted-foreground">{appointment.notes}</p>
          </div>
        )}

        {appointment.status === "pending" || appointment.status === "confirmed" ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => toast.info("Reschedule feature coming soon")}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => handleCancelAppointment(appointment.id)}
              disabled={isLoading === appointment.id}
            >
              {isLoading === appointment.id ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        ) : null}

        {appointment.status === "completed" && appointment.payment?.status === "pending" && (
          <Button className="w-full" size="sm">
            Pay Now
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastAppointments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4 mt-6">
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button className="mt-4" onClick={() => window.location.href = "/patient/book-appointment"}>
                Book an Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          upcomingAppointments.map(renderAppointmentCard)
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4 mt-6">
        {pastAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No past appointments</p>
            </CardContent>
          </Card>
        ) : (
          pastAppointments.map(renderAppointmentCard)
        )}
      </TabsContent>
    </Tabs>
  )
}
