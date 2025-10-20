"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconStethoscope,
  IconCalendar,
  IconMedicalCross,
  IconUserCog,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/layout/nav-documents"
import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Appointments",
      url: "/admin/appointment-management",
      icon: IconCalendar,
    },
    {
      title: "Patients",
      url: "/admin/patient-management",
      icon: IconUsers,
    },
    {
      title: "Dentists",
      url: "/admin/dentist-management",
      icon: IconStethoscope,
    },
    {
      title: "Services",
      url: "/admin/service-management",
      icon: IconMedicalCross,
    },
    {
      title: "Users",
      url: "/admin/user-management",
      icon: IconUserCog,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    }
  ],
  documents: [
    {
      name: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
  ],
}

const patientData = {
  navMain: [
    {
      title: "Dashboard",
      url:"/",
      icon: IconDashboard,
    },
    {
      title: "Book Appointment",
      url: "/patient/book-appointment",
      icon: IconCalendar,
    },
    {
      title: "My Appointments",
      url: "/patient/appointments",
      icon: IconListDetails,
    },
    {
      title: "Payments",
      url: "/patient/payments",
      icon: IconFileDescription,
    },
    {
      title: "Health Records",
      url: "/patient/health-records",
      icon: IconDatabase,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    }
  ],
  documents: [],
}

const dentistData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dentist",
      icon: IconDashboard,
    },
    {
      title: "My Appointments",
      url: "/dentist/appointments",
      icon: IconCalendar,
    },
    {
      title: "My Patients",
      url: "/dentist/patients",
      icon: IconUsers,
    },
    {
      title: "Schedule",
      url: "/dentist/schedule",
      icon: IconListDetails,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    }
  ],
  documents: [],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  } | null;
  isAdmin?: boolean;
};

export function AppSidebar({ user, isAdmin, ...props }: AppSidebarProps) {
  // Determine which data to use based on user role
  const role = user?.role || 'patient'
  const data = role === 'admin' ? adminData : role === 'dentist' ? dentistData : patientData
  const homeUrl = role === 'admin' ? '/admin' : role === 'dentist' ? '/dentist' : '/'
  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link href={homeUrl} className="flex items-center gap-2">
                  <Image src="/tooth.svg" alt="Dental U Care" width={24} height={24} className="!size-6" />
                  <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dental U-Care</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {data.documents.length > 0 && <NavDocuments items={data.documents} />}
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          {user && <NavUser user={user} isAdmin={isAdmin} />}
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
