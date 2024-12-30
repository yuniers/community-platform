import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Leaderboard skeleton */}
      <Card variant="borderless" className="h-full">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 px-4 rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity skeleton */}
      <Card variant="borderless">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center space-x-4 py-2">
                <Skeleton className="h-5 w-5" /> {/* Icon size */}
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4" /> {/* External link icon */}
              </div>
              {i < 2 && <div className="h-[1px] bg-border my-2" />} {/* Separator */}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
