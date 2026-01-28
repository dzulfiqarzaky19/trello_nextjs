import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface IDashboardStatsProps {
  stat: {
    label: string;
    value: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    color: string;
    iconColor: string;
  };
}

export const DashboardStats = ({ stat }: IDashboardStatsProps) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className={cn('p-3 rounded-xl', stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-4">
              {stat.label}
            </p>
          </div>

          <h1 className="text-7xl font-bold mt-1">{stat.value}</h1>
        </div>
      </CardContent>
    </Card>
  );
};
