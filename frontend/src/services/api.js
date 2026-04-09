import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("campuscart_user");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  // ✅ Let browser set Content-Type for FormData automatically
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  }
  return req;
});

// ─── Auth ───────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── Listings ───────────────────────────
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const getAllListings = (params) => API.get("/listings", { params });
export const getSingleListing = (id) => API.get(`/listings/${id}`);
export const getMyListings = () => API.get("/listings/my");
export const createListing = (data) => API.post("/listings", data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const markAsSold = (id) => API.patch(`/listings/${id}/sold`);