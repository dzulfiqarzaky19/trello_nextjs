import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SecurityForm = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Security</h3>
        <p className="text-sm text-muted-foreground">
          Update your password and secure your account.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg border shadow-sm">
        <div className="space-y-2 mb-6">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="ghost" className="hover:bg-muted">
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
