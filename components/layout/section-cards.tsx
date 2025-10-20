import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardStats = {
  totalAppointments: number
  appointmentChange: number
  newPatients: number
  patientChange: number
  revenue: number
  revenueChange: number
  satisfactionRate: number
  satisfactionChange: number
}

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Appointments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalAppointments.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.appointmentChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.appointmentChange >= 0 ? '+' : ''}{stats.appointmentChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.appointmentChange >= 0 ? 'Bookings up this month' : 'Bookings down this month'}{' '}
            {stats.appointmentChange >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Appointments for the last 30 days
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Patients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.newPatients.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.patientChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.patientChange >= 0 ? '+' : ''}{stats.patientChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.patientChange >= 0 ? 'Growing patient base' : 'Patient growth slowing'}{' '}
            {stats.patientChange >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            New registrations this month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₱{stats.revenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.revenueChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.revenueChange >= 0 ? 'Strong financial performance' : 'Revenue needs attention'}{' '}
            {stats.revenueChange >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Total revenue collected</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Patient Satisfaction</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.satisfactionRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.satisfactionChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.satisfactionChange >= 0 ? '+' : ''}{stats.satisfactionChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.satisfactionRate >= 95 ? 'Excellent patient feedback' : 'Good patient feedback'}{' '}
            {stats.satisfactionChange >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Based on completed appointments</div>
        </CardFooter>
      </Card>
    </div>
  )
}
