'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useOverviewStats } from '../../hooks/useOverviewStats';

export const OverviewStats = () => {
  const stats = useOverviewStats();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
      {stats.map((stat, index) => (
        <Card
          className="border-none shadow-sm hover:shadow-md transition-shadow"
          key={index}
        >
          <CardContent className="flex items-start gap-4">
            <div className={stat.iconClass}>
              <stat.icon className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
