"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface GoalsBarChartDatum {
  label: string;
  gol_fatti: number;
  gol_subiti: number;
}

export default function GoalsBarChart({ data }: { data: GoalsBarChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis dataKey="label" stroke="#6b7280" fontSize={11} interval="preserveStartEnd" />
        <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#1f1f1f",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="gol_fatti" name="Gol fatti" fill="#e87425" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gol_subiti" name="Gol subiti" fill="#3d3d3d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
