'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface PublicProfileProps {
  profile: any;
  email?: string;
}

export const PublicProfile = ({ profile }: PublicProfileProps) => {
  const fullName = profile?.full_name || 'User';
  const role = profile?.role || 'Member';
  const bio = profile?.bio || 'No bio provided.';
  // Parse tags if they are a string (JSON), otherwise assume array or empty
  let tags: { label: string, className: string }[] = [];
  try {
     if (typeof profile?.tags === 'string') {
        tags = JSON.parse(profile.tags);
     } else if (Array.isArray(profile?.tags)) {
        tags = profile.tags;
     }
  } catch (e) {
    tags = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Member Profile</h3>
        <p className="text-sm text-muted-foreground">
          View member details and activity.
        </p>
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="sr-only">Public Profile</CardTitle>
          <CardDescription className="sr-only">
             Member Details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-orange-100">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{fullName[0] || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col justify-center">
               <p className="font-bold text-lg">{fullName}</p>
               <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>

          <div className="space-y-2">
             <Label>Full Name</Label>
             <Input value={fullName} readOnly className="bg-muted/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Role</Label>
               <Input value={role} readOnly className="bg-muted/50" />
             </div>
             <div className="space-y-2">
                <Label>Tags</Label>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-2 min-h-[40px] border rounded-md bg-muted/50 items-center">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className={tag.className}>
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Input value="No tags" readOnly className="bg-muted/50 text-muted-foreground" />
                )}
             </div>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              readOnly
              className="min-h-[100px] resize-none bg-muted/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
