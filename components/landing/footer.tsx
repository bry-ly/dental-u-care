import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Image from "next/image";
interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Services",
    links: [
      { name: "Preventive Care", href: "/services/preventive-care" },
      { name: "Cosmetic Dentistry", href: "/services/cosmetic-dentistry" },
      { name: "Orthodontics", href: "/services/orthodontics" },
      { name: "Pediatric Dentistry", href: "/services/pediatric-dentistry" },
      { name: "Emergency Care", href: "/services/emergency-care" },
    ],
  },
  {
    title: "Patient Resources",
    links: [
      { name: "Book Appointment", href: "/book" },
      { name: "Patient Portal", href: "/dashboard" },
      { name: "Insurance Info", href: "/insurance" },
      { name: "Financing Options", href: "/financing" },
      { name: "New Patient Forms", href: "/forms" },
    ],
  },
  {
    title: "About Us",
    links: [
      { name: "Our Team", href: "/team" },
      { name: "Our Clinic", href: "/clinic" },
      { name: "Contact Us", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer = ({
  logo = {
    url: "/",
    src: "/tooth.svg",
    alt: "Dental U Care Logo",
    title: "Dental U Care",
  },
  sections = defaultSections,
  description = "Your trusted online dental appointment system. Book appointments, manage your dental health, and connect with expert dentists - all in one place.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Dental U Care. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8"
                  width={32}
                  height={32}
                />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="text-muted-foreground max-w-[70%] text-sm">
              {description}
            </p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Footer };
