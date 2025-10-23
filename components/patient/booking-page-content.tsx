"use client"

import { useState } from "react"
import BookingForm from "./booking-form"
import { Service, Dentist } from "@/components/services/types"

type BookingPageContentProps = {
  services: Service[]
  dentists: Dentist[]
  patientId: string
}

export function BookingPageContent({ services, dentists, patientId }: BookingPageContentProps) {
  const [selectedServiceId] = useState<string>("")

  return (
    <div className="flex flex-col gap-8 py-4 md:gap-10 md:py-6 px-4 lg:px-6">
      <div id="booking-form-section" className="border-t pt-8 scroll-mt-20">
        <BookingForm services={services} />
      </div>
    </div>
  )
}
