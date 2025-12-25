import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { SignupForm } from '@/features/auth/SignupForm';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Fill in the form below to create your account
        </p>
      </div>

      <SignupForm />

      <FieldSeparator>Or continue with</FieldSeparator>

      <Field>
        <Button variant="outline" type="button">
          <Github className="mr-2 h-4 w-4" />
          Sign up with GitHub
        </Button>

        <FieldDescription className="px-6 text-center">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
