import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { SecurityForm } from './SecurityForm';

export const Security = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-bold">Security</h3>
      <p className="text-sm text-muted-foreground">
        Update your password and secure your account.
      </p>
    </div>

    <FieldGroup>
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="sr-only">Security Settings</CardTitle>
          <CardDescription className="sr-only">
            Manage your password and account security
          </CardDescription>
        </CardHeader>

        <SecurityForm />
      </Card>
    </FieldGroup>
  </div>
);
