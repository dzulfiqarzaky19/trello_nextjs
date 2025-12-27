export const WorkspaceLoadingSkeleton = () => {
  return (
    <div className="p-8">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/50 dark:bg-zinc-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
