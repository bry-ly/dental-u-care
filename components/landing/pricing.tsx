"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface Service {
  name: string;
  price: string;
  description?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  badge: string;
  services: Service[];
}

import React, { useState } from "react";

const Pricing = () => {
  const [showRequiredDialog, setShowRequiredDialog] = useState(false);

  const serviceCategories: ServiceCategory[] = [
    {
      id: "basic",
      title: "Basic Services",
      badge: "Essential",
      services: [
        {
          name: "Dental Consultation / Checkup",
          price: "₱500 – ₱1,500",
          description: "Basic dental examination to check overall condition of teeth and gums",
        },
        {
          name: "Oral Prophylaxis (Cleaning)",
          price: "₱1,200 – ₱3,000",
          description: "Regular teeth cleaning, recommended every 6 months",
        },
        {
          name: "Tooth X-Ray",
          price: "₱700 – ₱2,500+",
          description: "Depends on type (periapical, panoramic, etc.)",
        },
        {
          name: "Simple Tooth Extraction",
          price: "₱1,500 – ₱5,000",
          description: "Basic tooth extraction procedure",
        },
        {
          name: "Deep Cleaning / Scaling and Root Planing",
          price: "₱3,000 – ₱10,000+",
          description: "For early signs of gum disease, deeper cleaning procedure",
        },
      ],
    },
    {
      id: "fillings",
      title: "Dental Fillings",
      badge: "Restorative",
      services: [
        {
          name: "Amalgam Filling (Silver)",
          price: "₱800 – ₱2,500",
          description: "Traditional silver-colored filling material",
        },
        {
          name: "Composite Filling (Tooth-colored)",
          price: "₱1,500 – ₱4,500+",
          description: "Natural-looking tooth-colored filling",
        },
        {
          name: "Ceramic/Gold Filling",
          price: "₱5,000 – ₱15,000+",
          description: "Premium filling materials for durability",
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Treatments",
      badge: "Popular",
      services: [
        {
          name: "Surgical/Impacted Tooth Extraction",
          price: "₱10,000 – ₱30,000+",
          description: "Complex extraction for impacted teeth",
        },
        {
          name: "Root Canal Treatment",
          price: "₱5,000 – ₱20,000+",
          description: "Treatment for infected tooth pulp, cleaned and sealed",
        },
        {
          name: "Dental Crowns (Basic - Metal or PFM)",
          price: "₱8,000 – ₱20,000+",
          description: "Cap for damaged tooth, metal or porcelain-fused-to-metal",
        },
        {
          name: "Dental Crowns (Premium - Zirconia, Emax)",
          price: "₱30,000 – ₱45,000+",
          description: "High-quality aesthetic crowns",
        },
        {
          name: "Teeth Whitening (Bleaching)",
          price: "₱9,000 – ₱30,000+",
          description: "Laser or in-clinic whitening procedure",
        },
      ],
    },
    {
      id: "replacement",
      title: "Tooth Replacement",
      badge: "Restoration",
      services: [
        {
          name: "Partial Denture",
          price: "₱10,000 – ₱30,000+",
          description: "Removable denture for missing teeth",
        },
        {
          name: "Full Denture",
          price: "Contact for pricing",
          description: "Complete denture set, depends on number of teeth",
        },
        {
          name: "Dental Bridges",
          price: "₱20,000 – ₱60,000+",
          description: "Replacement of missing teeth using adjacent teeth",
        },
        {
          name: "Dental Implants",
          price: "₱80,000 – ₱150,000+",
          description: "Permanent tooth replacement using titanium post + crown",
        },
      ],
    },
    {
      id: "cosmetic",
      title: "Cosmetic & Orthodontics",
      badge: "Premium",
      services: [
        {
          name: "Dental Veneers",
          price: "₱12,000 – ₱35,000+ per tooth",
          description: "For aesthetic purposes - straight, white, beautiful teeth",
        },
        {
          name: "Traditional Metal Braces",
          price: "₱35,000 – ₱80,000+",
          description: "Classic metal braces for teeth alignment",
        },
        {
          name: "Ceramic / Clear Braces",
          price: "₱100,000 – ₱200,000+",
          description: "Aesthetic clear or tooth-colored braces",
        },
      ],
    },
  ];

  return (
    <section className="py-32 ml-10">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <div className="text-center space-y-4">
            <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
              Dental Services & Pricing
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto lg:text-xl">
              Transparent pricing for all your dental needs. Quality dental care at competitive rates.
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm sm:text-base"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {serviceCategories.map((category) => (
              <TabsContent 
                key={category.id} 
                value={category.id} 
                className="mt-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl lg:text-3xl">{category.title}</CardTitle>
                      <Badge className="uppercase">{category.badge}</Badge>
                    </div>
                    <CardDescription>
                      Professional dental services with transparent pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:border-primary transition-all duration-300 hover:shadow-md gap-2 animate-in fade-in-50 slide-in-from-left-4"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <Check className="size-5 text-primary mt-1 shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                {service.description && (
                                  <p className="text-muted-foreground text-sm mt-1">
                                    {service.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right sm:text-left sm:ml-4">
                            <span className="text-xl font-bold text-primary whitespace-nowrap">
                              {service.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-center animate-in fade-in-50 zoom-in-95 duration-500 delay-300">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => setShowRequiredDialog(true)}
                      >
                        <Link href="patient/book-appointment" className="flex items-center">
                          Book Appointment
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
       <Dialog open={showRequiredDialog} onOpenChange={setShowRequiredDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Required To Sign In & Sign Up</DialogTitle>
                  <DialogDescription>
                    Please sign in or sign up to access this content.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline"><Link href="/sign-in">Sign In</Link></Button>
                  </DialogClose>
                  <Button variant="default">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </section>
  );
};

export { Pricing };
