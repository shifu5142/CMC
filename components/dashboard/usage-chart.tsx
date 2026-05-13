"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types";

interface UsageChartProps {
  data: ChartPoint[];
  title?: string;
}

export function UsageChart({ data, title = "Reviews & issues" }: UsageChartProps) {
  return (
    <Card glass className="col-span-1 lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Legend dot="bg-chart-1" label="Reviews" />
          <Legend dot="bg-chart-4" label="Issues" />
        </div>
      </CardHeader>
      <CardContent className="h-[260px] p-2 pb-0 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(263 85% 65%)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(263 85% 65%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(240 6% 16%)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(240 5% 65%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(240 5% 65%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(240 10% 6%)",
                border: "1px solid hsl(240 6% 16%)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(0 0% 98%)" }}
            />
            <Area
              type="monotone"
              dataKey="reviews"
              stroke="hsl(263 85% 65%)"
              fill="url(#g1)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="issues"
              stroke="hsl(38 92% 50%)"
              fill="url(#g2)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
