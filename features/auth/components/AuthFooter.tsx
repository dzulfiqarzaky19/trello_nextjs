import { Button } from '@/components/ui/button';
import { Field, FieldDescription } from '@/components/ui/field';
import { Github } from 'lucide-react';
import Link from 'next/link';

interface IAuthFooterProps {
  description: string;
  buttonText: string;
  to: string;
}

export const AuthFooter = ({
  description,
  buttonText,
  to,
}: IAuthFooterProps) => (
  <Field>
    <Button variant="outline" type="button">
      <Github className="mr-2 h-4 w-4" />
      GitHub
    </Button>

    <FieldDescription className="px-6 text-center">
      {description} <Link href={to}>{buttonText}</Link>
    </FieldDescription>
  </Field>
);
