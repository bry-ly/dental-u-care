"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ui/mode-toggle";

const Navbar = () => {
  const features = [
    {
      title: "Preventive Care",
      description: "Cleanings, exams, and routine check-ups to keep smiles healthy",
      href: "/services/preventive-care",
    },
    {
      title: "Cosmetic Dentistry",
      description: "Teeth whitening, veneers, and smile makeovers",
      href: "/services/cosmetic-dentistry",
    },
    {
      title: "Orthodontics",
      description: "Braces and clear aligners for children and adults",
      href: "/services/orthodontics",
    },
    {
      title: "Pediatric Dentistry",
      description: "Gentle, kid-friendly dental care for your little ones",
      href: "/services/pediatric-dentistry",
    },
    {
      title: "Emergency Care",
      description: "Same-day treatment for tooth pain, injuries, and urgent issues",
      href: "/services/emergency-care",
    },
    {
      title: "Patient Resources",
      description: "New patient forms, insurance info, and financing options",
      href: "/patient-resources",
    },
  ];

  return (
    <section className="sticky top-0 z-50 py-4">
      <div className="container">
        <nav className="flex items-center justify-between border rounded-full px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
          <a
            href="https://www.shadcnblocks.com"
            className="flex items-center gap-2"
          >
            <img
              src="/tooth.svg"
              className="max-h-8"
              alt="Dental U Care"
            />
            <span className="text-lg font-semibold tracking-tighter">
              Dental U Care
            </span>
          </a>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                      >
                        <div key={feature.title}>
                          <p className="text-foreground mb-1 font-semibold">
                            {feature.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#home"
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#about"
                  className={navigationMenuTriggerStyle()}
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#team"
                  className={navigationMenuTriggerStyle()}
                >
                  Team
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#services"
                  className={navigationMenuTriggerStyle()}
                >
                  Services
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#pricing"
                  className={navigationMenuTriggerStyle()}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#contact"
                  className={navigationMenuTriggerStyle()}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <ModeToggle/>
            <Button variant="outline"><Link href="/login">Sign In</Link></Button>
            <Button><Link href="/register">Book Now</Link></Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <a
                    href="#"
                    className="flex items-center gap-2"
                  >
                    <img
                      src="/tooth.svg"
                      className="max-h-8"
                      alt="Dental U Care"
                    />
                    <span className="text-lg font-semibold tracking-tighter">
                      Dental U Care
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Services
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <a
                            href={feature.href}
                            key={index}
                            className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                          >
                            <div key={feature.title}>
                              <p className="text-foreground mb-1 font-semibold">
                                {feature.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <Link href="/#home" className="font-medium">
                    Home
                  </Link>
                  <Link href="/#about" className="font-medium">
                    About
                  </Link>
                  <Link href="/#team" className="font-medium">
                    Team
                  </Link>
                  <Link href="/#services" className="font-medium">
                    Services
                  </Link>
                  <Link href="/#pricing" className="font-medium">
                    Pricing
                  </Link>
                  <Link href="/#contact" className="font-medium">
                    Contact
                  </Link>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Button variant="outline"><Link href="/login">Sign in</Link></Button>
                  <Button><Link href="/register">Book Now</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export { Navbar };
