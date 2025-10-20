"use client"

import { useState } from "react"
import { ServicesDisplay } from "./services-display"
import { EnhancedBookingForm } from "./enhanced-booking-form"

type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  isActive: boolean
}

type Dentist = {
  id: string
  name: string
  specialization: string | null
  image: string | null
}

type BookingPageContentProps = {
  services: Service[]
  dentists: Dentist[]
  patientId: string
}

export function BookingPageContent({ services, dentists, patientId }: BookingPageContentProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")

  return (
    <div className="flex flex-col gap-8 py-4 md:gap-10 md:py-6 px-4 lg:px-6">
      <div id="booking-form-section" className="border-t pt-8 scroll-mt-20">
        <EnhancedBookingForm 
          services={services} 
          dentists={dentists}
          patientId={patientId}
          preSelectedServiceId={selectedServiceId}
        />
      </div>
    </div>
  )
}
