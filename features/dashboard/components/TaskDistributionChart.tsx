'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useGetTaskDistribution } from '../api/useGetTaskDistribution';
import { TaskDistributionChartSkeleton } from './TaskDistributionChartSkeleton';

export const TaskDistributionChart = () => {
  const { data, isLoading } = useGetTaskDistribution();

  const totalTasks = React.useMemo(() => {
    return (data || []).reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: { label: 'Tasks' },
    };
    (data || []).forEach((item) => {
      config[item.name.toLowerCase()] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [data]);

  if (isLoading || !data) {
    return <TaskDistributionChartSkeleton />;
  }

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Task Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
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
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={110}
              strokeWidth={0}
              paddingAngle={0}
            >
              {data.map((entry, index) => (
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
                          {totalTasks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Tasks
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
          {data.map((entry) => {
            const percentage =
              totalTasks > 0 ? Math.round((entry.value / totalTasks) * 100) : 0;

            return (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
