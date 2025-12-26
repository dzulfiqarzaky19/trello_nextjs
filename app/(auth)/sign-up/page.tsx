import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SignupForm } from '@/features/auth/SignupForm';

export default function SignupPage() {
  return (
    <FieldGroup>
      <AuthHeader
        title="Create your account"
        description="Fill in the form below to create your account"
      />

      <SignupForm />

      <FieldSeparator>Or continue with</FieldSeparator>

      <AuthFooter
        description="Already have an account?"
        buttonText="Sign in"
        to="/sign-in"
      />
    </FieldGroup>
  );
}
