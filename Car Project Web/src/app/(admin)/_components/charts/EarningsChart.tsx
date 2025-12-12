"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PRIMARY_BASE, NEUTRAL_COLORS } from "@/lib/colors";

interface EarningsChartProps {
  // Normalized data: label is x-axis tick, value is revenue (in thousands)
  data?: { label: string; value: number }[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  // Default data if no data provided
  const defaultData = [
    { label: "1", value: 0 }, { label: "2", value: 0 }, { label: "3", value: 0 },
    { label: "4", value: 0 }, { label: "5", value: 0 }, { label: "6", value: 0 },
    { label: "7", value: 0 }, { label: "8", value: 0 }, { label: "9", value: 0 },
    { label: "10", value: 0 }, { label: "11", value: 0 }, { label: "12", value: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  // Show loading state if data is undefined
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading earnings data...</div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY_BASE} stopOpacity={0.3} />
              <stop offset="100%" stopColor={PRIMARY_BASE} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={NEUTRAL_COLORS.gridStroke} />
          <XAxis 
            dataKey="label" 
            tick={{ fill: NEUTRAL_COLORS.textGray, fontSize: 12 }}
            axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
          />
          <YAxis 
            tickFormatter={(n) => `$${n}k`} 
            tick={{ fill: NEUTRAL_COLORS.textGray, fontSize: 12 }}
            axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value: any) => [`$${value}k`, "Earnings"]}
            contentStyle={{ 
              backgroundColor: NEUTRAL_COLORS.white, 
              border: `1px solid ${NEUTRAL_COLORS.axisStroke}`,
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={PRIMARY_BASE} 
            strokeWidth={2}
            fill="url(#colorEarnings)"
            dot={{ fill: PRIMARY_BASE, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: PRIMARY_BASE, strokeWidth: 2, fill: NEUTRAL_COLORS.white }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}