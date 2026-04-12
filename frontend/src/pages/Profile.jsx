import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info"); // "info" | "password"

  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passErrors, setPassErrors] = useState({});

  // ✅ Update Name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    if (name.trim() === user.name) return toast.error("Name is the same as before");

    setNameLoading(true);
    try {
      const { data } = await updateProfile({ name });
      login(data); // ✅ update stored user
      toast.success("Name updated successfully! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setNameLoading(false);
    }
  };

  // ✅ Update Password
  const validatePasswords = () => {
    const errors = {};
    if (!passwords.currentPassword)
      errors.currentPassword = "Current password is required";
    if (!passwords.newPassword)
      errors.newPassword = "New password is required";
    else if (passwords.newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";
    if (!passwords.confirmPassword)
      errors.confirmPassword = "Please confirm your new password";
    else if (passwords.newPassword !== passwords.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const errors = validatePasswords();
    if (Object.keys(errors).length > 0) {
      setPassErrors(errors);
      toast.error("Please fix the errors below");
      return;
    }

    setPassLoading(true);
    try {
      await updateProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password updated successfully! 🔐");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPassErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (passErrors[e.target.name]) {
      setPassErrors({ ...passErrors, [e.target.name]: "" });
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const ErrorMsg = ({ field }) =>
    passErrors[field] ? (
      <p className="text-red-500 text-xs mt-1">{passErrors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              MUJ Student ✓
            </span>
          </div>

          {/* My Listings Button */}
          <button
            onClick={() => navigate("/my-listings")}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
          >
            My Listings
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === "info"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👤 Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🔐 Change Password
            </button>
          </div>

          <div className="p-6">

            {/* ── Tab 1: Edit Name ── */}
            {activeTab === "info" && (
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={nameLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {nameLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* ── Tab 2: Change Password ── */}
            {activeTab === "password" && (
              <form onSubmit={handleUpdatePassword} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passErrors.currentPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMsg field="currentPassword" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min. 6 characters"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passErrors.newPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMsg field="newPassword" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passErrors.confirmPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMsg field="confirmPassword" />
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Account Actions
          </h3>
          <button
            onClick={handleLogout}
            className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-lg text-sm transition"
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
