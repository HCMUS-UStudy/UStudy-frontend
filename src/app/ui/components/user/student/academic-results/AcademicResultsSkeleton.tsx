const CardSkeleton = () => (
  <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
    <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-4 animate-pulse"></div>
    <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
    <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse"></div>
    <div className="h-64 bg-gray-200 rounded-md animate-pulse"></div>
  </div>
);

export const AcademicResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton for Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Skeleton for Charts */}
      <div className="space-y-6">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
};
