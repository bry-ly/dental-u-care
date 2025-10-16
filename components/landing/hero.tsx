import { ArrowRight, Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section>
      <div className="container mt-10">
        <div className="bg-muted grid items-center gap-8 lg:grid-cols-2 border rounded-lg shadow-lg">
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>24/7 Online Booking Available</span>
            </div>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Your Smile, Our Priority
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              Book your dental appointment online in minutes. Choose your preferred date, time, and service. Real-time availability with instant confirmation.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">Sign In</Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-muted-foreground text-xs">Happy Patients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-muted-foreground text-xs">Expert Dentists</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-muted-foreground text-xs">Satisfaction Rate</p>
              </div>
            </div>
          </div>
          <img
            src="/smile.jpg"
            alt="Professional dental care at Dental U Care"
            className="h-full w-full object-cover border rounded-lg dark:brightness-75"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero };
