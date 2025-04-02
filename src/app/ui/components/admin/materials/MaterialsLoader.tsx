interface MaterialLoaderProps {
  viewMode: "grid" | "list";
}

const MaterialLoader: React.FC<MaterialLoaderProps> = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-xl p-4 animate-pulse">
            <div className="h-16 bg-gray-300 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="px-4 py-6 space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded-xl p-4 flex gap-4 animate-pulse"
        >
          <div className="h-10 w-10 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export default MaterialLoader;
