import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleListing, deleteListing, markAsSold } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import SkeletonDetail from "../components/SkeletonDetail";
import ImageCarousel from "../components/ImageCarousel";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await getSingleListing(id);
        setListing(data);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    setDeleting(true);
    try {
      await deleteListing(id);
      toast.success("Listing deleted successfully");
      navigate("/my-listings");
    } catch {
      toast.error("Failed to delete listing");
      setDeleting(false);
    }
  };

  const handleMarkSold = async () => {
    setMarking(true);
    try {
      await markAsSold(id);
      setListing({ ...listing, status: "sold" });
      toast.success("Listing marked as sold! ✅");
    } catch {
      toast.error("Failed to update listing");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <SkeletonDetail />;
  if (!listing) return null;

  const isOwner =
    user && listing.seller?._id?.toString() === user._id?.toString();

  const whatsappLink = `https://wa.me/91${listing.whatsapp}?text=Hi! I'm interested in your listing: ${listing.title}`;

  const postedDate = new Date(listing.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ✅ Column 1 — Image Carousel */}
          <div className="p-4 sm:p-6 bg-gray-50/50">
            <ImageCarousel
              images={listing.images || []}
              title={listing.title}
            />
          </div>

          {/* ✅ Column 2 — Details */}
          <div className="p-5 sm:p-6 flex flex-col">

            {/* Sold Badge */}
            {listing.status === "sold" && (
              <span className="self-start bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                SOLD
              </span>
            )}

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {listing.title}
            </h1>

            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              ₹{listing.price}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                {listing.condition}
              </span>
            </div>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              {listing.description}
            </p>

            {/* Seller Info */}
            <div className="mt-4 border-t pt-4">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                Seller
              </p>
              <p className="text-sm font-medium text-gray-700">
                {listing.seller?.name}
              </p>
              <p className="text-sm text-gray-500">
                {listing.seller?.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on {postedDate}
              </p>
            </div>

            {/* Contact Buttons — buyers only */}
            {!isOwner && listing.status !== "sold" && (
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg text-center transition flex items-center justify-center gap-2"
                >
                  <span>💬</span> Chat on WhatsApp
                </a>
                <a
                  href={`mailto:${listing.seller?.email}?subject=Interested in ${listing.title}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg text-center transition flex items-center justify-center gap-2"
                >
                  <span>✉️</span> Send Email
                </a>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="mt-auto pt-4 flex flex-col gap-2">
                {listing.status !== "sold" && (
                  <button
                    onClick={() => navigate(`/edit-listing/${id}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg transition"
                  >
                    ✏️ Edit Listing
                  </button>
                )}

                <div className="flex gap-2">
                  {listing.status !== "sold" && (
                    <button
                      onClick={handleMarkSold}
                      disabled={marking}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                      {marking ? "Updating..." : "✅ Mark as Sold"}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetails;