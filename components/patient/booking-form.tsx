"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import { doctors } from "@/lib/types/doctor";
import { allServices, serviceCategories } from "@/lib/types/services-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface BookingFormProps {
  services?: Array<{
    id: string;
    name: string;
    price: string | number;
    duration: string | number;
    category: string;
    description?: string;
  }>;
}

export default function BookingForm({ services: propServices }: BookingFormProps = {}) {
  // Dialog state for service details
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const steps = [
    "Patient Info",
    "Appointment Details",
    "Services",
    "Payment"
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
  // Use prop services if provided, otherwise use default services
  const services = propServices && propServices.length > 0 
    ? propServices.map(service => ({
        ...service,
        price: typeof service.price === 'number' ? `₱${service.price.toLocaleString()}` : service.price,
        duration: typeof service.duration === 'string' ? parseInt(service.duration) : service.duration,
      }))
    : allServices;
  type ServiceSelection = { id: string; name: string; qty: number };
  const [formData, setFormData] = useState<{
    patientName: string;
    patientAddress: string;
    patientCity: string;
    preferredDate: string;
    preferredTime: string;
    contactNumber: string;
    email: string;
    doctorId: string;
    specialRequests: string;
    invoiceNumber: string;
    dueDate: string;
    paymentMethod: string;
    paymentStatus: string;
    services: ServiceSelection[];
  }>({
    patientName: "",
    patientAddress: "",
    patientCity: "",
    preferredDate: "",
    preferredTime: "",
    contactNumber: "",
    email: "",
    doctorId: "",
    specialRequests: "",
    invoiceNumber: "",
    dueDate: "",
    paymentMethod: "",
    paymentStatus: "pending",
    services: [],
  });

  // Find selected doctor
  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === formData.doctorId
  );

    // Clinic info (static, can be replaced with config)
    const clinicPhone = "(043) 756-1234";
    const clinicEmail = "info@dentalucare.com";
    const clinicAddress = "123 Smile Street, Lipa City, Batangas 4217";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (serviceId: string, qty: number) => {
    setFormData((prev) => {
      const existing = prev.services.find((s) => s.id === serviceId);
      let newServices;
      if (existing) {
        newServices = prev.services.map((s) =>
          s.id === serviceId ? { ...s, qty } : s
        );
      } else {
        const service = services.find((s) => s.id === serviceId);
        if (!service) return prev;
        newServices = [...prev.services, { id: serviceId, name: service.name, qty }];
      }
      return { ...prev, services: newServices };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare itemized services for invoice
    const itemizedServices = formData.services
      .filter((s) => s.qty > 0)
      .map((s) => {
        const service = services.find((svc) => svc.id === s.id);
        const price = service ? (typeof service.price === 'string' ? parseFloat(service.price.replace(/[^\d.]/g, '')) : service.price) : 0;
        const total = price * s.qty;
        return {
          description: service ? service.name : '',
          qty: s.qty,
          unitPrice: price,
          total,
        };
      });

    // Calculate totals
    const subtotal = itemizedServices.reduce((sum, s) => sum + s.total, 0);
    const tax = Math.round(subtotal * 0.12 * 100) / 100;
    const totalDue = subtotal + tax;

    // Prepare invoice data for email
    const invoiceEmailData = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      patientName: formData.patientName,
      patientAddress: formData.patientAddress,
      patientCity: formData.patientCity,
      patientPhone: formData.contactNumber,
      patientEmail: formData.email,
      bookingId: Math.random().toString(36).substring(2, 10),
      appointmentDate: formData.preferredDate,
      appointmentTime: formData.preferredTime,
      doctorName: selectedDoctor ? selectedDoctor.name : '',
      treatmentRoom: '',
      appointmentDuration: itemizedServices.map(s => `${s.description}: ${services.find(svc => svc.name === s.description)?.duration || ''} min`).join(', '),
      reasonForVisit: formData.specialRequests,
      pdfDownloadUrl: '#',
      paymentStatus: formData.paymentStatus,
      nextAppointmentDate: '',
      nextAppointmentTime: '',
      nextAppointmentPurpose: '',
      services: itemizedServices,
      subtotal,
      tax,
      totalDue,
    };

    // Prepare data for reminder email
    const reminderEmailData = {
      patientName: formData.patientName,
      appointmentDate: formData.preferredDate,
      appointmentTime: formData.preferredTime,
      doctorName: selectedDoctor ? selectedDoctor.name : '',
      treatmentType: itemizedServices.map(s => s.description).join(', '),
      duration: itemizedServices.map(s => `${s.description}: ${services.find(svc => svc.name === s.description)?.duration || ''} min`).join(', '),
      clinicPhone,
      clinicEmail,
      clinicAddress,
    };

    console.log("Form submitted:", formData);
    console.log("Invoice email data:", invoiceEmailData);
    console.log("Reminder email data:", reminderEmailData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xl">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex items-center justify-center mb-2">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Stethoscope className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-center text-blue-900 dark:text-blue-100">
              Book Your Appointment
            </CardTitle>
            <CardDescription className="text-center text-lg text-slate-700 dark:text-slate-300">
              Schedule your visit with our expert dental care team
            </CardDescription>
            {/* Progress Bar */}
            <div className="w-full mt-6 mb-2">
              <div className="h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-2 rounded bg-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                {steps.map((step, idx) => (
                  <span key={step} className={idx === currentStep ? "font-bold text-blue-700" : ""}>{step}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Tabs defaultValue={steps[currentStep]} value={steps[currentStep]}>
                <TabsList>
                  {steps.map((step, idx) => (
                    <TabsTrigger key={step} value={step} disabled={idx > currentStep} className="text-base px-4 py-2">
                      {step}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Name */}
                  <Field>
                    <FieldLabel>
                      Patient Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800"> 
                      <InputGroup>
                        <InputGroupAddon>
                          <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) =>
                            handleInputChange("patientName", e.target.value)
                          }
                          placeholder="Enter your full name"
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Patient Address */}
                  <Field>
                    <FieldLabel>
                      Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupInput
                          id="patientAddress"
                          value={formData.patientAddress}
                          onChange={(e) =>
                            handleInputChange("patientAddress", e.target.value)
                          }
                          placeholder="Enter your address"
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Patient City */}
                  <Field>
                    <FieldLabel>
                      City <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupInput
                          id="patientCity"
                          value={formData.patientCity}
                          onChange={(e) =>
                            handleInputChange("patientCity", e.target.value)
                          }
                          placeholder="Enter your city"
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Contact Number */}
                  <Field>
                    <FieldLabel>
                      Contact Number <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupAddon>
                          <Phone className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="contactNumber"
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e) =>
                            handleInputChange("contactNumber", e.target.value)
                          }
                          placeholder="Enter your phone number"
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Email Address */}
                  <Field>
                    <FieldLabel>
                      Email Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email address"
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>
              )}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preferred Doctor */}
                  <Field>
                    <FieldLabel>
                      Preferred Doctor <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <Select
                        value={formData.doctorId}
                        onValueChange={(value) =>
                          handleInputChange("doctorId", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your doctor" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{doctor.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {doctor.role}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                  {/* Preferred Date */}
                  <Field>
                    <FieldLabel>
                      Preferred Date <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupAddon>
                          <Calendar className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            handleInputChange("preferredDate", e.target.value)
                          }
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Preferred Time */}
                  <Field>
                    <FieldLabel>
                      Preferred Time <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent className="rounded-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-sm border border-slate-200 dark:border-slate-800">
                      <InputGroup>
                        <InputGroupAddon>
                          <Clock className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="preferredTime"
                          type="time"
                          value={formData.preferredTime}
                          onChange={(e) =>
                            handleInputChange("preferredTime", e.target.value)
                          }
                          required
                          className="rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <Field>
                    <FieldLabel>
                      Services <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Tabs defaultValue={serviceCategories[0].id} className="w-full">
                        <TabsList>
                          {serviceCategories.map((cat) => (
                            <TabsTrigger key={cat.id} value={cat.id}>
                              {cat.title}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {serviceCategories.map((cat) => (
                          <TabsContent key={cat.id} value={cat.id} className="mt-4">
                            <div className="space-y-4">
                              <RadioGroup
                                value={(() => {
                                  const selected = formData.services.find(s => cat.services.some(cs => cs.id === s.id));
                                  return selected ? selected.id : "";
                                })()}
                                onValueChange={serviceId => {
                                  // Remove any previous selection for this category
                                  setFormData(prev => {
                                    const filtered = prev.services.filter(s => !cat.services.some(cs => cs.id === s.id));
                                    const service = cat.services.find(svc => svc.id === serviceId);
                                    if (!service) return prev;
                                    return {
                                      ...prev,
                                      services: [...filtered, { id: serviceId, name: service.name, qty: 1 }],
                                    };
                                  });
                                }}
                                className="space-y-4"
                              >
                                {cat.services.map((service) => {
                                  const selected = formData.services.find((s) => s.id === service.id);
                                  return (
                                    <label key={service.id} className="flex items-center gap-2 p-3 rounded border bg-muted/30 cursor-pointer">
                                      <RadioGroupItem value={service.id} className="shrink-0" />
                                      <span className="font-medium text-blue-900 dark:text-blue-100">{service.name}</span>
                                      <div className="flex-1 flex flex-col">
                                        <button
                                          type="button"
                                          className="text-xs text-blue-700 underline mb-1 self-start"
                                          onClick={e => { e.preventDefault(); setOpenDialogId(service.id); }}
                                        >
                                          View Details
                                        </button>
                                      </div>
                                      <span className="text-base font-bold text-blue-600 dark:text-blue-400">{service.price}</span>
                                      {/* Dialog for service details */}
                                      <Dialog open={openDialogId === service.id} onOpenChange={open => setOpenDialogId(open ? service.id : null)}>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>{service.name}</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-2">
                                            <div><strong>Description:</strong> {service.description}</div>
                                            <div><strong>Duration:</strong> ~{service.duration} min</div>
                                            <div><strong>Category:</strong> {service.category}</div>
                                            <div><strong>Price:</strong> <span className="font-bold text-blue-600">{service.price}</span></div>
                                          </div>
                                          <DialogFooter>
                                            <Button onClick={() => setOpenDialogId(null)}>Close</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </label>
                                  );
                                })}
                              </RadioGroup>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </FieldContent>
                  </Field>
                  {/* Service Details Card for all selected services */}
                  {formData.services.filter(s => s.qty > 0).length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900 mt-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Selected Services</h4>
                      <div className="space-y-2">
                        {formData.services.filter(s => s.qty > 0).map((s) => {
                          const service = services.find(svc => svc.id === s.id);
                          return (
                            <div key={s.id} className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{service?.name}</span>
                                <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">{service?.description}</span>
                                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">Duration: ~{service?.duration} min</span>
                                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">Category: {service?.category}</span>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                  {service?.price}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invoice Number */}
                  <Field>
                    <FieldLabel>
                      Invoice Number
                    </FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          id="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={(e) =>
                            handleInputChange("invoiceNumber", e.target.value)
                          }
                          placeholder="Auto-generated or manual"
                          className="border border-gray-300 dark:border-gray-700 rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Due Date */}
                  <Field>
                    <FieldLabel>
                      Due Date
                    </FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                          }
                          className="border border-gray-300 dark:border-gray-700 rounded"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                  {/* Payment Method */}
                  <Field>
                    <FieldLabel>
                      Payment Method
                    </FieldLabel>
                    <FieldContent>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                          handleInputChange("paymentMethod", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="e_wallet">E-Wallet</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                  {/* Payment Status */}
                  <Field>
                    <FieldLabel>
                      Payment Status
                    </FieldLabel>
                    <FieldContent>
                      <Select
                        value={formData.paymentStatus}
                        onValueChange={(value) =>
                          handleInputChange("paymentStatus", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </div>
              )}
              {/* Special Requests - Full Width (always visible) */}
              <Field className="mt-6">
                <FieldLabel>
                  Special Requests or Notes
                </FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <MessageSquare className="h-4 w-4" />
                    </InputGroupAddon>
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
                  </InputGroup>
                </FieldContent>
              </Field>
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="md:px-12">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
