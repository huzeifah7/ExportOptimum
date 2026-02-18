
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-10 w-48 mx-auto rounded-full" />
            <Skeleton className="h-20 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
