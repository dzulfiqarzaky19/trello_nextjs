'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';

import { CHART_DATA } from '@/lib/const/DashboardPage';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  ...CHART_DATA.reduce(
    (acc: any, curr: any) => ({
      ...acc,
      [curr.name.toLowerCase()]: {
        label: curr.name,
        color: curr.fill,
      },
    }),
    {}
  ),
} satisfies ChartConfig;

export const DonutPieChart = () => {
  const totalPercentage = React.useMemo(() => {
    return '100%';
  }, []);

  return (
    <div className="flex flex-col items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={CHART_DATA}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={110}
            strokeWidth={0}
            paddingAngle={0}
          >
            {CHART_DATA.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalPercentage}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Capacity
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4 w-full px-4">
        {CHART_DATA.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
