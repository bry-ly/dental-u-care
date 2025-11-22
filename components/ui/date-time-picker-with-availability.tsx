"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DateTimePickerWithAvailabilityProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  label?: string;
  required?: boolean;
  dentistId?: string;
}

export function DateTimePickerWithAvailability({
  date,
  onDateChange,
  disabled,
  className,
  label,
  required,
  dentistId,
}: DateTimePickerWithAvailabilityProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>(
    []
  );
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [availabilityError, setAvailabilityError] = React.useState<string>("");

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      const timeStr = format(date, "HH:mm");
      setSelectedTime(timeStr);
    }
  }, [date]);

  // Fetch available time slots when date and dentist are selected
  React.useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !dentistId) {
        setAvailableTimeSlots([]);
        setSelectedTime("");
        return;
      }

      setIsLoadingSlots(true);
      setAvailabilityError("");

      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/dentists/${dentistId}/availability?date=${dateStr}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.available && data.timeSlots) {
            setAvailableTimeSlots(data.timeSlots);
            // If current selected time is not available, clear it
            if (selectedTime && !data.timeSlots.includes(selectedTime)) {
              setSelectedTime("");
            }
          } else {
            setAvailableTimeSlots([]);
            setSelectedTime("");
            setAvailabilityError(
              data.message || "No available time slots for this date"
            );
          }
        } else {
          const errorData = await response.json();
          setAvailableTimeSlots([]);
          setSelectedTime("");
          setAvailabilityError(
            errorData.error || "Failed to fetch availability"
          );
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
        setAvailableTimeSlots([]);
        setSelectedTime("");
        setAvailabilityError("Failed to load available time slots");
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, dentistId]);

  const confirmedRef = React.useRef(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !confirmedRef.current) {
      if (date) {
        setSelectedDate(date);
        const timeStr = format(date, "HH:mm");
        setSelectedTime(timeStr);
      } else {
        setSelectedDate(undefined);
        setSelectedTime("");
      }
    }
    confirmedRef.current = false;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      setSelectedDate(selected);
      setSelectedTime(""); // Clear time when date changes
    } else {
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  };

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
  };

  const formatDisplayTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const confirmedDate = new Date(selectedDate);
      confirmedDate.setHours(parseInt(hours, 10));
      confirmedDate.setMinutes(parseInt(minutes, 10));
      confirmedRef.current = true;
      onDateChange(confirmedDate);
      setOpen(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (disabled) {
      return disabled(date);
    }
    const dateAtMidnight = new Date(date);
    dateAtMidnight.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateAtMidnight < today;
  };

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
            {selectedDate && selectedTime ? (
              <>
                {format(selectedDate, "PPP")} at{" "}
                {formatDisplayTime(selectedTime)}
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
                disabled={isDateDisabled}
                initialFocus
                className="rounded-lg"
              />
            </div>
            <div className="border-t sm:border-t-0 sm:border-l sm:pl-6 sm:pr-0 pt-4 sm:pt-0 mt-4 sm:mt-0 space-y-4 min-w-[220px]">
              {!dentistId ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Please select a dentist first
                    </AlertDescription>
                  </Alert>
                </div>
              ) : !selectedDate ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Please select a date first
                    </AlertDescription>
                  </Alert>
                </div>
              ) : isLoadingSlots ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              ) : availabilityError ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {availabilityError}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      No available time slots for this date
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Select Time
                    </Label>
                    <Select value={selectedTime} onValueChange={handleTimeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {formatDisplayTime(slot)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedDate && selectedTime && (
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
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

