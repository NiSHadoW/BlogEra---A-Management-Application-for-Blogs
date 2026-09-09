"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import Avatar from "@/components/Avatar";
import BlogCard from "@/components/BlogCard";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import ErrorAlert from "@/components/ErrorAlert";

const RECENT_BLOGS_LIMIT = 3;

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = role === "admin";

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setIsLoading(true);
      setError("");
      try {
        // The API has no "my blogs" filter, so we fetch everything and,
        // for a normal user, narrow it down to their own posts client-side.
        const { data } = await getBlogs();
        if (!cancelled) setBlogs(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  const relevantBlogs = isAdmin ? blogs : blogs.filter((blog) => blog.author?.id === user?.id);
  const recentBlogs = [...relevantBlogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, RECENT_BLOGS_LIMIT);

  if (!user) return null;

  const fullName = `${user.firstname} ${user.lastname}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.firstname}</h1>
          <p className="mt-1 text-gray-500">Here&apos;s what&apos;s happening with your blogs.</p>
        </div>
        <Link
          href="/dashboard/blogs/create"
          className="inline-flex w-fit items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Blog
        </Link>
      </div>

      <ErrorAlert message={error} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label={isAdmin ? "Total Blogs (All Users)" : "Total Blogs"} value={isLoading ? "-" : relevantBlogs.length} />
        <StatCard label="Member Since" value={formatDate(user.createdAt)} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Information</h2>
        <div className="flex items-center gap-4">
          <Avatar src={user.profileImage} name={fullName} size={56} />
          <div>
            <p className="font-medium text-gray-900">{fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium capitalize text-blue-700">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2>
          <Link href="/dashboard/blogs" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <Loader label="Loading blogs..." />
        ) : recentBlogs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white py-10 text-center text-gray-500">
            {isAdmin ? "No blogs found." : "You haven't created any blogs yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
