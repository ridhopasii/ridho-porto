import Card from "@/common/components/elements/Card";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Skeleton from "react-loading-skeleton";

const UsesSkeleton = () => {
  return (
    <SkeletonLoader>
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <Card key={j} className="p-4 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SkeletonLoader>
  );
};

export default UsesSkeleton;
