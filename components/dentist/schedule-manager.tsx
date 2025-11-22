"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkingHours {
  [key: string]: {
    start?: string;
    end?: string;
    closed?: boolean;
  };
}

interface ScheduleManagerProps {
  dentistId: string;
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export function ScheduleManager({ dentistId }: ScheduleManagerProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/dentists/${dentistId}/schedule`);
        if (response.ok) {
          const data = await response.json();
          if (data.workingHours) {
            setWorkingHours(data.workingHours);
          } else {
            // Initialize with default hours
            const defaultHours: WorkingHours = {};
            DAYS.forEach((day) => {
              if (day.key === "sunday") {
                defaultHours[day.key] = { closed: true };
              } else {
                defaultHours[day.key] = { start: "09:00", end: "17:00" };
              }
            });
            setWorkingHours(defaultHours);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        toast.error("Failed to load schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [dentistId]);

  const handleDayToggle = (dayKey: string, closed: boolean) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: closed
        ? { closed: true }
        : { start: prev[dayKey]?.start || "09:00", end: prev[dayKey]?.end || "17:00" },
    }));
  };

  const handleTimeChange = (
    dayKey: string,
    field: "start" | "end",
    value: string
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
        closed: false,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/dentists/${dentistId}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workingHours }),
      });

      if (response.ok) {
        toast.success("Schedule updated successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update schedule");
      }
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {DAYS.map((day) => {
            const dayHours = workingHours[day.key] || {};
            const isClosed = dayHours.closed || false;

            return (
              <div
                key={day.key}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-[120px]">
                  <Checkbox
                    checked={!isClosed}
                    onCheckedChange={(checked) =>
                      handleDayToggle(day.key, !checked)
                    }
                  />
                  <label className="font-medium text-sm cursor-pointer">
                    {day.label}
                  </label>
                </div>

                {!isClosed ? (
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={dayHours.start || "09:00"}
                        onChange={(e) =>
                          handleTimeChange(day.key, "start", e.target.value)
                        }
                        className="w-full"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={dayHours.end || "17:00"}
                        onChange={(e) =>
                          handleTimeChange(day.key, "end", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground italic">
                      Closed
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

