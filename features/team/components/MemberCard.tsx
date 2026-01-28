import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';

export interface IMemberCardProps {
  name: string;
  role: string;
  image?: string | null;
  isOnline?: boolean;
  tags?: { label: string; className: string }[];
  stats?: {
    activeTasks: number;
    projects: number;
  };
}

export const MemberCard = ({
  name,
  role,
  tags,
  stats,
  image,
  isOnline,
}: IMemberCardProps) => {
  return (
    <Card className="flex flex-col items-center pt-6 relative border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="relative mb-4">
        <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
          <AvatarImage src={image || undefined} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="text-center space-y-1 mb-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tags?.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`text-[10px] px-2 py-0.5 font-bold ${tag.className}`}
          >
            {tag.label}
          </Badge>
        ))}
      </div>

      <div className="flex w-full px-6 mb-6 justify-between text-center divide-x">
        <div className="flex-1">
          <div className="font-bold text-lg">{stats?.activeTasks || 0}</div>
          <div className="text-xs text-muted-foreground">Active Tasks</div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">{stats?.projects || 0}</div>
          <div className="text-xs text-muted-foreground">Projects</div>
        </div>
      </div>

      <CardFooter className="w-full pb-6 pt-0">
        <Button
          variant="secondary"
          className="w-full bg-gray-50 hover:bg-gray-100 font-semibold"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
