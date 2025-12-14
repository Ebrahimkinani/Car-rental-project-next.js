"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as RechartsPrimitive from "recharts";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-secondary-gradient shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Chart related components and types
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export interface StatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  trendData?: number[];
  trendColor?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function StatsCard({ 
  label, 
  value, 
  delta, 
  deltaType,
  trendData,
  trendColor = "hsl(142.1 76.2% 36.3%)",
  icon: Icon
}: StatsCardProps) {
  const color = deltaType === "positive" 
    ? "hsl(142.1 76.2% 36.3%)" 
    : deltaType === "negative"
    ? "hsl(0 72.2% 50.6%)"
    : trendColor;

  const id = React.useId().replace(/:/g, "");
  const gradientId = `gradient-${id}`;

  // Prepare chart data if trend data is provided
  const chartData = trendData && trendData.length > 0
    ? trendData.map((val, idx) => ({ date: idx, value: val }))
    : null;

  return (
    <Card className="relative p-0 overflow-hidden">
      <CardContent className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <dt className="text-xs text-zinc-500">
              {label}
            </dt>
            <div className="mt-1 flex items-baseline justify-between">
              <dd className="text-2xl font-semibold">
                {value}
              </dd>
              {delta && (
                <dd className="flex items-center space-x-1 text-xs">
                  <span
                    className={cn(
                      deltaType === "positive"
                        ? "text-emerald-600"
                        : deltaType === "negative"
                        ? "text-red-600"
                        : "text-zinc-600"
                    )}
                  >
                    {delta}
                  </span>
                </dd>
              )}
            </div>
          </div>
          {Icon && (
            <div className="ml-4 shrink-0">
              <Icon className="h-8 w-8 text-zinc-400" />
            </div>
          )}
        </div>

        {/* Optional trend chart */}
        {chartData && (
          <div className="mt-2 h-16 overflow-hidden">
            <ChartContainer
              className="w-full h-full"
              config={{
                value: {
                  label: label,
                  color: color,
                },
              }}
            >
              <RechartsPrimitive.AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <RechartsPrimitive.XAxis dataKey="date" hide={true} />
                <RechartsPrimitive.Area
                  dataKey="value"
                  stroke={color}
                  fill={`url(#${gradientId})`}
                  fillOpacity={0.4}
                  strokeWidth={1.5}
                  type="monotone"
                />
              </RechartsPrimitive.AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export interface StatsGridProps {
  items: StatsCardProps[];
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatsCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export { StatsCard, Card, CardContent, ChartContainer };

