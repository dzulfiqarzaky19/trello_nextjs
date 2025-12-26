import { FieldGroup, FieldSeparator } from '@/components/ui/field';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SigninForm } from '@/features/auth/SigninForm';

export default function LoginPage() {
  return (
    <FieldGroup>
      <AuthHeader
        title="Login to your account"
        description="Enter your email below to login to your account"
      />

      <SigninForm />

      <FieldSeparator>Or continue with</FieldSeparator>

      <AuthFooter
        description="Don't have an account?"
        buttonText="Sign up"
        to="/sign-up"
      />
    </FieldGroup>
  );
}
