import { Button } from "@/components/ui/button";
import Image from "next/image";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "/tooth.svg",
    alt: "tooth",
  },
];

const defaultAchievements = [
  { label: "Happy Patients", value: "500+" },
  { label: "Appointments Booked", value: "1000+" },
  { label: "Satisfaction Rate", value: "98%" },
  { label: "Expert Dentists", value: "4" },
];

const About = ({
  title = "About Dental U Care",
  description = "We're a modern dental care provider committed to making quality dental services accessible through our innovative online appointment system. Experience hassle-free booking and world-class dental care.",
  mainImage = {
    src: "/clinic.jpg",
    alt: "Modern dental clinic interior",
  },
  secondaryImage = {
    src: "/team.jpg",
    alt: "Professional dental team",
  },
  breakout = {
    src: "/tooth.svg",
    alt: "Dental U Care Logo",
    title: "Book Your Appointment in Minutes",
    description:
      "Our easy-to-use online booking system lets you schedule appointments 24/7, choose your preferred dentist, and manage your dental health journey.",
    buttonText: "Book Now",
    buttonUrl: "patient/book-appointment",
  },
  companiesTitle = "Trusted Insurance Partners",
  companies = defaultCompanies,
  achievementsTitle = "Our Impact in Numbers",
  achievementsDescription = "Providing quality dental care and making appointments easier for thousands of patients across the Philippines.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
            width={600}
            height={400}
            priority
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
              <Image
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12"
                width={48}
                height={48}
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <a href={breakout.buttonUrl} target="_blank">
                  {breakout.buttonText}
                </a>
              </Button>
            </div>
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
        <div className="py-32">
          <p className="text-center">{companiesTitle} </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div className="flex items-center gap-3" key={company.src + idx}>
                <Image
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8"
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 p-10 md:p-16 shadow-xl">
          <div className="flex flex-col gap-4 text-center md:text-left relative z-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{achievementsTitle}</h2>
            <p className="text-muted-foreground max-w-xl">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center relative z-10">
            {achievements.map((item, idx) => {
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-red-500",
              ];
              return (
                <div className="flex flex-col gap-4 group" key={item.label + idx}>
                  <p className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</p>
                  <span className={`text-4xl font-bold md:text-5xl bg-gradient-to-r ${gradients[idx % gradients.length]} bg-clip-text text-transparent`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-0 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--primary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_1px)] bg-[size:80px_80px] opacity-5 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};

export { About };
