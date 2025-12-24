import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export const SecurityForm = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Security</h3>
        <p className="text-sm text-muted-foreground">
          Update your password and secure your account.
        </p>
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="sr-only">Security Settings</CardTitle>
          <CardDescription className="sr-only">
            Manage your password and account security
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 mb-6">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Minimum 8 characters"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button variant="ghost" className="hover:bg-muted">
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
