"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const serviceTypes = [
  "Cleaning",
  "Consultation",
  "Extraction",
  "Filling",
  "Root Canal",
  "Crown/Bridge",
  "Teeth Whitening",
  "Orthodontic Consultation",
  "Emergency Treatment",
  "Other",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    preferredDate: "",
    preferredTime: "",
    contactNumber: "",
    email: "",
    serviceType: "",
    specialRequests: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen p-1">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              Dental Appointment Form
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Patient Booking
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Patient Name and Contact Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email Address and Type of Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">
                    Type of Service <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      handleInputChange("serviceType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Preferred Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">
                    Preferred Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">
                    Preferred Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      handleInputChange("preferredTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Special Requests or Notes */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests">
                  Special Requests or Notes
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleInputChange("specialRequests", e.target.value)
                  }
                  placeholder="Any allergies, medical conditions, or special requests..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button type="submit" size="lg" className="px-12">
                  Book Appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
