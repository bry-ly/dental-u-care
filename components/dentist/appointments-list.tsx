"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

type Appointment = {
  id: string
  date: Date
  timeSlot: string
  status: string
  notes: string | null
  patient: {
    name: string
    email: string
    phone: string | null
    medicalHistory: string | null
  }
  service: {
    name: string
    duration: number
    price: number
  }
  payment: {
    status: string
  } | null
}

type DentistAppointmentsListProps = {
  appointments: Appointment[]
}

export function DentistAppointmentsList({ appointments }: DentistAppointmentsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending")
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status === "confirmed"
  )
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")

  const handleConfirmAppointment = async (appointmentId: string) => {
    setIsLoading(appointmentId)

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to confirm appointment")
      }

      toast.success("Appointment confirmed successfully")
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Failed to confirm appointment")
    } finally {
      setIsLoading(null)
    }
  }

  const handleDeclineAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to decline this appointment?")) {
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
          cancelReason: "Declined by dentist",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to decline appointment")
      }

      toast.success("Appointment declined")
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Failed to decline appointment")
    } finally {
      setIsLoading(null)
    }
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    setIsLoading(appointmentId)

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete appointment")
      }

      toast.success("Appointment marked as completed")
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Failed to complete appointment")
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

  const renderAppointmentCard = (appointment: Appointment, showActions: boolean = true) => (
    <Card key={appointment.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{appointment.patient.name}</CardTitle>
            <CardDescription className="mt-1">{appointment.service.name}</CardDescription>
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
          {appointment.patient.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.patient.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{appointment.patient.email}</span>
          </div>
        </div>

        {appointment.patient.medicalHistory && (
          <div className="text-sm">
            <p className="font-medium">Medical History:</p>
            <p className="text-muted-foreground">{appointment.patient.medicalHistory}</p>
          </div>
        )}

        {appointment.notes && (
          <div className="text-sm">
            <p className="font-medium">Patient Notes:</p>
            <p className="text-muted-foreground">{appointment.notes}</p>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            {appointment.status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleConfirmAppointment(appointment.id)}
                  disabled={isLoading === appointment.id}
                >
                  {isLoading === appointment.id ? "Confirming..." : "Confirm"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeclineAppointment(appointment.id)}
                  disabled={isLoading === appointment.id}
                >
                  Decline
                </Button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleCompleteAppointment(appointment.id)}
                disabled={isLoading === appointment.id}
              >
                {isLoading === appointment.id ? "Completing..." : "Mark as Completed"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full max-w-2xl grid-cols-3">
        <TabsTrigger value="pending">
          Pending ({pendingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedAppointments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4 mt-6">
        {pendingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pending appointments</p>
            </CardContent>
          </Card>
        ) : (
          pendingAppointments.map((apt) => renderAppointmentCard(apt))
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-4 mt-6">
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </CardContent>
          </Card>
        ) : (
          upcomingAppointments.map((apt) => renderAppointmentCard(apt))
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4 mt-6">
        {completedAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No completed appointments</p>
            </CardContent>
          </Card>
        ) : (
          completedAppointments.map((apt) => renderAppointmentCard(apt, false))
        )}
      </TabsContent>
    </Tabs>
  )
}
