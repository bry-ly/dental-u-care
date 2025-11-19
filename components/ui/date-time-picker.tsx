"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  label?: string
  required?: boolean
}

export function DateTimePicker({
  date,
  onDateChange,
  disabled,
  className,
  label,
  required,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? format(date, "HH:mm") : "09:00"
  )

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date)
      setTimeValue(format(date, "HH:mm"))
    }
  }, [date])

  // Track if confirmation was clicked to avoid resetting on close
  const confirmedRef = React.useRef(false)

  // Reset to original date when dialog closes without confirmation
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen && !confirmedRef.current) {
      // Reset to original date if dialog was closed without confirming
      if (date) {
        setSelectedDate(date)
        setTimeValue(format(date, "HH:mm"))
      } else {
        setSelectedDate(undefined)
        setTimeValue("09:00")
      }
    }
    confirmedRef.current = false
  }

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      const [hours, minutes] = timeValue.split(":")
      const newDate = new Date(selected)
      newDate.setHours(parseInt(hours, 10) || 9)
      newDate.setMinutes(parseInt(minutes, 10) || 0)
      setSelectedDate(newDate)
      // Don't call onDateChange here - wait for confirmation
    } else {
      setSelectedDate(undefined)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime)
    if (selectedDate) {
      const [hours, minutes] = newTime.split(":")
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(hours, 10) || 9)
      newDate.setMinutes(parseInt(minutes, 10) || 0)
      setSelectedDate(newDate)
      // Don't call onDateChange here - wait for confirmation
    }
  }

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const timeSlots = React.useMemo(() => {
    const slots: string[] = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
        slots.push(timeStr)
      }
    }
    return slots
  }, [])

  const formatDisplayTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleConfirm = () => {
    if (selectedDate) {
      confirmedRef.current = true
      onDateChange(selectedDate)
      setOpen(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              <>
                {format(selectedDate, "PPP")} at {formatDisplayTime(timeValue)}
              </>
            ) : (
              <span>Pick a date and time</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Select Date & Time</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row px-6 pb-6">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabled}
                initialFocus
                className="rounded-lg"
              />
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:pl-6 sm:pr-0 pt-4 sm:pt-0 mt-4 sm:mt-0 space-y-4 min-w-[220px]">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Time
                </Label>
                <Select value={timeValue} onValueChange={handleTimeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {formatDisplayTime(slot)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDate && (
                <div className="pt-2 border-t">
                  <Button
                    type="button"
                    variant="default"
                    className="w-full"
                    onClick={handleConfirm}
                  >
                    Confirm Selection
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

