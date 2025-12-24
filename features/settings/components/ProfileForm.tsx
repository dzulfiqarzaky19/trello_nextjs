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
import { USER_PROFILE } from '@/lib/const/settingsPage';

export const ProfileForm = () => {
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
          {/* Avatar + Actions */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-orange-100">
              <AvatarImage src={USER_PROFILE.avatar} />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="space-x-2">
              <Button variant="outline" className="bg-white">
                Change Avatar
              </Button>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
            <p className="text-xs text-muted-foreground ml-auto self-center">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={USER_PROFILE.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={USER_PROFILE.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                defaultValue={USER_PROFILE.email}
                className="pl-10"
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
              defaultValue={USER_PROFILE.bio}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-right text-muted-foreground">0/250</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
