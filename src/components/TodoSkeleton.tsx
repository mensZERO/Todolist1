export default function TodoSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded mt-1"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
