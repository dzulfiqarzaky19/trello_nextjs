import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { cn } from '@/lib/utils';

interface ICardProps {
  title: string;
  description?: string | null;
  className?: string;
}

export const CardDemo = ({
  title,
  description,
  className,
}: ICardProps) => {
  return (
    <Card className={cn("border-none cursor-pointer hover:shadow-sm hover:bg-accent/50 transition-all mb-2", className)}>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium leading-none">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        {description && <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>}
      </CardContent>
    </Card>
  );
};
