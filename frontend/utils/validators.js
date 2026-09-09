// Mirrors backend/utils/validateEmail.js and validatePassword.js exactly,
// so the frontend rejects the same inputs the API would reject — this is a
// UX shortcut, not a replacement for the backend's own validation.
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const MIN_PASSWORD_LENGTH = 8;

export const isValidPassword = (password) =>
  typeof password === "string" && password.trim().length >= MIN_PASSWORD_LENGTH;

// Mirrors backend/middlewares/upload.middleware.js (multer fileFilter + 2MB limit).
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export const getImageFileError = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPEG, PNG or WEBP images are allowed";
  if (file.size > MAX_IMAGE_SIZE_BYTES) return "Image must be 2MB or smaller";
  return null;
};
