"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface GoalsPieDatum {
  name: string;
  value: number;
}

const COLORS = ["#e87425", "#f5a05c", "#c45f1a", "#6b7280", "#3d3d3d", "#9ca3af", "#a85a2a", "#d4d4d4"];

export default function GoalsPieChart({ data }: { data: GoalsPieDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#1f1f1f" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1f1f1f",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
