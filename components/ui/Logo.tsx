import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ILogoProps {
  variant?: 'default' | 'center';
  className?: string;
  showText?: boolean;
}

export const Logo = ({
  variant = 'default',
  className,
  showText = true,
}: ILogoProps) => {
  if (variant === 'center') {
    return (
      <div
        className={cn(
          'bg-red-50 w-32 h-32 flex flex-col items-center justify-center rounded-lg mx-auto gap-4',
          className
        )}
      >
        <LayoutDashboard className="w-6 h-6 text-red-600" />
        {showText && (
          <h1 className="font-bold text-xl tracking-tight">Trello Clone</h1>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 px-2', className)}>
      <div className="bg-red-50 p-2 rounded-lg">
        <LayoutDashboard className="w-6 h-6 text-red-600" />
      </div>
      {showText && (
        <h1 className="font-bold text-xl tracking-tight text-red-600">
          Trello Clone
        </h1>
      )}
    </div>
  );
};
