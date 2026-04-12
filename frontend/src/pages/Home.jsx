import { useState, useEffect } from "react";
import { getAllListings } from "../services/api";
import ListingCard from "../components/ListingCard";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";

const CATEGORIES = ["All", "Books", "Notes", "PYQs", "Electronics", "Other"];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchListings = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAllListings({
        search,
        category,
        sort,
        page,
        limit: 8,
      });
      setListings(data.listings);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset to page 1 when search/category/sort changes
  useEffect(() => {
    setCurrentPage(1);
    const delay = setTimeout(() => fetchListings(1), 400);
    return () => clearTimeout(delay);
  }, [search, category, sort]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchListings(page);
    // ✅ Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Search */}
      <div className="bg-blue-600 py-10 px-4">
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
            className="w-full rounded-xl px-5 py-3 text-sm text-gray-800 bg-white focus:outline-none shadow-md border border-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Category Pills */}
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

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Listing Count */}
        {!loading && (
          <p className="text-sm text-gray-400 mt-3">
            {total === 0
              ? "No listings found"
              : `${total} listing${total > 1 ? "s" : ""} found — Page ${currentPage} of ${totalPages}`}
          </p>
        )}
      </div>

      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-4 pb-12">
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* ✅ Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;