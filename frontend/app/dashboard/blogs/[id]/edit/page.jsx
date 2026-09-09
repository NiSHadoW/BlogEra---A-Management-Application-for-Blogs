"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import { getBlogById, updateBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const { data } = await getBlogById(id);
        if (!cancelled) setBlog(data);
      } catch (err) {
        if (!cancelled) setLoadError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBlog();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      // Backend enforces ownership (owner or admin) — if a non-owner reaches
      // this page directly, this call 403s and shows that message below.
      await updateBlog(id, values);
      router.push("/dashboard/blogs");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Blog</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <Loader label="Loading blog..." />
        ) : loadError ? (
          <ErrorAlert message={loadError} />
        ) : (
          <>
            {serverError && (
              <div className="mb-4">
                <ErrorAlert message={serverError} />
              </div>
            )}
            <BlogForm
              initialValues={blog}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
              submittingLabel="Saving..."
            />
          </>
        )}
      </div>
    </div>
  );
}
