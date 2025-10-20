"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Mail, Phone } from "lucide-react"

type Patient = {
  id: string
  name: string
  email: string
  phone: string | null
  medicalHistory: string | null
  appointments: Array<{
    id: string
    date: Date
    status: string
    service: {
      name: string
    }
  }>
}

type DentistPatientsTableProps = {
  patients: Patient[]
}

export function DentistPatientsTable({ patients }: DentistPatientsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase()
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Patients</CardTitle>
        <CardDescription>
          Total: {patients.length} patients
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => {
                  const completedVisits = patient.appointments.filter(
                    (apt) => apt.status === "completed"
                  ).length
                  const lastVisit = patient.appointments[0]

                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{patient.email}</span>
                          </div>
                          {patient.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{patient.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{patient.appointments.length} total</p>
                          <p className="text-xs text-muted-foreground">{completedVisits} completed</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lastVisit ? (
                          <div>
                            <p>{new Date(lastVisit.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{lastVisit.service.name}</p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
