import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyListings } from "../services/api";
import SkeletonCard from "../components/SkeletonCard"; // ✅ new

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {listings.length} listing{listings.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Link
            to="/add-listing"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + New Listing
          </Link>
        </div>

        {loading ? (
          // ✅ Skeleton Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-lg font-medium">No listings yet</p>
            <Link
              to="/add-listing"
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
            >
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <Link to={`/listing/${listing._id}`} key={listing._id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
                  <div className="h-40 bg-gray-100">
                    {listing.images?.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {listing.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          listing.status === "sold"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {listing.status === "sold" ? "Sold" : "Available"}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-blue-600 font-bold mt-1">
                      ₹{listing.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;