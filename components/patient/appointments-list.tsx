"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, DollarSign, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Appointment = {
  id: string;
  date: Date;
  timeSlot: string;
  status: string;
  notes: string | null;
  dentist: {
    name: string;
    image: string | null;
  };
  service: {
    name: string;
    price: number | string;
  };
  payment: {
    status: string;
    amount: number;
  } | null;
};

type AppointmentsListProps = {
  appointments: Appointment[];
};

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date() || apt.status === "cancelled"
  );

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setIsLoading(appointmentId);

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
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      toast.success("Appointment cancelled successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
      completed: "outline",
      rescheduled: "secondary",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatPrice = (price: number | string): string => {
    if (typeof price === "string") {
      return price;
    }
    if (isNaN(price)) {
      return "Contact for pricing";
    }
    return `₱${price.toLocaleString()}`;
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {appointment.service.name}
            </CardTitle>
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
            <span>{formatPrice(appointment.service.price)}</span>
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

        {appointment.status === "pending" ||
        appointment.status === "confirmed" ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Reschedule feature coming soon")}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelAppointment(appointment.id)}
              disabled={isLoading === appointment.id}
            >
              {isLoading === appointment.id ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setSelectedAppointment(appointment)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}

        {appointment.status === "completed" &&
          appointment.payment?.status === "pending" && (
            <Button className="w-full" size="sm">
              Pay Now
            </Button>
          )}
      </CardContent>
    </Card>
  );

  return (
    <>
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
                <p className="text-muted-foreground">
                  No upcoming appointments
                </p>
                <Button
                  className="mt-4"
                  onClick={() =>
                    (window.location.href = "/patient/book-appointment")
                  }
                >
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

      {/* Appointment Details Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  Appointment Details
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedAppointment?.id}
                </DialogDescription>
              </div>
              {selectedAppointment &&
                getStatusBadge(selectedAppointment.status)}
            </div>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Service Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Service Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">
                      {selectedAppointment.service.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">
                      {formatPrice(selectedAppointment.service.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Appointment Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(selectedAppointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {selectedAppointment.timeSlot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dentist Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Dentist Information
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your Dentist
                    </p>
                    <p className="font-medium">
                      Dr. {selectedAppointment.dentist.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedAppointment.payment && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Status
                      </p>
                      <div className="mt-1">
                        {getPaymentBadge(selectedAppointment.payment.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        ₱{selectedAppointment.payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Special Requests / Notes
                  </h3>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedAppointment.status === "pending" ||
                selectedAppointment.status === "confirmed" ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAppointment(null);
                        toast.info("Reschedule feature coming soon");
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        const id = selectedAppointment.id;
                        setSelectedAppointment(null);
                        handleCancelAppointment(id);
                      }}
                      disabled={isLoading === selectedAppointment.id}
                    >
                      Cancel Appointment
                    </Button>
                  </>
                ) : selectedAppointment.status === "completed" &&
                  selectedAppointment.payment?.status === "pending" ? (
                  <Button className="w-full">Pay Now</Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
