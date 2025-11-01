"use client";
import { useState, useMemo } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Area,
  AreaChart,
  BarChart,
  Bar
} from "recharts";
import { PRIMARY_BASE, CHART_COLORS, NEUTRAL_COLORS } from "@/lib/colors";

interface ExpensesTrendProps {
  points: { date: string; total: number }[];
}

export default function ExpensesTrend({ points }: ExpensesTrendProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [showAverage, setShowAverage] = useState(true);
  const [showPeak, setShowPeak] = useState(true);
  
  // Debug logging
  console.log('ExpensesTrend received points:', points);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!points || points.length === 0) return null;
    
    const totals = points.map(p => p.total);
    const sum = totals.reduce((a, b) => a + b, 0);
    const average = sum / totals.length;
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    const maxIndex = totals.indexOf(max);
    const minIndex = totals.indexOf(min);
    
    return {
      total: sum,
      average,
      max,
      min,
      maxDate: points[maxIndex]?.date,
      minDate: points[minIndex]?.date,
      count: points.length,
      nonZeroDays: totals.filter(t => t > 0).length
    };
  }, [points]);
  
  // Handle empty or invalid data
  if (!points || points.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <div className="text-gray-500 text-lg font-medium">No trend data available</div>
          <div className="text-gray-400 text-sm mt-2">Add some expenses to see the trend visualization</div>
        </div>
      </div>
    );
  }

  // Check if all values are zero
  const hasNonZeroData = points.some(point => point.total > 0);
  if (!hasNonZeroData) {
    return (
      <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📈</div>
          <div className="text-gray-500 text-lg font-medium">No expenses in selected period</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your date range or filters to see data</div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-secondary-gradient border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {formatDate(label)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{formatCurrency(data.total)}</span>
            <span className="text-gray-400 ml-2">expenses</span>
          </div>
          {stats && (
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
              <div>Daily avg: {formatCurrency(stats.average)}</div>
              <div>Period total: {formatCurrency(stats.total)}</div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">Chart Type:</div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'line', label: 'Line', icon: '📈' },
              { key: 'area', label: 'Area', icon: '📊' },
              { key: 'bar', label: 'Bar', icon: '📋' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setChartType(key as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartType === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showAverage}
              onChange={(e) => setShowAverage(e.target.checked)}
              className="mr-2 rounded border-gray-300"
            />
            Show Average
          </label>
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPeak}
              onChange={(e) => setShowPeak(e.target.checked)}
              className="mr-2 rounded border-gray-300"
            />
            Show Peak
          </label>
        </div>
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary-gradient rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</div>
            <div className="text-xs text-gray-500">Total Period</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.average)}</div>
            <div className="text-xs text-gray-500">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.max)}</div>
            <div className="text-xs text-gray-500">Highest Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.nonZeroDays}</div>
            <div className="text-xs text-gray-500">Active Days</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80 bg-secondary-gradient border border-gray-200 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' && (
            <LineChart data={points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={NEUTRAL_COLORS.gridStroke} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <Tooltip content={<CustomTooltip />} />
              {showAverage && stats && (
                <ReferenceLine 
                  y={stats.average} 
                  stroke={CHART_COLORS.danger} 
                  strokeDasharray="5 5"
                  label={{ value: "Average", position: "right" }}
                />
              )}
              {showPeak && stats && (
                <ReferenceLine 
                  y={stats.max} 
                  stroke={CHART_COLORS.warning} 
                  strokeDasharray="3 3"
                  label={{ value: "Peak", position: "right" }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={PRIMARY_BASE} 
                strokeWidth={3}
                dot={{ fill: PRIMARY_BASE, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: PRIMARY_BASE, strokeWidth: 2, fill: NEUTRAL_COLORS.white }}
              />
            </LineChart>
          )}
          
          {chartType === 'area' && (
            <AreaChart data={points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={NEUTRAL_COLORS.gridStroke} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <Tooltip content={<CustomTooltip />} />
              {showAverage && stats && (
                <ReferenceLine 
                  y={stats.average} 
                  stroke={CHART_COLORS.danger} 
                  strokeDasharray="5 5"
                  label={{ value: "Average", position: "right" }}
                />
              )}
              <Area
                type="monotone"
                dataKey="total"
                stroke={PRIMARY_BASE}
                fill={PRIMARY_BASE}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          )}
          
          {chartType === 'bar' && (
            <BarChart data={points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={NEUTRAL_COLORS.gridStroke} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12, fill: NEUTRAL_COLORS.textGray }}
                axisLine={{ stroke: NEUTRAL_COLORS.axisStroke }}
              />
              <Tooltip content={<CustomTooltip />} />
              {showAverage && stats && (
                <ReferenceLine 
                  y={stats.average} 
                  stroke={CHART_COLORS.danger} 
                  strokeDasharray="5 5"
                  label={{ value: "Average", position: "right" }}
                />
              )}
              <Bar 
                dataKey="total" 
                fill={PRIMARY_BASE}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          Showing {points.length} days • 
          {stats && ` Range: ${formatDate(points[0].date)} - ${formatDate(points[points.length - 1].date)}`}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span>Daily Expenses</span>
          </div>
          {showAverage && (
            <div className="flex items-center">
              <div className="w-3 h-3 border border-red-500 border-dashed mr-2"></div>
              <span>Average</span>
            </div>
          )}
          {showPeak && (
            <div className="flex items-center">
              <div className="w-3 h-3 border border-yellow-500 border-dashed mr-2"></div>
              <span>Peak</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}