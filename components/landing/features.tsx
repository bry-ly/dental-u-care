"use client";

import {
  Calendar,
  Clock,
  CreditCard,
  Bell,
  UserCheck,
  Search,
} from "lucide-react";
import { ShimmeringText } from "@/components/ui/shimmering-text";

const Features = () => {
  const services = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Easy Online Booking",
      description:
        "Book your dental appointment online anytime, anywhere. Choose your preferred date, time slot, and specific dental service with real-time availability.",
      items: [
        "Real-time Availability",
        "Choose Date & Time",
        "Service Selection",
      ],
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Secure Patient Portal",
      description:
        "Create your secure account with email verification. Manage your profile, medical history, and view all your appointments in one dashboard.",
      items: ["Profile Management", "Medical History", "Appointment Overview"],
      gradient: "from-teal-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
      iconBg: "bg-gradient-to-br from-teal-500 to-cyan-500",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Smart Reminders",
      description:
        "Never miss an appointment with automatic email and SMS reminders. Stay informed about upcoming visits and important updates.",
      items: ["Email Notifications", "SMS Reminders", "Real-time Updates"],
      gradient: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Flexible Payments",
      description:
        "Pay consultation and booking fees conveniently online via credit card, e-wallet, or bank transfer. Secure and hassle-free transactions.",
      items: ["Multiple Payment Methods", "Secure Checkout", "Payment History"],
      gradient: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Appointment Management",
      description:
        "Full control over your appointments. View, reschedule, or cancel upcoming visits easily through your patient dashboard.",
      items: ["View Appointments", "Reschedule Anytime", "Easy Cancellation"],
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Find Your Dentist",
      description:
        "Search for dentists by specialty or service. View detailed profiles with qualifications, experience, and patient reviews to make informed decisions.",
      items: ["Dentist Profiles", "Read Reviews", "Compare Specialists"],
      gradient: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              <ShimmeringText 
                text="Features"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                shimmeringColor="rgb(147 51 234)"
                color="rgb(79 70 229)"
                duration={2}
              />
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
              Everything you need to manage your dental health journey. Book
              appointments, track your history, and connect with top dentists.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className={`${service.bgColor} space-y-6 rounded-xl border p-8 shadow-lg dark:shadow-xl dark:shadow-gray-900/50 transition-shadow duration-300 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/70`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${service.iconBg} text-white rounded-full p-3 shadow-lg`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
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

export { Features };
