"use client";

import { MenuIcon, SearchIcon, LogOut, User, Shield } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ModeToggle } from "../ui/mode-toggle";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
} | null;

type NavbarProps = {
  user?: User;
  isAdmin?: boolean;
};

const Navbar = ({ user, isAdmin: userIsAdmin }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
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

  const aboutItems = [
    {
      title: "Our Story",
      description: "Learn about Dental U Care's mission and values",
      href: "/#about",
    },
    {
      title: "Our Team",
      description: "Meet our expert dental professionals",
      href: "/#team",
    },
    {
      title: "Features",
      description: "Discover our online booking system features",
      href: "/#features",
    },
    {
      title: "Pricing",
      description: "Transparent pricing for all dental services",
      href: "/#pricing",
    },
  ];

  return (
    <section className="sticky top-0 z-50 py-4">
      <div
        className={cn(
          "container transition-all duration-300",
          isScrolled && "px-6 lg:px-12"
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-6 py-4 transition-all duration-300",
            isScrolled
              ? "border-2 border-accent dark:border-gray-900 bg-background/50 backdrop-blur-lg shadow-lg"
              : "border-2 border-accent dark:border-gray-800 bg-background/95 shadow-lg"
          )}
        >
          <Link
            href="/#home"
            className="flex items-center gap-2"
          >
            <Image src="/tooth.svg" alt="Dental U Care" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tighter">
              Dental U Care
            </span>
          </Link>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#home"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] grid-cols-2 p-3">
                    {aboutItems.map((item, index) => (
                      <NavigationMenuLink
                        href={item.href}
                        key={index}
                        className="rounded-md p-3 transition-colors"
                      >
                        <div key={item.title}>
                          <p className="text-foreground mb-1 font-semibold">
                            {item.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors"
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
                  href="/#pricing"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#contact"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <InputGroup className={cn("w-64 transition-all duration-300 border-1 border-gray-400", isScrolled && "w-48")}>
              <InputGroupInput placeholder="Search services..." />
              <InputGroupAddon>
                <SearchIcon className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="sm">Search</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <ModeToggle />
            
            {user ? (
              <>
                <Button className={cn(isScrolled ? 'hidden' : 'lg:inline-flex')}>
                  <Link href="/booking">Book Appointment</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userIsAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" className={cn(isScrolled ? 'hidden' : 'lg:inline-flex')}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className={cn(isScrolled ? 'hidden' : 'lg:inline-flex')}>
                  <Link href="/signup">Book Now</Link>
                </Button>
              </>
            )}
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
                  <a href="#" className="flex items-center gap-2">
                    <Image
                      src="/tooth.svg"
                      alt="Dental U Care"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                    <span className="text-lg font-semibold tracking-tighter">
                      Dental U Care
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="about" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      About
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2">
                        {aboutItems.map((item, index) => (
                          <a
                            href={item.href}
                            key={index}
                            className="rounded-md p-3 transition-colors"
                          >
                            <div key={item.title}>
                              <p className="text-foreground mb-1 font-semibold">
                                {item.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
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
                            className="rounded-md p-3 transition-colors"
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
                  <Link href="/#contact" className="font-medium">
                    Contact
                  </Link>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image || undefined} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href="/booking">Book Appointment</Link>
                      </Button>
                      {userIsAdmin && (
                        <Button variant="outline" asChild>
                          <Link href="/dashboard">
                            <Shield className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="destructive" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline">
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button>
                        <Link href="/signup">Book Now</Link>
                      </Button>
                    </>
                  )}
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
