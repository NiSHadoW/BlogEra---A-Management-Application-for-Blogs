import api from "@/utils/api";

// GET /api/users/profile -> { message, data: user } (Admin, User)
export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data;
};

// PUT /api/users/profile/update -> { message, data: user } (Admin, User)
export const updateProfile = async ({ firstname, lastname }) => {
  const { data } = await api.put("/users/profile/update", { firstname, lastname });
  return data;
};

// PATCH /api/users/password -> { message } (Admin, User)
export const updatePassword = async (password) => {
  const { data } = await api.patch("/users/password", { password });
  return data;
};

// PATCH /api/users/profile/image -> { message, data: user } (Admin, User)
// file must be a File/Blob from an <input type="file">
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  // Do not set Content-Type manually — the browser must generate the multipart boundary itself.
  const { data } = await api.patch("/users/profile/image", formData);
  return data;
};

// GET /api/users -> { message, data: [user] } (Admin only)
export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// GET /api/users/:id -> { message, data: user } (Admin only)
export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// PATCH /api/users/:id/status -> { message, data: user } (Admin only)
export const updateUserStatus = async (id, isActive) => {
  const { data } = await api.patch(`/users/${id}/status`, { isActive });
  return data;
};
