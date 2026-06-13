"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ScoreDatum {
  label: string;
  score: number;
}

export default function ScoreLineChart({ data }: { data: ScoreDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
        <YAxis stroke="#6b7280" fontSize={11} domain={[0, 5]} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#1f1f1f",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          name="Score fisico"
          stroke="#e87425"
          strokeWidth={2}
          dot={{ r: 3, fill: "#e87425" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
