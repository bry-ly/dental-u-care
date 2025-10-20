import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "../ui/mode-toggle"

type SiteHeaderProps = {
  role?: string | null
}

export function SiteHeader({ role }: SiteHeaderProps = {}) {
  const getTitle = () => {
    switch (role) {
      case 'admin':
        return 'Dental U-Care Admin Dashboard'
      case 'dentist':
        return 'Dental U-Care Dentist Portal'
      case 'patient':
        return 'Dental U-Care Patient Portal'
      default:
        return 'Dental U-Care'
    }
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
