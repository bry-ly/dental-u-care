"use client"
import { Brackets } from "lucide-react";
import Image from "next/image";
import { serviceCategories } from "@/lib/types/services-data";

export function Orthodontics() {
  const orthodonticServices = serviceCategories.find(cat => cat.id === "cosmetic")?.services.filter(service =>
    service.name.toLowerCase().includes('braces') || service.name.toLowerCase().includes('veneers')
  ) || [];

  return (
    <section className="w-full max-w-2xl mt-5 mb-8 mx-auto">
      <div className="space-y-4 text-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Orthodontics
          </h2>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
          Braces and clear aligners for children and adults
        </p>
      </div>
      <div className="rounded-xl border p-6 shadow-lg dark:shadow-xl dark:shadow-gray-900/50 transition-shadow duration-300 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/70 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full p-3 shadow-lg">
            <Brackets className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Orthodontics</h3>
          <div className="flex items-center gap-2 sm:ml-4">
            <Image
              src="/kath.jpg"
              alt="Kath Estrada"
              className="w-10 h-10 rounded-full object-cover border"
              width={40}
              height={40}
              priority
            />
            <span className="font-semibold">Kath Estrada</span>
            <span className="text-primary text-sm">
              Chief Dentist & Orthodontist
            </span>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Straighten your teeth and correct bite issues with traditional braces
          or modern clear aligners for both children and adults.
        </p>
        <ul className="space-y-2 text-left mb-6">
          {orthodonticServices.map((service) => (
            <li key={service.id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 inline-block" />
              {service.name}
            </li>
          ))}
        </ul>
        {/* Team Member */}

        {/* Pricing */}
        <div className="mt-4">
          <div className="font-bold mb-2">Pricing</div>
          <ul className="text-sm space-y-1">
            {orthodonticServices.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>{service.name}</span>
                <span className="font-semibold text-primary">{service.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
