"use client";

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
import { Badge } from "@/components/ui/badge";

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

// Optimized Step Configuration
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

export default function BookingFormOptimized({
  services: propServices = [],
  dentists: propDentists = [],
  patientId,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  // Auto-save to localStorage
  const STORAGE_KEY = `booking-form-${patientId}`;

  const services = useMemo(
    () =>
      propServices && propServices.length > 0
        ? propServices.map((service) => ({
            ...service,
            // Keep price as-is (string or number) - will be parsed later
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
    // Services & Appointment
    services: ServiceSelection[];
    preferredDate: string;
    preferredTime: string;
    dentistId: string;

    // Personal Info
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

    // Medical History (Conditional)
    medicalConditions: string[];
    otherConditions: string;
    currentMedications: string[];
    otherMedications: string;
    allergies: string;
    lastDentalVisit: string;
    dentalHistory: string[];
    hasMedicalUpdates: string;

    // Additional
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

  // Load saved form data on mount
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

  // Auto-save form data
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, STORAGE_KEY]);

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

  // Helper function to parse price from string or number (e.g., "₱35,000 – ₱80,000+" -> 35000)
  const parsePrice = (price: string | number): number => {
    if (!price) return 0;

    // If it's already a number, return it
    if (typeof price === "number") return price;

    // Handle "Contact for pricing" or similar
    if (price.toLowerCase().includes("contact")) return 0;

    // Extract first number from price string (e.g., "₱1,500 – ₱3,000" -> 1500)
    const match = price.match(/₱?([\d,]+)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
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

  // Validation for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Services
        return formData.services.filter((s) => s.qty > 0).length > 0;
      case 1: // Date & Time
        return !!(
          formData.preferredDate &&
          formData.preferredTime &&
          formData.dentistId
        );
      case 2: // Personal Info
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.contactNumber &&
          formData.dateOfBirth &&
          formData.gender
        );
      case 3: // Medical History (optional, always valid)
        return true;
      case 4: // Review
        return formData.consentToTreatment;
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (canProceed && currentStep < STEP_CONFIG.length - 1) {
      // Skip medical history if not needed
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
      // Skip medical history when going back
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

      // Clear saved form data on successful submission
      localStorage.removeItem(STORAGE_KEY);

      // Show success message with toast
      toast.success(
        data.message ||
          "Appointment booked successfully! Check your email for confirmation.",
        {
          description: "You will be redirected to your appointments page.",
          duration: 3000,
        }
      );

      // Redirect to appointments page after a short delay
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

  const progressPercent = ((currentStep + 1) / STEP_CONFIG.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-blue-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <CardHeader className="space-y-4 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-center mb-2">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center">
              Book Your Appointment
            </CardTitle>
            <CardDescription className="text-center text-lg text-blue-100">
              Complete in just a few minutes
            </CardDescription>

            {/* Progress Bar */}
            <div className="w-full mt-6">
              <div className="h-3 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-3 rounded-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Step Indicators - Desktop */}
              <div className="hidden md:flex justify-between mt-4 gap-2">
                {STEP_CONFIG.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2",
                          isActive &&
                            "bg-white text-blue-600 scale-110 shadow-lg",
                          isCompleted && "bg-white/80 text-blue-600",
                          !isActive &&
                            !isCompleted &&
                            "bg-white/20 text-white/60"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium text-center transition-all duration-300",
                          isActive && "text-white font-bold",
                          isCompleted && "text-blue-100",
                          !isActive && !isCompleted && "text-blue-200/60"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Indicators - Mobile */}
              <div className="flex md:hidden justify-center mt-4">
                <div className="flex items-center gap-2">
                  {STEP_CONFIG.map((step, idx) => (
                    <div
                      key={step.id}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        idx === currentStep && "w-8 bg-white",
                        idx < currentStep && "w-2 bg-white/80",
                        idx > currentStep && "w-2 bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit}>
              {/* Step 0: Service Selection */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Select Your Service
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Choose the dental service you need
                    </p>
                  </div>

                  {services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {services.map((service) => {
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
                              "relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200",
                              "hover:shadow-lg hover:-translate-y-0.5",
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md"
                                : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                                  isSelected
                                    ? "bg-blue-600"
                                    : "bg-slate-100 dark:bg-slate-800"
                                )}
                              >
                                <Stethoscope
                                  className={cn(
                                    "h-6 w-6",
                                    isSelected
                                      ? "text-white"
                                      : "text-slate-600 dark:text-slate-400"
                                  )}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                    {service.name}
                                  </h4>
                                  <Badge
                                    variant="secondary"
                                    className="flex-shrink-0"
                                  >
                                    {service.category}
                                  </Badge>
                                </div>

                                {service.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    {service.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                      <Clock className="h-4 w-4" />
                                      {service.duration} min
                                    </span>
                                  </div>
                                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
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
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No services available. Please contact the clinic.
                      </AlertDescription>
                    </Alert>
                  )}

                  {formData.services.filter((s) => s.qty > 0).length > 0 && (
                    <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          Selected Service
                        </h4>
                      </div>
                      {formData.services
                        .filter((s) => s.qty > 0)
                        .map((s) => {
                          const service = services.find(
                            (svc) => svc.id === s.id
                          );
                          return (
                            <div
                              key={s.id}
                              className="flex justify-between items-center text-blue-900 dark:text-blue-100"
                            >
                              <span className="font-medium">
                                {service?.name}
                              </span>
                              <span className="font-bold">
                                ₱{service?.price.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Date & Time Selection */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Choose Date & Time
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Select your preferred appointment schedule
                    </p>
                  </div>

                  <Field>
                    <FieldLabel>
                      Preferred Dentist <span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <RadioGroup
                        value={formData.dentistId}
                        onValueChange={(value) =>
                          handleInputChange("dentistId", value)
                        }
                        className="space-y-3"
                      >
                        {dentists.map((dentist) => (
                          <label
                            key={dentist.id}
                            className={cn(
                              "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                              "hover:shadow-md hover:border-blue-300",
                              formData.dentistId === dentist.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                : "border-slate-200 dark:border-slate-700"
                            )}
                          >
                            <RadioGroupItem
                              value={dentist.id}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {dentist.name}
                              </p>
                              {dentist.specialization && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
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
                        Preferred Date <span className="text-red-500">*</span>
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
                            className="text-base"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Preferred Time <span className="text-red-500">*</span>
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
                            className="text-base"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      We&apos;ll confirm your appointment time based on
                      availability
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Your Information
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Help us serve you better
                    </p>
                  </div>

                  {/* New vs Returning Patient */}
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
                          <span>Yes, first visit</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="no" />
                          <span>No, returning patient</span>
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
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem value="no" />
                            <span>No changes</span>
                          </label>
                        </RadioGroup>
                      </FieldContent>
                    </Field>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                      <FieldLabel>
                        First Name <span className="text-red-500">*</span>
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
                            placeholder="John"
                            required
                            autoComplete="given-name"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Last Name <span className="text-red-500">*</span>
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
                            placeholder="Doe"
                            required
                            autoComplete="family-name"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Date of Birth <span className="text-red-500">*</span>
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
                        Gender <span className="text-red-500">*</span>
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
                        Email Address <span className="text-red-500">*</span>
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
                            placeholder="john@example.com"
                            required
                            autoComplete="email"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>
                        Phone Number <span className="text-red-500">*</span>
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
                          <span>Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="sms" />
                          <span>SMS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="call" />
                          <span>Phone Call</span>
                        </label>
                      </RadioGroup>
                    </FieldContent>
                  </Field>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-slate-600" />
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
                              placeholder="123 Main Street"
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
                                placeholder="Manila"
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
                                placeholder="1000"
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

              {/* Step 3: Medical History (Conditional) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Medical History
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Help us provide safe and effective treatment
                    </p>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
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
                            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
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
                            <span className="text-sm font-medium">
                              {condition}
                            </span>
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
                            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <Checkbox
                              checked={formData.currentMedications.includes(
                                med
                              )}
                              onCheckedChange={() =>
                                handleArrayToggle("currentMedications", med)
                              }
                            />
                            <span className="text-sm font-medium">{med}</span>
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
                            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <Checkbox
                              checked={formData.dentalHistory.includes(history)}
                              onCheckedChange={() =>
                                handleArrayToggle("dentalHistory", history)
                              }
                            />
                            <span className="text-sm font-medium">
                              {history}
                            </span>
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
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Review & Confirm
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                      Please review your appointment details
                    </p>
                  </div>

                  {/* Appointment Summary */}
                  <div className="space-y-4">
                    {/* Services */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        Selected Services
                      </h4>
                      <div className="space-y-3">
                        {itemizedServices.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
                          >
                            <div>
                              <p className="font-medium">{item.description}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                ₱{item.unitPrice.toLocaleString()} × {item.qty}
                              </p>
                            </div>
                            <p className="font-bold">
                              ₱{item.total.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Appointment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Date:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              formData.preferredDate
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Time:
                          </span>
                          <span className="font-medium">
                            {formData.preferredTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Dentist:
                          </span>
                          <span className="font-medium">
                            {selectedDentist?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Patient Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Name:
                          </span>
                          <span className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Email:
                          </span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Phone:
                          </span>
                          <span className="font-medium">
                            {formData.contactNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-900">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        Payment Summary
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-slate-700 dark:text-slate-300">
                          <span>Subtotal:</span>
                          <span>₱{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-700 dark:text-slate-300">
                          <span>Tax (12%):</span>
                          <span>₱{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t-2 border-blue-300 dark:border-blue-800 pt-3 mt-3">
                          <span>Total:</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            ₱{totalDue.toLocaleString()}
                          </span>
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
                          placeholder="Any special requirements or concerns we should know about?"
                          rows={3}
                          maxLength={500}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {formData.specialRequests.length}/500 characters
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

                    <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <Checkbox
                        checked={formData.smsReminders}
                        onCheckedChange={(checked) =>
                          handleInputChange("smsReminders", checked)
                        }
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">Send SMS Reminders</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive appointment reminders via SMS 24 hours before
                          your visit
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 cursor-pointer">
                      <Checkbox
                        checked={formData.consentToTreatment}
                        onCheckedChange={(checked) =>
                          handleInputChange("consentToTreatment", checked)
                        }
                        className="mt-1"
                        required
                      />
                      <div>
                        <p className="font-medium">
                          Consent to Treatment{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          I consent to receive dental treatment and understand
                          that payment is required at the time of service. I
                          have provided accurate medical information to the best
                          of my knowledge.
                        </p>
                      </div>
                    </label>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>Secure Payment:</strong> You&apos;ll be redirected
                      to Stripe&apos;s secure payment page to complete your
                      booking. Your appointment will be confirmed after
                      successful payment.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
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
                    className="flex items-center gap-2 ml-auto"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed || isSubmitting}
                    className="flex items-center gap-2 ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                )}
              </div>

              {!canProceed && currentStep === 0 && (
                <p className="text-sm text-center text-red-600 dark:text-red-400 mt-2">
                  Please select at least one service to continue
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>2 min to complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
