import api from "@/utils/api";

// GET /api/blogs?title=&category= -> { message, data: [blog] } (Public)
export const getBlogs = async ({ title, category } = {}) => {
  const params = {};
  if (title) params.title = title;
  if (category) params.category = category;
  const { data } = await api.get("/blogs", { params });
  return data;
};

// GET /api/blogs/:id -> { message, data: blog } (Public)
export const getBlogById = async (id) => {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
};

// POST /api/blogs/create -> { message, data: blog } (Admin, User)
// Never send userId — the backend derives the author from the auth token.
export const createBlog = async ({ blogTitle, blog, category }) => {
  const { data } = await api.post("/blogs/create", { blogTitle, blog, category });
  return data;
};

// PUT /api/blogs/update/:id -> { message, data: blog } (owner or Admin)
export const updateBlog = async (id, { blogTitle, blog, category }) => {
  const { data } = await api.put(`/blogs/update/${id}`, { blogTitle, blog, category });
  return data;
};

// DELETE /api/blogs/delete/:id -> { message } (owner or Admin)
export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/delete/${id}`);
  return data;
};
