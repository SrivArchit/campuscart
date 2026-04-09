import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Books", "Notes", "PYQs", "Electronics", "Other"];
const CONDITIONS = ["New", "Like New", "Used"];

const AddListing = () => {
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

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // ✅ Clear error for that field as user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const canAddMore = images.length < 5;

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const available = 5 - images.length;
    if (files.length > available) {
      toast.error(`You can only add ${available} more image${available !== 1 ? "s" : ""}`);
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    if (errors.images) setErrors({ ...errors, images: "" });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Validate all fields
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

    if (images.length === 0)
      newErrors.images = "Please upload at least 1 image";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Run validation
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
      images.forEach((img) => formData.append("images", img));

      await createListing(formData);
      toast.success("Listing posted successfully! 🎉");
      navigate("/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reusable error message component
  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 text-xl transition"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            📦 Create a Listing
          </h2>
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
              placeholder="e.g. Engineering Maths Textbook"
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
              placeholder="Describe the item, its condition, edition, etc."
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
              placeholder="e.g. 250"
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
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                placeholder="9876543210"
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
                placeholder="Same as phone?"
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images ({images.length}/5)
            </label>

            <div className="flex gap-3 flex-wrap">
              {/* Image previews with remove buttons */}
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add more button */}
              {canAddMore && (
                <label className={`h-24 w-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  errors.images
                    ? "border-red-400 text-red-400"
                    : "border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500"
                }`}>
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-[10px] mt-1">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {canAddMore
                ? `You can add ${5 - images.length} more image${5 - images.length !== 1 ? "s" : ""}`
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
            {loading ? "Uploading..." : "Post Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;