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

import { Tables } from '@/lib/supabase/database.types';

type Profile = Tables<'profiles'>;

interface PublicProfileProps {
  profile: Profile | null;
  email?: string;
}

export const PublicProfile = ({ profile }: PublicProfileProps) => {
  const fullName = profile?.full_name || 'User';
  const role = profile?.role || 'Member';
  const bio = profile?.bio || 'No bio provided.';

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
          <CardDescription className="sr-only">Member Details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-orange-100">
              <AvatarImage src={profile?.avatar_url || undefined} />
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

          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={role} readOnly className="bg-muted/50" />
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
