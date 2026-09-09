"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { CATEGORIES } from "./CategoryFilter";

const categoryOptions = CATEGORIES.filter((category) => category !== "All");
const MIN_CONTENT_LENGTH = 20;

function validate(values) {
  const errors = {};
  if (!values.blogTitle.trim()) errors.blogTitle = "Blog title is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.blog.trim()) errors.blog = "Blog content is required";
  else if (values.blog.trim().length < MIN_CONTENT_LENGTH)
    errors.blog = `Blog content must be at least ${MIN_CONTENT_LENGTH} characters`;
  return errors;
}

const emptyValues = { blogTitle: "", category: "", blog: "" };

// Shared by /dashboard/blogs/create and /dashboard/blogs/[id]/edit. When
// initialValues arrives asynchronously (the edit page fetches the blog
// first), the effect below re-syncs the form once it lands.
export default function BlogForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Publish Blog",
  submittingLabel = "Publishing...",
}) {
  const [values, setValues] = useState(initialValues ? { ...emptyValues, ...initialValues } : emptyValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({ ...emptyValues, ...initialValues });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit({ blogTitle: values.blogTitle.trim(), category: values.category, blog: values.blog.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormInput
        label="Blog Title"
        name="blogTitle"
        value={values.blogTitle}
        onChange={handleChange}
        error={errors.blogTitle}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={values.category}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
            errors.category
              ? "border-red-400 focus:border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Blog Content</label>
        <textarea
          name="blog"
          rows={10}
          value={values.blog}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
            errors.blog
              ? "border-red-400 focus:border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {errors.blog && <p className="mt-1 text-xs text-red-600">{errors.blog}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
