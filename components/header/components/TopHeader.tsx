import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface ITopHeaderProps {
  label: string;
  description: string;
}

export const TopHeader = ({ label, description }: ITopHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{label}</div>
        <div>{description}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="default">
          <Bell />
        </Button>
      </div>
    </div>
  );
};
