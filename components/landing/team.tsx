import { Github, Linkedin, Twitter } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

interface Team1Props {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const Team = ({
  heading = "Meet Our Expert Dental Team",
  description = "Our team of highly qualified dentists and specialists are dedicated to providing you with exceptional dental care. Each brings years of experience and a passion for creating healthy, beautiful smiles.",
  members = [
    {
      id: "member-1",
      name: "Kath Estrada",
      role: "Chief Dentist & Orthodontist",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      linkedin: "#",
    },
    {
      id: "member-2",
      name: "Clyrelle Jade Cervantes",
      role: "Cosmetic Dentistry Specialist",
      avatar:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      linkedin: "#",
    },
    {
      id: "member-3",
      name: "Von Vryan Arguelles",
      role: "Oral Surgeon",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      linkedin: "#",
    },
    {
      id: "member-4",
      name: "Dexter Cabanag",
      role: "Periodontist",
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      linkedin: "#",
    },
  ],
}: Team1Props) => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight lg:text-5xl">
            {heading}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(3n-2)]:col-start-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Avatar className="size-20 lg:size-24">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg font-semibold">
                      {member.name}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="mb-6">
                  <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                </div>

                <div className="flex gap-3">
                  {member.github && (
                    <a
                      href={member.github}
                      className="bg-muted/50 rounded-lg p-2"
                    >
                      <Github className="text-muted-foreground size-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      className="bg-muted/50 rounded-lg p-2"
                    >
                      <Twitter className="text-muted-foreground size-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="bg-muted/50 rounded-lg p-2"
                    >
                      <Linkedin className="text-muted-foreground size-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Team };
