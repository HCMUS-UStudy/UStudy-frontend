const CompletedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white shadow-md overflow-hidden animate-pulse"
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-100 p-6 flex items-center justify-center md:w-1/4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto" />
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto" />
                <div className="h-3 bg-gray-300 rounded w-20 mx-auto" />
              </div>
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div>
                <div className="h-4 bg-gray-300 rounded w-40 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-24" />
                      <div className="h-4 bg-gray-300 rounded w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <div className="h-10 w-full md:w-40 bg-gray-300 rounded" />
                <div className="h-10 w-full md:w-40 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedSkeleton;
