import { Skeleton } from '@/components/ui/skeleton';

export const SidebarFooterLoader = () => {
  return (
    <footer className="p-4">
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-2 w-[80px]" />
        </div>
      </div>
    </footer>
  );
};
