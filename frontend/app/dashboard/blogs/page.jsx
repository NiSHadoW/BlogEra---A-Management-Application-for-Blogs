"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs, deleteBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import Loader from "@/components/Loader";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DashboardBlogsPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      // No "my blogs" endpoint exists — fetch everything and narrow to the
      // current user's own posts unless they're an admin (Rules #17).
      const { data } = await getBlogs();
      setBlogs(isAdmin ? data : data.filter((blog) => blog.author?.id === user?.id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");
    try {
      await deleteBlog(deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.blogTitle}" was deleted successfully.`);
      setDeleteTarget(null);
      await fetchBlogs();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "All Blogs" : "My Blogs"}</h1>
        <Link
          href="/dashboard/blogs/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Blog
        </Link>
      </div>

      {successMessage && (
        <div className="mb-4">
          <SuccessAlert message={successMessage} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading blogs..." />
      ) : blogs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500">
          {isAdmin ? "No blogs found." : "You haven't created any blogs yet."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Author</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-blue-600 hover:underline">
                      {blog.blogTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{blog.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(blog.createdAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(blog)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteTarget?.blogTitle}"?`}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
