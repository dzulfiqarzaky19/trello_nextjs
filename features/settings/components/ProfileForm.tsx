'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProfile } from '../actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  profile: any;
  userEmail?: string;
}

export const ProfileForm = ({ profile, userEmail }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const fullName = profile?.full_name || '';

  console.log(profile);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Public Profile</h3>
        <p className="text-sm text-muted-foreground">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="sr-only">Profile Settings</CardTitle>
          <CardDescription className="sr-only">
            Update your avatar and personal information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-orange-100">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{fullName[0] || 'U'}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-medium">Avatar</p>
                <p className="text-xs text-muted-foreground">
                  Managed via Supabase / UI Avatars for now
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={fullName} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={profile?.role || ''}
                  placeholder="e.g. Product Manager"
                />
              </div>
              {/* Tags - basic text input for now, could be improved to tag input */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" defaultValue={''} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  defaultValue={userEmail || ''}
                  className="pl-10"
                  disabled
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio || ''}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-right text-muted-foreground">
                Markdown supported
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
