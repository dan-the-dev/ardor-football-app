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

export interface AttendanceDatum {
  label: string;
  presente: number;
}

export default function AttendanceChart({ data }: { data: AttendanceDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
        <YAxis
          stroke="#6b7280"
          fontSize={11}
          domain={[0, 1]}
          ticks={[0, 1]}
          tickFormatter={(v) => (v === 1 ? "Presente" : "Assente")}
        />
        <Tooltip
          contentStyle={{
            background: "#1f1f1f",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value) => (Number(value) === 1 ? "Presente" : "Assente")}
        />
        <Bar dataKey="presente" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.presente ? "#e87425" : "#3d3d3d"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
