import api from "@/utils/api";

// POST /api/auth/register -> { message, data: { id, firstname, lastname, email, role, isActive } }
export const register = async ({ firstname, lastname, email, password }) => {
  const { data } = await api.post("/auth/register", { firstname, lastname, email, password });
  return data;
};

// POST /api/auth/login -> { message, data: { token, user: { id, email, role, isActive } } }
export const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

// POST /api/auth/forgot-password -> { message }
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// PATCH /api/auth/reset-password/:token -> { message }
export const resetPassword = async (token, password) => {
  const { data } = await api.patch(`/auth/reset-password/${token}`, { password });
  return data;
};
