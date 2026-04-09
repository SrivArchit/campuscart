const SkeletonDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left — Image */}
          <div className="p-4 bg-gray-50 space-y-3">
            <div className="h-72 rounded-xl bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-16 w-16 rounded-lg bg-gray-200" />
              <div className="h-16 w-16 rounded-lg bg-gray-200" />
              <div className="h-16 w-16 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Right — Details */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-full w-3/4" />
            <div className="h-8 bg-gray-200 rounded-full w-1/3" />

            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-full" />
              <div className="h-4 bg-gray-200 rounded-full w-5/6" />
              <div className="h-4 bg-gray-200 rounded-full w-4/6" />
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-1/4" />
              <div className="h-4 bg-gray-200 rounded-full w-1/2" />
              <div className="h-4 bg-gray-200 rounded-full w-2/3" />
            </div>

            <div className="h-10 bg-gray-200 rounded-lg w-full" />
            <div className="h-10 bg-gray-200 rounded-lg w-full" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkeletonDetail;