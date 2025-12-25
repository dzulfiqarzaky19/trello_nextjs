import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { SigninForm } from '@/features/signin/SigninForm';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <SigninForm />

      <FieldSeparator>Or continue with</FieldSeparator>

      <Field>
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer hover:bg-transparent hover:text-red-500"
        >
          <Github className="mr-2 h-4 w-4" />
          Login with GitHub
        </Button>

        <FieldDescription className="text-center">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
