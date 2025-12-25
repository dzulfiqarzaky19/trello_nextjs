import { LayoutDashboard } from 'lucide-react';

interface ILogoProps {
  variant?: 'default' | 'center';
}

export const Logo = ({ variant = 'default' }: ILogoProps) => {
  if (variant === 'center') {
    return (
      <div className="bg-red-50 w-32 h-32 flex flex-col items-center justify-center rounded-lg mx-auto gap-4">
        <LayoutDashboard className="w-6 h-6 text-red-600" />
        <h1 className="font-bold text-xl tracking-tight">TaskMaster</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="bg-red-50 p-2 rounded-lg">
        <LayoutDashboard className="w-6 h-6 text-red-600" />
      </div>
      <h1 className="font-bold text-xl tracking-tight">TaskMaster</h1>
    </div>
  );
};
