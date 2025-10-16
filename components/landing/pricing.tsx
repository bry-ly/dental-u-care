"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface PricingPlan {
  name: string;
  badge: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

interface Pricing4Props {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  className?: string;
}

const Pricing = ({
  title = "Our Dental Services",
  description = "Professional dental care with transparent pricing. Choose the service that's right for you.",
  plans = [
    {
      name: "Preventive Care",
      badge: "Essential",
      monthlyPrice: "₱1,500",
      yearlyPrice: "₱15,000",
      features: [
        "Regular Dental Cleaning",
        "Oral Examination",
        "Fluoride Treatment",
        "Dental X-rays (if needed)",
        "Oral Health Consultation",
      ],
      buttonText: "Book Appointment",
    },
    {
      name: "Cosmetic Dentistry",
      badge: "Popular",
      monthlyPrice: "₱3,500",
      yearlyPrice: "₱35,000",
      features: [
        "Everything in Preventive Care",
        "Teeth Whitening Session",
        "Dental Veneers Consultation",
        "Smile Makeover Planning",
        "Before & After Photos",
      ],
      buttonText: "Book Appointment",
      isPopular: true,
    },
    {
      name: "Orthodontics",
      badge: "Premium",
      monthlyPrice: "₱5,000",
      yearlyPrice: "₱50,000",
      features: [
        "Complete Orthodontic Assessment",
        "Braces Installation",
        "Monthly Adjustment Sessions",
        "Clear Aligners Option",
        "Retainer After Treatment",
        "Progress Monitoring",
      ],
      buttonText: "Book Consultation",
    },
  ],
  className = "",
}: Pricing4Props) => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className={`py-32 ${className} ml-10`}>
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
            {title}
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="text-muted-foreground max-w-3xl lg:text-xl">
              {description}
            </p>
            <div className="bg-muted flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg">
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === "annually");
                }}
              >
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center px-7 font-semibold"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annually"
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold"
                  >
                    Yearly
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex w-full flex-col rounded-lg border p-6 text-left ${
                  plan.isPopular ? "bg-muted" : ""
                }`}
              >
                <Badge className="mb-8 block w-fit uppercase">
                  {plan.badge}
                </Badge>
                <span className="text-4xl font-medium">
                  {isAnnually ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <p className="text-muted-foreground">
                  {isAnnually ? "Annual Package" : "Per Visit"}
                </p>
                <Separator className="my-6" />
                <div className="flex h-full flex-col justify-between gap-20">
                  <ul className="text-muted-foreground space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <Check className="size-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">{plan.buttonText}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing };
