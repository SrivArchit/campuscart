const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-44 bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category + Condition row */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded-full w-16" />
          <div className="h-4 bg-gray-200 rounded-full w-14" />
        </div>

        {/* Title */}
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-4 bg-gray-200 rounded-full w-1/2" />

        {/* Price + Seller row */}
        <div className="flex justify-between pt-1">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-4 bg-gray-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;