import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Search } from 'lucide-react';

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
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search the docs..."
            className="pl-8"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 select-none" />
        </div>

        <Button variant="default">
          <Bell />
        </Button>
      </div>
    </div>
  );
};
