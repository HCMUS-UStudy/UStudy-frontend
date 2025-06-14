const ProfileLoadingSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-8">
      <div className="animate-pulse flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="h-20 bg-gray-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  </div>
);

export default ProfileLoadingSkeleton;
