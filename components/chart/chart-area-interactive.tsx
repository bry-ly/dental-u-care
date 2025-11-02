"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

type ChartDataPoint = {
  date: string;
  appointments: number;
};

const defaultChartData: ChartDataPoint[] = [
  { date: "2024-04-01", appointments: 12 },
  { date: "2024-04-02", appointments: 8 },
  { date: "2024-04-03", appointments: 15 },
  { date: "2024-04-04", appointments: 22 },
  { date: "2024-04-05", appointments: 18 },
  { date: "2024-04-06", appointments: 25 },
  { date: "2024-04-07", appointments: 10 },
  { date: "2024-04-08", appointments: 16 },
  { date: "2024-04-09", appointments: 9 },
  { date: "2024-04-10", appointments: 19 },
  { date: "2024-04-11", appointments: 27 },
  { date: "2024-04-12", appointments: 21 },
  { date: "2024-04-13", appointments: 14 },
  { date: "2024-04-14", appointments: 11 },
  { date: "2024-04-15", appointments: 17 },
  { date: "2024-04-16", appointments: 13 },
  { date: "2024-04-17", appointments: 24 },
  { date: "2024-04-18", appointments: 28 },
  { date: "2024-04-19", appointments: 20 },
  { date: "2024-04-20", appointments: 12 },
  { date: "2024-04-21", appointments: 16 },
  { date: "2024-04-22", appointments: 19 },
  { date: "2024-04-23", appointments: 23 },
  { date: "2024-04-24", appointments: 26 },
  { date: "2024-04-25", appointments: 15 },
  { date: "2024-04-26", appointments: 8 },
  { date: "2024-04-27", appointments: 29 },
  { date: "2024-04-28", appointments: 18 },
  { date: "2024-04-29", appointments: 22 },
  { date: "2024-04-30", appointments: 25 },
  { date: "2024-05-01", appointments: 14 },
  { date: "2024-05-02", appointments: 20 },
  { date: "2024-05-03", appointments: 17 },
  { date: "2024-05-04", appointments: 24 },
  { date: "2024-05-05", appointments: 28 },
  { date: "2024-05-06", appointments: 30 },
  { date: "2024-05-07", appointments: 21 },
  { date: "2024-05-08", appointments: 16 },
  { date: "2024-05-09", appointments: 19 },
  { date: "2024-05-10", appointments: 23 },
  { date: "2024-05-11", appointments: 26 },
  { date: "2024-05-12", appointments: 18 },
  { date: "2024-05-13", appointments: 13 },
  { date: "2024-05-14", appointments: 27 },
  { date: "2024-05-15", appointments: 25 },
  { date: "2024-05-16", appointments: 22 },
  { date: "2024-05-17", appointments: 29 },
  { date: "2024-05-18", appointments: 24 },
  { date: "2024-05-19", appointments: 17 },
  { date: "2024-05-20", appointments: 20 },
  { date: "2024-05-21", appointments: 11 },
  { date: "2024-05-22", appointments: 10 },
  { date: "2024-05-23", appointments: 21 },
  { date: "2024-05-24", appointments: 19 },
  { date: "2024-05-25", appointments: 16 },
  { date: "2024-05-26", appointments: 14 },
  { date: "2024-05-27", appointments: 28 },
  { date: "2024-05-28", appointments: 18 },
  { date: "2024-05-29", appointments: 12 },
  { date: "2024-05-30", appointments: 23 },
  { date: "2024-05-31", appointments: 17 },
  { date: "2024-06-01", appointments: 15 },
  { date: "2024-06-02", appointments: 26 },
  { date: "2024-06-03", appointments: 13 },
  { date: "2024-06-04", appointments: 25 },
  { date: "2024-06-05", appointments: 11 },
  { date: "2024-06-06", appointments: 19 },
  { date: "2024-06-07", appointments: 22 },
  { date: "2024-06-08", appointments: 24 },
  { date: "2024-06-09", appointments: 27 },
  { date: "2024-06-10", appointments: 16 },
  { date: "2024-06-11", appointments: 10 },
  { date: "2024-06-12", appointments: 28 },
  { date: "2024-06-13", appointments: 12 },
  { date: "2024-06-14", appointments: 25 },
  { date: "2024-06-15", appointments: 21 },
  { date: "2024-06-16", appointments: 23 },
  { date: "2024-06-17", appointments: 29 },
  { date: "2024-06-18", appointments: 14 },
  { date: "2024-06-19", appointments: 20 },
  { date: "2024-06-20", appointments: 26 },
  { date: "2024-06-21", appointments: 17 },
  { date: "2024-06-22", appointments: 22 },
  { date: "2024-06-23", appointments: 30 },
  { date: "2024-06-24", appointments: 15 },
  { date: "2024-06-25", appointments: 16 },
  { date: "2024-06-26", appointments: 24 },
  { date: "2024-06-27", appointments: 27 },
  { date: "2024-06-28", appointments: 18 },
  { date: "2024-06-29", appointments: 13 },
  { date: "2024-06-30", appointments: 25 },
];

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: { data?: ChartDataPoint[] }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const chartData = data && data.length > 0 ? data : defaultChartData;

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Appointment Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Appointments over time
          </span>
          <span className="@[540px]/card:hidden">Appointments</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="appointments"
              type="natural"
              fill="url(#fillAppointments)"
              stroke="var(--color-appointments)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
