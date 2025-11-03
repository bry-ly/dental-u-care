"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  Stethoscope,
  AlertCircle,
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CreditCard,
  Shield,
  Check,
  MapPin,
  Heart,
} from "lucide-react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingFormProps {
  services?: Array<{
    id: string;
    name: string;
    price: string | number;
    duration: string | number;
    category: string;
    description?: string;
  }>;
  dentists?: Array<{
    id: string;
    name: string;
    specialization?: string;
    image?: string;
  }>;
  patientId?: string;
}

const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "Bleeding Disorder",
  "Asthma",
  "Allergies (Drug/Food)",
  "Thyroid Disease",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "Osteoporosis",
  "Arthritis",
];

const MEDICATIONS_COMMON = [
  "Aspirin",
  "Ibuprofen",
  "Warfarin (Blood Thinner)",
  "Antibiotics",
  "Blood Pressure Medication",
  "Diabetes Medication",
  "Thyroid Medication",
  "Antidepressants",
];

const DENTAL_HISTORY = [
  "Regular Checkups",
  "Root Canal",
  "Extractions",
  "Crowns/Bridges",
  "Implants",
  "Orthodontics (Braces)",
  "Gum Disease Treatment",
  "Teeth Whitening",
];

const STEP_CONFIG = [
  {
    id: 0,
    title: "Services",
    shortTitle: "Services",
    description: "Choose your dental service",
    icon: Stethoscope,
  },
  {
    id: 1,
    title: "Date & Time",
    shortTitle: "Schedule",
    description: "Select appointment date and time",
    icon: Calendar,
  },
  {
    id: 2,
    title: "Patient Info",
    shortTitle: "Info",
    description: "Your contact information",
    icon: User,
  },
  {
    id: 3,
    title: "Medical History",
    shortTitle: "Medical",
    description: "Health information (optional)",
    icon: Heart,
  },
  {
    id: 4,
    title: "Review & Confirm",
    shortTitle: "Review",
    description: "Confirm your appointment",
    icon: Check,
  },
];

type ServiceSelection = { id: string; name: string; qty: number };

