"use client";

import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Bell, 
  UserCheck,
  Search
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Easy Online Booking",
      description:
        "Book your dental appointment online anytime, anywhere. Choose your preferred date, time slot, and specific dental service with real-time availability.",
      items: ["Real-time Availability", "Choose Date & Time", "Service Selection"],
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Secure Patient Portal",
      description:
        "Create your secure account with captcha verification. Manage your profile, medical history, and view all your appointments in one dashboard.",
      items: ["Profile Management", "Medical History", "Appointment Overview"],
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Smart Reminders",
      description:
        "Never miss an appointment with automatic email and SMS reminders. Stay informed about upcoming visits and important updates.",
      items: ["Email Notifications", "SMS Reminders", "Real-time Updates"],
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Flexible Payments",
      description:
        "Pay consultation and booking fees conveniently online via credit card, e-wallet, or bank transfer. Secure and hassle-free transactions.",
      items: ["Multiple Payment Methods", "Secure Checkout", "Payment History"],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Appointment Management",
      description:
        "Full control over your appointments. View, reschedule, or cancel upcoming visits easily through your patient dashboard.",
      items: ["View Appointments", "Reschedule Anytime", "Easy Cancellation"],
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find Your Dentist",
      description:
        "Search for dentists by specialty or service. View detailed profiles with qualifications, experience, and patient reviews to make informed decisions.",
      items: ["Dentist Profiles", "Read Reviews", "Compare Specialists"],
    },
  ];

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
              Everything you need to manage your dental health journey. Book appointments, track your history, and connect with top dentists.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="border-border space-y-6 rounded-lg border p-8 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary rounded-full p-3">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Services };
