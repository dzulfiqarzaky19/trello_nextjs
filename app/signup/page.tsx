import { SignupForm } from '@/features/signup/SignupForm';
import { LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">TaskMaster</h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          fill
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
