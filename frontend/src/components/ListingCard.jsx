import { Link } from "react-router-dom";

const CONDITION_COLORS = {
  New: "bg-green-100 text-green-700",
  "Like New": "bg-blue-100 text-blue-700",
  Used: "bg-yellow-100 text-yellow-700",
};

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/listing/${listing._id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="h-44 bg-gray-100 overflow-hidden relative">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              📦
            </div>
          )}
          {/* Multi-image badge */}
          {listing.images && listing.images.length > 1 && (
            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
              📷 {listing.images.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {listing.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                CONDITION_COLORS[listing.condition]
              }`}
            >
              {listing.condition}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2">
            {listing.title}
          </h3>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="text-blue-600 font-bold text-base">
              ₹{listing.price}
            </span>
            <span className="text-xs text-gray-400">
              {listing.seller?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;