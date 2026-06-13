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

export interface FormationsChartDatum {
  modulo: string;
  vittorie: number;
  pareggi: number;
  sconfitte: number;
}

export default function FormationsChart({ data }: { data: FormationsChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis dataKey="modulo" stroke="#6b7280" fontSize={11} />
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
        <Bar dataKey="vittorie" name="Vittorie" stackId="esiti" fill="#e87425" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pareggi" name="Pareggi" stackId="esiti" fill="#6b7280" radius={[4, 4, 0, 0]} />
        <Bar dataKey="sconfitte" name="Sconfitte" stackId="esiti" fill="#3d3d3d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
