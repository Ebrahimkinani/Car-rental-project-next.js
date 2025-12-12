"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CHART_COLORS, NEUTRAL_COLORS } from "@/lib/colors";

interface BookingsChartProps {
  data?: { month: string; count: number }[];
}

export function BookingsChart({ data }: BookingsChartProps) {
  // Default data if no data provided
  const defaultData = [
    { m: "Jan", bookings: 0 }, { m: "Feb", bookings: 0 }, { m: "Mar", bookings: 0 },
    { m: "Apr", bookings: 0 }, { m: "May", bookings: 0 }, { m: "Jun", bookings: 0 },
  ];

  // Transform data to match chart format
  const chartData = data ? data.map(item => ({ m: item.month, bookings: item.count })) : defaultData;

  // Show loading state if data is undefined
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading bookings data...</div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={NEUTRAL_COLORS.gridStroke} />
          <XAxis 
            dataKey="m" 
            tick={{ fill: NEUTRAL_COLORS.textGray, fontSize: 12 }}
            axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
          />
          <YAxis 
            tick={{ fill: NEUTRAL_COLORS.textGray, fontSize: 12 }}
            axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: NEUTRAL_COLORS.white, 
              border: `1px solid ${NEUTRAL_COLORS.axisStroke}`,
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="bookings" 
            stroke={CHART_COLORS.success} 
            strokeWidth={2}
            fill="url(#colorBookings)"
            dot={{ fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: CHART_COLORS.success, strokeWidth: 2, fill: NEUTRAL_COLORS.white }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}