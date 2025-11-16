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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { zipcodes } from "ph-zipcode-lookup";
import * as phAddress from "select-philippines-address";

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

const patientInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().min(1, "Phone number is required"),
  preferredContact: z.enum(["email", "sms", "call"]),
  address: z.string().optional(),
  region: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  barangay: z.string().optional(),
  postalCode: z.string().optional(),
});

type PatientInfoFormValues = z.infer<typeof patientInfoSchema>;

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
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoadingBookedDates, setIsLoadingBookedDates] = useState(false);
  const [postalCodeOpen, setPostalCodeOpen] = useState(false);
  const [regions, setRegions] = useState<Array<{ id: number; region_name: string; region_code: string }>>([]);
  const [provinces, setProvinces] = useState<Array<{ id: number; prov_name: string; prov_code: string; region_code: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: number; city_name: string; city_code: string; prov_code: string }>>([]);
  const [barangays, setBarangays] = useState<Array<{ id: number; brgy_name: string; brgy_code: string; city_code: string }>>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);

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

  // Patient Info Form with react-hook-form
  const patientInfoForm = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      email: "",
      contactNumber: "",
      preferredContact: "email",
      address: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      postalCode: "",
    },
  });

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

  // Combined date-time picker helpers
  const getDateTimeValue = (): Date | undefined => {
    if (formData.preferredDate && formData.preferredTime) {
      const date = new Date(formData.preferredDate);
      const [hours, minutes] = formData.preferredTime.split(":");
      date.setHours(parseInt(hours, 10) || 0);
      date.setMinutes(parseInt(minutes, 10) || 0);
      return date;
    }
    return undefined;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const currentTime = formData.preferredTime || "09:00";
      handleInputChange("preferredDate", dateStr);
      
      // Preserve time when date changes
      if (!formData.preferredTime) {
        handleInputChange("preferredTime", currentTime);
      }
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = getDateTimeValue() || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      const currentHour = newDate.getHours();
      // Convert 12-hour format to 24-hour format
      if (currentHour >= 12) {
        // Currently PM, set PM hour
        newDate.setHours(hour === 12 ? 12 : hour + 12);
      } else {
        // Currently AM, set AM hour
        newDate.setHours(hour === 12 ? 0 : hour);
      }
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    const dateStr = format(newDate, "yyyy-MM-dd");
    const timeStr = `${newDate.getHours().toString().padStart(2, "0")}:${newDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    handleInputChange("preferredDate", dateStr);
    handleInputChange("preferredTime", timeStr);
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

  const validateStep = async (step: number): Promise<boolean> => {
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
        // Use react-hook-form validation for patient info
        const isValid = await patientInfoForm.trigger();
        if (isValid) {
          // Sync validated values back to formData
          const values = patientInfoForm.getValues();
          Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined) {
              handleInputChange(key, value as string);
            }
          });
        }
        return isValid;
      case 3:
        return true;
      case 4:
        return formData.consentToTreatment;
      default:
        return false;
    }
  };

  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    const checkValidation = async () => {
      if (currentStep === 2) {
        const isValid = await patientInfoForm.trigger();
        setCanProceed(isValid);
      } else {
        const isValid = await validateStep(currentStep);
        setCanProceed(isValid);
      }
    };
    checkValidation();
  }, [currentStep, formData, patientInfoForm]);

  const handleNext = async () => {
    if (currentStep === 2) {
      const isValid = await patientInfoForm.trigger();
      if (!isValid) {
        return;
      }
      // Sync validated values
      const values = patientInfoForm.getValues();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          handleInputChange(key, value as string);
        }
      });
    }

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
        // Update form when loading from localStorage
        patientInfoForm.reset({
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          dateOfBirth: parsed.dateOfBirth || "",
          gender: parsed.gender || undefined,
          email: parsed.email || "",
          contactNumber: parsed.contactNumber || "",
          preferredContact: parsed.preferredContact || "email",
          address: parsed.address || "",
          city: parsed.city || "",
          postalCode: parsed.postalCode || "",
        });
      } catch (e) {
        console.error("Failed to load saved form data", e);
      }
    }
  }, [STORAGE_KEY]);

  // Sync form values with formData state when form changes
  useEffect(() => {
    const subscription = patientInfoForm.watch((value, { name }) => {
      if (name && currentStep === 2) {
        const fieldValue = value[name as keyof typeof value];
        if (fieldValue !== undefined) {
          handleInputChange(name, fieldValue as string);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [patientInfoForm.watch, currentStep]);

  // Update form when formData changes externally
  useEffect(() => {
    if (currentStep === 2) {
      patientInfoForm.reset({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female" | "other" | undefined,
        email: formData.email,
        contactNumber: formData.contactNumber,
        preferredContact: formData.preferredContact as "email" | "sms" | "call",
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      });
    }
  }, [currentStep]);

  // Fetch booked dates when dentist is selected
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!formData.dentistId) {
        setBookedDates([]);
        return;
      }

      setIsLoadingBookedDates(true);
      try {
        const response = await fetch(
          `/api/appointments?userId=${formData.dentistId}&role=dentist`
        );
        if (response.ok) {
          const appointments = await response.json();
          // Extract unique dates from appointments (pending or confirmed status)
          const booked = appointments
            .filter(
              (apt: { status: string; date: string }) =>
                apt.status === "pending" || apt.status === "confirmed"
            )
            .map((apt: { date: string }) => {
              const date = new Date(apt.date);
              // Normalize to midnight for comparison
              date.setHours(0, 0, 0, 0);
              return date;
            });

          // Remove duplicates
          const uniqueTimestamps: number[] = Array.from(
            new Set(booked.map((d: Date) => d.getTime()))
          );
          const uniqueBookedDates = uniqueTimestamps.map(
            (timestamp: number) => new Date(timestamp)
          );

          setBookedDates(uniqueBookedDates);
        }
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      } finally {
        setIsLoadingBookedDates(false);
      }
    };

    if (formData.dentistId && currentStep === 1) {
      fetchBookedDates();
    }
  }, [formData.dentistId, currentStep]);

  // Load regions when on address step
  useEffect(() => {
    const loadRegions = async () => {
      if (currentStep === 2 && regions.length === 0) {
        setIsLoadingRegions(true);
        try {
          const regionsData = await phAddress.regions();
          setRegions(regionsData);
        } catch (error) {
          console.error("Failed to load regions:", error);
        } finally {
          setIsLoadingRegions(false);
        }
      }
    };
    loadRegions();
  }, [currentStep, regions.length]);

  // Load provinces when region is selected
  useEffect(() => {
    const loadProvinces = async () => {
      const selectedRegion = patientInfoForm.watch("region");
      if (selectedRegion && currentStep === 2) {
        setIsLoadingProvinces(true);
        try {
          const allProvinces = await phAddress.provinces();
          const filteredProvinces = allProvinces.filter(
            (p: { region_code: string }) => p.region_code === selectedRegion
          );
          setProvinces(filteredProvinces);
          // Reset province, city, and barangay when region changes
          patientInfoForm.setValue("province", "");
          patientInfoForm.setValue("city", "");
          patientInfoForm.setValue("barangay", "");
          setCities([]);
          setBarangays([]);
        } catch (error) {
          console.error("Failed to load provinces:", error);
        } finally {
          setIsLoadingProvinces(false);
        }
      } else if (!selectedRegion) {
        setProvinces([]);
        setCities([]);
        setBarangays([]);
      }
    };
    loadProvinces();
  }, [patientInfoForm.watch("region"), currentStep]);

  // Load cities when province is selected
  useEffect(() => {
    const loadCities = async () => {
      const selectedProvince = patientInfoForm.watch("province");
      if (selectedProvince && currentStep === 2) {
        setIsLoadingCities(true);
        try {
          const allCities = await phAddress.cities();
          const filteredCities = allCities.filter(
            (c: { prov_code: string }) => c.prov_code === selectedProvince
          );
          setCities(filteredCities);
          // Reset city and barangay when province changes
          patientInfoForm.setValue("city", "");
          patientInfoForm.setValue("barangay", "");
          setBarangays([]);
        } catch (error) {
          console.error("Failed to load cities:", error);
        } finally {
          setIsLoadingCities(false);
        }
      } else if (!selectedProvince) {
        setCities([]);
        setBarangays([]);
      }
    };
    loadCities();
  }, [patientInfoForm.watch("province"), currentStep]);

  // Load barangays when city is selected
  useEffect(() => {
    const loadBarangays = async () => {
      const selectedCity = patientInfoForm.watch("city");
      if (selectedCity && currentStep === 2) {
        setIsLoadingBarangays(true);
        try {
          const allBarangays = await phAddress.barangays();
          const filteredBarangays = allBarangays.filter(
            (b: { city_code?: string; brgy_code?: string }) => b.city_code === selectedCity
          );
          setBarangays(filteredBarangays);
          // Reset barangay when city changes
          patientInfoForm.setValue("barangay", "");
        } catch (error) {
          console.error("Failed to load barangays:", error);
        } finally {
          setIsLoadingBarangays(false);
        }
      } else if (!selectedCity) {
        setBarangays([]);
      }
    };
    loadBarangays();
  }, [patientInfoForm.watch("city"), currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, STORAGE_KEY]);

  const progressPercent = ((currentStep + 1) / STEP_CONFIG.length) * 100;

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <Card className="border shadow-sm">
            <CardHeader className="space-y-4 pb-4 border-b px-6">
              <div className="space-y-4">
                <div className="text-center">
                  <CardTitle className="text-xl font-semibold">
                    Book Your Appointment
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {STEP_CONFIG[currentStep]?.description}
                  </CardDescription>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Step Indicators - Simplified */}
                  <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-6">
                    {STEP_CONFIG.map((step, idx) => {
                      const isActive = idx === currentStep;
                      const isCompleted = idx < currentStep;

                      return (
                        <div
                          key={step.id}
                          className={cn(
                            "h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full flex items-center justify-center text-xs md:text-sm lg:text-base font-semibold transition-all shrink-0",
                            isActive &&
                              "bg-primary text-primary-foreground shadow-md",
                            isCompleted &&
                              "bg-primary/20 text-primary border-2 border-primary/50",
                            !isActive &&
                              !isCompleted &&
                              "bg-muted text-muted-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                          ) : (
                            <span className="leading-none select-none">{idx + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardHeader>

          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit}>
              {/* Step 0: Service Selection */}
              {currentStep === 0 && (
                <div className="space-y-6">

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
                                    <button
                                      key={service.id}
                                      type="button"
                                      onClick={() =>
                                        handleServiceChange(
                                          service.id,
                                          isSelected ? 0 : 1
                                        )
                                      }
                                      className={cn(
                                        "relative w-full p-4 rounded-lg border text-left transition-all hover:shadow-sm",
                                        isSelected
                                          ? "border-primary bg-primary/5 shadow-sm"
                                          : "border-border bg-card hover:border-primary/50"
                                      )}
                                    >
                                      {isSelected && (
                                        <div className="absolute top-3 right-3">
                                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex items-start gap-4 pr-8">
                                        <div
                                          className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                            isSelected
                                              ? "bg-primary text-primary-foreground"
                                              : "bg-muted text-muted-foreground"
                                          )}
                                        >
                                          <Stethoscope className="h-6 w-6" />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                          <h4 className="font-semibold text-base">
                                            {service.name}
                                          </h4>

                                          {service.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                              {service.description}
                                            </p>
                                          )}

                                          <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                              <Clock className="h-3.5 w-3.5" />
                                              {service.duration} min
                                            </span>
                                            <span className="font-bold text-primary">
                                              {typeof service.price === "number"
                                                ? `₱${service.price.toLocaleString()}`
                                                : service.price}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </button>
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
                    <div className="mt-6 p-4 bg-muted/50 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">
                          Selected Services ({formData.services.filter((s) => s.qty > 0).length})
                        </h4>
                      </div>
                      <div className="space-y-1.5">
                        {formData.services
                          .filter((s) => s.qty > 0)
                          .map((s) => {
                            const service = services.find(
                              (svc) => svc.id === s.id
                            );
                            return (
                              <div
                                key={s.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {service?.name}
                                </span>
                                <span className="font-semibold text-primary">
                                  {typeof service?.price === "number"
                                    ? `₱${service.price.toLocaleString()}`
                                    : service?.price}
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
                <div className="space-y-6">

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
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        {dentists.map((dentist) => (
                          <label
                            key={dentist.id}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                              formData.dentistId === dentist.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <RadioGroupItem
                              value={dentist.id}
                              className="flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                Dr. {dentist.name}
                              </p>
                              {dentist.specialization && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {dentist.specialization}
                                </p>
                              )}
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Preferred Date & Time{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !getDateTimeValue() && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {getDateTimeValue() ? (
                              format(
                                getDateTimeValue()!,
                                "PPP hh:mm aa"
                              )
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="sm:flex">
                            <CalendarComponent
                              mode="single"
                              selected={
                                formData.preferredDate
                                  ? new Date(formData.preferredDate)
                                  : undefined
                              }
                              onSelect={handleDateSelect}
                              disabled={(date) => {
                                const dateAtMidnight = new Date(date);
                                dateAtMidnight.setHours(0, 0, 0, 0);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                
                                // Disable past dates
                                if (dateAtMidnight < today) {
                                  return true;
                                }
                                
                                // Disable booked dates if dentist is selected
                                if (formData.dentistId && bookedDates.length > 0) {
                                  return bookedDates.some((bookedDate) => {
                                    const bookedAtMidnight = new Date(bookedDate);
                                    bookedAtMidnight.setHours(0, 0, 0, 0);
                                    return (
                                      dateAtMidnight.getTime() ===
                                      bookedAtMidnight.getTime()
                                    );
                                  });
                                }
                                
                                return false;
                              }}
                              modifiers={{
                                booked: bookedDates,
                              }}
                              modifiersClassNames={{
                                booked: "[&>button]:line-through opacity-60",
                              }}
                              defaultMonth={
                                formData.preferredDate
                                  ? new Date(formData.preferredDate)
                                  : new Date()
                              }
                              initialFocus
                              className="rounded-lg border shadow-sm"
                            />
                            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                  {Array.from({ length: 12 }, (_, i) => i + 1)
                                    .reverse()
                                    .map((hour) => {
                                      const dateValue = getDateTimeValue();
                                      const displayHour = dateValue?.getHours() || 0;
                                      const isSelected =
                                        dateValue &&
                                        displayHour % 12 === (hour % 12 || 12);
                                      return (
                                        <Button
                                          key={hour}
                                          type="button"
                                          size="icon"
                                          variant={isSelected ? "default" : "ghost"}
                                          className="sm:w-full shrink-0 aspect-square"
                                          onClick={() =>
                                            handleTimeChange("hour", hour.toString())
                                          }
                                        >
                                          {hour}
                                        </Button>
                                      );
                                    })}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                  {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                    (minute) => {
                                      const dateValue = getDateTimeValue();
                                      const isSelected =
                                        dateValue?.getMinutes() === minute;
                                      return (
                                        <Button
                                          key={minute}
                                          type="button"
                                          size="icon"
                                          variant={
                                            isSelected ? "default" : "ghost"
                                          }
                                          className="sm:w-full shrink-0 aspect-square"
                                          onClick={() =>
                                            handleTimeChange(
                                              "minute",
                                              minute.toString()
                                            )
                                          }
                                        >
                                          {minute.toString().padStart(2, "0")}
                                        </Button>
                                      );
                                    }
                                  )}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                              <ScrollArea className="">
                                <div className="flex sm:flex-col p-2">
                                  {["AM", "PM"].map((ampm) => {
                                    const dateValue = getDateTimeValue();
                                    const hours = dateValue?.getHours() || 0;
                                    const isSelected =
                                      (ampm === "AM" && hours < 12) ||
                                      (ampm === "PM" && hours >= 12);
                                    return (
                                      <Button
                                        key={ampm}
                                        type="button"
                                        size="icon"
                                        variant={isSelected ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                          handleTimeChange("ampm", ampm)
                                        }
                                      >
                                        {ampm}
                                      </Button>
                                    );
                                  })}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FieldContent>
                  </Field>

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
                <Form {...patientInfoForm}>
                  <div className="space-y-6">
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
                      <FormField
                        control={patientInfoForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              First Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dental"
                                autoComplete="given-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientInfoForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Last Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Care"
                                autoComplete="family-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientInfoForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Date of Birth{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                autoComplete="bday"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientInfoForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Gender <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3"
                              >
                                <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50">
                                  <RadioGroupItem value="male" />
                                  <span className="text-sm font-medium">Male</span>
                                </label>
                                <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50">
                                  <RadioGroupItem value="female" />
                                  <span className="text-sm font-medium">Female</span>
                                </label>
                                <label className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 col-span-2 md:col-span-1">
                                  <RadioGroupItem value="other" />
                                  <span className="text-sm font-medium">Other</span>
                                </label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientInfoForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="@example.com"
                                autoComplete="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={patientInfoForm.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+63 912 345 6789"
                                autoComplete="tel"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={patientInfoForm.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address (Optional)
                      </h4>

                      <div className="space-y-4">
                        <FormField
                          control={patientInfoForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <InputGroup>
                                  <InputGroupInput
                                    placeholder="Baltan Street"
                                    autoComplete="street-address"
                                    {...field}
                                  />
                                </InputGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={patientInfoForm.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Region <span className="text-muted-foreground">(Optional)</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isLoadingRegions}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select region" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingRegions ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Loading regions...
                                        </div>
                                      ) : (
                                        regions.map((region) => (
                                          <SelectItem key={region.id} value={region.region_code}>
                                            {region.region_name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                          />

                          <FormField
                            control={patientInfoForm.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Province <span className="text-muted-foreground">(Optional)</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!patientInfoForm.watch("region") || isLoadingProvinces}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select province" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingProvinces ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Loading provinces...
                                        </div>
                                      ) : provinces.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Select a region first
                                        </div>
                                      ) : (
                                        provinces.map((province) => (
                                          <SelectItem key={province.id} value={province.prov_code}>
                                            {province.prov_name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={patientInfoForm.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    City/Municipality{" "}
                                    <span className="text-muted-foreground">(Optional)</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={
                                      !patientInfoForm.watch("province") || isLoadingCities
                                    }
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select city/municipality" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingCities ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Loading cities...
                                        </div>
                                      ) : cities.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Select a province first
                                        </div>
                                      ) : (
                                        cities.map((city) => (
                                          <SelectItem key={city.id} value={city.city_code}>
                                            {city.city_name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                          />

                          <FormField
                            control={patientInfoForm.control}
                            name="barangay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Barangay <span className="text-muted-foreground">(Optional)</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={
                                      !patientInfoForm.watch("city") || isLoadingBarangays
                                    }
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select barangay" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {isLoadingBarangays ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Loading barangays...
                                        </div>
                                      ) : barangays.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-muted-foreground">
                                          Select a city first
                                        </div>
                                      ) : (
                                        barangays.map((barangay) => (
                                          <SelectItem key={barangay.id} value={barangay.brgy_code || barangay.city_code || String(barangay.id)}>
                                            {barangay.brgy_name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                          />
                        </div>

                        <FormField
                          control={patientInfoForm.control}
                          name="postalCode"
                          render={({ field }) => {
                              const handleSearch = (searchValue: string) => {
                                if (!searchValue) return [];
                                
                                const results: Array<{ code: string; location: string }> = [];
                                
                                // Try to find by postal code
                                if (/^\d{4}$/.test(searchValue.trim())) {
                                  const location = zipcodes.findLocation(searchValue.trim());
                                  if (location) {
                                    results.push({
                                      code: searchValue.trim(),
                                      location,
                                    });
                                  }
                                }
                                
                                // Try to find by location name
                                const zipcode = zipcodes.findZipcode(searchValue);
                                if (zipcode) {
                                  const location = zipcodes.findLocation(zipcode);
                                  if (location) {
                                    results.push({
                                      code: zipcode,
                                      location,
                                    });
                                  }
                                }
                                
                                return results;
                              };

                              const searchResults = field.value
                                ? handleSearch(field.value)
                                : [];

                              const isFourDigitCode = field.value
                                ? /^\d{4}$/.test(field.value.trim())
                                : false;

                              const postalCodeRegex = /^\d{4}$/;

                              return (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Postal Code
                                  </FormLabel>
                                  <Popover
                                    open={postalCodeOpen}
                                    onOpenChange={setPostalCodeOpen}
                                  >
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            "w-full justify-between font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            <span>
                                              {field.value}
                                              {searchResults.length > 0 &&
                                                ` - ${searchResults[0].location}`}
                                            </span>
                                          ) : (
                                            <span>Search postal code or location</span>
                                          )}
                                          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-[var(--radix-popover-trigger-width)] p-0"
                                      align="start"
                                    >
                                      <Command>
                                        <CommandInput
                                          placeholder="Search by postal code (e.g., 5300) or location..."
                                          value={field.value || ""}
                                          onValueChange={(value) => {
                                            field.onChange(value);
                                            // If it's a 4-digit code, try to find location
                                            if (postalCodeRegex.test(value)) {
                                              const location = zipcodes.findLocation(value);
                                              if (location) {
                                                setPostalCodeOpen(false);
                                              }
                                            }
                                          }}
                                        />
                                        <CommandList>
                                          <CommandEmpty>
                                            No postal code found. Try typing a 4-digit code or
                                            location name.
                                          </CommandEmpty>
                                          {searchResults.length > 0 && (
                                            <CommandGroup heading="Results">
                                              {searchResults.map((result) => (
                                                <CommandItem
                                                  key={result.code}
                                                  value={result.code}
                                                  onSelect={() => {
                                                    field.onChange(result.code);
                                                    setPostalCodeOpen(false);
                                                  }}
                                                >
                                                  <div className="flex flex-col">
                                                    <span className="font-medium">
                                                      {result.code}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                      {result.location}
                                                    </span>
                                                  </div>
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          )}
                                          {field.value &&
                                            isFourDigitCode &&
                                            searchResults.length === 0 && (
                                              <CommandGroup>
                                                <CommandItem
                                                  value={field.value}
                                                  onSelect={() => {
                                                    setPostalCodeOpen(false);
                                                  }}
                                                >
                                                  Use postal code: {field.value}
                                                </CommandItem>
                                              </CommandGroup>
                                            )}
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                </Form>
              )}

              {/* Step 3: Medical History */}
              {currentStep === 3 && (
                <div className="space-y-6">

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
                <div className="space-y-6">

                  <div className="grid gap-4">
                    {/* Services */}
                    <div className="p-5 rounded-lg border bg-card">
                      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        Selected Services
                      </h4>
                      <div className="space-y-3">
                        {itemizedServices.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b last:border-0 text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ₱{item.unitPrice.toLocaleString()} × {item.qty}
                              </p>
                            </div>
                            <p className="font-semibold text-primary">
                              ₱{item.total.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="p-5 rounded-lg border bg-card">
                      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Appointment Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Date
                          </p>
                          <p className="font-medium">
                            {new Date(
                              formData.preferredDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Time
                          </p>
                          <p className="font-medium">{formData.preferredTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Dentist
                          </p>
                          <p className="font-medium">
                            Dr. {selectedDentist?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="p-5 rounded-lg border bg-card">
                      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Name
                          </p>
                          <p className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Email
                          </p>
                          <p className="font-medium truncate">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Phone
                          </p>
                          <p className="font-medium">{formData.contactNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-5 rounded-lg border-2 border-primary/20 bg-primary/5">
                      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>₱{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Tax (12%)</span>
                          <span>₱{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 mt-2 border-t">
                          <span>Total Due</span>
                          <span className="text-primary">
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
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    size="default"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
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
                    className="ml-auto"
                    size="default"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed || isSubmitting}
                    className="ml-auto"
                    size="default"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm & Book
                      </>
                    )}
                  </Button>
                )}
              </div>

              {!canProceed && currentStep === 0 && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                  <p className="text-sm font-medium text-destructive">
                    Please select at least one service to continue
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer Badges */}
      <div className="border-t bg-muted/30 py-3 shrink-0">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Secure & HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
