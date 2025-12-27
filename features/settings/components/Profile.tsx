'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ProfileForm } from './ProfileForm';

export const Profile = () => (
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

      <ProfileForm />
    </Card>
  </div>
);
