"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "@/lib/colors";

interface RentStatusChartProps {
  data?: {
    name: string;
    value: number;
  }[];
}

const COLORS = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info];

export function RentStatusChart({ data }: RentStatusChartProps) {
  const defaultData = [
    { name: "Active", value: 0 },
    { name: "Pending", value: 0 },
    { name: "Completed", value: 0 },
    { name: "Cancelled", value: 0 },
  ];

  const chartData = data || defaultData;

  // Show loading state if data is undefined
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading status data...</div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie 
            data={chartData} 
            dataKey="value" 
            nameKey="name" 
            outerRadius={80} 
            innerRadius={48}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}