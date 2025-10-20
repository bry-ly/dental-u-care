"use client"

import { Check, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  isActive: boolean
}

type ServicesDisplayProps = {
  services: Service[]
  onSelectService?: (serviceId: string) => void
  scrollToBooking?: boolean
}

export function ServicesDisplay({ services, onSelectService, scrollToBooking = true }: ServicesDisplayProps) {
  const handleServiceSelect = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId)
    }
    
    if (scrollToBooking) {
      // Scroll to booking form
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-form-section')
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  const categories = Object.keys(servicesByCategory)
  const defaultCategory = categories[0] || ""

  // Map category names to badges
  const categoryBadges: Record<string, string> = {
    "Preventive Care": "Essential",
    "Restorative": "Popular",
    "Cosmetic": "Premium",
    "Orthodontics": "Advanced",
    "Emergency": "Urgent",
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultCategory} className="w-full">
        <TabsList className="grid w-full h-auto gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` }}>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm sm:text-base"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{category}</CardTitle>
                  <Badge className="uppercase">
                    {categoryBadges[category] || "Service"}
                  </Badge>
                </div>
                <CardDescription>
                  Professional dental services with transparent pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {servicesByCategory[category].map((service, index) => (
                    <div
                      key={service.id}
                      className="flex flex-col p-4 rounded-lg border hover:border-primary transition-all duration-300 hover:shadow-md animate-in fade-in-50 slide-in-from-left-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Check className="size-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>⏱️ {service.duration} mins</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t">
                        <span className="text-2xl font-bold text-primary">
                          ₱{service.price.toLocaleString()}
                        </span>
                        {onSelectService && (
                          <Button
                            size="sm"
                            onClick={() => handleServiceSelect(service.id)}
                          >
                            <Calendar className="size-4 mr-2" />
                            Book Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
