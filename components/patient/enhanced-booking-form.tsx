"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { 
  Loader2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Eye,
  CheckCircle,
  Stethoscope,
  FileText
} from "lucide-react"

type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
}

type Dentist = {
  id: string
  name: string
  specialization: string | null
  image: string | null
}

type EnhancedBookingFormProps = {
  services: Service[]
  dentists: Dentist[]
  patientId: string
  preSelectedServiceId?: string
}

const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
]

export function EnhancedBookingForm({ services, dentists, patientId, preSelectedServiceId }: EnhancedBookingFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'form' | 'review'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<string>(preSelectedServiceId || "")
  const [selectedDentist, setSelectedDentist] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  
  // Contact information
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")

  // Update selected service when preSelectedServiceId changes
  useEffect(() => {
    if (preSelectedServiceId) {
      setSelectedService(preSelectedServiceId)
    }
  }, [preSelectedServiceId])

  // Auto-populate user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const user = await response.json()
          setEmail(user.email || "")
          setPhone(user.phone || "")
          setFirstName(user.name?.split(' ')[0] || "")
          setLastName(user.name?.split(' ').slice(1).join(' ') || "")
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }
    fetchUserInfo()
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedService) {
      toast.error("Please select a service")
      return
    }
    if (!selectedDentist) {
      toast.error("Please select a dentist")
      return
    }
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot")
      return
    }
    if (!firstName || !lastName) {
      toast.error("Please fill in your name")
      return
    }
    if (!email) {
      toast.error("Please provide your email address")
      return
    }
    if (!phone) {
      toast.error("Please provide your phone number")
      return
    }

    // Move to review step
    setCurrentStep('review')
  }

  const handleBookingSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          dentistId: selectedDentist,
          serviceId: selectedService,
          date: selectedDate?.toISOString(),
          timeSlot: selectedTimeSlot,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book appointment")
      }

      toast.success("Appointment booked successfully!", {
        description: "We'll send you a confirmation email shortly.",
        duration: 5000,
      })
      
      setTimeout(() => {
        router.push("/patient/appointments")
      }, 1500)
    } catch (error) {
      console.error(error)
      toast.error("Failed to book appointment", {
        description: "Please try again or contact us directly.",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const selectedDentistData = dentists.find((d) => d.id === selectedDentist)

  return (
    <div className="space-y-6">
      {currentStep === 'form' ? (
        <form onSubmit={handleFormSubmit}>
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="service">
                <Stethoscope className="h-4 w-4 mr-2" />
                Service
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="info">
                <User className="h-4 w-4 mr-2" />
                Your Info
              </TabsTrigger>
              <TabsTrigger value="notes">
                <MessageSquare className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Service Tab */}
            <TabsContent value="service">
              <Card>
                <CardHeader>
                  <CardTitle>Select Service</CardTitle>
                  <CardDescription>
                    Choose the dental service you need
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="service">Dental Service <span className="text-red-500">*</span></Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ₱{service.price.toLocaleString()} ({service.duration} mins)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedServiceData && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {selectedServiceData.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
                          <span>⏱️ {selectedServiceData.duration} minutes</span>
                          <span>💰 ₱{selectedServiceData.price.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dentist">Preferred Dentist <span className="text-red-500">*</span></Label>
                    <Select value={selectedDentist} onValueChange={setSelectedDentist}>
                      <SelectTrigger id="dentist">
                        <SelectValue placeholder="Choose a dentist" />
                      </SelectTrigger>
                      <SelectContent>
                        {dentists.map((dentist) => (
                          <SelectItem key={dentist.id} value={dentist.id}>
                            Dr. {dentist.name}
                            {dentist.specialization && ` - ${dentist.specialization}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Schedule</CardTitle>
                  <CardDescription>
                    Choose your preferred date and time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-3">
                    <Label>Select Date <span className="text-red-500">*</span></Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        if (date < today) return true
                        if (date.getDay() === 0) return true
                        return false
                      }}
                      className="rounded-lg border shadow-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      *Clinic is closed on Sundays
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timeSlot">Select Time Slot <span className="text-red-500">*</span></Label>
                    <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger id="timeSlot">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patient Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Dela Cruz"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>
                    Any special concerns or requests? (Optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-3">
                    <Label htmlFor="notes">
                      Special concerns or requests
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g., Tooth sensitivity, anxiety about procedures, allergies..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Review Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      ) : (
        /* Review Step */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review Your Appointment
            </CardTitle>
            <CardDescription>
              Please review your appointment details before confirming
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Summary */}
            {selectedServiceData && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-base">Service Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{selectedServiceData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedServiceData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-lg text-primary">₱{selectedServiceData.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Details */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-base">Appointment Schedule</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Dentist:</span>
                  <p className="font-medium">
                    Dr. {selectedDentistData?.name}
                    {selectedDentistData?.specialization && (
                      <span className="text-xs text-muted-foreground block">
                        {selectedDentistData.specialization}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium">{selectedTimeSlot}</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-base">Patient Information</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{firstName} {lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{email}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {notes && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-base">Additional Notes</h5>
                <p className="text-sm bg-background/50 p-3 rounded-md border">
                  {notes}
                </p>
              </div>
            )}

            {/* Confirmation Notice */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Appointment Confirmation</p>
                  <p className="text-blue-600 dark:text-blue-300">
                    We'll send you a confirmation email and SMS once your appointment is confirmed. 
                    Please arrive 10 minutes early for check-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("form")}
                className="flex-1"
                disabled={isLoading}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                onClick={handleBookingSubmit}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
