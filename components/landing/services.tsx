"use client";

import {
  Stethoscope,
  Sparkles,
  Brackets,
  Drill,
  Baby,
  ShieldAlert,
} from "lucide-react";
import { ShimmeringText } from "@/components/ui/shimmering-text";

const Services = () => {
  const services = [
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: "General Dentistry",
      description:
        "Comprehensive oral health care including routine checkups, professional cleanings, and preventive treatments to maintain your dental health.",
      items: [
        "Routine Checkups",
        "Professional Cleaning",
        "Cavity Fillings",
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Cosmetic Dentistry",
      description:
        "Transform your smile with our advanced cosmetic procedures. From teeth whitening to complete smile makeovers, we help you achieve the perfect smile.",
      items: ["Teeth Whitening", "Veneers", "Smile Makeover"],
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      icon: <Brackets className="h-6 w-6" />,
      title: "Orthodontics",
      description:
        "Straighten your teeth and correct bite issues with traditional braces or modern clear aligners for both children and adults.",
      items: ["Traditional Braces", "Clear Aligners", "Retainers"],
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      icon: <Drill className="h-6 w-6" />,
      title: "Restorative Care",
      description:
        "Restore damaged or missing teeth with dental implants, crowns, bridges, and root canal therapy using advanced techniques.",
      items: ["Dental Implants", "Crowns & Bridges", "Root Canal Therapy"],
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      icon: <Baby className="h-6 w-6" />,
      title: "Pediatric Dentistry",
      description:
        "Gentle, kid-friendly dental care designed to make children feel comfortable and establish healthy oral hygiene habits from an early age.",
      items: ["Children's Checkups", "Fluoride Treatment", "Sealants"],
      gradient: "from-yellow-500 to-amber-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
      iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "Emergency Dental Care",
      description:
        "Same-day emergency services for dental injuries, severe toothaches, broken teeth, and other urgent dental issues.",
      items: ["Tooth Pain Relief", "Broken Tooth Repair", "Same-Day Treatment"],
      gradient: "from-rose-500 to-red-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30",
      iconBg: "bg-gradient-to-br from-rose-500 to-red-600",
    },
  ];

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              <ShimmeringText 
                text="Our Dental Services"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                shimmeringColor="rgb(236 72 153)"
                color="rgb(37 99 235)"
                duration={2}
              />
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
              Comprehensive dental care tailored to your needs. From preventive treatments to advanced procedures, we provide exceptional care for the whole family.
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

export { Services };
