"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const DATA = [
  { name: "Fixed", value: 76, color: "hsl(142 71% 55%)" },
  { name: "Open", value: 24, color: "hsl(38 92% 60%)" },
];

export function FixRatePie() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{
            background: "hsl(240 10% 6%)",
            border: "1px solid hsl(240 6% 16%)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Pie
          data={DATA}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={84}
          paddingAngle={2}
          strokeWidth={0}
        >
          {DATA.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
