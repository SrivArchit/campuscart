import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleListing, updateListing } from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Books", "Notes", "PYQs", "Electronics", "Other"];
const CONDITIONS = ["New", "Like New", "Used"];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    phone: "",
    whatsapp: "",
  });

  const [existingImages, setExistingImages] = useState([]); // URLs kept from server
  const [newImages, setNewImages] = useState([]);            // File objects to upload
  const [newPreviews, setNewPreviews] = useState([]);        // Blob previews for new files
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  const totalImages = existingImages.length + newImages.length;
  const maxImages = 5;
  const canAddMore = totalImages < maxImages;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await getSingleListing(id);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          phone: data.phone,
          whatsapp: data.whatsapp || "",
        });
        setExistingImages(data.images || []);
      } catch {
        toast.error("Failed to load listing");
        navigate("/my-listings");
      } finally {
        setFetching(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Remove an existing (already uploaded) image
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a newly selected (not yet uploaded) image
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add new images (append, don't replace)
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const available = maxImages - totalImages;

    if (files.length > available) {
      toast.error(`You can only add ${available} more image${available !== 1 ? "s" : ""}`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);

    if (errors.images) setErrors({ ...errors, images: "" });

    // Reset file input so same file can be re-selected
    e.target.value = "";
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim())
      newErrors.title = "Title is required";
    else if (form.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.price)
      newErrors.price = "Price is required";
    else if (isNaN(form.price) || Number(form.price) < 0)
      newErrors.price = "Enter a valid price";

    if (!form.category)
      newErrors.category = "Please select a category";

    if (!form.condition)
      newErrors.condition = "Please select a condition";

    if (!form.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp.trim()))
      newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number";

    if (existingImages.length + newImages.length === 0)
      newErrors.images = "At least 1 image is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      // Tell backend which existing images to keep
      formData.append("keepImages", JSON.stringify(existingImages));

      // Append new file uploads
      newImages.forEach((img) => formData.append("images", img));

      await updateListing(id, formData);
      toast.success("Listing updated successfully! ✅");
      navigate(`/listing/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 text-xl transition"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Listing</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-400" : "border-gray-300"
              }`}
            />
            <ErrorMsg field="title" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? "border-red-400" : "border-gray-300"
              }`}
            />
            <ErrorMsg field="description" />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-400" : "border-gray-300"
              }`}
            />
            <ErrorMsg field="price" />
          </div>

          {/* Category + Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Select</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ErrorMsg field="category" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.condition ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Select</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ErrorMsg field="condition" />
            </div>
          </div>

          {/* Phone + WhatsApp */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-400" : "border-gray-300"
                }`}
              />
              <ErrorMsg field="phone" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp (optional)
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                maxLength={10}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.whatsapp ? "border-red-400" : "border-gray-300"
                }`}
              />
              <ErrorMsg field="whatsapp" />
            </div>
          </div>

          {/* ========== IMAGE MANAGER ========== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images ({totalImages}/{maxImages})
            </label>

            <div className="flex gap-3 flex-wrap">
              {/* Existing images (from server) */}
              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative group">
                  <img
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    Saved
                  </span>
                </div>
              ))}

              {/* New images (not yet uploaded) */}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative group">
                  <img
                    src={src}
                    alt={`New ${i + 1}`}
                    className="h-24 w-24 object-cover rounded-lg border-2 border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 left-1 bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                </div>
              ))}

              {/* Add more button */}
              {canAddMore && (
                <label className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-blue-500">
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-[10px] mt-1">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {canAddMore
                ? `You can add ${maxImages - totalImages} more image${maxImages - totalImages !== 1 ? "s" : ""}`
                : "Maximum 5 images reached"}
            </p>
            <ErrorMsg field="images" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;