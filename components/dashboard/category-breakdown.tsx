"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategoryDatum } from "@/types";

const COLORS: Record<CategoryDatum["category"], string> = {
  security: "hsl(0 72% 60%)",
  performance: "hsl(38 92% 60%)",
  bug: "hsl(199 89% 60%)",
  refactor: "hsl(263 85% 70%)",
  style: "hsl(142 71% 55%)",
};

export function CategoryBreakdown({ data }: { data: CategoryDatum[] }) {
  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="text-base">Issues by category</CardTitle>
        <CardDescription>Where CodePilot is finding things.</CardDescription>
      </CardHeader>
      <CardContent className="h-[220px] p-2 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="hsl(240 6% 16%)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
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
              cursor={{ fill: "hsl(240 6% 14%)" }}
              contentStyle={{
                background: "hsl(240 10% 6%)",
                border: "1px solid hsl(240 6% 16%)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={COLORS[entry.category]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