export default function BookingForm({
  services: propServices = [],
  dentists: propDentists = [],
  patientId,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  // Auto-save to localStorage - memoize to prevent unnecessary re-renders
  const STORAGE_KEY = useMemo(() => `booking-form-${patientId}`, [patientId]);

  const services = useMemo(
    () =>
      propServices && propServices.length > 0
        ? propServices.map((service) => ({
            ...service,
            price: service.price,
            duration:
              typeof service.duration === "string"
                ? Number.parseInt(service.duration)
                : service.duration,
          }))
        : [],
    [propServices]
  );

  const dentists = propDentists && propDentists.length > 0 ? propDentists : [];

  const [formData, setFormData] = useState<{
    services: ServiceSelection[];
    preferredDate: string;
    preferredTime: string;
    dentistId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    contactNumber: string;
    preferredContact: string;
    address: string;
    city: string;
    postalCode: string;
    medicalConditions: string[];
    otherConditions: string;
    currentMedications: string[];
    otherMedications: string;
    allergies: string;
    lastDentalVisit: string;
    dentalHistory: string[];
    hasMedicalUpdates: string;
    specialRequests: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    smsReminders: boolean;
    consentToTreatment: boolean;
  }>({
    services: [],
    preferredDate: "",
    preferredTime: "",
    dentistId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    contactNumber: "",
    preferredContact: "email",
    address: "",
    city: "",
    postalCode: "",
    medicalConditions: [],
    otherConditions: "",
    currentMedications: [],
    otherMedications: "",
    allergies: "",
    lastDentalVisit: "",
    dentalHistory: [],
    hasMedicalUpdates: "no",
    specialRequests: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    smsReminders: true,
    consentToTreatment: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => {
      const array = prev[field as keyof typeof prev] as string[];
      if (array.includes(value)) {
        return {
          ...prev,
          [field]: array.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...array, value],
        };
      }
    });
  };

  const handleServiceChange = (serviceId: string, qty: number) => {
    setFormData((prev) => {
      const existing = prev.services.find((s) => s.id === serviceId);
      let newServices;
      if (existing) {
        if (qty === 0) {
          newServices = prev.services.filter((s) => s.id !== serviceId);
        } else {
          newServices = prev.services.map((s) =>
            s.id === serviceId ? { ...s, qty } : s
          );
        }
      } else {
        const service = services.find((s) => s.id === serviceId);
        if (!service) return prev;
        newServices = [
          ...prev.services,
          { id: serviceId, name: service.name, qty },
        ];
      }
      return { ...prev, services: newServices };
    });
  };

  const parsePrice = (price: string | number): number => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    if (price.toLowerCase().includes("contact")) return 0;
    const match = price.match(/₱?([\d,]+)/);
    if (match) {
      return Number.parseFloat(match[1].replace(/,/g, ""));
    }
    return 0;
  };

  const { itemizedServices, subtotal, tax, totalDue } = useMemo(() => {
    const itemizedServices = formData.services
      .filter((s) => s.qty > 0)
      .map((s) => {
        const service = services.find((svc) => svc.id === s.id);
        const price = service ? parsePrice(service.price) : 0;
        const total = price * s.qty;
        return {
          description: service ? service.name : "",
          qty: s.qty,
          unitPrice: price,
          total,
        };
      });

    const subtotal = itemizedServices.reduce(
      (sum: number, s) => sum + s.total,
      0
    );
    const tax = Math.round(subtotal * 0.12 * 100) / 100;
    const totalDue = subtotal + tax;

    return { itemizedServices, subtotal, tax, totalDue };
  }, [formData.services, services]);

  const selectedDentist = dentists.find((d) => d.id === formData.dentistId);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.services.filter((s) => s.qty > 0).length > 0;
      case 1:
        return !!(
          formData.preferredDate &&
          formData.preferredTime &&
          formData.dentistId
        );
      case 2:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.contactNumber &&
          formData.dateOfBirth &&
          formData.gender
        );
      case 3:
        return true;
      case 4:
        return formData.consentToTreatment;
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (canProceed && currentStep < STEP_CONFIG.length - 1) {
      if (
        currentStep === 2 &&
        !showMedicalHistory &&
        formData.hasMedicalUpdates === "no"
      ) {
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (
        currentStep === 4 &&
        !showMedicalHistory &&
        formData.hasMedicalUpdates === "no"
      ) {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consentToTreatment) {
      toast.error("Please agree to the consent to treatment");
      return;
    }

    const selectedServices = formData.services.filter((s) => s.qty > 0);
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (totalDue <= 0) {
      toast.error("Invalid total amount");
      return;
    }

    setIsSubmitting(true);

    const appointmentData = {
      patientId,
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        contactNumber: formData.contactNumber,
        preferredContact: formData.preferredContact,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      medicalHistory:
        showMedicalHistory || formData.hasMedicalUpdates === "yes"
          ? {
              conditions: formData.medicalConditions,
              otherConditions: formData.otherConditions,
              medications: formData.currentMedications,
              otherMedications: formData.otherMedications,
              allergies: formData.allergies,
              lastDentalVisit: formData.lastDentalVisit,
              dentalHistory: formData.dentalHistory,
            }
          : null,
      appointment: {
        date: formData.preferredDate,
        time: formData.preferredTime,
        dentistId: formData.dentistId,
        dentistName: selectedDentist?.name,
      },
      services: itemizedServices,
      insurance: {
        provider: formData.insuranceProvider,
        policyNumber: formData.insurancePolicyNumber,
      },
      emergency: {
        contactName: formData.emergencyContactName,
        contactPhone: formData.emergencyContactPhone,
      },
      preferences: {
        smsReminders: formData.smsReminders,
      },
      specialRequests: formData.specialRequests,
      totals: {
        subtotal,
        tax,
        totalDue,
      },
    };

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      localStorage.removeItem(STORAGE_KEY);

      toast.success(
        data.message ||
          "Appointment booked successfully! Check your email for confirmation.",
        {
          description: "You will be redirected to your appointments page.",
          duration: 3000,
        }
      );

      setTimeout(() => {
        window.location.href = "/patient/appointments";
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment", {
        description:
          error instanceof Error
            ? error.message
            : "Unknown error. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved form data", e);
      }
    }
  }, [STORAGE_KEY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, STORAGE_KEY]);

  const progressPercent = ((currentStep + 1) / STEP_CONFIG.length) * 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card
          className="border-2 border-border shadow-xl"
          style={{
            borderRadius: "var(--radius-xl)",
          }}
        >
          <CardHeader className="space-y-5 pb-8 border-b-2 border-border bg-accent/30">
            <div className="flex items-center justify-center mb-3">
              <div
                className="h-16 w-16 bg-primary flex items-center justify-center shadow-lg ring-4 ring-primary/20"
                style={{
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <Stethoscope className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-3 text-center">
              <CardTitle className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Book Your Appointment
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-muted-foreground font-medium">
                Complete in just a few minutes
              </CardDescription>
            </div>

            <div className="w-full pt-3">
              <div
                className="h-3 bg-muted overflow-hidden shadow-inner"
                style={{
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div
                  className="h-3 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out shadow-sm"
                  style={{
                    width: `${progressPercent}%`,
                    borderRadius: "var(--radius-lg)",
                  }}
                />
              </div>

              {/* Step Indicators - Desktop */}
              <div className="hidden md:flex justify-between mt-8 gap-3">
                {STEP_CONFIG.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 flex items-center justify-center transition-all duration-300 border-2 shadow-md",
                          isActive &&
                            "bg-primary text-primary-foreground border-primary scale-110 shadow-lg ring-4 ring-primary/20",
                          isCompleted &&
                            "bg-accent text-primary border-primary/50",
                          !isActive &&
                            !isCompleted &&
                            "bg-muted text-muted-foreground border-border hover:border-primary/30"
                        )}
                        style={{
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold text-center transition-colors",
                          isActive && "text-primary",
                          isCompleted && "text-primary/70",
                          !isActive && !isCompleted && "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Indicators - Mobile */}
              <div className="flex md:hidden justify-center mt-5">
                <div
                  className="px-5 py-2 bg-primary/10 text-primary font-bold text-sm shadow-sm border border-primary/30"
                  style={{
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  Step {currentStep + 1} of {STEP_CONFIG.length}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit}>
              {/* Step 0: Service Selection */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-3 mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      Select Your Service
                    </h3>
                    <p className="text-base text-muted-foreground font-medium">
                      Choose the dental service you need
                    </p>
                    <div
                      className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50"
                      style={{
                        borderRadius: "var(--radius-lg)",
                      }}
                    />
                  </div>

                  {services.length > 0 ? (
                    <Tabs
                      defaultValue={services[0]?.category || "all"}
                      className="w-full"
                    >
                      <TabsList className="w-full flex-wrap h-auto">
                        {Array.from(
                          new Set(services.map((s) => s.category))
                        ).map((category) => (
                          <TabsTrigger
                            key={category}
                            value={category}
                            className="flex-1 min-w-[120px]"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Array.from(new Set(services.map((s) => s.category))).map(
                        (category) => (
                          <TabsContent
                            key={category}
                            value={category}
                            className="mt-4"
                          >
                            <div className="space-y-3">
                              {services
                                .filter(
                                  (service) => service.category === category
                                )
                                .map((service) => {
                                  const isSelected = formData.services.some(
                                    (s) => s.id === service.id && s.qty > 0
                                  );

                                  return (
                                    <div
                                      key={service.id}
                                      onClick={() =>
                                        handleServiceChange(
                                          service.id,
                                          isSelected ? 0 : 1
                                        )
                                      }
                                      className={cn(
                                        "relative p-5 border-2 cursor-pointer transition-all duration-200",
                                        isSelected
                                          ? "border-primary bg-accent shadow-lg ring-2 ring-primary/20"
                                          : "border-border hover:border-primary/60 hover:bg-accent/30"
                                      )}
                                      style={{
                                        borderRadius: "var(--radius-md)",
                                      }}
                                    >
                                      {isSelected && (
                                        <div className="absolute top-4 right-4">
                                          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-md ring-2 ring-primary/30">
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex items-start gap-4 pr-10">
                                        <div
                                          className={cn(
                                            "h-14 w-14 flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                                            isSelected
                                              ? "bg-primary text-primary-foreground shadow-lg"
                                              : "bg-muted text-muted-foreground"
                                          )}
                                          style={{
                                            borderRadius: "var(--radius-md)",
                                          }}
                                        >
                                          <Stethoscope className="h-7 w-7" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-lg mb-1.5 text-foreground">
                                            {service.name}
                                          </h4>

                                          {service.description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                              {service.description}
                                            </p>
                                          )}

                                          <div className="flex items-center gap-5 text-sm">
                                            <span className="flex items-center gap-2 text-muted-foreground font-medium">
                                              <Clock className="h-4 w-4 text-primary/70" />
                                              <span className="tracking-wide">
                                                {service.duration} min
                                              </span>
                                            </span>
                                            <div className="h-4 w-px bg-border" />
                                            <span className="font-bold text-primary text-base">
                                              {typeof service.price === "number"
                                                ? `₱${service.price.toLocaleString()}`
                                                : service.price}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </TabsContent>
                        )
                      )}
                    </Tabs>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No services available. Please contact the clinic.
                      </AlertDescription>
                    </Alert>
                  )}

                  {formData.services.filter((s) => s.qty > 0).length > 0 && (
                    <div
                      className="mt-6 p-5 bg-accent/80 border-2 border-primary/30 shadow-lg animate-in slide-in-from-bottom duration-300"
                      style={{
                        borderRadius: "var(--radius-lg)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h4 className="font-bold text-base text-foreground">
                          Selected Services
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {formData.services
                          .filter((s) => s.qty > 0)
                          .map((s) => {
                            const service = services.find(
                              (svc) => svc.id === s.id
                            );
                            return (
                              <div
                                key={s.id}
                                className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
                              >
                                <span className="font-medium text-foreground">
                                  {service?.name}
                                </span>
                                <span className="font-bold text-primary">
                                  ₱{service?.price.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Date & Time Selection */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold">
                      Choose Date & Time
                    </h3>
                    <p className="text-muted-foreground">
                      Select your preferred appointment schedule
                    </p>
                  </div>

                  <Field>
                    <FieldLabel>
                      Preferred Dentist{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <RadioGroup
                        value={formData.dentistId}
                        onValueChange={(value) =>
                          handleInputChange("dentistId", value)
                        }
                        className="space-y-2"
                      >
                        {dentists.map((dentist) => (
                          <label
                            key={dentist.id}
                            className={cn(
                              "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                              "hover:bg-accent/30 ",
                              formData.dentistId === dentist.id
                                ? "border-foreground bg-secondary/20"
                                : "border-border"
                            )}
                          >
                            <RadioGroupItem
                              value={dentist.id}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {dentist.name}
                              </p>
                              {dentist.specialization && (
                                <p className="text-xs text-muted-foreground">
                                  {dentist.specialization}
                                </p>
                              )}
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    </FieldContent>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel>
                        Preferred Date{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Calendar className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) =>
                              handleInputChange("preferredDate", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Preferred Time{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Clock className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="time"
                            value={formData.preferredTime}
                            onChange={(e) =>
                              handleInputChange("preferredTime", e.target.value)
                            }
                            required
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      We&apos;ll confirm your appointment time based on
                      availability
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold">Your Information</h3>
                    <p className="text-muted-foreground">
                      Help us serve you better
                    </p>
                  </div>

                  <Field>
                    <FieldLabel>Are you a new patient?</FieldLabel>
                    <FieldContent>
                      <RadioGroup
                        value={isNewPatient ? "yes" : "no"}
                        onValueChange={(value) => {
                          setIsNewPatient(value === "yes");
                          setShowMedicalHistory(value === "yes");
                          if (value === "no") {
                            handleInputChange("hasMedicalUpdates", "no");
                          }
                        }}
                        className="flex gap-4"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="yes" />
                          <span className="text-sm">Yes, first visit</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="no" />
                          <span className="text-sm">No, returning patient</span>
                        </label>
                      </RadioGroup>
                    </FieldContent>
                  </Field>

                  {!isNewPatient && (
                    <Field>
                      <FieldLabel>
                        Any updates to your medical history?
                      </FieldLabel>
                      <FieldContent>
                        <RadioGroup
                          value={formData.hasMedicalUpdates}
                          onValueChange={(value) => {
                            handleInputChange("hasMedicalUpdates", value);
                            setShowMedicalHistory(value === "yes");
                          }}
                          className="flex gap-4"
                        >
                          <label className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value="yes" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value="no" />
                            <span className="text-sm">No changes</span>
                          </label>
                        </RadioGroup>
                      </FieldContent>
                    </Field>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel>
                        First Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="Dental"
                            required
                            autoComplete="given-name"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Last Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Care"
                            required
                            autoComplete="family-name"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Date of Birth{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Calendar className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                            required
                            autoComplete="bday"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Gender <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Mail className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="@example.com"
                            required
                            autoComplete="email"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Phone Number <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Phone className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="tel"
                            value={formData.contactNumber}
                            onChange={(e) =>
                              handleInputChange("contactNumber", e.target.value)
                            }
                            placeholder="+63 912 345 6789"
                            required
                            autoComplete="tel"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Preferred Contact Method</FieldLabel>
                    <FieldContent>
                      <RadioGroup
                        value={formData.preferredContact}
                        onValueChange={(value) =>
                          handleInputChange("preferredContact", value)
                        }
                        className="flex flex-wrap gap-4"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="email" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="sms" />
                          <span className="text-sm">SMS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="call" />
                          <span className="text-sm">Phone Call</span>
                        </label>
                      </RadioGroup>
                    </FieldContent>
                  </Field>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address (Optional)
                    </h4>

                    <div className="space-y-4">
                      <Field>
                        <FieldLabel>Street Address</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              value={formData.address}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              placeholder="Baltan Street"
                              autoComplete="street-address"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>City</FieldLabel>
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                value={formData.city}
                                onChange={(e) =>
                                  handleInputChange("city", e.target.value)
                                }
                                placeholder="Palawan"
                                autoComplete="address-level2"
                              />
                            </InputGroup>
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Postal Code</FieldLabel>
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                value={formData.postalCode}
                                onChange={(e) =>
                                  handleInputChange(
                                    "postalCode",
                                    e.target.value
                                  )
                                }
                                placeholder="5300"
                                autoComplete="postal-code"
                              />
                            </InputGroup>
                          </FieldContent>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Medical History */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold">Medical History</h3>
                    <p className="text-muted-foreground">
                      Help us provide safe and effective treatment
                    </p>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Protected:</strong> All medical
                      information is confidential and HIPAA compliant
                    </AlertDescription>
                  </Alert>

                  <Field>
                    <FieldLabel>Medical Conditions</FieldLabel>
                    <FieldContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MEDICAL_CONDITIONS.map((condition) => (
                          <label
                            key={condition}
                            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-secondary transition-colors"
                          >
                            <Checkbox
                              checked={formData.medicalConditions.includes(
                                condition
                              )}
                              onCheckedChange={() =>
                                handleArrayToggle(
                                  "medicalConditions",
                                  condition
                                )
                              }
                            />
                            <span className="text-sm">{condition}</span>
                          </label>
                        ))}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Other Medical Conditions</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.otherConditions}
                        onChange={(e) =>
                          handleInputChange("otherConditions", e.target.value)
                        }
                        placeholder="Please list any other medical conditions..."
                        rows={3}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Current Medications</FieldLabel>
                    <FieldContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MEDICATIONS_COMMON.map((med) => (
                          <label
                            key={med}
                            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-secondary transition-colors"
                          >
                            <Checkbox
                              checked={formData.currentMedications.includes(
                                med
                              )}
                              onCheckedChange={() =>
                                handleArrayToggle("currentMedications", med)
                              }
                            />
                            <span className="text-sm">{med}</span>
                          </label>
                        ))}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Other Medications</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.otherMedications}
                        onChange={(e) =>
                          handleInputChange("otherMedications", e.target.value)
                        }
                        placeholder="List any other medications, vitamins, or supplements..."
                        rows={3}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Known Allergies</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.allergies}
                        onChange={(e) =>
                          handleInputChange("allergies", e.target.value)
                        }
                        placeholder="List any allergies to medications, latex, etc. (Type 'None' if no allergies)"
                        rows={3}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Previous Dental Treatments</FieldLabel>
                    <FieldContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {DENTAL_HISTORY.map((history) => (
                          <label
                            key={history}
                            className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-secondary transition-colors"
                          >
                            <Checkbox
                              checked={formData.dentalHistory.includes(history)}
                              onCheckedChange={() =>
                                handleArrayToggle("dentalHistory", history)
                              }
                            />
                            <span className="text-sm">{history}</span>
                          </label>
                        ))}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Last Dental Visit</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <Calendar className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          type="date"
                          value={formData.lastDentalVisit}
                          onChange={(e) =>
                            handleInputChange("lastDentalVisit", e.target.value)
                          }
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>
              )}

              {/* Step 4: Review & Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-semibold">Review & Confirm</h3>
                    <p className="text-muted-foreground">
                      Please review your appointment details
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Services */}
                    <div className="p-4 bg-primary-foreground dark:bg-secondary-foreground rounded-lg border">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Selected Services
                      </h4>
                      <div className="space-y-2">
                        {itemizedServices.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0 text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.description}</p>
                              <p className="text-xs text-muted-foreground">
                                ₱{item.unitPrice.toLocaleString()} × {item.qty}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₱{item.total.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="p-4 bg-primary-foreground dark:bg-secondary-foreground rounded-lg border">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Appointment Details
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">
                            {new Date(
                              formData.preferredDate
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">
                            {formData.preferredTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Dentist:
                          </span>
                          <span className="font-medium">
                            {selectedDentist?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-4 bg-primary-foreground dark:bg-secondary-foreground rounded-lg border">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">
                            {formData.contactNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-4 bg-primary-foreground dark:bg-secondary-foreground rounded-lg border">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₱{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (12%):</span>
                          <span>₱{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span>₱{totalDue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4 pt-4">
                    <Field>
                      <FieldLabel>
                        Special Requests or Notes (Optional)
                      </FieldLabel>
                      <FieldContent>
                        <Textarea
                          value={formData.specialRequests}
                          onChange={(e) =>
                            handleInputChange("specialRequests", e.target.value)
                          }
                          placeholder="Any special requirements or concerns?"
                          rows={3}
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.specialRequests.length}/500
                        </p>
                      </FieldContent>
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Insurance Provider (Optional)</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <FileText className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              value={formData.insuranceProvider}
                              onChange={(e) =>
                                handleInputChange(
                                  "insuranceProvider",
                                  e.target.value
                                )
                              }
                              placeholder="Company name"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Policy Number (Optional)</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              value={formData.insurancePolicyNumber}
                              onChange={(e) =>
                                handleInputChange(
                                  "insurancePolicyNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Policy #"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Emergency Contact Name</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <User className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              value={formData.emergencyContactName}
                              onChange={(e) =>
                                handleInputChange(
                                  "emergencyContactName",
                                  e.target.value
                                )
                              }
                              placeholder="Full name"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Emergency Contact Phone</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              type="tel"
                              value={formData.emergencyContactPhone}
                              onChange={(e) =>
                                handleInputChange(
                                  "emergencyContactPhone",
                                  e.target.value
                                )
                              }
                              placeholder="+63 912 345 6789"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>

                    <label className="flex items-start gap-2 p-3 rounded-lg border cursor-pointer dark:bg-secondary-foreground transition-colors">
                      <Checkbox
                        checked={formData.smsReminders}
                        onCheckedChange={(checked) =>
                          handleInputChange("smsReminders", checked)
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          Send SMS Reminders
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Receive appointment reminders 24 hours before your
                          visit
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-2 p-3 rounded-lg border-2 bg-primary-foreground dark:bg-accent cursor-pointer">
                      <Checkbox
                        checked={formData.consentToTreatment}
                        onCheckedChange={(checked) =>
                          handleInputChange("consentToTreatment", checked)
                        }
                        className="mt-0.5"
                        required
                      />
                      <div>
                        <p className="font-medium text-sm">
                          Consent to Treatment{" "}
                          <span className="text-destructive">*</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          I consent to receive dental treatment and understand
                          payment is required at time of service.
                        </p>
                      </div>
                    </label>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Secure Payment:</strong> You&apos;ll be redirected
                      to Stripe for secure payment. Your appointment will be
                      confirmed after successful payment.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t-2 border-border">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    size="lg"
                    className="font-semibold shadow-sm hover:shadow-md transition-shadow border-2"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < STEP_CONFIG.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed || isSubmitting}
                    className="ml-auto font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed || isSubmitting}
                    className="ml-auto font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                )}
              </div>

              {!canProceed && currentStep === 0 && (
                <div
                  className="mt-4 p-3 bg-destructive/10 border border-destructive/30 text-center animate-in fade-in duration-300"
                  style={{
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <p className="text-sm font-semibold text-destructive">
                    Please select at least one service to continue
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <div
            className="flex items-center gap-2 px-4 py-2 bg-accent/50 border border-border shadow-sm"
            style={{
              borderRadius: "var(--radius-md)",
            }}
          >
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              HIPAA Compliant
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 bg-accent/50 border border-border shadow-sm"
            style={{
              borderRadius: "var(--radius-md)",
            }}
          >
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Secure Payment
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 bg-accent/50 border border-border shadow-sm"
            style={{
              borderRadius: "var(--radius-md)",
            }}
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              2 min to complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
