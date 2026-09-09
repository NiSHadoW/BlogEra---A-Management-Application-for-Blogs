"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import ErrorAlert from "@/components/ErrorAlert";
import { createBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";

export default function CreateBlogPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      // values is only { blogTitle, category, blog } — never userId, the
      // backend determines the author from the auth token (Rules #16).
      await createBlog(values);
      router.push("/dashboard/blogs");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Blog</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {serverError && (
          <div className="mb-4">
            <ErrorAlert message={serverError} />
          </div>
        )}
        <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
