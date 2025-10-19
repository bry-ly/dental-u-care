"use client";

import { Navbar } from "@/components/landing/navbar";

export default function PatientResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Patient Resources</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl text-center">
          Find new patient forms, insurance information, and financing options to help you prepare for your visit and manage your dental care.
        </p>
        {/* Add more resource links or components here as needed */}
      </main>
    </>
  );
}
