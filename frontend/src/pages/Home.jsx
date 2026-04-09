import { useState, useEffect } from "react";
import { getAllListings } from "../services/api";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";

const CATEGORIES = ["All", "Books", "Notes", "PYQs", "Electronics", "Other"];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await getAllListings({ search, category, page, limit: 20 });
      setListings(data.listings);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const delay = setTimeout(fetchListings, 400);
    return () => clearTimeout(delay);
  }, [search, category, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Search */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Find what you need on campus 🎓
          </h1>
          <p className="text-blue-100 text-sm mb-6">
            Buy and sell within your MUJ community
          </p>
          <input
            type="text"
            placeholder="Search for books, notes, electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl px-5 py-3 text-sm text-gray-800 focus:outline-none shadow-md"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listing count */}
        {!loading && (
          <p className="text-sm text-gray-400 mt-3">
            {total === 0
              ? "No listings found"
              : `${total} listing${total > 1 ? "s" : ""} found`}
          </p>
        )}
      </div>

      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-4 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">No listings found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;